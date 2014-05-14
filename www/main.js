//variables de Express, Jade, Mongodb,basicAuth
// y la instance de express.
// la gcm (Push Notifications, notificaciones en la barra de estado)

var express = require('express');
var jade = require('jade');
 var MongoClient = require('mongodb').MongoClient
	,format = require('util').format;
var ObjectID = require('mongodb').ObjectID;
var basicAuth = require('basic-auth');
var app = express();
var gcm = require('node-gcm');


//VARIABLE PARA ENVIAR NOTIFICACIONES A TRAVES DE GOOGLE SERVER
var sender = new gcm.Sender('AIzaSyA17vCpI_8Mz4F1XXvaUm84go9IRfhutGA');

var registrationIds = [];

//registrationIds.push('APA91bFZpTCJtGzZk514dQam4MEOOc3xTqYsoLrDDmNiDc2f1DCZVs9ApPxReMMmzCM0PSwSG2lKHgkuT2e-Rus38P5gL9yi9mXa-RtXo3snJU94QJw6sjtGwk0uKb70BCPRQVmN90DfJWgMgs5oD_GmV-IUIxIlTA');
	 
//COLECCIONES DE MONGODB
var productos;
var oferta;
var menus;

//WEBSOCKET
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//puerto que escucha el socket, que hace de intermediario entre el cliente y express.
server.listen(20001);

io.set("log level",1);

//conexion a mongodb
MongoClient.connect('mongodb://localhost:27017/bar', function(err, db) {
		if(err) throw err;
	productos = db.collection('productos');
	oferta = db.collection('oferta');
	menus = db.collection('menus');
 });

//auth para la parte de admin que me brinda basicAuth
var auth = function (req, res, next) {
  function unauthorized(res) {
	res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
	return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
	return unauthorized(res);
  };

  if (user.name === 'admin' && user.pass === 'sysadmin') {
	return next();
  } else {
	return unauthorized(res);
  };
};
//le indico a express la carpeta static, que es donde va el codigo
//que no va a ser modificado
app.use(require('connect').bodyParser());
app.use("/static", express.static(__dirname + '/static'));

//le indico que jade es el motor de renderizado de las paginas
app.engine('jade', jade.__express);

//le indico el directorio de las vistas
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//peticiones de express y sus respuestas
//renderiza la plantilla index, la principal de angularjs
app.get('/', function(req, res){
	res.render('index');
});
//devuelve productos
app.get('/productos', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	productos.find().toArray(function(err,results){
		res.json(results);
	});
});
//devuelve la oferta
app.get('/oferta', function(req, res){
	res.setHeader('Content-Type','application/json');
	oferta.find().toArray(function(err,results){
		res.json(results);
	});
});

app.get('/sobre', function(req, res){
});
//renderiza la plantilla admin (que pide auth)
app.get('/admin',auth,function(req, res){
	res.render('admin');
});

app.get('/donde', function(req, res){
});
//devuelve los menus
app.get('/menus',function(req,res){
	res.setHeader('Content-Type','application/json');
	menus.find().toArray(function(err,results){
		res.json(results);
	});
});
//inserta o actualiza dependiendo de si tiene o no _id
//el producto enviado en el body del request.
app.post('/insertarproducto',function(req,res){
	var message = new gcm.Message();
	if(req.body){
		var _id = ObjectID(req.body.producto._id);
		req.body.producto._id = _id;
		productos.save(req.body.producto,function(err,result){
			if(err) throw err;
			result = result == 1 ? req.body.producto : result;
			io.sockets.emit("actualizacion de producto",result);
			message.addData('message','Producto Actualizado : '+result.nombre);
			message.addData('title','Producto Actualizado');
			console.log(registrationIds);
			sender.send(message, registrationIds, 4, function (result) {
    			console.log(result);
			});
		});
	}
});
//elimina el producto enviado en el body del request.
app.post('/eliminarproducto',function(req,res){
	if(req.body)
		var _id = ObjectID(req.body.producto._id);
		req.body.producto._id = _id;
		productos.remove(req.body.producto,function(err,result){
			if(err) throw err;
			io.sockets.emit("eliminacion de producto",req.body.producto);
		});
});
//inserta o actualiza dependiendo de si tiene o no _id
//la oferta enviada en el body del request
app.post('/insertaroferta',function(req,res){
	if(req.body){
		var _id = ObjectID(req.body.oferta._id);
		req.body.oferta._id = _id;
		oferta.save(req.body.oferta,function(err,result){
			if(err) throw err;
			result = result == 1 ? req.body.oferta : result;
			io.sockets.emit("actualizacion de oferta",result);
		});
	}
});
app.post('/insertarmenu',function(req,res){
	var _id = ObjectID(req.body.menu._id);
	req.body.menu._id = _id;
		menus.save(req.body.menu,function(err,result){
			if(err) throw err;
			result = result ==1 ? req.body.menu : result;
			io.sockets.emit("actualizacion de menu",result);
		})

});

app.post('/id',function(req,res){
	if(req.body){
		console.log(req.body);
		registrationIds.push(req.body.id);
	}
});