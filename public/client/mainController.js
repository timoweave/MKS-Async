angular.module('async.mainController', ['ui.bootstrap'])
  .controller('MainController', ['$scope', '$uibModal', '$filter', 'Ads', 'uiGmapGoogleMapApi', 'SignInState', 'Auth',
    function($scope, $uibModal, $filter, Ads, uiGmapGoogleMapApi, SignInState, Auth) {
      // Google Map Implementation
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
      // Open "Add a Listing" form/modal
      $scope.openForm = function() {
        $uibModal.open({
          templateUrl: 'client/postForm/postForm.html',
          controller: 'FormController'
        });
      };
      // Open "Log In" form/modal
      $scope.openLogin = function() {
        $uibModal.open({
          templateUrl: 'client/login/loginModal.html',
          controller: 'loginController'
        });
      };
      // Data storage
      $scope.ads = {};
      // Load single ad's information into modal
      $scope.getInfo = function(item) {
        Ads.adModalData = item;
        $uibModal.open({
          templateUrl: 'client/adsList/adModal.html',
          controller: 'MainController'
        });
      };
      $scope.$watch('Ads.adModalData', function() {
        $scope.adModalData = Ads.adModalData;
      });
      // Load all ads from db onto page
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
      // Dismiss modal by pressing Cancel
      $scope.cancel = function() {
        $scope.$dismiss();
      };
      // Pagination
      $scope.pageSize = 12;
      $scope.currentPage = 1;
      // Making the "Search" button work
      $scope.searchModel = {};
      $scope.search = function() {
        $scope.filteredSearch = $filter('filter')($scope.ads, {
          'school': $scope.searchModel.school,
          'major': $scope.searchModel.major
        });
      };
      // Check if user is logged in
      $scope.isUserLoggedIn = function() {
        if (SignInState.authData) {
          return true;
        } else {
          return false;
        }
      };
      // Logout
      $scope.logout = function() {
        $scope.auth = Auth;

        $scope.auth.$signOut();
      };

      Auth.$onAuthStateChanged(function(authData) {
        SignInState.authData = authData;
        console.log("authData: ", authData);
        console.log("SignInState.authData: ", SignInState.authData);
      });
    }
  ])

.filter('filterSearchModel', function(){
  return function(items, $scope, search) {
    $scope.filteredSearch = items.filter(filter_search);
    return $scope.filteredSearch;
    
    function filter_search(element, index, array) {
      var searchKeys = Object.keys(search);
      var match = searchKeys.reduce(matchKeys, true);
      return match;
      
      function matchKeys(result, key, index, container) {
        if (!result) { return false; }
          result = element[key].toLowerCase().match(search[key].toLowerCase());
        return result;
      }
    }
  };
})

.filter('startFrom', function(){
  return function(data,start){

    if (!Array.isArray(data)) {
      return undefined;
    }
    var sliced = data.slice(start);
    return sliced;
  };
})

// For Carousel
.directive('topCarousel', function() {
  return {
    controller: 'MainController',
    restrict: 'EA',
    templateUrl: 'client/carousel/carousel.html'
  };
})

// Directive for loading each provider Ad information
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
