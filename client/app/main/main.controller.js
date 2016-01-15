'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket, _GameFactory_) {
    this.$http = $http;
    this.games = [];
    this.seats = [
      'west',
      'east',
      'north',
      'south'
    ];

    this.GameFactory = _GameFactory_;
    this.game = _GameFactory_.create();

    var actionDefault = {actor: null, actionType: null, from: 'all'};
    this.action = angular.copy(actionDefault);

    _GameFactory_.loadGames().then((games) => {
      this.games = games;
      socket.syncUpdates('games', games);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('games');
    });

    var that = this;
    this.customDialogOptions = {
      scope: $scope,
      title: 'Add an action!',
      message: 'Item',
      templateUrl: '/app/main/add-dialog.html',
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
    console.log('saving ', game);
    game.save();
  }

  removeAction(action) {
    _.remove(this.game.data.actions, action);
  }
}

angular.module('mahjongApp')
  .controller('MainController', MainController);

})();
