var express = require('express');
var router = express.Router();
var debug = require('debug')('blog:router');


module.exports = function(db) {

	router.get('/', function(req, res, next) {
		debug('index/');
		res.render('index');
	});

	return router;
}