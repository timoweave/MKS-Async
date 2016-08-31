angular.module('async', ['async.mainController', 'async.formController', 'ngRoute', 'ui.bootstrap'])


.config(['$routeProvider', function($routeProvider) {
  // $routeProvider

  // .when('/providerList', {
  //  templateUrl: '/providerList.html',
  //  controller: 'mainController'
  // })

  // .otherwise({
  //  redirectTo: '/providerList'
  // })

}])

.factory('Modal', function($http){

  var createAd = function(input){
    return $http({
      method: 'POST',
      url: '/api/posts',
      data: input
    });
  };

  return{
    createAd: createAd
  }

})


