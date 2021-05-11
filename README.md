# Express Mongoose Sanitize

Express 4.x middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection.

[![Build Status](https://github.com/fiznool/express-mongo-sanitize/workflows/Node.js%20CI/badge.svg)](https://github.com/fiznool/express-mongo-sanitize/workflows/Node.js%20CI/badge.svg)
[![npm version](https://img.shields.io/npm/v/express-mongo-sanitize)](https://img.shields.io/npm/v/express-mongo-sanitize)
[![npm downloads per week](https://img.shields.io/npm/dw/express-mongo-sanitize?color=blue)](https://img.shields.io/npm/dw/express-mongo-sanitize?color=blue)
[![Dependency Status](https://david-dm.org/fiznool/express-mongo-sanitize.svg)](https://david-dm.org/fiznool/express-mongo-sanitize)
[![devDependency Status](https://david-dm.org/fiznool/express-mongo-sanitize/dev-status.svg)](https://david-dm.org/fiznool/express-mongo-sanitize#info=devDependencies)

## Installation

```bash
npm install express-mongo-sanitize
```

## Usage

Add as a piece of express middleware, before defining your routes.

```js
const express = require('express');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// To remove data, use:
app.use(mongoSanitize());

// Or, to replace prohibited characters with _, use:
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);
```

### `onSanitize`

`onSanitize` callback is called after the request's value was sanitized.

```js
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
  }),
);
```

### `dryRun`

You can run this middleware as dry run mode.

```js
app.use(
  mongoSanitize({
    dryRun: true,
    onSanitize: ({ req, key }) => {
      console.warn(`[DryRun] This request[${key}] will be sanitized`, req);
    },
  }),
);
```

### Node Modules API

You can also bypass the middleware and use the module directly:

```js
const mongoSanitize = require('express-mongo-sanitize');

const payload = {...};

// Remove any keys containing prohibited characters
mongoSanitize.sanitize(payload);

// Replace any prohibited characters in keys
mongoSanitize.sanitize(payload, {
  replaceWith: '_'
});

// Check if the payload has keys with prohibited characters
const hasProhibited = mongoSanitize.has(payload);
```

## What?

This module searches for any keys in objects that begin with a `$` sign or contain a `.`, from `req.body`, `req.query` or `req.params`. It can then either:

- completely remove these keys and associated data from the object, or
- replace the prohibited characters with another allowed character.

The behaviour is governed by the passed option, `replaceWith`. Set this option to have the sanitizer replace the prohibited characters with the character passed in.

See the spec file for more examples.

## Why?

Object keys starting with a `$` or containing a `.` are _reserved_ for use by MongoDB as operators. Without this sanitization, malicious users could send an object containing a `$` operator, or including a `.`, which could change the context of a database operation. Most notorious is the `$where` operator, which can execute arbitrary JavaScript on the database.

The best way to prevent this is to sanitize the received data, and remove any offending keys, or replace the characters with a 'safe' one.

## Contributing

PRs are welcome! Please add test coverage for any new features or bugfixes, and make sure to run `npm run prettier` before submitting a PR to ensure code consistency.

## Credits

Inspired by [mongo-sanitize](https://github.com/vkarpov15/mongo-sanitize).

## License

MIT
