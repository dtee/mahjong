'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket, GameFactory) {
    this.socket = socket;
    this.$http = $http;
    this.games = [];
    this.summary = {};
    this.seats = [
      'west',
      'east',
      'north',
      'south'
    ];

    this.GameFactory = GameFactory;
    this.game = GameFactory.create();

    var actionDefault = {actor: null, actionType: null, from: 'all'};
    this.action = angular.copy(actionDefault);

    this.refreshGames();

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('games');
    });

    var that = this;
    this.customDialogOptions = {
      scope: $scope,
      title: 'Add an action!',
      message: 'Item',
      templateUrl: 'app/main/add-dialog.html',
      buttons: {
        cancel: {
          label: "Cancel"
        },
        success: {
          label: "Save",
          className: "btn-success",
          callback: () => {
            if (that.action.actor && that.action.actionType) {
              that.game.addAction(that.action);
              that.action = angular.copy(actionDefault);
              $scope.$apply();
            }
          }
        }
      }
    };
  }

  addAction() {
  }

  save(game) {
    game.save().then(() => {
      this.refreshGames();
      this.game = this.GameFactory.create();
    });
  }

  refreshGames() {
    this.GameFactory.loadGames().then((games) => {
      this.games = games;
      this.socket.syncUpdates('games', games);

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

      console.log('summary', summary);
      this.summary = summary;
    });
  }

  removeAction(action) {
    _.remove(this.game.data.actions, action);
  }
}

angular.module('mahjongApp')
  .controller('MainController', ['$http', '$scope', 'socket', 'GameFactory', MainController]);

})();
