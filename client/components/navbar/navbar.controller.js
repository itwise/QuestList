'use strict';

angular.module('questApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'My Quest',
      'link': '/profile/me'
    },{
      'title': 'Quest Time Line',
      'link': '/quest/me'
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
