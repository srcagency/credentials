# Credential

This was initially a fork of @ericelliott's great effort at
https://github.com/ericelliott/credential with the main differences being:

- API supports callbacks *and* promises
- Each instance is separate - no globals or leak to other instances
- No travis, linting, webpack or other tooling cruft

API (after instantiation) and produced hashes are 100% compatible.

A merge is not possible due to differences discovered in
https://github.com/ericelliott/credential/issues/25

## About

Easy password hashing and verification in Node. Protects against brute force,
rainbow tables, and timing attacks.

Employs cryptographically secure, per password salts to prevent rainbow table
attacks. Key stretching is used to make brute force attacks impractical. A
constant time verification check prevents variable response time attacks.

*<-- from original README*

This package is an attempt to create a reference point for secure password
storage and avoid duplicate effort.

If you find a security flaw in this code, please contact security@src.agency.

## Usage

```shell
npm install --save credential
```

```js
var pw = require('credential')();

/*
Optionally accepts a hash of configuration values. Defaults to:

{
	keyLength: 66,			// length of salt
	hashMethod: 'pbkdf2',	// node crypto method used
	work: 1,				// relative work load (0.5 for half the work)
}
*/

pw.hash(password);

// callback( err, hash )

pw.verify(hash, password);

// callback( err, isValid )

pw.configure(otps)
```

## Examples

### Sign up

```js
var pw = require('credential')();

pw.hash(userInput)
	.then(function( hash ){
		saveHash(hash);
	});
```

### Sign in

```js
var pw = require('credential'),

pw.verify(savedHash, userInput)
	.then(function( isValid ){
		if (!isValid)
			throw new CredentialsError('Bad credentials');

		// allow access
	});
```

## Work and iterations

One problem with password hashing is that any hash can be broken given enough
computational time. It is simply a matter of trying all possibilities until
the right one is found.

To mitigate this, algorithms with significant work load is chosen and then
applied multiple times (iteration count).

It is hard to determine the correct work load. A general rule of thumb is:
**use as much time (work) as possible, without annoying your users**. This
could be something like 800ms.

With computers getting ever more powerful, you can imagine the work load
should increase over time. This is handled automatically in Credential with an
algorithm of: `2^((year - 2000) / 2)`.
