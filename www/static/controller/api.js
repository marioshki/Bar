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
	$http({method:'GET',url:'/productos'}).
		success(function(data,status,headers,config){
			$scope.separar(data);
		}).
		error(function(data,status,headers,config){
			console.log(status);
		});

	$scope.separar = function(data){
		console.log(data);
		$scope.bebidas = _.filter(data, function(objeto){
			return objeto.tipo == 'bebida';
		});
		$scope.tapas = _.filter(data,function(objeto){
			return objeto.tipo == 'tapa';
		});
		$scope.menus = _.filter(data,function(objeto){
			return objeto.tipo == 'menu';
		});
	}
});

app.run(function($rootScope) {
	$rootScope.$on('$viewContentLoaded', function () {
		$(document).foundation();
	});
});

$(document).ready(function(){
	$('.blur').blurjs({
		draggable: true,
		overlay: 'rgba(255,255,255,0.1)',
		radius:10
	});

	$(document).foundation();
});