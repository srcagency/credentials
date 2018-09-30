'use strict'

const test = require('tape')
const pw = require('../')()

test('hash', t => {
	t.plan(2)

	pw.hash('foo').then(hash => {
		t.equal(typeof hash, 'string', 'returned hash')
		t.ok(JSON.parse(hash).hash, 'returned hash is JSON parsable')
	})
})

test('hash (error)', t => {
	t.plan(1)

	pw.hash().then(
		() => t.fail('success callback was invoked'),
		() => t.ok('error callback was invoked')
	)
})

test('verify', t => {
	t.plan(1)

	const pass = 'foo'

	pw.hash(pass)
		.then(hash => pw.verify(hash, pass))
		.then(isValid => t.ok(isValid, 'return value with valid password'))
})

test('verify (error)', t => {
	t.plan(1)

	const pass = 'foo'
	const storedHash =
		'aoeuntkh;kbanotehudil,.prcgidax$aoesnitd,riouxbx;qjkwmoeuicgr'

	pw.verify(storedHash, pass).then(
		() => t.fail('success callback was invoked'),
		() => t.ok('error callback was invoked')
	)
})
