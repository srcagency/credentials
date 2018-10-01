'use strict'

const test = require('tape')
const pw = require('../')()

test('verify with right pw', t => {
	const pass = 'foo'
	t.plan(1)

	pw.hash(pass).then(storedHash =>
		pw
			.verify(storedHash, pass)
			.then(isValid => t.equal(isValid, true, 'is valid'))
	)
})

test('verify with broken stored hash', t => {
	const pass = 'foo'
	const storedHash =
		'aoeuntkh;kbanotehudil,.prcgidax$aoesnitd,riouxbx;qjkwmoeuicgr'
	t.plan(1)

	pw.verify(storedHash, pass).catch(err => t.ok(err))
})

test('verify with wrong pw', t => {
	const pass = 'foo'
	t.plan(1)

	pw.hash(pass).then(storedHash =>
		pw
			.verify(storedHash, 'bar')
			.then(isValid => t.equal(isValid, false, 'is valid'))
	)
})

test('verify with undefined password', t => {
	const pass = 'foo'
	t.plan(1)

	pw.hash(pass).then(storedHash =>
		pw.verify(storedHash, undefined).catch(err => t.ok(err))
	)
})

test('verify with empty password', t => {
	const pass = 'foo'
	t.plan(1)

	pw.hash(pass).then(storedHash =>
		pw.verify(storedHash, '').catch(err => t.ok(err))
	)
})
