'use strict';

angular.module('mahjongApp')
  .directive('gameAction', ['GameFactory', function (GameFactory) {
    return {
      templateUrl: 'app/gameAction/gameAction.html',
      scope: {
        game: '=',
        action: '='
      },
      restrict: 'EA',
      link: function (scope) {
        var players = _.map(scope.game.data.seats, function(name) {
          return {id: name, name: name};
        });

        scope.userPlayers = [];
        scope.fromPlayers = [];
        scope.actionTypes = _.toArray(GameFactory.getActionTypes());

        var updateActors = function() {
          scope.userPlayers = _.filter(players, function(player) {
            return player.id !== scope.action.from;
          });
        };

        var updateFromPlayers = function() {
          console.log('exclude: ', scope.action.actor);
          var fromPlayers = _.filter(players, function(player) {
            return player.id !== scope.action.actor;
          });

          if (scope.action.actionType !== GameFactory.enums.EAT) {
            fromPlayers.unshift({id: 'all', name: 'All'})
          }

          console.log('fromPlayers', fromPlayers);
          scope.fromPlayers = fromPlayers;
        };

        scope.$watch(function() { return scope.action.from; }, updateActors);
        scope.$watch(function() { return scope.action.actor; }, updateFromPlayers);
        scope.$watch(function() { return scope.action.actionType; }, updateFromPlayers);

        updateFromPlayers();
        updateActors();

        scope.isWinningAction = function() {
          return _.indexOf([GameFactory.enums.EAT, GameFactory.enums.SELF_DRAW], scope.action.actionType) >= 0;
        }
      }
    };
  }]);
