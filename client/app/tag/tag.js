'use strict';

angular.module('questApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tag', {
        url: '/tag/:tag',
        templateUrl: 'app/tag/tag.html',
        controller: 'TagCtrl'
      });
  });
