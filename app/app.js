'use strict';

// Declare app level module which depends on views, and components
angular.module('apj-browser', [
  'ngRoute'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.
    when('/app', {
      templateUrl: '//' + document.domain + '/app/views/app.template.html'
    }).
    otherwise('/app');
}]);
