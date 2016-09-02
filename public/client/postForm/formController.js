angular.module('async.formController', [])

.controller('FormController', ['$scope', '$http', 'Modal', '$window', 'uiGmapGoogleMapApi', function($scope, $http, Modal, $window, uiGmapGoogleMapApi) {

  var areaLat      = 37.7749,
    areaLng      = -122.4194,
    areaZoom     = 12;

  uiGmapGoogleMapApi.then(function(maps) {
    $scope.map  = { center: { latitude: areaLat, longitude: areaLng }, zoom: areaZoom };
    $scope.options = { scrollwheel: false };
  });



  $scope.submit = function() {

    $scope.input = {
      title: this.title,
      name: this.name,
      school: this.school,
      major: this.major,
      price: this.price,
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

}]);
