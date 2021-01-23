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
  })
);

// Or, to sanitize data that only contains $, without .(dot)
// Can be useful for letting data pass that is meant for querying nested documents. NOTE: This may cause some problems on older versions of MongoDb
// READ MORE: https://github.com/fiznool/express-mongo-sanitize/issues/36
app.use(
  mongoSanitize({
    allowDots: true,
  })
);
```

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

// Exclude sanitization of . (dot), only sanitize data that contains $. This may cause some problems on older versions of mongoDb
mongoSanitize.sanitize(payload, {
  allowDots: true
});

// Check if the payload has keys with prohibited characters
const hasProhibited = mongoSanitize.has(payload);
```

You can also combine allowDots with replaceWith options:

```js
const mongoSanitize = require('express-mongo-sanitize');

const payload = {...};

// This will only replace the $ with _(symbol) and allow dots
// Example. {'some.data': 'da', $where: 'bad'} -> {'some.data': 'da', _where: 'bad'}

// middleware
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: '_'
  })
);

// module
mongoSanitize.sanitize(payload, {
  allowDots: true,
  replaceWith: '_'
});

// Check if the payload has keys with prohibited characters. Pass true as the second argument so it allows dots.
const hasProhibited = mongoSanitize.has(payload, true);
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

## Credits

Inspired by [mongo-sanitize](https://github.com/vkarpov15/mongo-sanitize).

## License

MIT
