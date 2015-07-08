#!/usr/bin/env node
'use strict';

var program = require('commander');
var pluck = require('pluck-keys');
var credential = require('../')();

var stdin = '';

program
	.version('1.0.0')

program
	.command('hash [password]')
	.description('Hash password')
	.option('-w --work <work>', 'relative work load (0.5 for half the work)', Number)
	.option('-k --key-length <key-length>', 'length of salt', Number)
	.action(function( password, options ){
		credential.configure(pluck([
			'keyLength',
			'hashMethod',
			'work'
		], options));

		credential.hash(stdin || password).then(console.log, console.error);
	});

program
	.command('verify [hash] <password>')
	.description('Verify password')
	.action(function( hash, password ){
		credential.verify(stdin || hash, password).then(function( result ){
			console.log(result ? 'Verified' : 'Invalid');
			process.exit(result ? 0 : 1);
		}, console.error);
	});

if (process.stdin.isTTY) {
	program.parse(process.argv);
} else {
	process.stdin.on('readable', function(){
		stdin += this.read() || '';
	});

	process.stdin.on('end', function(){
		program.parse(process.argv);
	});
}
