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
	work: 1,				// relative work load (0.5 for half the work)
	expiry: 90,				// days, used only for "expired" method
}
*/

pw.hash(password);

// callback( err, hash )

pw.verify(hash, password);

// callback( err, isValid )

pw.expired(hash/*[, days]*/)

/*
true/false if hash was created before/after "days" (defaults to configuration
value "expiry")
*/

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

## CLI

```shell
$ credential --help

  Usage: cmd [options] [command]


  Commands:

    hash [options] [password]  Hash password
    verify [hash] <password>   Verify password

  Options:

    -h, --help  output usage information
```

```shell
$ credential hash --help

  Usage: hash [options] [password]

  Hash password

  Options:

    -h, --help                    output usage information
    -w --work <work>              relative work load (0.5 for half the work)
    -k --key-length <key-length>  length of salt
```

The `password` argument for `hash` and the `hash` argument for `verify` both support piping by replacing with a dash (`-`):

```shell
$ echo -n "my password" | credential hash - | credential verify - "my password"
Verified
```

Exit codes `0` and `1` are used to communicate verified or invalid as well.

## Expiry

The `expiry` configuration value is used entirely by the `expired` method.
`verify` does not check if a password is expired.

The main purpose of this concept is to tell the user to update their password.

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
algorithm of: `2^(msSinceY2k / 2*msPerYear)`.

This is also a good reason to force users to change passwords once in a while
as the new password will be hashed slightly stronger.
