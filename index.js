'use strict';

const TEST_REGEX = /^\$|\./;
const REPLACE_REGEX = /^\$|\./g;

function isPlainObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

function withEach(target, cb) {
  (function act(obj) {
    if(Array.isArray(obj)) {
      obj.forEach(act);

    } else if(isPlainObject(obj)) {
      Object.keys(obj).forEach(function(key) {
        const val = obj[key];
        const resp = cb(obj, val, key);
        if(resp.shouldRecurse) {
          act(obj[resp.key || key]);
        }
      });
    }
  })(target);

}

function has(target) {
  let hasProhibited = false;
  withEach(target, function(obj, val, key) {
    if(TEST_REGEX.test(key)) {
      hasProhibited = true;
      return { shouldRecurse: false };
    } else {
      return { shouldRecurse: true };
    }
  });

  return hasProhibited;
}

function sanitize(target, options) {
  options = options || {};

  let replaceWith = null;
  if(!(TEST_REGEX.test(options.replaceWith))) {
    replaceWith = options.replaceWith;
  }

  withEach(target, function(obj, val, key) {
    let shouldRecurse = true;

    if(TEST_REGEX.test(key)) {
      delete obj[key];
      if(replaceWith) {
        key = key.replace(REPLACE_REGEX, replaceWith);
        // Avoid to set __proto__ and constructor.prototype
        // https://portswigger.net/daily-swig/prototype-pollution-the-dangerous-and-underrated-vulnerability-impacting-javascript-applications
        // https://snyk.io/vuln/SNYK-JS-LODASH-73638
        if (key !== "__proto__" && key !== "constructor" && key !== "prototype") {
          obj[key] = val;
        }
      } else {
        shouldRecurse = false;
      }
    }

    return {
      shouldRecurse: shouldRecurse,
      key: key
    };
  });

  return target;
}

function middleware(options) {
  return function(req, res, next) {
    ['body', 'params', 'headers', 'query'].forEach(function(k) {
      if(req[k]) {
        req[k] = sanitize(req[k], options);
      }
    });
    next();
  };
}

module.exports = middleware;
module.exports.sanitize = sanitize;
module.exports.has = has;
