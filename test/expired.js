'use strict'

const test = require('tape')
const pw = require('../')

const fooHash = pw.hash('foo')

test('expired with default expiry', t => {
	t.plan(1)
	fooHash.then(storedHash =>
		t.equal(pw.expired(storedHash), false, 'is expired')
	)
})

test('expired with custom expiry', t => {
	t.plan(1)
	fooHash.then(storedHash =>
		t.equal(pw.expired(storedHash, 2), false, 'is expired')
	)
})

test('expired with expiry in the past', t => {
	t.plan(1)
	fooHash.then(storedHash =>
		t.equal(pw.expired(storedHash, -2), true, 'is expired')
	)
})

test('expired with malformed hash', t => {
	t.throws(() => pw.expired('bad'), /parse/)
	t.end()
})
