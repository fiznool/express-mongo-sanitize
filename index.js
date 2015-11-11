'use strict';

var sanitize = function(val) {
  if(Array.isArray(val)) {
    val.forEach(sanitize);

  } else if(val instanceof Object) {
    Object.keys(val).forEach(function(key) {
      if (/^\$/.test(key)) {
        delete val[key];
      } else {
        sanitize(val[key]);
      }
    });
  }

  return val;
};

module.exports = function() {
  return function(req, res, next) {
    ['body', 'params', 'query'].forEach(function(k) {
      if(req[k]) {
        req[k] = sanitize(req[k]);
      }
    });
    next();
  };
};
