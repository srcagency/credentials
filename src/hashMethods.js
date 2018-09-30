'use strict'

const {promisify} = require('bluebird')
const crypto = require('crypto')
const pbkdf2 = promisify(crypto.pbkdf2)

module.exports = {
	pbkdf2: (password, salt, iterations, keyLength) =>
		pbkdf2(password, salt, iterations, keyLength, 'SHA1').call(
			'toString',
			'base64'
		),
}
