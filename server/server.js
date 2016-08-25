var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');

var app = express();

// app.set('views', __dirname + '/views');
// app.set('view engine', 'html');

app.use(morgan('combined'));

app.use(express.static(path.resolve('../public')));
app.use(express.static(path.resolve('../bower_components')));
app.use(express.static(path.resolve('../client')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res){
	console.log(__dirname + '../public/index.html');
	console.log(path.resolve('../public/index.html'));
	res.sendFile(path.resolve('../public/index.html'));
})

app.post('/', function(req, res){

	var something = req.body.something;
	//do something with 'something'

})
console.log('ASYNC group server listening on 3000')
app.listen(3000);