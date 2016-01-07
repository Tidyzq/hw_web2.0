var express = require('express');
var router = express.Router();
var debug = require('debug')('blog:router');


module.exports = function(db) {

	router.get('/', function(req, res, next) {
		debug('/');
		res.render('index');
	});

	router.get('/home', function(req, res, next) {
		debug('/home');
		res.render('home');
	});

	return router;
}