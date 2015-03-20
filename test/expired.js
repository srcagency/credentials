'use strict';

var test = require('tape');
var pw = require('../')();

test('expired with valid hash and default expiry', function( t ){
	var pass = 'foo';

	pw.hash(pass, function( err, storedHash ){
		t.notOk(pw.expired(storedHash), 'should return false when expiry is default.');
		t.end();
	});
});

test('expired with short expiry', function( t ){
	var pass = 'foo';

	pw.hash(pass, function( err, storedHash ){
		t.notOk(pw.expired(storedHash, 2), 'should return false when expiry is default.');
		t.end();
	});
});

test('expired with expiry in the past', function( t ){
	var pass = 'foo';

	pw.hash(pass, function( err, storedHash ){
		t.ok(pw.expired(storedHash, -2), 'should return true when expiry is in the future.');
		t.end();
	});
});

test('expired with matlformed hash', function( t ){
	t.throws(function(){
		pw.expired('bad');
	}, /parse/, 'should throw an error');

	t.end();
});
