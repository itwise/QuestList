'use strict';

angular.module('questApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile/:userId',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl'
      });
  });
