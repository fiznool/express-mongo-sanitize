'use strict';

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const sanitize = require('./index.js');

describe('Express Mongo Sanitize', function() {
  describe('Remove Data', function() {
    const app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(sanitize());

    app.post('/body', function(req, res){
      res.status(200).json({
        body: req.body,
      });
    });

    app.post('/headers', function (req, res){
      res.status(200).json({
        headers: req.headers
      });
    });

    app.get('/query', function(req, res){
      res.status(200).json({
        query: req.query
      });
    });

    describe('Top-level object', function() {
      it('should sanitize the query string', function(done) {
        request(app)
          .get('/query?q=search&$where=malicious&dotted.data=some_data')
          .set('Accept', 'application/json')
          .expect(200, {
            query: {
              q: 'search'
            }
          }, done);
      });

      it('should sanitize a JSON body', function(done) {
        request(app)
          .post('/body')
          .send({
            q: 'search',
            is: true,
            and: 1,
            even: null,
            stop: undefined,
            $where: 'malicious',
            'dotted.data': 'some_data'
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              q: 'search',
              is: true,
              and: 1,
              even: null
            }
          }, done);
      });

      it('should sanitize HTTP headers', function(done) {
        request(app)
          .post('/headers')
          .set({
            q: 'search',
            is: true,
            and: 1,
            even: null,
            $where: 'malicious',
            'dotted.data': 'some_data'
          })
          .expect(200)
          .expect(function(res) {
            expect(res.body.headers).to.include({
              q: 'search',
              is: 'true',
              and: '1',
              even: 'null'
            })
          })
          .end(done);
      });

      it('should sanitize a form url-encoded body', function(done) {
        request(app)
          .post('/body')
          .send('q=search&$where=malicious&dotted.data=some_data')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              q: 'search'
            }
          }, done);
      });
    });

    describe('Nested Object', function() {
      it('should sanitize a nested object in the query string', function(done) {
        request(app)
          .get('/query?username[$gt]=foo&username[dotted.data]=some_data')
          .set('Accept', 'application/json')
          .expect(200, {
            query: {
              username: {}
            }
          }, done);
      });

      it('should sanitize a nested object in a JSON body', function(done) {
        request(app)
          .post('/body')
          .send({
            username: {
              $gt: 'foo',
              'dotted.data': 'some_data'
            }
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              username: {}
            }
          }, done);
      });

      it('should sanitize a nested object in a form url-encoded body', function(done) {
        request(app)
          .post('/body')
          .send('username[$gt]=foo&username[dotted.data]=some_data')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              username: {}
            }
          }, done);
      });
    });

    describe('Nested Object inside an Array', function() {
      it('should sanitize a nested object in the query string', function(done) {
        request(app)
          .get('/query?username[0][$gt]=foo&username[0][dotted.data]=some_data')
          .set('Accept', 'application/json')
          .expect(200, {
            query: {
              username: [{}]
            }
          }, done);
      });

      it('should sanitize a nested object in a JSON body', function(done) {
        request(app)
          .post('/body')
          .send({
            username: [{
              $gt: 'foo',
              'dotted.data': 'some_data'
            }]
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              username: [{}]
            }
          }, done);
      });

      it('should sanitize a nested object in a form url-encoded body', function(done) {
        request(app)
          .post('/body')
          .send('username[0][$gt]=foo&username[0][dotted.data]=some_data')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              username: [{}]
            }
          }, done);
      });
    });
  });

  describe('Preserve Data', function() {
    const app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(sanitize({
      replaceWith: '_'
    }));

    app.post('/body', function(req, res){
      res.status(200).json({
        body: req.body
      });
    });

    app.post('/headers', function (req, res){
      res.status(200).json({
        headers: req.headers
      });
    });

    app.get('/query', function(req, res){
      res.status(200).json({
        query: req.query
      });
    });

    describe('Top-level object', function() {
      it('should sanitize the query string', function(done) {
        request(app)
          .get('/query?q=search&$where=malicious&dotted.data=some_data')
          .set('Accept', 'application/json')
          .expect(200, {
            query: {
              q: 'search',
              _where: 'malicious',
              dotted_data: 'some_data'
            }
          }, done);
      });

      it('should sanitize a JSON body', function(done) {
        request(app)
          .post('/body')
          .send({
            q: 'search',
            is: true,
            and: 1,
            even: null,
            stop: undefined,
            $where: 'malicious',
            'dotted.data': 'some_data'
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              q: 'search',
              is: true,
              and: 1,
              even: null,
              _where: 'malicious',
              dotted_data: 'some_data'
            }
          }, done);
      });

      it('should sanitize HTTP headers', function(done) {
        request(app)
          .post('/headers')
          .set({
            q: 'search',
            is: true,
            and: 1,
            even: null,
            $where: 'malicious',
            'dotted.data': 'some_data'
          })
          .expect(function(res) {
            expect(res.body.headers).to.include({
              q: 'search',
              is: 'true',
              and: '1',
              even: 'null',
              _where: 'malicious',
              dotted_data: 'some_data'
            })
          })
          .end(done);
      });

      it('should sanitize a form url-encoded body', function(done) {
        request(app)
          .post('/body')
          .send('q=search&$where=malicious&dotted.data=some_data')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              q: 'search',
              _where: 'malicious',
              dotted_data: 'some_data'
            }
          }, done);
      });
    });

    describe('Nested Object', function() {
      it('should sanitize a nested object in the query string', function(done) {
        request(app)
          .get('/query?username[$gt]=foo&username[dotted.data]=some_data')
          .set('Accept', 'application/json')
          .expect(200, {
            query: {
              username: {
                _gt: 'foo',
                dotted_data: 'some_data'
              }
            }
          }, done);
      });

      it('should sanitize a nested object in a JSON body', function(done) {
        request(app)
          .post('/body')
          .send({
            username: {
              $gt: 'foo',
              'dotted.data': 'some_data'
            }
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              username: {
                _gt: 'foo',
                dotted_data: 'some_data'
              }
            }
          }, done);
      });

      it('should sanitize a nested object in a form url-encoded body', function(done) {
        request(app)
          .post('/body')
          .send('username[$gt]=foo&username[dotted.data]=some_data')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              username: {
                _gt: 'foo',
                dotted_data: 'some_data'
              }
            }
          }, done);
      });
    });

    describe('Nested Object inside an Array', function() {
      it('should sanitize a nested object in the query string', function(done) {
        request(app)
          .get('/query?username[0][$gt]=foo&username[0][dotted.data]=some_data')
          .set('Accept', 'application/json')
          .expect(200, {
            query: {
              username: [{
                _gt: 'foo',
                dotted_data: 'some_data'
              }]
            }
          }, done);
      });

      it('should sanitize a nested object in a JSON body', function(done) {
        request(app)
          .post('/body')
          .send({
            username: [{
              $gt: 'foo',
              'dotted.data': 'some_data'
            }]
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              username: [{
                _gt: 'foo',
                dotted_data: 'some_data'
              }]
            }
          }, done);
      });

      it('should sanitize a nested object in a form url-encoded body', function(done) {
        request(app)
          .post('/body')
          .send('username[0][$gt]=foo&username[0][dotted.data]=some_data')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              username: [{
                _gt: 'foo',
                dotted_data: 'some_data'
              }]
            }
          }, done);
      });
    });

    describe('Nested Object inside one with prohibited chars', function() {
      it('should sanitize a nested object inside one with prohibited chars in a JSON body', function(done) {
        request(app)
          .post('/body')
          .send({
            username: {
              $gt: 'foo',
              'dotted.data': {
                'more.dotted.data': 'some_data'
              }
            }
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              username: {
                _gt: 'foo',
                dotted_data: {
                  'more_dotted_data': 'some_data'
                }
              }
            }
          }, done);
      });
    });

    describe('prototype pollution', function() {
      const createApp = (options) => {
        const app = express();
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(sanitize(options));

        app.post('/body', function (req, res) {
          // should not inject valued
          expect(req.body.injected).to.be.undefined;
          res.status(200).json({
            body: req.body
          });
        });
        return app;
      }
      it('should not set __proto__ property', function (done) {
        const app = createApp({
          replaceWith: "_"
        });
        request(app)
            .post('/body')
            .send({
              // replace $ with _
              $_proto__: {
                injected: "injected value"
              },
              query: {
                q: 'search'
              }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200, {
              body: {
                query: {
                  q: 'search'
                }
              }
            }, done);
      });
      it('should not set constructor property', function (done) {
        const app = createApp({
          replaceWith: "c"
        });
        request(app)
          .post('/body')
          .send({
            // replace $ with c
            $onstructor: {
              injected: "injected value"
            },
            query: {
              q: 'search'
            }
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              query: {
                q: 'search'
              }
            }
          }, done);
      });
      it('should not set prototype property', function (done) {
        const app = createApp({
          replaceWith: "p"
        });
        request(app)
          .post('/body')
          .send({
            // replace $ with empty p
            $rototype: {
              injected: "injected value"
            },
            query: {
              q: 'search'
            }
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200, {
            body: {
              query: {
                q: 'search'
              }
            }
          }, done);
      });
    });
  });

  describe('Preserve Data: prohibited characters', function() {
    it('should not allow data to be replaced with a `$`', function(done) {
      const app = express();
      app.use(bodyParser.urlencoded({extended: true}));
      app.use(sanitize({
        replaceWith: '$'
      }));

      app.get('/query', function(req, res){
        res.status(200).json({
          query: req.query
        });
      });
       request(app)
        .get('/query?q=search&$where=malicious&dotted.data=some_data')
        .set('Accept', 'application/json')
        .expect(200, {
          query: {
            q: 'search'
          }
        }, done);
    });

    it('should not allow data to be replaced with a `.`', function(done) {
      const app = express();
      app.use(bodyParser.urlencoded({extended: true}));
      app.use(sanitize({
        replaceWith: '.'
      }));

      app.get('/query', function(req, res){
        res.status(200).json({
          query: req.query
        });
      });
       request(app)
        .get('/query?q=search&$where=malicious&dotted.data=some_data')
        .set('Accept', 'application/json')
        .expect(200, {
          query: {
            q: 'search'
          }
        }, done);
    });
  });

  describe('Has Prohibited Keys', function() {
    it('should return true if the object has a key beginning with a `$`', function() {
      const input = {
        $prohibited: 'key'
      };
      expect(sanitize.has(input)).to.be.true;
    });

    it('should return true if the object has a key containing a `.`', function() {
      const input = {
        'prohibited.key': 'value'
      };
      expect(sanitize.has(input)).to.be.true;
    });

    it('should return true if the object has a nested key beginning with a `$`', function() {
      const input = {
        nested: {
          $prohibited: 'key'
        }
      };
      expect(sanitize.has(input)).to.be.true;
    });

    it('should return true if the object has a nested key containing a `.`', function() {
      const input = {
        nested: {
          'prohibited.key': 'value'
        }
      };
      expect(sanitize.has(input)).to.be.true;
    });

    it('should return true if the array contains an object with a key beginning with a `$`', function() {
      const input = [{
        $prohibited: 'key'
      }];
      expect(sanitize.has(input)).to.be.true;
    });

    it('should return true if the array contains an object with a key containing a `.`', function() {
      const input = [{
        'prohibited.key': 'value'
      }];
      expect(sanitize.has(input)).to.be.true;
    });

    it('should return true if the payload contains a deeply nested object with a key beginning with a `$`', function() {
      const input = [{
        some: {
          deeply: [{
            nested: {
              $prohibited: 'key'
            }
          }]
        }
      }];
      expect(sanitize.has(input)).to.be.true;
    });

    it('should return true if the payload contains a deeply nested object with a key containing a `.`', function() {
      const input = [{
        some: {
          deeply: [{
            nested: {
              'prohibited..key': 'key'
            }
          }]
        }
      }];
      expect(sanitize.has(input)).to.be.true;
    });

    it('should return false if the payload doesn\'t contain any prohibited characters', function() {
      const input = {
        some: {
          nested: [{
            data: 'panda'
          }]
        }
      };
      expect(sanitize.has(input)).to.be.false;
    });
  });
});
