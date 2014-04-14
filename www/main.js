var express = require('express');
var jade = require('jade');
var app = express();

app.engine('jade', jade.__express);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render('index', {
  	titulo:'Hola Mundo',
  	parrafo:'Esto es un Hola Mundo'
  });
});

app.get('/productos', function(req, res){
  res.render('productos', {
  	titulo:'Hola Mundo',
  	parrafo:'Esto es un Hola Mundo'
  });
});

app.get('/oferta', function(req, res){
  res.render('oferta', {
  	titulo:'Hola Mundo',
  	parrafo:'Esto es un Hola Mundo'
  });
});

app.get('/contacto', function(req, res){
  res.render('contacto', {
  	titulo:'Hola Mundo',
  	parrafo:'Esto es un Hola Mundo'
  });
});



app.listen(20001);