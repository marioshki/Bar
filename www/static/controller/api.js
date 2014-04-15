var app = angular.module('app',['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
		.when('/',{
			templateUrl: 'index.html',
			controller: 'Controlador',
		})
		.otherwise({
			redirectTo:'/'
		})

});

app.controller('Controlador',function($scope){

console.log("HEY NIGGAH");
});