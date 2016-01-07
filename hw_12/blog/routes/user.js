var express = require('express');
var router = express.Router();
var debug = require('debug')('blog:router:user');

module.exports = function(db) {

	var userController = require('../controllers/userController')(db);
	/* GET users listing. */
	router.get('/', function(req, res, next) {
		debug(req);
		res.redirect('/signin');
	});

	// gets
	router.get('/signin', function(req, res, next) {
		debug(req);
		res.render('signin');
	});

	router.get('/signup', function(req, res, next) {
		debug(req);
		res.render('signup');
	});

	router.get('/detail', function(req, res, next) {
		debug(req);
		res.render('detail');
	});

	router.get('/edit', function(req, res, next) {
		debug(req);
		res.render('edit');
	});

	router.get('/getUser', function(req, res, next) {
		debug(req);
		username = req.query.username;
		userController.getUserByUserName(username).then(function(user) {
			delete user.pwd;
			res.json(user);
		}).catch(function(error) {
			res.json({});
		});
	});

	router.get('/signout', function(req, res, next) {
		debug(req);
		delete req.session.username;
		res.json({success: true});
	});

	// posts
	router.post('/signin', function(req, res, next) {
		debug(req);
		var user = req.body;
		userController.signinUser(user).then(function(user) {
			debug(user._id, user.id); // to do
			req.session.userId = user._id;
			res.json({success: true});
		}).catch(function(error) {
			debug(error);
			res.json({success: false, error: error});
		})
	});

	router.post('/signup', function(req, res, next) {
		debug(req);
		var user = req.body;
		userController.signupUser(user).then(function(resultArr) {
			req.debug(resultArr); // to do
			req.session.username = user._id;
			res.json({success: true});
		}).catch(function(error) {
			res.json({success: false, error: error});
		});
	});

	router.post('/edit', function(req, res, next) {
		debug(req);
		var user = req.body;
		userController.editUser(user._id, user).then(function() {
			res.json({success: true});
		}).catch(function(error) {
			res.json({success: false, error: error});
		})
	});

	return router;
}