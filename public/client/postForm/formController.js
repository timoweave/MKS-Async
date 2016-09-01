angular.module('async.formController', [])

.controller('FormController', ['$scope', '$http', 'Modal', '$window', function($scope, $http, Modal, $window) {

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
