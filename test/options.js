'use strict'

const test = require('tape')
const pw = require('../')()

test('options', t => {
	const work = 0.5
	const keyLength = 12

	pw.hash('foo', (err, hash) => {
		const defaultIterations = JSON.parse(hash).iterations

		pw.configure({
			work: work,
			keyLength: keyLength,
		})

		pw.hash('foo', (err, hash) => {
			t.equal(
				JSON.parse(hash).iterations,
				Math.floor(defaultIterations * work),
				'should allow work override'
			)
			t.equal(
				JSON.parse(hash).keyLength,
				keyLength,
				'should allow keylength override'
			)
			t.end()
		})
	})
})
