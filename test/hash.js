'use strict'

const test = require('tape')
const pw = require('../')()

test('hash', t =>
	pw.hash('foo').then(hash => {
		t.equal(typeof hash, 'string', 'should produce a hash string.')
		t.ok(
			JSON.parse(hash).hash,
			'should a json object representing the hash.'
		)
		t.end()
	}))

test('hash with different passwords', t =>
	pw.hash('foo').then(fooHash =>
		pw.hash('bar').then(barHash => {
			t.notEqual(fooHash, barHash, 'should produce a different hash.')
			t.end()
		})
	))

test('hash with same passwords', t =>
	pw.hash('foo').then(fooHash =>
		pw.hash('foo').then(barHash => {
			t.notEqual(fooHash, barHash, 'should produce a different hash.')
			t.end()
		})
	))

test('hash with undefined password', t => {
	try {
		pw.hash(undefined).catch(err => {
			t.ok(err, 'should cause error.')
			t.end()
		})
	} catch (e) {
		t.fail('should not throw')
	}
})

test('hash with empty password', t => {
	try {
		pw.hash('').catch(err => {
			t.ok(err, 'should cause error.')
			t.end()
		})
	} catch (e) {
		t.fail('should not throw')
	}
})
