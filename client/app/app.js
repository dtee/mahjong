'use strict';

angular.module('mahjongApp', [
  'mahjongApp.auth',
  'mahjongApp.admin',
  'mahjongApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'ngBootbox',
  'ui.bootstrap',
  'ui.bootstrap.tabs',
  'gridshore.c3js.chart',
  'ngTable'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
