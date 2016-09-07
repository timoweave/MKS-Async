angular.module('async.providerController', ['ui.bootstrap'])

.controller('ProviderController', ['$scope', '$uibModal', 'Ads', function($scope, $uibModal, Ads){
   $scope.openForm = function() {
      $uibModal.open({
        templateUrl: 'client/postForm/postForm.html',
        controller: 'FormController'
      });
    };

    $scope.ads={};

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
