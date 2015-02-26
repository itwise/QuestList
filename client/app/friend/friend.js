'use strict';

angular.module('questApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('friend', {
        url: '/friend',
        templateUrl: 'app/friend/friend.html',
        controller: 'FriendCtrl'
      });
  });
