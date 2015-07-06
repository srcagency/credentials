'use strict';

var assign = require('object-assign');
var Promise = require('bluebird');
var hash = require('./hash');
var verify = require('./verify');

module.exports = Credential;

function Credential( opts ){
	if (!(this instanceof Credential))
		return new Credential(opts);

	this.configure(opts);
}

assign(Credential.prototype, {
	keyLength: 66,
	hashMethod: 'pbkdf2',
	work: 1,
	expiry: 90,

	hash: function( password, cb ){
		var hashMethod = this.hashMethod;
		var keyLength = this.keyLength;
		var n = iterations(this.work);

		return Promise.try(function(){
			if (typeof (password) !== 'string' || password.length === 0)
				throw new Error('Password must be a non-empty string.');

			return hash(hashMethod, password, n, keyLength)
				.then(JSON.stringify);
		})
			.nodeify(cb);
	},

	verify: function( hash, input, cb ){
		var stored = parseHash(hash);

		return Promise.try(function(){
			if (typeof input !== 'string' || input.length === 0)
				throw new Error('Input password must be a non-empty string.');

			if (!stored.hashMethod)
				throw new Error('Couldn\'t parse stored hash.');

			return verify(stored, input);
		})
			.nodeify(cb);
	},

	expired: function( hash, days ){
		var parsed = parseHash(hash);

		if (!parsed.iterations)
			throw new Error('Couldn\'t parse hash.');

		return expired(parsed, this.work, days || this.expiry);
	},

	configure: function( opts ) {
		assign(this, opts);
		return this;
	},
});

function parseHash( encodedHash ){
	try {
		return JSON.parse(encodedHash);
	} catch (err) {
		return err;
	}
}

var msPerDay = 24 * 60 * 60 * 1000;
var msPerYear = 366 * msPerDay;
var y2k = new Date(2000, 0, 1);

function iterations( work, base ){
	var years = ((base || Date.now()) - y2k) / msPerYear;

	return Math.floor(1000 * Math.pow(2, years / 2) * work);
}

function expired( hash, work, days ){
	var base = Date.now() - days * msPerDay;
	var minIterations = iterations(work, base);

	return hash.iterations < minIterations;
}
