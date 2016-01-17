'use strict';

(function () {
  var $http, _default = {
    seats: {
      east: 'jeff',
      south: 'amy',
      west: 'david',
      north: 'julia'
    },
    actions: []   //{actor: null, actionType: null, from: 'all', bonus: 0-2}
  };

  var enums = {
    EAT: 'eat',
    SELF_DRAW: 'self-draw',
    GONG: 'gong',
    HIDDEN_GONG: 'hidden-gong',
    BIRD: 'bird',
    SELF_DRAW_BONUS: 'bonus',
    ORPHAN: 'orphan'
  };

  var actionTypes = _.indexBy([
    {id: enums.EAT, name: 'Eat', value: 1},
    {id: enums.SELF_DRAW, name: 'Self draw', value: 2},
    {id: enums.GONG, name: 'Gong', value: 1},
    {id: enums.HIDDEN_GONG, name: 'Hidden Gong', value: 2},
    {id: enums.BIRD, name: 'Bird', value: 1},
    {id: enums.SELF_DRAW_BONUS, name: 'Self draw bonus', value: 2},
    {id: enums.ORPHAN, name: 'Thirteen Orphans', value: 13}
  ], 'id');

  function getValue(action) {
    var amount = actionTypes[action.actionType].value;
    if (action.isOrphan) {
      amount = actionTypes[enums.ORPHAN].value;
    }

    if (action.actionType === enums.SELF_DRAW && action.bonus) {
      amount += actionTypes[enums.SELF_DRAW_BONUS].value * action.bonus;
    }

    if (action.from !== 'all' && action.actionType !== enums.EAT) {
      amount *= 3;
    }

    return amount;
  }

  class Game {
    constructor(data) {
      // Use the User $resource to fetch all users
      this.data = _.merge({}, _default, data || {});

      this.data.created = this.data.created || new Date();
      this.data.updated = this.data.updated || new Date();

      this.data.actions = _.map(this.data.actions, (action) => {
        return this.createAction(action);
      });
    }

    addAction(action) {
      this.data.actions.push(action);
    }

    isDraw() {
      return this.getWinners().length === 0;
    }

    getWinners() {
      var winners = [];
      _.forEach(this.data.actions, function(action) {
        if (action.actionType === enums.EAT || action.actionType === enums.SELF_DRAW) {
          winners.push(action.actorPlayer());
        }
      });

      return winners;
    }

    // return a 2d array of who owes whom what
    getScore() {
      var summary = [];
      var winners = this.getWinners();
      _.forEach(_.toArray(this.data.seats), (player) => {
        summary.push({
          name: player,
          score: this.getTotalScoreForPlayer(player),
          won: _.indexOf(winners, player) >= 0
        });
      });

      return summary;
    }

    getTotalScoreForPlayer(player) {
      var values = _.toArray(this.getScoreForPlayer(player));
      return _.sum(values);
    }

    getScoreForPlayer(player) {
      var others = {};
      _.forEach(_.toArray(this.data.seats), function(seatPlayer) {
        if (seatPlayer !== player) {
          others[seatPlayer] = 0;
        }
      });

      _.forEach(this.data.actions, function(action) {
        if (action.actorPlayer() === player) {
          var wonValue = getValue(action);

          if (action.from === 'all') {
            // Collect from everyone
            _.forEach(_.keys(others), function(otherPlayer) {
              others[otherPlayer] += wonValue;
            });
          }
          else {
            others[action.fromPlayer()] += wonValue;
          }
        }
        else {
          // did not win - but did not lose
          var lostValue = getValue(action);

          if (action.from !== 'all' && action.fromPlayer() !== player) {
            lostValue = 0;    // No need to pay
          }

          others[action.actorPlayer()] -= lostValue;
        }
      });

      return others;
    }

    save() {
      if (this.data._id) {
        this.data.updated = new Date();
        return $http.put('/api/games/' + this.data._id, this.data);
      }

      this.data.created = new Date();
      return $http.post('/api/games', this.data)
    }

    remove() {
      return $http.delete('/api/games/' + this.data._id);
    }

    createAction (action) {
      return new GameAction(action || {}, this);
    }

    selectDealer(wind) {
      var currentOrder = [
        this.seats.east,
        this.seats.south,
        this.seats.west,
        this.seats.north
      ];

      if (wind !== 'east') {

      }
    }
  };

  var GameAction = function(action, game) {
    this.actor = action.actor || null;
    this.actionType = action.actionType || null;
    this.from = action.from || 'all';
    this.bonus = action.bonus || 0;
    this.isOrphan = action.isOrphan || false;

    this.actorPlayer = function() {
      return game.data.seats[this.actor];
    }

    this.fromPlayer = function() {
      return game.data.seats[this.from] || this.from;
    }
  }

  angular.module('mahjongApp').factory('GameFactory', ['$http', '$q', 'socket', function (_$http_, $q) {
    $http = _$http_;

    var methods = {
      enums: enums,
      getActionTypes: function () {
        return _.filter(actionTypes, function (value, key) {
          return key !== enums.SELF_DRAW_BONUS && key !== enums.ORPHAN;
        });
      },
      create: function create(data) {
        return new Game(data);
      },
      loadGames: function () {
        var games = [];
        var defer = $q.defer();
        $http.get('/api/games').then(response => {
          _.forEach(response.data, function (gameData) {
            games.push(new Game(gameData));
          });

          defer.resolve(games);
        });

        return defer.promise;
      },
      getSummary: function(games) {
        var summary = {};
        _.forEach(games, function(game) {
          _.forEach(game.getScore(), function(scoreSummary) {
            if (game.isDraw()) {
              return;
            }

            if (!summary[scoreSummary.name]) {
              summary[scoreSummary.name] = 0;
            }

            summary[scoreSummary.name] += scoreSummary.score;
          });
        });

        return summary;
      }
    };

    return methods;
  }]);
})();
//# sourceMappingURL=game.factory.js.map
