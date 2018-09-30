'use strict'

const test = require('tape')
const pw = require('../')()

test('expired with valid hash and default expiry', t => {
	const pass = 'foo'

	pw.hash(pass, (err, storedHash) => {
		t.notOk(
			pw.expired(storedHash),
			'should return false when expiry is default.'
		)
		t.end()
	})
})

test('expired with short expiry', t => {
	const pass = 'foo'

	pw.hash(pass, (err, storedHash) => {
		t.notOk(
			pw.expired(storedHash, 2),
			'should return false when expiry is default.'
		)
		t.end()
	})
})

test('expired with expiry in the past', t => {
	const pass = 'foo'

	pw.hash(pass, (err, storedHash) => {
		t.ok(
			pw.expired(storedHash, -2),
			'should return true when expiry is in the future.'
		)
		t.end()
	})
})

test('expired with malformed hash', t => {
	t.throws(
		function() {
			pw.expired('bad')
		},
		/parse/,
		'should throw an error'
	)

	t.end()
})
