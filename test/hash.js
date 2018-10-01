'use strict'

const {join} = require('bluebird')
const test = require('tape')
const pw = require('../')()

test('hash', t => {
	t.plan(1)
	pw.hash('foo').then(hash => t.equal(typeof hash, 'string', 'type'))
})

test('hash with different passwords', t => {
	t.plan(1)
	join(pw.hash('foo'), pw.hash('bar'), (a, b) =>
		t.ok(a !== b, 'is not equal')
	)
})

test('hash with same passwords', t => {
	const pass = 'foo'
	t.plan(1)
	join(pw.hash(pass), pw.hash(pass), (a, b) => t.ok(a !== b, 'is not equal'))
})

test('hash with undefined password', t => {
	t.plan(1)
	pw.hash(undefined).catch(err => t.ok(err))
})

test('hash with empty password', t => {
	t.plan(1)
	pw.hash('').catch(err => t.ok(err))
})
