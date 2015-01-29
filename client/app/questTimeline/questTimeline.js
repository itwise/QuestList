'use strict';

angular.module('questApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('questTimeline', {
        url: '/quest/:userId',
        templateUrl: 'app/questTimeline/questTimeline.html',
        controller: 'QuesttimelineCtrl'
      });
  });
