'use strict';

describe('Model: Game', function() {

  // load the controller's module
  beforeEach(module('mahjongApp'));

  var scope, GameFactory,
    david = 'david', jeff = 'jeff', amy = 'amy', julia = 'julia', all = 'all';

  // Initialize the controller and a mock scope
  beforeEach(inject(function($rootScope, $state, _GameFactory_) {
    scope = $rootScope.$new();
    GameFactory = _GameFactory_;
  }));

  it('should calculate draw', function() {
    var game = GameFactory.create();
    game.addAction({actor: david, actionType: GameFactory.enums.BIRD, from: all});
    expect(game.isDraw()).toBe(true);
  });

  describe('calculate single eat', function() {
    var game = null;
    beforeEach(function() {
      game = GameFactory.create();
      game.addAction({actor: david, actionType: GameFactory.enums.EAT, from: julia});
    });

    it('should expect draw to be false', function() {
      expect(game.isDraw()).toBe(false);
    });

    it('should expect winner to be david', function() {
      expect(game.getWinners().length).toBe(1);
      expect(game.getWinners()).toEqual([david]);
    });

    it('should expect david to win correct amount', function() {
      expect(game.getScoreForPlayer(david)).toEqual(
        {julia: 1, amy: 0, jeff: 0}
      );
    });

    it('should expect julia to loose correct amount', function() {
      expect(game.getScoreForPlayer(julia)).toEqual(
        {david: -1, amy: 0, jeff: 0}
      );
    });
  });

  describe('calculate single eat 13 orphan', function() {
    var game = null;
    beforeEach(function() {
      game = GameFactory.create();
      game.addAction({actor: david, actionType: GameFactory.enums.EAT, from: julia, isOrphan: true});
    });

    it('should expect draw to be false', function() {
      expect(game.isDraw()).toBe(false);
    });

    it('should expect winner to be david', function() {
      expect(game.getWinners().length).toBe(1);
      expect(game.getWinners()).toEqual([david]);
    });

    it('should expect david to win correct amount', function() {
      expect(game.getScoreForPlayer(david)).toEqual(
        {julia: 13, amy: 0, jeff: 0}
      );
    });

    it('should expect julia to loose correct amount', function() {
      expect(game.getScoreForPlayer(julia)).toEqual(
        {david: -13, amy: 0, jeff: 0}
      );
    });
  });

  describe('calculate single eat with bird', function() {
    var game = null;
    beforeEach(function() {
      game = GameFactory.create();
      game.addAction({actor: david, actionType: GameFactory.enums.BIRD, from: all});
      game.addAction({actor: david, actionType: GameFactory.enums.EAT, from: julia});
    });

    it('should expect draw to be false', function() {
      expect(game.isDraw()).toBe(false);
    });

    it('should expect winner to be david', function() {
      expect(game.getWinners().length).toBe(1);
      expect(game.getWinners()).toEqual([david]);
    });

    it('should expect david to win correct amount', function() {
      expect(game.getScoreForPlayer(david)).toEqual(
        {julia: 2, amy: 1, jeff: 1}
      );
    });
  });

  describe('calculate single eat with gong, then bird', function() {
    var game = null;
    beforeEach(function() {
      game = GameFactory.create();
      game.addAction({actor: david, actionType: GameFactory.enums.GONG, from: julia});
      game.addAction({actor: david, actionType: GameFactory.enums.BIRD, from: julia});
      game.addAction({actor: david, actionType: GameFactory.enums.EAT, from: julia});
    });

    it('should expect draw to be false', function() {
      expect(game.isDraw()).toBe(false);
    });

    it('should expect winner to be david', function() {
      expect(game.getWinners().length).toBe(1);
      expect(game.getWinners()).toEqual([david]);
    });

    it('should expect david to win correct amount', function() {
      expect(game.getScoreForPlayer(david)).toEqual(
        {julia: 7, amy: 0, jeff: 0}
      );
      expect(game.getTotalScoreForPlayer(david)).toEqual(7);
    });
  });

  describe('calculate multi-winner eat with bird', function() {
    var game = null;
    beforeEach(function() {
      game = GameFactory.create();
      game.addAction({actor: david, actionType: GameFactory.enums.BIRD, from: all});
      game.addAction({actor: david, actionType: GameFactory.enums.EAT, from: julia});
      game.addAction({actor: amy, actionType: GameFactory.enums.EAT, from: julia});
    });

    it('should expect draw to be false', function() {
      expect(game.isDraw()).toBe(false);
    });

    it('should expect winner to be david and amy', function() {
      expect(game.getWinners().length).toBe(2);
      expect(game.getWinners()).toEqual([david, amy]);
    });

    it('should expect david to win correct amount', function() {
      expect(game.getScoreForPlayer(david)).toEqual(
        {julia: 2, amy: 1, jeff: 1}
      );
      expect(game.getTotalScoreForPlayer(david)).toEqual(4);
    });

    it('should expect amy to win correct amount', function() {
      expect(game.getScoreForPlayer(amy)).toEqual(
        {julia: 1, david: -1, jeff: 0}
      );
    });
  });

  describe('should calculate single self-draw', function() {
    var game = null;
    beforeEach(function() {
      game = GameFactory.create();
      game.addAction({actor: david, actionType: GameFactory.enums.SELF_DRAW, from: all});
    });

    it('should expect draw to be false', function() {
      expect(game.isDraw()).toBe(false);
    });

    it('should expect winner to be david', function() {
      expect(game.getWinners().length).toBe(1);
      expect(game.getWinners()).toEqual([david]);
    });

    it('should expect david to win correct amount', function() {
      expect(game.getScoreForPlayer(david)).toEqual(
        {julia: 2, amy: 2, jeff: 2}
      );
      expect(game.getTotalScoreForPlayer(david)).toEqual(6);
    });
  });

  describe('should calculate single self-draw - orphan', function() {
    var game = null;
    beforeEach(function() {
      game = GameFactory.create();
      game.addAction({actor: david, actionType: GameFactory.enums.SELF_DRAW, from: all, isOrphan: true});
    });

    it('should expect draw to be false', function() {
      expect(game.isDraw()).toBe(false);
    });

    it('should expect winner to be david', function() {
      expect(game.getWinners().length).toBe(1);
      expect(game.getWinners()).toEqual([david]);
    });

    it('should expect david to win correct amount', function() {
      expect(game.getScoreForPlayer(david)).toEqual(
        {julia: 13, amy: 13, jeff: 13}
      );
      expect(game.getTotalScoreForPlayer(david)).toEqual(39);
    });
  });

  describe('should calculate single self-draw with bonus', function() {
    var game = null;
    beforeEach(function() {
      game = GameFactory.create();
      game.addAction({actor: david, actionType: GameFactory.enums.SELF_DRAW, from: all, bonus: 1});
    });

    it('should expect draw to be false', function() {
      expect(game.isDraw()).toBe(false);
    });

    it('should expect winner to be david', function() {
      expect(game.getWinners().length).toBe(1);
      expect(game.getWinners()).toEqual([david]);
    });

    it('should expect david to win correct amount', function() {
      expect(game.getScoreForPlayer(david)).toEqual(
        {julia: 4, amy: 4, jeff: 4}
      );
    });
  });

  describe('should calculate single self-draw with bonus from a player', function() {
    var game = null;
    beforeEach(function() {
      game = GameFactory.create();
      game.addAction({actor: david, actionType: GameFactory.enums.SELF_DRAW, from: julia, bonus: 1});
    });

    it('should expect draw to be false', function() {
      expect(game.isDraw()).toBe(false);
    });

    it('should expect winner to be david', function() {
      expect(game.getWinners().length).toBe(1);
      expect(game.getWinners()).toEqual([david]);
    });

    it('should expect david to win correct amount', function() {
      expect(game.getScoreForPlayer(david)).toEqual(
        {julia: 12, amy: 0, jeff: 0}
      );
    });
  });

  describe('should calculate gong, bird selfdraw from back', function() {
    var game = null;
    beforeEach(function() {
      game = GameFactory.create();
      game.addAction({actor: david, actionType: GameFactory.enums.GONG, from: julia});
      game.addAction({actor: david, actionType: GameFactory.enums.BIRD, from: julia});
      game.addAction({actor: david, actionType: GameFactory.enums.SELF_DRAW, from: julia, bonus: 2});
    });

    it('should expect draw to be false', function() {
      expect(game.isDraw()).toBe(false);
    });

    it('should expect winner to be david', function() {
      expect(game.getWinners().length).toBe(1);
      expect(game.getWinners()).toEqual([david]);
    });

    it('should expect david to win correct amount', function() {
      expect(game.getScoreForPlayer(david)).toEqual(
        {julia: 24, amy: 0, jeff: 0}
      );
    });
  });
});
