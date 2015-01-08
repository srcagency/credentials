'use strict';

var crypto = require('crypto');
var hashMethods = require('./hashMethods');

module.exports = hash;

function hash( algo, password, iterations, keyLength, cb ){
	var hashMethod = hashMethods[algo];

	createSalt(keyLength, function( err, salt ){
		if (err)
			return cb(err);

		hashMethod(password, salt, iterations, keyLength, function( err, hash ){
			if (err)
				return cb(err);

			cb(null, {
				hash: hash,
				salt: salt,
				keyLength: keyLength,
				hashMethod: algo,
				iterations: iterations,
			});
		});
	});
}

function createSalt( keyLength, cb ){
	crypto.randomBytes(keyLength, function( err, buffer ){
		if (err)
			return cb(err);

		cb(null, buffer.toString('base64'));
	});
}
