'use strict';

var constantEquals = require('scmp');
var hashMethods = require('./hashMethods');

module.exports = verify;

function verify( storedhash, input, cb ){
	var hashMethod = hashMethods[storedhash.hashMethod];
	var keyLength = storedhash.keyLength;
	var iterations = storedhash.iterations;
	var salt = storedhash.salt;

	hashMethod(input, salt, iterations, keyLength, function( err, hash ){
		if (err)
			return cb(err);

		cb(null, constantEquals(hash, storedhash.hash));
	});
}
