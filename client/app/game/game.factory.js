'use strict';

(function () {
  var $http, _default = {
    seats: {
      west: 'david',
      east: 'jeff',
      north: 'julia',
      south: 'amy'
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
      this.data = _.merge({}, data || {}, _default);
      this.data.created = new Date();
      this.data.updated = new Date();
    }

    addAction(action) {
      this.data.actions.push(action);
    }

    isDraw() {
      return this.getWinners().length == 0;
    }

    getWinners() {
      var winners = [];
      _.forEach(this.data.actions, function(action) {
        if (action.actionType === enums.EAT || action.actionType === enums.SELF_DRAW) {
          winners.push(action.actor);
        }
      });

      return winners;
    }

    // return a 2d array of who owes whom what
    getScore() {
      var summary = [];
      _.forEach(_.toArray(this.data.seats), (player) => {
        summary.push({
          name: player,
          score: this.getTotalScoreForPlayer(player)
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
        if (action.actor === player) {
          var wonValue = getValue(action);

          if (action.from === 'all') {
            // Collect from everyone
            _.forEach(_.keys(others), function(otherPlayer) {
              others[otherPlayer] += wonValue;
            });
          }
          else {
            others[action.from] += wonValue;
          }
        }
        else {
          // did not win - but did not lose
          var lostValue = getValue(action);

          if (action.from !== 'all' && action.from !== player) {
            lostValue = 0;    // No need to pay
          }

          others[action.actor] -= lostValue;
        }
      });

      return others;
    }

    save() {
      return $http.post('/api/games', this.data)
    }
  };

  angular.module('mahjongApp').factory('GameFactory', function (_$http_, $q, socket) {
    $http = _$http_;
    var games = [];

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
      createAction: function () {
        return {actor: null, actionType: null, from: 'all', bonus: 0, isOrphan: false};
      },
      loadGames: function () {
        var defer = $q.defer();
        $http.get('/api/games').then(response => {
          _.forEach(response.data, function (gameData) {
            games.push(new Game(gameData));
          });

          defer.resolve(games);
        });

        return defer.promise;
      }
    };

    return methods;
  });
})();
//# sourceMappingURL=game.factory.js.map