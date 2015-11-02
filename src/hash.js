'use strict';

var Promise = require('bluebird');
var crypto = Promise.promisifyAll(require('crypto'));
var hashMethods = require('./hashMethods');

module.exports = hash;

function hash( algo, password, iterations, keyLength ){
	var salt = createSalt(keyLength);
	var hashMethod = hashMethods[algo];

	var hash = Promise.join(password, salt, iterations, keyLength, hashMethod);

	return Promise.props({
		salt: salt,
		hash: hash,
		keyLength: keyLength,
		hashMethod: algo,
		iterations: iterations,
	});
}

function createSalt( keyLength ){
	return crypto
		.randomBytesAsync(keyLength)
		.call('toString', 'base64');
}
