angular.module('async.formController', [])

.controller('FormController', function($scope, $http){

	$scope.submit = function(){
		//submit info.
	}

	$scope.cancel = function(){
		$scope.$parent.$dismiss();
	}

});