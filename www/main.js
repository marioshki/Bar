var express = require('express');
var jade = require('jade');
 var MongoClient = require('mongodb').MongoClient
	,format = require('util').format;
var ObjectID = require('mongodb').ObjectID;
var basicAuth = require('basic-auth');
var app = express();



//COLECCIONES DE MONGODB
var productos;
var oferta;
var menus;

//WEBSOCKET
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//puerto que escucha express.
server.listen(20001);

io.set("log level",1);

io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
});


MongoClient.connect('mongodb://localhost:27017/bar', function(err, db) {
		if(err) throw err;
	productos = db.collection('productos');
	oferta = db.collection('oferta');
	menus = db.collection('menus');
	//datos = db.collection('datos');
 });


var auth = function (req, res, next) {
  function unauthorized(res) {
	res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
	return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
	return unauthorized(res);
  };

  if (user.name === 'foo' && user.pass === 'bar') {
	return next();
  } else {
	return unauthorized(res);
  };
};

app.use(require('connect').bodyParser());
app.use("/static", express.static(__dirname + '/static'));

app.engine('jade', jade.__express);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
	res.render('index');
});

app.get('/productos', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	productos.find().toArray(function(err,results){
		res.json(results);
	});
});

app.get('/oferta', function(req, res){
	res.setHeader('Content-Type','application/json');
	oferta.find().toArray(function(err,results){
		res.json(results);
	});
});

app.get('/sobre', function(req, res){
});

app.get('/admin',auth,function(req, res){
	res.render('admin');
});

app.get('/donde', function(req, res){
});

app.get('/menus',function(req,res){
	res.setHeader('Content-Type','application/json');
	menus.find().toArray(function(err,results){
		res.json(results);
	});
});

app.post('/insertarproducto',function(req,res){
	if(req.body)
		var _id = ObjectID(req.body.producto._id);
		req.body.producto._id = _id;
		productos.save(req.body.producto,function(err,result){
			console.log(result , "--" , err);
			if(err) throw err;
			result = result == 1 ? req.body.producto : result;
			io.sockets.emit("actualizacion de producto",result);
		});
});

app.post('/eliminarproducto',function(req,res){
	if(req.body)
		var _id = ObjectID(req.body.producto._id);
		req.body.producto._id = _id;
		productos.remove(req.body.producto,function(err,result){
			if(err) throw err;
			socket.emit("eliminacion de producto",result);
		});
});

app.post('/insertaroferta',function(req,res){
	if(req.body)
		var _id = ObjectID(req.body.oferta._id);
		req.body.oferta._id = _id;
		oferta.save(req.body.oferta,function(err,result){
			if(err) throw err;
			socket.emit("actualizacion de oferta",result);
		});
});