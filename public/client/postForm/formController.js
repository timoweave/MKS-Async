angular.module('async.formController', [])

.controller('FormController', ['$scope', '$http', 'Modal', '$window', 'uiGmapGoogleMapApi', 'flowFactory', 'Upload',
  function($scope, $http, Modal, $window, uiGmapGoogleMapApi, flowFactory, Upload) {

    // $scope.obj = {};

    // $scope.print=function(){
    //   console.log('testing:', JSON.stringify($scope.obj.flow));
    // }


    // $scope.uploadFile = function(){
    //   var file = $scope.myFile;
    //   var uploadUrl = '/upload';
    //   Modal.uploadFile(file, uploadUrl);
    // }

    $scope.getMap = function(lat, lng) {
      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = {
          center: {
            latitude: lat, //Default location is San Francisco
            longitude: lng
          },
          zoom: 13,
          markers: [{
            id: Date.now(),
            coords: {
              latitude: lat,
              longitude: lng
            }
          }]
        };
        $scope.options = {
          scrollwheel: false
        };
      });
    };

    $scope.$watch('place', function() {
      if (($scope.place) && ($scope.place.geometry) && ($scope.place.geometry.location)) {
        console.log(JSON.stringify($scope.place.geometry));
        $scope.getMap($scope.place.geometry.location.lat(), $scope.place.geometry.location.lng());
      }
    });

    $scope.render = true;
    $scope.place = null;

    $scope.submit = function() {
      if(!Modal.checkUrl(this.imgUrl)){
        this.imgUrl = "http://i.imgur.com/XehxIGv.jpg";
      };
      $scope.input = {
        title: this.title,
        imgUrl: this.imgUrl,
        image : this.image,
        name: this.name,
        school: this.school,
        major: this.major,
        price: this.price,
        latitude: $scope.map.center.latitude,
        longitude: $scope.map.center.longitude,
        address: $scope.place.formatted_address,
        description: this.description,
        // file: $scope.file
      };

      Modal.createAd($scope.input)
        .success(function() {
          console.log('POST request data:', JSON.stringify($scope.input));
          $window.location.reload();
        })
        .error(function(err) {
          console.log('Error: ', err);
        });
    };

    $scope.cancel = function() {
      console.log(JSON.stringify($scope.$parent));
      $scope.$parent.$dismiss();
    };

  }
])
.directive('fileModel', ['$parse', function ($parse) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
 
              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
           }
        };
     }]);
