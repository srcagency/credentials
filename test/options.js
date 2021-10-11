'use strict';

const test = require('tape');
const pw = require('../');

const defaultIterations = pw
    .hash('foo')
    .then((stored) => JSON.parse(stored).iterations);

test('options "on demand"', (t) => {
    const work = 0.5;
    const keyLength = 12;
    const stored = pw.hash('foo', {
        work,
        keyLength,
    });

    Promise.all([defaultIterations, stored]).then(
        ([defaultIterations, stored]) => {
            t.equal(
                JSON.parse(stored).iterations,
                Math.floor(defaultIterations * work),
                'should allow work override'
            );
            t.equal(
                JSON.parse(stored).keyLength,
                keyLength,
                'should allow keylength override'
            );
            t.end();
        }
    );
});

test('configured options', (t) => {
    const work = 0.5;
    const keyLength = 12;
    const cpw = pw({
        work,
        keyLength,
    });
    const stored = cpw.hash('foo');

    Promise.all([defaultIterations, stored]).then(
        ([defaultIterations, stored]) => {
            t.equal(
                JSON.parse(stored).iterations,
                Math.floor(defaultIterations * work),
                'should allow work override'
            );
            t.equal(
                JSON.parse(stored).keyLength,
                keyLength,
                'should allow keylength override'
            );
            t.end();
        }
    );
});
