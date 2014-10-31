'use strict';

angular.module('todoListApp')
  .directive('questTimeline', function () {
    return {
      scope: {
        questTimelines: '='
      },
      replace: true,
      restrict: 'E',
      controller: function($scope){
        console.log($scope.questTimelines);
      },
      templateUrl: 'app/questTimeline/questTimeline.html'
    };
  });
