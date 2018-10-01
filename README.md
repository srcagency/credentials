# Credentials

Secure password hashing and verification with core Node.js modules.

- Time consuming hashing (PBKDF2 with SHA-512) to combat brute force
- Per password salt to combat rainbow tables
- Incrementing work/complexity to combat future computing advances
- Constant time equality check to combat timing attacks

```js
const {hash, verify} = require('credentials')

verify(hash('password'), 'password') // → true
```

If you find a security flaw in this code, please contact security@src.agency.

## Usage

```shell
npm install credentials
```

```js
const {hash, verify, expired} = require('credentials')

hash(password /*[, opts]*/) // → hashed (string), ready for storage
verify(hashed, password) // → isValid (Boolean)
expired(hashed /*[, days[, opts]]*/) // → isExpired (Boolean)
```

`hash` optionally accepts an object literal of configuration values. Defaults
to:

```js
{
  keyLength: 64,  // length of salt
  work: 1,        // relative work load (0.5 for half the work)
}
```

`expired` optionally accepts an object literal of configuration values.
Defaults to:

```js
{
  work: 1,
}
```

Preconfigured functions:

```js
const {hash, verify, expired} = require('credentials').configure({
  // defaults:
  keyLength: 64,
  work: 1,
  expiry: 90,
})
```

## Examples

### Sign up

```js
const {hash} = require('credentials')

hash(userInput).then(hashed => saveHash(hashed))
```

### Sign in

```js
const {verify} = require('credentials')

verify(hashed, userInput).then(isValid => {
  if (!isValid) throw new Error('Bad credentials')

  // allow access
})
```

## CLI

```shell
$ credentials --help

  Usage: cmd [options] [command]


  Commands:

    hash [options] [password]  Hash password
    verify [hash] <password>   Verify password

  Options:

    -h, --help  output usage information
```

```shell
$ credentials hash --help

  Usage: hash [options] [password]

  Hash password

  Options:

    -h, --help                    output usage information
    -w --work <work>              relative work load (0.5 for half the work)
    -k --key-length <key-length>  length of salt
```

The `password` argument for `hash` and the `hash` argument for `verify` both
support piping by replacing with a dash (`-`):

```shell
$ echo -n "my password" | credentials hash - | credentials verify - "my password"
Verified
```

Exit codes `0` and `1` are used to communicate verified or invalid as well.

## Expiry

The `expiry` configuration value is used entirely by the `expired` method.
`verify` does not check if a password is expired.

The main purpose of this concept is to tell the user to update their password.

# Inspiration

This was initially a fork of @ericelliott's great effort at
https://github.com/ericelliott/credential with the main differences being:

- Better default values (SHA-512 and a key length of 64 bytes)
- Promises
- There's a [CLI](#cli)
- Each instance is separate - no globals or leak to other instances

Produced hashes are compatible.

A merge was not possible due to differences discovered in
https://github.com/ericelliott/credential/issues/25
