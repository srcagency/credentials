'use strict';

var Promise = require('bluebird');
var crypto = Promise.promisifyAll(require('crypto'));

module.exports = {
	pbkdf2: pbkdf2,
};

function pbkdf2( password, salt, iterations, keyLength ){
	return crypto
		.pbkdf2Async(password, salt, iterations, keyLength)
		.call('toString', 'base64');
}
