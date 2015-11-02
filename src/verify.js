'use strict';

var constantEquals = require('scmp');
var Promise = require('bluebird');
var hashMethods = require('./hashMethods');

module.exports = verify;

function verify( storedhash, input ){
	var hashMethod = hashMethods[storedhash.hashMethod];
	var keyLength = storedhash.keyLength;
	var iterations = storedhash.iterations;
	var salt = storedhash.salt;

	var hash = hashMethod(input, salt, iterations, keyLength);

	return Promise.join(hash, storedhash.hash, constantEquals);
}
