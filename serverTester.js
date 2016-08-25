var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(express.static(__dirname + '../public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/client'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res){
	//render our index.html
	res.render('index');
})

app.post('/', function(req, res){

	var something = req.body.something;
	//do something with 'something'

})
console.log('server listening on 3000')
app.listen(3000);