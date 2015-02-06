'use strict';

angular.module('questApp')
  .directive('questTimeline', function () {
    return {
      scope: {
        questTimelines: '='
      },
      replace: true,
      restrict: 'E',
      controller: function($scope, $http, $window){
        $scope.deleteComment = function(comment){
          var options = $window.confirm('delete?');

          //TODO 임시설정
          if (options === true) {
            $http.delete('/api/comments/' + comment._id)
              .success(function(){
                alert('success');
                $window.location.reload();
              }).error(function(err){
                console.log(err);
              });
          } else {
            console.log('cancel')
          }
        };

        $scope.getPrintEditData = function(questTimeline){
          questTimeline.edit = 'edit';
          console.log(questTimeline.questPool.tags.length);
          if(questTimeline.questPool.tags.length === 0){
            return;
          }
          var tags = '';

          for(var i = 0 ; i < questTimeline.questPool.tags.length; i++){
            tags += '#' + questTimeline.questPool.tags[i];
          }
          questTimeline.editTags = tags;
        };

        $scope.updateComment = function(comment){
          console.log(comment);
          //Update
          $http.put('/api/comments/' + comment._id, comment)
           .success(function(){
            console.log('success');
              $window.location.reload();
           }).error(function(err){
            console.log(err);
           });
        };
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

        $scope.editQuestTimeline = function(questTimeLine){
          console.log(questTimeLine);
          $http.put('/api/quests/' + questTimeLine._id, questTimeLine)
            .success(function(quest){
              console.log(quest);
            }).error(function(err){
              console.log(err);
            });
        };

        $scope.deleteQeustTimeline = function(questTimeLine){
          var options = $window.confirm('delete?');

          if(options === true){
            $http.delete('/api/quests/' + questTimeLine._id)
              .success(function(){
                alert('success');
                $window.location.reload();
              }).error(function(err){
                console.log(err);
              });
          }

        };

        $scope.modifyTimeline = function(questTimeline){
          var splitTagList = questTimeline.editTags.split('#');
          if(splitTagList.length <= 1){
            alert("Not found '#'");
            return;
          }

          splitTagList.shift();
          questTimeline.questPool.tags = splitTagList;

          console.log(questTimeline);
          $http.put('/api/quests/' + questTimeline._id, questTimeline)
            .success(function(){
              $window.location.reload();
            }).error(function(err){
              console.log(err);
            });
        };

      },
      templateUrl: 'app/questTimeline/questTimeline.html'
    };
  });
