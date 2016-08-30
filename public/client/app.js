angular.module('async', ['async.mainController', 'async.formController', 'ngRoute', 'ui.bootstrap'])


.config(function($routeProvider) {
  // $routeProvider

  // .when('/providerList', {
  //  templateUrl: '/providerList.html',
  //  controller: 'mainController'
  // })

  // .otherwise({
  //  redirectTo: '/providerList'
  // })
})

.factory('Modal', function($http){

})

