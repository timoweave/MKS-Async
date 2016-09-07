angular.module('async', ['async.mainController', 'async.formController', 'async.loginController', 'async.providerController', 'ngRoute', 'ui.bootstrap','uiGmapgoogle-maps', 'google.places', 'firebase'])

.config(['$routeProvider','uiGmapGoogleMapApiProvider','flowFactoryProvider', function($routeProvider, uiGmapGoogleMapApiProvider,flowFactoryProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyAce5w_fapMtVvsiBl-uxQRNZ6bpVXOD1c',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
   });
}])

.factory('Modal', ['$http', 'Upload', function($http, Upload){

  var createAd = function(input){
    return $http({
      method: 'POST',
      url: '/api/posts',
      data: input
    });
  };

  var checkUrl = function(url){
    if(url === undefined){
      return false;
    }else{
      return(url.match(/\.(jpeg|jpg|gif|png)$/) !== null);
    }
  };

  return{
    createAd: createAd,
    checkUrl: checkUrl
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
}])

.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
])

.factory("SignInState", function(){
  var status = {
    authData: null
  };

  return {
    status: status
  };
});
