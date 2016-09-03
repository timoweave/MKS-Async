angular.module('async.providerController', ['ui.bootstrap'])

.controller('ProviderController', ['$scope', '$uibModal', function($scope, $uibModal){
   $scope.openForm = function() {
      $uibModal.open({
        templateUrl: 'client/postForm/postForm.html',
        controller: 'FormController'
      });
    };
}]);
