'use strict';

var test = require('tape');
var pw = require('../')();

test('hash', function( t ){
	pw.hash('foo', function( err, hash ){
		t.equal(typeof hash, 'string', 'should produce a hash string.');
		t.ok(JSON.parse(hash).hash, 'should a json object representing the hash.');
		t.end();
	});
});

test('hash with different passwords', function( t ){
	pw.hash('foo', function( err, fooHash ){
		pw.hash('bar', function( err, barHash ){
			t.notEqual(fooHash, barHash, 'should produce a different hash.');
			t.end();
		});
	});
});

test('hash with same passwords', function( t ){
	pw.hash('foo', function( err, fooHash ){
		pw.hash('foo', function( err, barHash ){
			t.notEqual(fooHash, barHash, 'should produce a different hash.');
			t.end();
		});
	});
});

test('hash with undefined password', function( t ){
	try {
		pw.hash(undefined, function( err ){
			t.ok(err, 'should cause error.');
			t.end();
		});
	} catch (e) {
		t.fail('should not throw');
	}
});

test('hash with empty password', function( t ){
	try {
		pw.hash("", function( err ){
			t.ok(err, 'should cause error.');
			t.end();
		});
	} catch (e) {
		t.fail('should not throw');
	}
});
