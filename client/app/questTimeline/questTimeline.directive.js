'use strict';

angular.module('questApp')
  .directive('questTimeline', function () {
    return {
      scope: {
        questTimelines: '='
      },
      replace: true,
      restrict: 'E',
      controller: function($scope, $http){

      /*  $http.get('/api/comments').success(function(data){
          console.log(data);
        });
        $http.get('/api/comments/' + $scope.questTimelines[0]._id).success(function(data){
          console.log(data);
        });*/

        $scope.addComment = function(questTimeline){

          $http.post('/api/comments', questTimeline)
            .success(function(comment){
              console.log(comment);
              questTimeline.comments.push(comment);
              questTimeline.addTargetComment = {}
            }).error(function(err){
              console.log(err);
            });

        };

      },
      templateUrl: 'app/questTimeline/questTimeline.html'
    };
  });
