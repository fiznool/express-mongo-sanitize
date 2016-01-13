'use strict';

var TEST_REGEX = /^\$|\./,
    REPLACE_REGEX = /^\$|\./g;

var sanitize = function(val, options) {
  options = options || {};

  var replaceWith = null;
  if(!(TEST_REGEX.test(options.replaceWith))) {
    replaceWith = options.replaceWith;
  }

  var act = function(val) {
    if(Array.isArray(val)) {
      val.forEach(act);

    } else if(val instanceof Object) {
      Object.keys(val).forEach(function(key) {
        var v = val[key];
        var noRecurse = false;

        if(TEST_REGEX.test(key)) {
          delete val[key];
          if(replaceWith) {
            val[key.replace(REPLACE_REGEX, replaceWith)] = v;
          } else {
            noRecurse = true;
          }
        }

        if(!noRecurse) {
          act(v);
        }

      });
    }

    return val;
  };

  return act(val);
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
