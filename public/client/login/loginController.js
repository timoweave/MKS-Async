angular.module('async.loginController', ['firebase'])

.controller("loginController", ["$scope", "Auth", "SignInState",
  function($scope, Auth, SignInState) {

    $scope.createUser = function() {
      $scope.message = null;
      $scope.error = null;

      $scope.auth = Auth;

      $scope.auth.$createUserWithEmailAndPassword($scope.email, $scope.password)
        .then(function(userData) {
        $scope.message = "User created with uid: " + userData.uid;
      }).catch(function(error) {
        $scope.error = error;
      });
    };

    $scope.loginUser = function(){
      $scope.message = null;
      $scope.error = null;

      $scope.auth = Auth;

      $scope.auth.$signInWithEmailAndPassword($scope.email, $scope.password)
        .then(function(authData) {
        $scope.authData = authData;
        $scope.message = "User logged in with uid: " + authData.uid;
      }).catch(function(error) {
        $scope.error = error;
      });

      console.log($scope.email);
    };

    // Auth.onAuth(function(authData){
    //   SignInState.authData = authData;
    //   console.log("authData: ", authData);
    //   console.log("SignInState.authData: ", SignInState.authData);
    // });

    $scope.removeUser = function() {
      $scope.message = null;
      $scope.error = null;

      Auth.$removeUser({
        email: $scope.email,
        password: $scope.password
      }).then(function() {
        $scope.message = "User removed";
      }).catch(function(error) {
        $scope.error = error;
      });
    };
  }
]);
