'use strict';

angular.module('todoListApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile/:userId',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl'
      });
  });
