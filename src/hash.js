'use strict'

const {join, promisify} = require('bluebird')
const crypto = require('crypto')
const hashMethods = require('./hashMethods')

const randomBytes = promisify(crypto.randomBytes)

module.exports = hash

function hash(algo, password, iterations, keyLength) {
	const salt = createSalt(keyLength)
	const hashMethod = hashMethods[algo]

	const hash = join(password, salt, iterations, keyLength, hashMethod)

	return join(salt, hash, (salt, hash) => ({
		salt,
		hash,
		keyLength,
		hashMethod: algo,
		iterations,
	}))
}

function createSalt(keyLength) {
	return randomBytes(keyLength).call('toString', 'base64')
}
