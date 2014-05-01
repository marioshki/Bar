var express = require('express');
var jade = require('jade');
 var MongoClient = require('mongodb').MongoClient
	,format = require('util').format;
var ObjectID = require('mongodb').ObjectID;
var app = express();
var productos;
var oferta;
var menus;
//var datos;
MongoClient.connect('mongodb://localhost:27017/bar', function(err, db) {
		if(err) throw err;
	productos = db.collection('productos');
	oferta = db.collection('oferta');
	menus = db.collection('menus');
	//datos = db.collection('datos');
 });



//funcion donde se dice el usuario y el password del auth de admin
function authorize(username, password) {
    return 'admin' === username & 'admin' === password;
}


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

app.get('/admin',function(req, res){
	express.basicAuth(authorize);
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
			if(err) throw err;
		});
})


app.post('/eliminarproducto',function(req,res){
	if(req.body)
		var _id = ObjectID(req.body.producto._id);
		req.body.producto._id = _id;
		productos.remove(req.body.producto,function(err,result){
			if(err) throw err;
		});
})

app.post('/insertaroferta',function(req,res){
	if(req.body)
		var _id = ObjectID(req.body.oferta._id);
		req.body.oferta._id = _id;
		oferta.save(req.body.oferta,function(err,result){
			if(err) throw err;
		});
})
app.listen(20001);