var express = require('express');
var jade = require('jade');
 var MongoClient = require('mongodb').MongoClient
 	,format = require('util').format;
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
    productos.save(req.body.producto,function(err,result){
      if(err) throw err;
    });
})


app.post('/eliminarproducto',function(req,res){
  if(req.body)
    productos.remove(req.body.producto,function(err,result){
      if(err) throw err;
    });
})

app.post('/insertaroferta',function(req,res){
  if(req.body)
    oferta.save(req.body.oferta,function(err,result){
      if(err) throw err;
    });
})
app.listen(20001);