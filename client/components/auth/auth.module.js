'use strict';

angular.module('mahjongApp.auth', [
  'mahjongApp.constants',
  'mahjongApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
