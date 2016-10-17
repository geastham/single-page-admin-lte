/*
 *    Analytics Service -- helper service for accessing server-side analytics API
 */

 angular.module('services.analytics', []).factory('Analytics', ['$http',
     function($http) {
         return {
            searches: {
                // Gets scored searches over a time period (broken down by matched attribute)
                timeline: function(callback, clientid, query) {
                  $http({
                      method: 'get',
                      url: '/api/analytics/searches/timeline/' + clientid + '/' + query
                  }).success(function(data) {
                      //console.log(data);
                      callback(data);
                  }).error(function() {
                      console.log("Error: AnalyticsService searches.timeline");
                  });
                },
                // Gets ranked attribute facets for given query
                attributes: function(callback, clientid, query) {
                  $http({
                      method: 'get',
                      url: '/api/analytics/searches/attributes/' + clientid + '/' + query
                  }).success(function(data) {
                      //console.log(data);
                      callback(data);
                  }).error(function() {
                      console.log("Error: AnalyticsService searches.attributes");
                  });
                },
                // Gets ranked attribute facets for given query
                results: function(callback, clientid, attribute, query) {
                  $http({
                      method: 'get',
                      url: '/api/analytics/searches/results/' + clientid + '/' + encodeURI(attribute) + '/' + query
                  }).success(function(data) {
                      //console.log(data);
                      callback(data);
                  }).error(function() {
                      console.log("Error: AnalyticsService searches.results");
                  });
                },
                // Gets value breakdown and newly idenfitied attribute values
                values: function(callback, clientid, attribute, query) {
                  $http({
                      method: 'get',
                      url: '/api/analytics/searches/values/' + clientid + '/' + encodeURI(attribute) + '/' + query
                  }).success(function(data) {
                      //console.log(data);
                      callback(data);
                  }).error(function() {
                      console.log("Error: AnalyticsService searches.values");
                  });
                }
             }
         };
     }
 ]);
