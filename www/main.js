var express = require('express');
var jade = require('jade');
 var MongoClient = require('mongodb').MongoClient
 	,format = require('util').format;
var app = express();
var productos;
var ofertas;
MongoClient.connect('mongodb://localhost:27017/bar', function(err, db) {
    if(err) throw err;
	productos = db.collection('productos');
	ofertas = db.collection('ofertas');
 });

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
  //res.json({pene:'penesito'});
});

app.get('/oferta', function(req, res){
});

app.get('/sobre', function(req, res){
});

app.get('/donde', function(req, res){
});

app.get('/llamanos', function(req, res){
});
app.listen(20001);