# Express Mongoose Sanitize

Express 4.x middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection.

## Installation

``` bash
npm install express-mongo-sanitize
```

## Usage

Add as a piece of express middleware, before defining your routes.

``` js
var express = require('express'),
    bodyParser = require('body-parser'),
    mongoSanitize = require('express-mongo-sanitize');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(mongoSanitize());

```

## What?

This module removes any keys in objects that begin with a `$` sign from `req.body`, `req.query` or `req.params`.

## Why?

Object keys starting with a `$` are _reserved_ for use by MongoDB as operators. Without this sanitization,  malicious users could send an object containing a `$` operator, which could change the context of a database operation. Most notorious is the `$where` operator, which can execute arbitrary JavaScript on the database.

The best way to prevent this is to sanitize the received data, and remove any offending keys.

## Credits

Inspired by [mongo-sanitize](https://github.com/vkarpov15/mongo-sanitize).

## License

MIT
