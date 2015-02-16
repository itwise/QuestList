'use strict';

angular.module('questApp')
  .directive('questTimeline', function () {
    return {
      scope: {
        questTimelines: '='
      },
      replace: true,
      restrict: 'E',
      controller: function($scope, $window, Auth, Quest, Comment){
        $scope.currentUser = Auth.getCurrentUser();

        $scope.deleteComment = function(comment){
          var options = $window.confirm('delete?');

          if (options === true) {
            Comment.deleteComment({ _id : comment._id}, comment, function(data){
              console.log(data);
              $window.location.reload();
            });
          } else {
            console.log('cancel')
          }
        };

        $scope.getPrintEditData = function(questTimeline){
          questTimeline.edit = 'edit';


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
          //Update
         Comment.updateComment({ _id : comment._id}, comment, function(data){
           $window.location.reload();
         });
        };


        $scope.addComment = function(questTimeline){
          if(questTimeline.addTargetComment === undefined){
            alert('내용이 없습니다.');
            return;
          }

          Comment.createComment(questTimeline, function(comment){
            questTimeline.comments.push(comment);
            questTimeline.addTargetComment = {}
          })

        };

        $scope.deleteQeustTimeline = function(questTimeLine){
          var options = $window.confirm('delete?');

          if(options === true){
            Quest.deleteQuest({ _id : questTimeLine._id}, questTimeLine, function(err){
              $window.location.reload();
            })
          }

        };

        $scope.modifyTimeline = function(questTimeline){
          var splitTagList;

          if(questTimeline.editTags !== undefined && questTimeline.editTags !== "" ){
            splitTagList = questTimeline.editTags.split('#');

            console.log(splitTagList);
            if(splitTagList.length <= 1) {
              alert("Not found '#'");
              return;
            }
            splitTagList.shift();

            questTimeline.questPool.tags = splitTagList;
          }else{
            questTimeline.questPool.tags = [];
          }

          Quest.updateQuest({ _id : questTimeline._id}, questTimeline, function(quest){
            $window.location.reload();
          });
        };

        $scope.changeStatus = function(questTimeline){
          questTimeline.status = 'END';
          questTimeline.completeDate = new Date();

          Quest.updateQuest({ _id : questTimeline._id}, questTimeline, function(quest){
            $window.location.reload();
          });
        };

      },
      templateUrl: 'app/questTimeline/questTimeline.html'
    };
  });
