var express = require('express');
var jade = require('jade');
var app = express();


app.use("/static", express.static(__dirname + '/static'));

app.engine('jade', jade.__express);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render('index');
});

app.get('/productos', function(req, res){
  res.render('productos');
});

app.get('/oferta', function(req, res){
  res.render('oferta');
});

app.get('/contacto', function(req, res){
  res.render('contacto');
});



app.listen(20001);