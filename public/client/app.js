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

.factory('Modal', ['$http', function($http){

  var createAd = function(input){
    return $http({
      method: 'POST',
      url: '/api/posts',
      data: input
    });
  };

  return{
    createAd: createAd
  };

}])

.factory('Ads', ['$http', function($http) {

  var getAds = function() {
    return $http({
        method: 'GET',
        url: 'api/posts',
      })
      .then(function(resp) {
        return resp.data;
      });
  };

  var adModalData = null;

  return {
    getAds: getAds,
    adModalData: adModalData
  };
}]);

