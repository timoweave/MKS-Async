angular.module('async.mainController', ['ui.bootstrap'])

.controller('MainController', function($scope, $uibModal){

	$scope.print = function(){
		console.log('test');
	};

	$scope.openForm = function(){
		$uibModal.open({
			templateUrl: 'client/postForm/postForm.html',
			controller: 'FormController'
		})
	}

	
});


