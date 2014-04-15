var app = angular.module('app',['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/',{
			templateUrl: 'index.html',
			controller: 'Controller',
		})
		.when('/productos',{
			templateUrl:'productos.html',
			controller:'prodController',
		})
		.when('/oferta',{
			templateUrl:'oferta.html',
			controller:'prodController',
		})
		.when('/sobre',{
			templateUrl:'sobre.html',
			controller:'prodController',
		})
		.when('/donde',{
			templateUrl:'donde.html',
			controller:'prodController',
		})
		.otherwise({
			redirectTo:'/',
		});
});

app.controller('Controller',function($scope){
	console.log("home");
});

app.controller('prodController',function($scope,$http){
	console.log("productos");
	$http({method:'GET',url:'/productos'}).
		success(function(data,status,headers,config){
			console.log(data);
			$scope.productos = data;
		}).
		error(function(data,status,headers,config){
			console.log(status);
		});
});

$(document).ready(function(){
	$('.blur').blurjs({
		overlay: 'rgba(255,255,255,0.1)',
		radius:10
	});	
});