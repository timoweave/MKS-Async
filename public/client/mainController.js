angular.module('async.mainController', ['ui.bootstrap'])

.controller('MainController', ['$scope', '$uibModal', '$filter', 'Ads', 'uiGmapGoogleMapApi',
  function($scope, $uibModal, $filter, Ads, uiGmapGoogleMapApi) {

    $scope.render = true;
    $scope.getMap = function(lat, lng) {
      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = {
          center: {
            latitude: lat,
            longitude: lng
          },
          zoom: 13,
          markers: [{
            id: Date.now(),
            coords: {
              latitude: lat,
              longitude: lng
            }
          }]
        };
        $scope.options = {
          scrollwheel: false
        };
      });
    };

    $scope.$watch('adModalData.latitude', function() {
      if (($scope.adModalData) && ($scope.adModalData.latitude) && ($scope.adModalData.longitude)) {
        $scope.getMap($scope.adModalData.latitude, $scope.adModalData.longitude);
      }
    });
    $scope.openForm = function() {
      $uibModal.open({
        templateUrl: 'client/postForm/postForm.html',
        controller: 'FormController'
      });
    };

    $scope.openLogin = function() {
      $uibModal.open({
        templateUrl: 'client/login/loginModal.html',
        controller: 'loginController'
      });
    };

    $scope.ads = {};
    $scope.pageSize = 12;
    $scope.currentPage = 1;

    $scope.$watch('Ads.adModalData', function(){
      $scope.adModalData = Ads.adModalData;
    });

    $scope.getInfo = function(item) {
      Ads.adModalData = item;
      $uibModal.open({
        templateUrl: 'client/adsList/adModal.html',
        controller: 'MainController'
      });
    };

    $scope.cancel = function() {
      console.log(JSON.stringify($scope.$parent));
      $scope.$dismiss();
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

    $scope.$watch('ads', function() {
      $scope.filteredSearch = $scope.ads;
    });

    $scope.searchModel = {};
    $scope.search = function() {
      $scope.filteredSearch = $filter('filter')($scope.ads, {
        'school': $scope.searchModel.school,
        'major': $scope.searchModel.major
      });
    };
  }
])
.filter('startFrom', function(){
  return function(data,start){
    var sliced = data.slice(start);
    return sliced;
  };
})
.directive('topCarousel', function(){
  return{
    controller: 'MainController',
    restrict: 'EA',
    templateUrl: 'client/carousel/carousel.html'
  };
})

.directive('providerAds', function() {
  return {
    scope: {
      item: '='
    },
    controller: 'MainController',
    restrict: 'EA',
    templateUrl: 'client/adsList/adsList.html'
  };
});
