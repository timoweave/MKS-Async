angular.module('async.formController', [])

.controller('FormController', ['$scope', '$http', 'Modal', '$window', 'uiGmapGoogleMapApi',
  function($scope, $http, Modal, $window, uiGmapGoogleMapApi) {

    $scope.getMap = function(lat, lng) {
      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = {
          center: {
            latitude: lat, //Default location is San Francisco
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
          scrollwheel: true
        };
      });
    };

    $scope.$watch('place', function() {
      if ($scope.place.geometry.location) {
        console.log($scope.place.geometry);
        $scope.getMap($scope.place.geometry.location.lat(), $scope.place.geometry.location.lng());
      }
    });

    $scope.render = true;
    $scope.place = null;

    $scope.submit = function() {

      $scope.input = {
        title: this.title,
        name: this.name,
        school: this.school,
        major: this.major,
        price: this.price,
        latitude: $scope.map.center.latitude,
        longitude: $scope.map.center.longitude,
        address: $scope.place.formatted_address,
        description: this.description
      };

      Modal.createAd($scope.input)
        .success(function() {
          console.log('POST request data:', $scope.input);
          $window.location.reload();
        })
        .error(function(err) {
          console.log('Error: ', err);
        });
    };

    $scope.cancel = function() {
      console.log($scope.$parent);
      $scope.$parent.$dismiss();
    };

  }
]);
