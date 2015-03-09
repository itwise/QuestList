'use strict';

angular.module('questApp')
  .controller('TagCtrl', function ($scope, Quest, $stateParams) {
    $scope.init = function(){
      Quest.tagQuest({ tag : $stateParams.tag }, function(questList){
        $scope.questTimelines = questList;
      });
    }
  });
