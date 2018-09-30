'use strict'

const constantEquals = require('scmp')
const {join} = require('bluebird')
const hashMethods = require('./hashMethods')

module.exports = verify

function verify(storedhash, input) {
	const hashMethod = hashMethods[storedhash.hashMethod]
	const keyLength = storedhash.keyLength
	const iterations = storedhash.iterations
	const salt = storedhash.salt

	const hash = hashMethod(input, salt, iterations, keyLength)

	return join(hash, storedhash.hash, constantEquals)
}
