'use strict';

var app = require('../..');
import request from 'supertest';

var newGame;
var gameData = {
  seats: {
    west: 'david',
    east: 'julia',
    south: 'amy',
    north: 'jeff',
  },
  actions: []
};

describe('Game API:', function() {
  describe('GET /api/games', function() {
    var games;

    beforeEach(function(done) {
      request(app)
        .get('/api/games')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          games = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      games.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/games', function() {

    beforeEach(function(done) {
      request(app)
        .post('/api/games')
        .send(gameData)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newGame = res.body;
          done();
        });
    });

    it('should respond with the newly created game', function() {
      newGame.seats.east.should.equal(gameData.seats.east);
    });

  });

  describe('GET /api/games/:id', function() {
    var game;

    beforeEach(function(done) {
      request(app)
        .get('/api/games/' + newGame._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          game = res.body;
          done();
        });
    });

    afterEach(function() {
      game = {};
    });

    it('should respond with the requested game', function() {
      game.seats.east.should.equal(gameData.seats.east);
    });

  });

  describe('PUT /api/games/:id', function() {
    var updatedGame;

    gameData.actions = [{
      actor: 'west',
      actionType: 'eat',
      from: 'east'
    }];

    beforeEach(function(done) {
      request(app)
        .put('/api/games/' + newGame._id)
        .send(gameData)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedGame = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedGame = {};
    });

    it('should respond with the updated game', function() {
      newGame.seats.east.should.equal(gameData.seats.east);
    });

    it('should respond with the updated game - one action', function() {
      newGame.actions.length.should.equal(1);
    });
  });

  describe('DELETE /api/games/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/games/' + newGame._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when game does not exist', function(done) {
      request(app)
        .delete('/api/games/' + newGame._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
