angular.module('async', ['async.mainController', 'async.formController', 'ngRoute', 'ui.bootstrap','uiGmapgoogle-maps', 'google.places'])

.config(['$routeProvider','uiGmapGoogleMapApiProvider', function($routeProvider, uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyAce5w_fapMtVvsiBl-uxQRNZ6bpVXOD1c',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
   });
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
