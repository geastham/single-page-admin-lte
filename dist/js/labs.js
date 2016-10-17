/*
 *   Labs.js -- Primary entry point for Edgecase Labs front-end
 */

// Routes --- setup URL routes
angular.module('labs.routes', []).config(['$stateProvider', '$urlRouterProvider',
   function($stateProvider, $urlRouterProvider) {
     // For any unmatched url, redirect to admin dashboard
     $urlRouterProvider.otherwise("/query_analyzer/menswearhouse");

     // Now set up the states
     $stateProvider
       .state('query_analyzer', {
         url: "/query_analyzer/:clientid",
         /*templateUrl: "partials/dashboard.html",*/
         controller: "QueryAnalyzer"
       });
   }
]);

// Initialize app
angular.module('labs', [
 'ui.router',
 'labs.routes',
 'controllers.queryanalyzer',
 'services.analytics'
]);
