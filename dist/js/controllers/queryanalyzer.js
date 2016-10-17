/*
 *   Query Analzyer -- App for discovering emerging topics and new terminology from on-site shopper search behavior
 */

angular.module('controllers.queryanalyzer', []).controller('QueryAnalyzer', function($scope, $stateParams, $location, Analytics) {
  // Set loading state on initial widgets
  // ... TODO: un-hide loading overlays

  // Set client ID
  var _clientId = $stateParams.clientid;
  console.info(_clientId);

  //Initialize Select2 Elements
  var _queryBox = $(".select2").select2({
    tags: true
  });

  // Initial Query
  var _query = "_";
  var _attribute = "Type";
  $scope.activeAttribute = "";

  // Charts
  var _timeline; // to be instantiated later
  var _jQCloudFlag = false; // flag indicating if cloud has been insantiated

  // Data
  var _timelineData;
  var _attributeData;

  // Hide initial values pane
  $("#values-loading").show();

  // Helper -- setup timeline
  function setupTimeline(data) {
    // Insantiate graph
    return nv.addGraph(function() {
      _timeline = nv.models.stackedAreaChart()
                    .x(function(d) { return d[0] })
                    .y(function(d) { return d[1] })
                    .clipEdge(true)
                    .useInteractiveGuideline(true);

      _timeline.xAxis
          .showMaxMin(false)
          .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

      _timeline.yAxis
          .tickFormat(d3.format(',.2f'));

      _timelineData = d3.select('#query_timeline_chart svg').datum(data);
      _timelineData.transition().duration(500).call(_timeline);

      nv.utils.windowResize(_timeline.update);

      return _timeline;
    });
  };

  // Setup initial timeline
  /*Analytics.searches.timeline(function(results) {
      // Format data correctly
      console.info(results);

      // Setup initial timeline
      setupTimeline(results);
  }, _query);*/

  // Setup initial attributes
  Analytics.searches.attributes(function(results) {
      // Format data correctly
      console.info(results);

      // Set initial attributes scope
      _attributeData = results; // store full set
      $scope.attributes = results.splice(0, 30);


  }, _clientId, _query);

  // Instantiate initial search results
  Analytics.searches.results(function(results) {
      // Format data correctly
      console.info(results);

      // Set initial attributes scope
      $scope.results = results;
  }, _clientId, "Type", "_");

  // Track query updates -- setup change to analytics
  $scope.$watch('query', function(newvalue, oldvalue) {
    console.info(newvalue);

    // update graph
    if(newvalue) { // if there's an actual new value
      // Grab query value
      _query = ""; // clear
      if(newvalue.length > 0) {
        for(var i = 0; i < newvalue.length - 1; i++) {
          _query += encodeURI(newvalue[i]) + "_";
        }
        _query += newvalue[newvalue.length - 1]; // append end value
      } else {
        _query = "_";
      }
      console.info(_query);
      //_query = (newvalue.length > 0) ? newvalue[0] : "_";
      _attribute = "Type";

      // Show loading indicator
      $("#timeline-loading").show();
      $("#attribute-loading").show();
      $("#results-loading").show();
      $("#values-loading").show();

      // Update timeline
      /*Analytics.searches.timeline(function(results) {
          // Format data correctly
          console.info(results);

          // Update data with regard to timeline
          _timelineData.datum(results).transition().duration(500).call(_timeline);

          // Re-set window resize
          nv.utils.windowResize(_timeline.update);

          $("#timeline-loading").hide();
      }, _query);*/

      // Update attributes
      Analytics.searches.attributes(function(results) {
          // Format data correctly
          console.info(results);

          // Set initial attributes scope
          _attributeData = results; // store full set
          $scope.attributes = results.splice(0, 30);

          $("#attribute-loading").hide();
      }, _clientId, _query);

      // Update results
      Analytics.searches.results(function(results) {
          // Format data correctly
          console.info(results);

          // Set initial attributes scope
          $scope.results = results;

          $("#results-loading").hide();
      }, _clientId, _attribute, _query);
    }

    // Setup click handler on attribute facets
    $scope.refineResults = function($event, attribute) {
      // Set loading bars
      $("#results-loading").show();
      $("#values-loading").show();

      // Set inner text
      console.info($event.currentTarget);
      $(".attribute-name").css({'color': 'black', 'font-weight': 'normal'});
      $($event.currentTarget).find(".attribute-name").css({'color': 'blue', 'font-weight':'bold'});

      // Set attribute
      _attribute = attribute.name;
      $scope.activeAttribute = "(" + attribute.name + ")";

      // Load search results
      Analytics.searches.results(function(results) {
          // Format data correctly
          console.info(results);

          // Set initial attributes scope
          $scope.results = results;

          $("#results-loading").hide();
      }, _clientId, _attribute, _query);

      // Instantiate value summary
      Analytics.searches.values(function(results) {
          // Format data correctly
          console.info(results);

          // Wipe existing elements
          $("#value-chart").empty();

          // Setup initial values chart
          var donut = new Morris.Donut({
            element: 'value-chart',
            resize: true,
            colors: ["#3c8dbc", "#f56954", "#00a65a"],
            data: results.valueCounts,
            hideHover: 'auto'
          });

          // set scope for table view
          $scope.recommendedTerms = results.rankedTerms;

          // Check if we've already instantiated jQCloud
          if(_jQCloudFlag) { // Update jQCloud
            $('#recommended-attributes').jQCloud('update', results.cleanedTerms);
          } else { // Instantiate word cloud
            $('#recommended-attributes').jQCloud(results.cleanedTerms, {
              shape: 'rectangular',
              autoResize: true
            });
            _jQCloudFlag = true; // set jQcloud
          }

          $("#values-loading").hide();
      }, _clientId, attribute.name, _query);
    };

    // Add new terms from values or search results
    $scope.addTerm = function(term) {
      console.info(_queryBox);
      console.info(_queryBox(0));
      //_queryBox.val(_queryBox.val().push(term)).trigger("change");
    };
  });

});
