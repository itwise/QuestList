'use strict';

angular.module('questApp')
  .directive('questTimeline', function () {
    return {
      scope: {
        questTimelines: '='
      },
      replace: true,
      restrict: 'E',
      controller: function($scope, $window, Auth, Quest, Comment, Notifier, $http){
        $scope.currentUser = Auth.getCurrentUser();

        $scope.deleteComment = function(comment){

          Notifier.confirm('delete?', function(){
            Comment.deleteComment({ _id : comment._id}, comment, function(data){
              $window.location.reload();
            });
          });
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
            Notifier.message('내용이 없습니다.');
            return;
          }

          questTimeline.user = $scope.currentUser;

          Comment.createComment(questTimeline, function(comment){
            questTimeline.comments.push(comment);
            questTimeline.addTargetComment = {}
          });

        };

        /**
         * Delete Timeline
         * @param questTimeLine
         */
        $scope.deleteQeustTimeline = function(questTimeLine){
            Notifier.confirm('해당 Quest를 삭제 하시겠습니까?', function(){
              Quest.deleteQuest({ _id : questTimeLine._id}, questTimeLine, function(err){
                Notifier.message('삭제되었습니다.', function(){
                  $window.location.reload();
                });
              });
            });
        };

        /**
         * Timeline 수정
         * @param questTimeline
         */

        $scope.modifyTimeline = function(questTimeline){

          Notifier.confirm('해당 내용으로 저장 하시겠습니까?', function(){
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
              Notifier.message('수정완료 하였습니다.', function(){
                $window.location.reload();
              });
            });

          });
        };

        /**
         * 좋아요 클릭 이벤트
         */
        $scope.likeEvent = function(questTimeline){
          Quest.likeQuest({questId : questTimeline._id}, function(data){
            if(data.retCode === "fail"){
              Notifier.message(data.msg, function(){

              });
            }else{
              console.log('asdfsadf');
            }
          });
        }

        /**
         * 퀘스트 상태변경
         * @param questTimeline
         */
        $scope.changeStatus = function(questTimeline){
          questTimeline.status = 'END';
          questTimeline.completeDate = new Date();

          Notifier.confirm('해당 Quest를 완료 하시겠습니까?', function(){
            Quest.updateQuest({ _id : questTimeline._id}, questTimeline, function(quest){
              Notifier.message(quest.questPool.title + '완료하였습니다.');
            });
          });

        };

      },
      templateUrl: 'app/questTimeline/questTimeline.html'
    };
  });
