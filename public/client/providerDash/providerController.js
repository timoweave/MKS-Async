angular.module('async.providerController', ['ui.bootstrap'])

.controller('ProviderController', ['$scope', '$uibModal', 'Ads', 'SignInState', function($scope, $uibModal, Ads, SignInState){
   $scope.openForm = function() {
      $uibModal.open({
        templateUrl: 'client/postForm/postForm.html',
        controller: 'FormController'
      });
    };

    $scope.ads={};

    $scope.status = {
      authData: null
    };

    $scope.saveAuthStatus = function(){
      $scope.status.authData = SignInState.authData;
      console.log('SignInState.authData: ', SignInState.authData);
      console.log('$scope.status.authData: ', $scope.status.authData);
    };

    $scope.getAds = function(){
      Ads.getAds()
        .then(function(data) {
          console.log(JSON.stringify(data));
          $scope.ads = data;
        })
        .catch(function(err) {
          console.error(err);
        });
    };
}]);
