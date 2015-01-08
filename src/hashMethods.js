'use strict';

var crypto = require('crypto');

module.exports = {
	pbkdf2: pbkdf2,
};

function pbkdf2( password, salt, iterations, keyLength, cb ){
	crypto.pbkdf2(password, salt, iterations, keyLength, function( err, hash ){
		if (err)
			return cb(err);

		cb(null, new Buffer(hash).toString('base64'));
	});
}
