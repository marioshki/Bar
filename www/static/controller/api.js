var app = angular.module('app',['ngRoute']);

var pushNotification;

app.service('SocketService', function($rootScope) {
	var socket = io.connect(window.location.origin);

	socket.on('actualizacion de producto', function (data) {
		navigator.notification.alert("Se ha actualizado un producto: " + data.nombre, null, "Producto Actualizado")
		$rootScope.$emit("actualizarproducto",data);
	});

	socket.on('actualizacion de oferta', function (data) {
		$rootScope.$emit("actualizaroferta",data);
	});

	socket.on('eliminacion de producto', function (data) {
		$rootScope.$emit("eliminarproducto",data);
	});
});

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
});

app.controller('adminController',function($scope,$http,$route,$rootScope){

	$scope.nuevoproducto = {nombre:"",clase:"",precio:""}
	$http({method:'GET',url:'/oferta'})
	.success(function(data,status,headers,config){
		$scope.oferta = data[0];
	})
	.error(function(data,status,headers,config){
	});

	$http({method:'GET',url:'/productos'})
	.success(function(data,status,headers,config){
		$scope.productos = data;
	})
	.error(function(data,status,headers,config){
	});

	$scope.guardarProducto = function(producto){
		$http({method:'POST',url:'/insertarproducto',data:{producto:producto}})
	}
	$scope.guardarOferta = function(oferta){
		$http({method:'POST',url:'/insertaroferta',data:{oferta:oferta}})
	}
	$scope.eliminarProducto = function(producto){
		$http({method:'POST',url:'/eliminarproducto',data:{producto:producto}})
	}

	$scope.clases = 
	[
		'vino',
		'cerveza',
		'licor',
		'bocadillo',
		'racion',
		'cubata'
	];

	$rootScope.$on('actualizarproducto', function(ev, data) {
		var encontrado = false;
		_.each($scope.productos, function(obj){
			if(obj._id === data._id){
				_.extend(obj, data);
				encontrado = true;
			}
		});
		if(!encontrado){
			$scope.productos.push(data);
			_.extend($scope.nuevoproducto, {nombre:"",clase:"",precio:""});
		}
		$scope.$apply();
	});

	$rootScope.$on('eliminarproducto', function(ev, data) {
		var nuevosproductos = _.reject($scope.productos, function(prod){
			return prod._id == data._id;
		});
		$scope.productos = nuevosproductos;
		$scope.$apply();
	});

});

app.controller('ofertaController',function($scope,$http,$rootScope){
	$http({method:'GET',url:'/oferta'}).
		success(function(data,status,headers,config){
			$scope.oferta = data[0];
		}).
		error(function(data,status,headers,config){
		});

	$rootScope.$on('actualizaroferta', function(ev, data) {
		$scope.oferta = data;
		$scope.$apply();
	});

});
app.controller('prodController', function($scope, $http, $rootScope){

	$rootScope.$on('actualizarproducto', function(ev, data) {
		var encontrado = false;

		var clase = data.clase;
		_.each($scope[clase], function(obj){
			if(obj._id === data._id){
				_.extend(obj, data);
				encontrado = true;
			}
				
		});
		if(!encontrado){
			$scope[clase].push(data);
		}
		$scope.$apply();
	});

	$rootScope.$on('eliminarproducto', function(ev, data) {
		var clase = data.clase;
		var nuevosproductos = _.reject($scope[clase], function(prod){
			return prod._id == data._id;
		});
		$scope[clase] = nuevosproductos;
		$scope.$apply();
	});

	$http({method:'GET',url:'/productos'}).
		success(function(data,status,headers,config){
			$scope.separar(data);
		}).
		error(function(data,status,headers,config){
	});
	$http({method:'GET',url:'/menus'}).
		success(function(data,status,headers,config){
			$scope.separarmenus(data);
		}).
		error(function(data,status,headers,config){
	});

	$scope.separar = function(data){
		_.each(data,function(x){
			if(_.isUndefined($scope[x.clase])){
				$scope[x.clase]=[];
			}
			$scope[x.clase].push(x);
		});
	}

	$scope.separarmenus = function(data){
		_.each(data,function(x){
			$scope[x.dia] = x;
		});
	}
});

app.run(function($rootScope,SocketService) {
	$rootScope.$on('$viewContentLoaded', function () {
		$(document).foundation();
	});
});
//CUANDO SE CARGAN TODOS LOS JS SE EJECUTA ESTE EVENTO
$(document).ready(function(){
	$(document).foundation();
	//Y ESTO ES UN EVENTO QUE SE EJECUTA CUANDO SE TERMINA DE INICIAR LA APP
	function onDeviceReady() {
		pushNotification = window.plugins.pushNotification;
	if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "Amazon" || device.platform == "amazon")
		{
			pushNotification.register(
				successHandler,
				errorHandler, {
					"senderID":"1047487760830",
					"ecb":"onNotificationGCM"
				});
		}
	else
		{
		 	pushNotification.register(
				tokenHandler,
				errorHandler, {
					"badge":"true",
					"sound":"true",
					"alert":"true",
					"ecb":"onNotificationAPN"
				});
		}
	


	}

	document.addEventListener("deviceready", onDeviceReady, false);
});


