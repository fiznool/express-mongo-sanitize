'use strict';

var request = require('supertest'),
    express = require('express'),
    bodyParser = require('body-parser'),
    sanitize = require('./index.js');

describe('Express Mongo Sanitize', function() {
  var app = express();
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(sanitize());

  app.post('/body', function(req, res){
    res.status(200).json({
      body: req.body
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
        .get('/query?q=search&$where=malicious')
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
          $where: 'malicious'
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

    it('should sanitize a form url-encoded body', function(done) {
      request(app)
        .post('/body')
        .send('q=search&$where=malicious')
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
        .get('/query?username[$gt]=')
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
          username: { $gt: '' }
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
        .send('username[$gt]=')
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
        .get('/query?username[0][$gt]=')
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
          username: [{ $gt: '' }]
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
        .send('username[0][$gt]=')
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
