'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket, GameFactory) {
    this.socket = socket;
    this.$http = $http;
    this.games = [];
    this.summary = {};
    this.seats = [
      'east',
      'south',
      'west',
      'north'
    ];

    this.GameFactory = GameFactory;

    this.newGame();
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
            if (that.action.actor && that.action.actionType && that.action.from) {
              that.game.addAction(that.action);
              that.action = that.game.createAction();
              $scope.$apply();
            }
          }
        }
      }
    };
  }

  save(game) {
    game.save().then(() => {
      this.refreshGames();
      this.game = this.GameFactory.create();
    });
  }

  newGame() {
    this.game = this.GameFactory.create();
    this.action = this.game.createAction();

    if (this.games && this.games.length > 0) {
      this.game.data.seats = _.last(this.games).data.seats;
    }
  }

  editGame(game) {
    this.game = game;
  }

  deleteGame(game) {
    game.remove().then(() => {
      this.refreshGames();
    });
  }

  refreshGames() {
    this.GameFactory.loadGames().then((games) => {
      this.games = games;
      this.socket.syncUpdates('games', games);
      this.summary = this.GameFactory.getSummary(games);

      var chartCols = {};
      var row = {};
      this.chart = _.map(games, function(game) {
        _.forEach(game.getScore(), function(score) {
          if (!row[score.name]) {
            row[score.name] = 0;
          }

          row[score.name] += score.score;

          if (!chartCols[score.name]) {
            chartCols[score.name] = {
              id: score.name,
              type: 'spline'
            };
          }
        });

        return angular.copy(row);
      });

      this.chartCols = _.values(chartCols);
      this.newGame();
    });
  }

  removeAction(action) {
    _.remove(this.game.data.actions, action);
  }
}

angular.module('mahjongApp')
  .controller('MainController', ['$http', '$scope', 'socket', 'GameFactory', MainController]);

})();
