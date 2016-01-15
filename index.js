'use strict';

var TEST_REGEX = /^\$|\./,
    REPLACE_REGEX = /^\$|\./g;

var withEach = function(target, cb) {
  var act = function(obj) {
    if(Array.isArray(obj)) {
      obj.forEach(act);

    } else if(obj instanceof Object) {
      Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var shouldRecurse = cb(obj, val, key);
        if(shouldRecurse) {
          act(obj[key]);
        }
      });
    }
  };

  act(target);
};

var has = function(target) {
  var hasProhibited = false;
  withEach(target, function(obj, val, key) {
    if(TEST_REGEX.test(key)) {
      hasProhibited = true;
      return false;
    } else {
      return true;
    }
  });

  return hasProhibited;
};

var sanitize = function(target, options) {
  options = options || {};

  var replaceWith = null;
  if(!(TEST_REGEX.test(options.replaceWith))) {
    replaceWith = options.replaceWith;
  }

  withEach(target, function(obj, val, key) {
    var shouldRecurse = true;

    if(TEST_REGEX.test(key)) {
      delete obj[key];
      if(replaceWith) {
        obj[key.replace(REPLACE_REGEX, replaceWith)] = val;
      } else {
        shouldRecurse = false;
      }
    }

    return shouldRecurse;
  });

  return target;
};

var middleware = function(options) {
  return function(req, res, next) {
    ['body', 'params', 'query'].forEach(function(k) {
      if(req[k]) {
        req[k] = sanitize(req[k], options);
      }
    });
    next();
  };
};

module.exports = middleware;
module.exports.sanitize = sanitize;
module.exports.has = has;
