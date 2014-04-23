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
			controller:'ofertaController',
		})
		.when('/sobre',{
			templateUrl:'sobre.html',
			controller:'prodController',
		})
		.when('/donde',{
			templateUrl:'donde.html',
			controller:'prodController',
		})
		.when('/admin',{
			templateUrl:'admin.html',
			controller:'adminController',
		})
		.otherwise({
			redirectTo:'/',
		});
});

app.controller('Controller',function($scope){
	console.log("home");
});

app.controller('adminController',function($scope,$http){
	$http({method:'GET',url:'/oferta'})
	.success(function(data,status,headers,config){
		$scope.oferta = data[0];
	})
	.error(function(data,status,headers,config){
		console.log(status);
	});

	$http({method:'GET',url:'/productos'})
	.success(function(data,status,headers,config){
		$scope.productos = data;
	})
	.error(function(data,status,headers,config){
		console.log(status);
	});
});

app.controller('ofertaController',function($scope,$http){
	$http({method:'GET',url:'/oferta'}).
		success(function(data,status,headers,config){
			console.log(data);
			$scope.oferta = data[0];
		}).
		error(function(data,status,headers,config){
			console.log(status);
		});
});
app.controller('prodController',function($scope,$http){
	$http({method:'GET',url:'/productos'}).
		success(function(data,status,headers,config){
			$scope.separar(data);
		}).
		error(function(data,status,headers,config){
			console.log(status);
	});
	$http({method:'GET',url:'/menus'}).
		success(function(data,status,headers,config){
			$scope.separarmenus(data);
		}).
		error(function(data,status,headers,config){
			console.log(status);
	});

	$scope.separar = function(data){
		_.each(data,function(x){
			if(_.isUndefined($scope[x.clase])){
				$scope[x.clase]=[];
			}
			$scope[x.clase].push(x);
		});
		console.log($scope['mini-bocadillo']);
	}

	$scope.separarmenus = function(data){
		_.each(data,function(x){
			$scope[x.dia] = x;
		});
		console.log($scope.domingo);
	}
});

app.run(function($rootScope) {
	$rootScope.$on('$viewContentLoaded', function () {
		$(document).foundation();
	});
});

$(document).ready(function(){
	$(document).foundation({
		orbit: {
			animation: 'slide',
			timer_speed: 1000,
			pause_on_hover: true,
			animation_speed: 500,
			navigation_arrows: false,
			bullets: false
		}
	});
});