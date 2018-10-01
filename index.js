'use strict'

const crypto = require('crypto')
const {join, reject, promisify} = require('bluebird')

const pbkdf2 = promisify(crypto.pbkdf2)
const randomBytes = promisify(crypto.randomBytes)
const timingSafeEqual = crypto.timingSafeEqual

const msPerDay = 24 * 60 * 60 * 1000
const msPerYear = 366 * msPerDay
const y2k = new Date(2000, 0, 1)

const dOpts = {
	keyLength: 66,
	work: 1,
	expiry: 90,
}

configure.hash = hash
configure.verify = verify
configure.expired = expired

module.exports = configure

function configure(opts) {
	return {
		hash: password => hash(password, opts),
		verify,
		expired: (stored, days) => expired(stored, days, opts),
	}
}

function hash(password, opts) {
	const {keyLength, work} = {...dOpts, ...opts}
	const iterations = calculateIterations(work)

	if (typeof password !== 'string' || password.length === 0) {
		return bail('Password must be a non-empty string.')
	}

	const salt = randomBytes(keyLength)
	const hash = join(salt, salt =>
		pbkdf2(password, salt, iterations, keyLength, 'SHA1')
	)

	return join(salt, hash, (salt, hash) =>
		JSON.stringify({
			hashMethod: 'pbkdf2',
			salt: salt.toString('base64'),
			hash: hash.toString('base64'),
			keyLength,
			iterations,
		})
	)
}

function verify(stored, input) {
	const {hashMethod, keyLength, iterations, salt, hash} = parse(stored)

	if (typeof input !== 'string' || input.length === 0) {
		return bail('Input password must be a non-empty string.')
	}
	if (!hashMethod) return bail("Couldn't parse stored hash.")
	if (hashMethod !== 'pbkdf2') return bail('Unsupported hashing method')

	const hashB = pbkdf2(input, salt, iterations, keyLength, 'SHA1')

	return join(hashB, hash, timingSafeEqual)
}

function expired(stored, days, opts) {
	const {work, expiry} = {...dOpts, ...opts}
	const parsed = parse(stored)

	if (!parsed.iterations) throw new Error("Couldn't parse hash.")

	const base = Date.now() - (days || expiry) * msPerDay
	return parsed.iterations < calculateIterations(work, base)
}

function calculateIterations(work, base) {
	const years = ((base || Date.now()) - y2k) / msPerYear
	return Math.floor(1000 * Math.pow(2, years / 2) * work)
}

function bail(message) {
	return reject(new Error(message))
}

function parse(stored) {
	try {
		const parsed = JSON.parse(stored)
		return {
			...parsed,
			salt: Buffer.from(parsed.salt, 'base64'),
			hash: Buffer.from(parsed.hash, 'base64'),
		}
	} catch (err) {
		return {}
	}
}
