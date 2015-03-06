'use strict';

angular.module('questApp')
  .controller('FriendCtrl', function ($scope, Auth, $http, Notifier, $window) {
    $scope.message = 'Hello';

    $scope.currentUser = Auth.getCurrentUser();
    console.log($scope.currentUser);

    $scope.search = "";
    $scope.findUserList = [];
    $scope.isSearch = false;


    $scope.deleteFriend = function(friend){
      Notifier.confirm('[' + friend.name + '] 삭제 하시겠습니까? ', function(){
        var users = $scope.currentUser.friends;
        var data = [];

        users.forEach(function(friends){
          if(friends._id === friend._id){
            console.log(friend._id);
          }else{
            data.push(friends);
          }
        });

        $http.put('/api/users/' + $scope.currentUser._id, data ).success(function(user){
          Notifier.message('삭제되었습니다.', function(){
            $window.location.reload();
          });

        });
      });

    };

    $scope.addFriend = function(findUser){
      Notifier.confirm('친구추가 하시겠습니까?', function(){
        var friendList = $scope.currentUser.friends;

        friendList.push(findUser);

        $http.put('/api/users/' + $scope.currentUser._id, friendList ).success(function(user){
          Notifier.message('친구추가 완료.', function(){
            $window.location.reload();
          });
        });
      });

    };

    $scope.searchUser = function(){
      if($scope.search === "" || $scope.search === null){
        Notifier.message("검색어를 입력해주세요.");
        return;
      }

      $scope.isSearch = true;
      var friends =  $scope.currentUser.friends;

      $http.get('/api/users/find/' + $scope.search).success(function(userList){

        if(userList.length > 0 ){
          for(var i = 0; i < friends.length; i++){
            for(var j = 0; j < userList.length; j++){
              if(friends[i]._id === userList[j]._id){
                console.log("is friend");
                userList[j].isFriend = true;
              }
            }
          }
        }
        $scope.findUserList = userList;
      }).error(function(err){
        console.log(err);
      });
    };

  });
