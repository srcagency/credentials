'use strict'

var test = require('tape')
var pw = require('../')()

test('hash', function(t) {
	t.plan(2)

	pw.hash('foo').then(function(hash) {
		t.equal(typeof hash, 'string', 'returned hash')
		t.ok(JSON.parse(hash).hash, 'returned hash is JSON parsable')
	})
})

test('hash (error)', function(t) {
	t.plan(1)

	pw.hash().then(
		function() {
			t.fail('success callback was invoked')
		},
		function() {
			t.ok('error callback was invoked')
		}
	)
})

test('verify', function(t) {
	t.plan(1)

	var pass = 'foo'

	pw.hash(pass)
		.then(function(hash) {
			return pw.verify(hash, pass)
		})
		.then(function(isValid) {
			t.ok(isValid, 'return value with valid password')
		})
})

test('verify (error)', function(t) {
	t.plan(1)

	var pass = 'foo'
	var storedHash =
		'aoeuntkh;kbanotehudil,.prcgidax$aoesnitd,riouxbx;qjkwmoeuicgr'

	pw.verify(storedHash, pass).then(
		function() {
			t.fail('success callback was invoked')
		},
		function() {
			t.ok('error callback was invoked')
		}
	)
})
