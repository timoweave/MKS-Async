angular.module('async.mainController', ['ui.bootstrap'])

.controller('MainController', ['$scope', '$uibModal', function($scope, $uibModal) {

  $scope.openForm = function() {
    $uibModal.open({
      templateUrl: 'client/postForm/postForm.html',
      controller: 'FormController'
    });
  };
}])

.controller('AdsController', ['$scope', '$uibModal', 'Ads', function($scope, $uibModal, Ads) {
  $scope.title = "Hello World";
  $scope.ads = {};

  $scope.getAds = function() {
    Ads.getAds()
      .then(function(data) {
        $scope.ads = data;
      })
      .catch(function(err) {
        console.eror(err);
      });
  };
}])

.directive('providerAds', function() {
  return {
    scope: {
      item: '=providerAds'
    },
    restrict: 'EA',
    templateUrl: 'client/adsList/adsList.html'
  };
});

