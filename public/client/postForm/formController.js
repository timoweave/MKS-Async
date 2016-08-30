angular.module('async.formController', [])

.controller('FormController', function($scope, $http) {

  $scope.submit = function() {
    //submit info.
    alert(this.name);
  };

  $scope.cancel = function() {
    $scope.$parent.$dismiss();
  };

});
