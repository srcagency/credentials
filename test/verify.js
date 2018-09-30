'use strict'

const test = require('tape')
const pw = require('../')()

test('verify with right pw', t => {
	const pass = 'foo'

	pw.hash(pass, (err, storedHash) =>
		pw.verify(storedHash, pass, (err, isValid) => {
			t.error(err, 'should not cause error.')
			t.ok(isValid, 'should return true for matching password.')
			t.end()
		})
	)
})

test('verify with broken stored hash', t => {
	const pass = 'foo'
	const storedHash =
		'aoeuntkh;kbanotehudil,.prcgidax$aoesnitd,riouxbx;qjkwmoeuicgr'

	pw.verify(storedHash, pass, err => {
		t.ok(err, 'should cause error.')
		t.end()
	})
})

test('verify with wrong pw', t => {
	const pass = 'foo'

	pw.hash(pass, (err, storedHash) =>
		pw.verify(storedHash, 'bar', (err, isValid) => {
			t.equal(isValid, false, 'is valid.')
			t.end()
		})
	)
})

test('verify with undefined password', t => {
	const pass = 'foo'

	pw.hash(pass, (err, storedHash) => {
		try {
			pw.verify(storedHash, undefined, (err, isValid) => {
				t.notOk(isValid, 'is valid.')
				t.ok(err, 'should cause error.')
				t.end()
			})
		} catch (e) {
			t.fail('should not throw')
		}
	})
})

test('verify with empty password', t => {
	const pass = 'foo'

	pw.hash(pass, (err, storedHash) => {
		try {
			pw.verify(storedHash, '', (err, isValid) => {
				t.notOk(isValid, 'is valid')
				t.ok(err, 'should cause error.')
				t.end()
			})
		} catch (e) {
			t.fail('should not throw')
		}
	})
})
