angular.module('async.mainController', ['ui.bootstrap'])

.controller('MainController', ['$scope', '$uibModal',
  function($scope, $uibModal) {

    $scope.openForm = function() {
      $uibModal.open({
        templateUrl: 'client/postForm/postForm.html',
        controller: 'FormController'
      });
    };
  }
])

.controller('AdsController', ['$scope', '$uibModal', 'Ads',
  function($scope, $uibModal, Ads) {
    $scope.ads = {};
    $scope.adModalData = Ads.adModalData;

    $scope.$watch('Ads.adModalData', function(){
      $scope.adModalData = Ads.adModalData;
    });

    $scope.getInfo = function(item) {
      Ads.adModalData = item;
        $uibModal.open({
          templateUrl: 'client/adsList/adModal.html',
          controller: 'AdsController'
        });
    };

    $scope.getAds = function() {
      Ads.getAds()
        .then(function(data) {
          $scope.ads = data;
        })
        .catch(function(err) {
          console.error(err);
        });
    };
  }
])

.directive('providerAds', function() {
  return {
    scope: {
      item: '='
    },
    controller: 'AdsController',
    restrict: 'EA',
    templateUrl: 'client/adsList/adsList.html'
  };
});
