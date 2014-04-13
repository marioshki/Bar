var express = require('express');
var jade = require('jade');
var app = express();

app.engine('jade', jade.__express);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render('plantilla', {
  	titulo:'Hola Mundo',
  	parrafo:'Esto es un Hola Mundo'
  });
});

app.listen(20001);