angular.module('async', ['async.mainController','async.formController', 'ngRoute', 'ui.bootstrap'])


.config(function($routeProvider){
	$routeProvider
	.when('/postForm',{
		templateUrl: "client/postForm/postForm.html",
		controller: 'FormController'
	})
	// .when('/providerList', {
	// 	templateUrl: '/providerList.html',
	// 	controller: 'mainController'
	// })

	// .otherwise({
	// 	redirectTo: '/providerList'
	// })
});

