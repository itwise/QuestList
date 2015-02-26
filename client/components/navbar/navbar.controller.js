'use strict';

angular.module('questApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'My ',
      'link': '/profile/me'
    },{
      'title': 'Friend',
      'link': '/friend'
    }];
    $scope.currentUser = Auth.getCurrentUser();

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
