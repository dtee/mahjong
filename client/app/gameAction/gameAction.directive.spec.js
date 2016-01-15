'use strict';

describe('Directive: gameAction', function () {

  // load the directive's module and view
  beforeEach(module('mahjongApp'));
  beforeEach(module('app/gameAction/gameAction.html'));

  var element, scope, GameFactory;

  beforeEach(inject(function ($rootScope, _GameFactory_) {
    scope = $rootScope.$new();
    GameFactory = _GameFactory_;
    scope.game = GameFactory.create();
    scope.action = GameFactory.createAction();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<game-action game="game" action="action"></game-action>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the gameAction directive');
  }));
});
