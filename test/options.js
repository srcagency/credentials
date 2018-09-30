'use strict'

var test = require('tape')
var pw = require('../')()

test('options', function(t) {
	var work = 0.5
	var keyLength = 12

	pw.hash('foo', function(err, hash) {
		var defaultIterations = JSON.parse(hash).iterations

		pw.configure({
			work: work,
			keyLength: keyLength,
		})

		pw.hash('foo', function(err, hash) {
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
