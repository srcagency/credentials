'use strict'

const assign = require('object-assign')
const Promise = require('bluebird')
const {reject} = Promise
const hash = require('./hash')
const verify = require('./verify')

module.exports = Credentials

function Credentials(opts) {
	if (!(this instanceof Credentials)) return new Credentials(opts)

	this.configure(opts)
}

assign(Credentials.prototype, {
	keyLength: 66,
	hashMethod: 'pbkdf2',
	work: 1,
	expiry: 90,

	hash: function(password, cb) {
		const hashMethod = this.hashMethod
		const keyLength = this.keyLength
		const n = iterations(this.work)

		Promise.try(() => {
			if (typeof password !== 'string' || password.length === 0)
				return reject(new Error('Password must be a non-empty string.'))

			return hash(hashMethod, password, n, keyLength)
		})
			.then(JSON.stringify)
			.asCallback(cb)
	},

	verify: function(hash, input, cb) {
		const stored = parseHash(hash)

		Promise.try(() => {
			if (typeof input !== 'string' || input.length === 0)
				return reject(
					new Error('Input password must be a non-empty string.')
				)

			if (!stored.hashMethod)
				return reject(new Error("Couldn't parse stored hash."))

			return verify(stored, input)
		}).asCallback(cb)
	},

	expired: function(hash, days) {
		const parsed = parseHash(hash)

		if (!parsed.iterations) throw new Error("Couldn't parse hash.")

		return expired(parsed, this.work, days || this.expiry)
	},

	configure: function(opts) {
		assign(this, opts)
		return this
	},
})

function parseHash(encodedHash) {
	try {
		return JSON.parse(encodedHash)
	} catch (err) {
		return err
	}
}

const msPerDay = 24 * 60 * 60 * 1000
const msPerYear = 366 * msPerDay
const y2k = new Date(2000, 0, 1)

function iterations(work, base) {
	const years = ((base || Date.now()) - y2k) / msPerYear

	return Math.floor(1000 * Math.pow(2, years / 2) * work)
}

function expired(hash, work, days) {
	const base = Date.now() - days * msPerDay
	const minIterations = iterations(work, base)

	return hash.iterations < minIterations
}
