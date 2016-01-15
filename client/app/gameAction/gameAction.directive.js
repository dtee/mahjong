'use strict';

angular.module('mahjongApp')
  .directive('gameAction', [GameFactory, function (GameFactory) {
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

        scope.actionTypes = _.toArray(GameFactory.getActionTypes());

        var updateFromPlayers = function() {
          scope.userPlayers = _.filter(players, function(player) {
            return player.id !== scope.action.from;
          });
        };

        var updateActors = function() {
          var fromPlayers = _.filter(players, function(player) {
            return player.id !== scope.action.actor;
          });

          if (scope.action.actionType !== GameFactory.enums.EAT) {
            fromPlayers.unshift({id: 'all', name: 'All'})
          }

          scope.fromPlayers = fromPlayers;
        };

        scope.$watch(function() { return scope.action.from; }, updateActors);
        scope.$watch(function() { return scope.action.actor; }, updateFromPlayers);

        updateFromPlayers();
        updateActors();
      }
    };
  }]);
