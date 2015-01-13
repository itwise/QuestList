'use strict';

angular.module('questApp')
  .controller('MainCtrl', function ($scope, Auth) {

    $scope.questTimelines = [
      {
        timelineId: 0,
        userName: 'SoYeon Park',
        quest: {
          name: '문서정리',
          status: '완료',
          tags:[
            '노트북', '업무'
          ]
        },
        startDate: new Date(),
        memo: 'wiki에 express 정리',
        addTargetComment: {},
        comments: [
          {
            userName: 'TaeHee Kim',
            content: '오오',
            commentDate: new Date() - (1000 * 60 * 60)
          }
        ]
      },
      {
        timelineId: 0,
        userName: 'DongJun Kim',
        quest: {
          name: '해킨토시 설치',
          status: '시작',
          tags:[
            '노트북', '업무'
          ]
        },
        startDate: new Date(),
        memo: '인민에어....',
        addTargetComment: {},
        comments: [
          {
            userName: 'TaeHee Kim',
            content: '이거 어떄요?',
            commentDate: new Date() - (1000 * 60 * 60)
          },
          {
            userName: 'DongJun Kim',
            content: '쓸만하네요 ㅋㅋㅋㅋ',
            commentDate: new Date() - (1000 * 60 * 48)
          }
        ]
      }
    ];

    $scope.currentUser = Auth.getCurrentUser();

    $scope.nowProgressQuests = [

    ];

    $scope.processibleQuests = [

    ];

    $scope.addComment = function(questTimeline){
      var comment = {
        userName: 'TaeHee Kim',
        commentDate: new Date(),
        content: questTimeline.addTargetComment.content
      };

      questTimeline.comments.push(comment);
      questTimeline.addTargetComment = {};
    };
    $scope.getConnectingWord = function(word){
      var code = word.charCodeAt(word.length-1) - 44032;

      // 원본 문구가 없을때는 빈 문자열 반환
      if (word.length == 0) return '';

      // 한글이 아닐때
      if (code < 0 || code > 11171) {
        return '';
      }


      if (code % 28 == 0) {
        return '를';
      }else {
        return '을'
      }
    };

  });
