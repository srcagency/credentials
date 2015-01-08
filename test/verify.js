'use strict';

var test = require('tape');
var pw = require('../')();

test('verify with right pw', function( t ){
	var pass = 'foo';

	pw.hash(pass, function( err, storedHash ){
		pw.verify(storedHash, pass, function( err, isValid ){
			t.error(err, 'should not cause error.');
			t.ok(isValid, 'should return true for matching password.');
			t.end();
		});
	});
});

test('verify with broken stored hash', function( t ){
	var pass = 'foo';
	var storedHash = 'aoeuntkh;kbanotehudil,.prcgidax$aoesnitd,riouxbx;qjkwmoeuicgr';

	pw.verify(storedHash, pass, function( err ){
		t.ok(err, 'should cause error.');
		t.end();
	});
});


test('verify with wrong pw', function( t ){
	var pass = 'foo';

	pw.hash(pass, function( err, storedHash ){
		pw.verify(storedHash, 'bar', function( err, isValid ){
			t.ok(!isValid, 'should return false for matching password.');
			t.end();
		});
	});
});

test('verify with undefined password', function( t ){
	var pass = 'foo';

	pw.hash(pass, function( err, storedHash ){
		try {
			pw.verify(storedHash, undefined, function( err, isValid ){
				t.ok(!isValid, 'should return false for matching password.');
				t.ok(err, 'should cause error.');
				t.end();
			});
		} catch (e) {
			t.fail('should not throw');
		}
	});
});

test('verify with empty password', function( t ){
	var pass = 'foo';

	pw.hash(pass, function( err, storedHash ){
		try {
			pw.verify(storedHash, "", function( err, isValid ){
				t.ok(!isValid, 'should return false for matching password.');
				t.ok(err, 'should cause error.');
				t.end();
			});
		} catch (e) {
			t.fail('should not throw');
		}
	});
});
