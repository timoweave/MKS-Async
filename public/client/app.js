angular.module('async', ['async.mainController', 'async.formController', 'async.loginController', 'ngRoute', 'ui.bootstrap','uiGmapgoogle-maps', 'google.places','flow', 'ngFileUpload'])

.config(['$routeProvider','uiGmapGoogleMapApiProvider','flowFactoryProvider', function($routeProvider, uiGmapGoogleMapApiProvider,flowFactoryProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyAce5w_fapMtVvsiBl-uxQRNZ6bpVXOD1c',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
   });

  flowFactoryProvider.defaults = {
    target: 'api/posts',
    permanentErrors: [404, 500, 501],
    maxChunkRetries: 1,
    chunkRetryInterval: 5000,
    simultaneousUploads: 4,
    singleFile: true
  };
}])

.factory('Modal', ['$http', 'Upload', function($http, Upload){

  var createAd = function(input){
    // return Upload.upload({
    //   url: 'upload',
    //   data: input
    // }).then(function(resp) {
    //   console.log('i think we did some shit lol', resp);
    //   return resp;
    // }, function(err) {
    //     console.log('error lol', err);
    // });
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
      return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }
  };
  // var uploadFile = function(data, uploadUrl){
  //   var fd = new FormData();
  //   fd.append('file', data);
  //   $http.post(uploadUrl, fd, {
  //     transformRequest: angular.identity,
  //     headers: {'Content-Type': undefined}
  //   });
  // };

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
    var ref = new Firebase("https://docs-sandbox.firebaseio.com");
    return $firebaseAuth(ref);
  }
]);
