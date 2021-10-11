'use strict';

const crypto = require('crypto');

const timingSafeEqual = crypto.timingSafeEqual;

const msPerDay = 24 * 60 * 60 * 1000;
const msPerYear = 366 * msPerDay;
const y2k = new Date(2000, 0, 1);

const dOpts = {
    keyLength: 64,
    work: 1,
    expiry: 90,
};

configure.hash = hash;
configure.verify = verify;
configure.expired = expired;

module.exports = configure;

function configure(opts) {
    return {
        hash: (password) => hash(password, opts),
        verify,
        expired: (stored, days) => expired(stored, days, opts),
    };
}

function hash(password, opts) {
    const { keyLength, work } = { ...dOpts, ...opts };
    const iterations = calculateIterations(work);

    if (typeof password !== 'string' || password.length === 0) {
        return bail('Password must be a non-empty string.');
    }

    const salt = crypto.randomBytes(keyLength);
    const hash = crypto.pbkdf2Sync(
        password,
        salt,
        iterations,
        keyLength,
        'sha512'
    );

    return JSON.stringify({
        hashMethod: 'pbkdf2-sha512',
        salt: salt.toString('base64'),
        hash: hash.toString('base64'),
        keyLength,
        iterations,
    });
}

function verify(stored, input) {
    const { hashMethod, keyLength, iterations, salt, hash } = parse(stored);

    if (typeof input !== 'string' || input.length === 0) {
        return bail('Input password must be a non-empty string.');
    }
    if (!hashMethod) return bail("Couldn't parse stored hash.");

    const dfn = hashMethod.slice(0, 6);
    const hfn = hashMethod.slice(7) || 'sha1';

    if (dfn !== 'pbkdf2') return bail('Unsupported key derivation function');
    if (!['sha1', 'sha512'].includes(hfn)) {
        return bail('Unsupported hash function');
    }

    const hashB = crypto.pbkdf2Sync(input, salt, iterations, keyLength, hfn);

    return timingSafeEqual(hashB, hash);
}

function expired(stored, days, opts) {
    const { work, expiry } = { ...dOpts, ...opts };
    const parsed = parse(stored);

    if (!parsed.iterations) throw new Error("Couldn't parse hash.");

    const base = Date.now() - (days || expiry) * msPerDay;
    return parsed.iterations < calculateIterations(work, base);
}

function calculateIterations(work, base) {
    const years = ((base || Date.now()) - y2k) / msPerYear;
    return Math.floor(1000 * Math.pow(2, years / 2) * work);
}

function bail(message) {
    return Promise.reject(new Error(message));
}

function parse(stored) {
    try {
        const parsed = JSON.parse(stored);
        return {
            ...parsed,
            salt: Buffer.from(parsed.salt, 'base64'),
            hash: Buffer.from(parsed.hash, 'base64'),
        };
    } catch (err) {
        return {};
    }
}
