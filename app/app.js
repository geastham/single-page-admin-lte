'use strict';

// Declare app level module which depends on views, and components
angular.module('admin-lte', [
  'ngRoute'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.
    when('/app', {
      templateUrl: 'app.template'
    }).
    otherwise('/app');
}]);
