angular.module('async', ['async.mainController', 'async.formController', 'async.loginController',
  'async.providerController', 'ngRoute', 'ui.bootstrap', 'uiGmapgoogle-maps', 'google.places', 'firebase'
])
  .run(["$rootScope", "$location",
    function($rootScope, $location) {
      $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
          $location.path("/");
        }
      });
    }
  ])
  .config(['uiGmapGoogleMapApiProvider', '$routeProvider',
    function(uiGmapGoogleMapApiProvider,
      $routeProvider) {
      uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAce5w_fapMtVvsiBl-uxQRNZ6bpVXOD1c',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
      });

      $routeProvider
        .when('/providerDash', {
          templateUrl: 'client/providerDash/providerDash.html',
          controller: 'ProviderController',
          resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth",
              function(Auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireSignIn();
              }
            ]
          }
        })
        .when('/', {
          templateUrl: 'home.html',
          controller: 'MainController',
          resolve: {
            // controller will not be loaded until $waitForSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth",
              function(Auth) {
                // $waitForSignIn returns a promise so the resolve waits for it to complete
                return Auth.$waitForSignIn();
              }
            ]
          }
        })
        .otherwise({
          redirectTo: '/'
        });

    }
  ])

.factory('Modal', ['$http',
  function($http) {
    var createAd = function(input) {
      return $http({
        method: 'POST',
        url: '/api/posts',
        data: input
      });
    };

    var userData = function(input){
      return $http({
        method: 'POST',
        url:'/api/users',
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
      checkUrl: checkUrl,
      userData: userData
    };
}])


.factory('Ads', ['$http',
  function($http) {

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
  }
])

.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
])

.service("SignInState", function() {
  this.authData = null;
  // var status = {
  //   authData: null
  // };

  // return status;

  // {
  //   status: status
  // };
});
