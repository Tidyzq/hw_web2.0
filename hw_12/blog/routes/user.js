var express = require('express');
var router = express.Router();
var debug = require('debug')('blog:router:user');

module.exports = function(db) {

	var userController = require('../controllers/userController')(db);
	/* GET users listing. */
	router.get('/', function(req, res, next) {
		debug('/');
		res.redirect('/signin');
	});

	// gets
	router.get('/signin', function(req, res, next) {
		debug('/signin');
		res.render('user/signin');
	});

	router.get('/signup', function(req, res, next) {
		debug('/signup');
		res.render('user/signup');
	});

	router.get('/detail', function(req, res, next) {
		debug('/detail');
		res.render('user/detail');
	});

	router.get('/edit', function(req, res, next) {
		debug('/edit');
		res.render('user/edit');
	});

	router.get('/getUser', function(req, res, next) {
		debug('/getUser');
		userId = req.query.userId;
		userController.getUserById(userId).then(function(user) {
			delete user.pwd;
			debug(user);
			res.json(user);
		}).catch(function(error) {
			res.json();
		});
	});

	router.get('/signout', function(req, res, next) {
		debug('/signout');
		delete req.session.userId;
		res.json({success: true});
	});

	// posts
	router.post('/signin', function(req, res, next) {
		debug('/signin');
		var user = req.body;
		userController.signinUser(user).then(function(user) {
			req.session.userId = user._id;
			delete user.pwd;
			res.json({success: true, user: user});
		}).catch(function(error) {
			debug(error);
			res.json({success: false, error: error});
		})
	});

	router.post('/signup', function(req, res, next) {
		debug('/signup');
		var user = req.body;
		userController.signupUser(user).then(function(resultArr) {
			user._id = resultArr.insertedIds[1];
			req.session.userId = user._id;
			delete user.pwd;
			res.json({success: true, user: user});
		}).catch(function(error) {
			debug('failed');
			res.json({success: false, error: error});
		});
	});

	router.all('*', function(req, res, next) {
		req.session.userId ? next() : res.json({success: false, error: "You haven't signin yet"});
	});

	router.post('/edit', function(req, res, next) {
		debug('/edit');
		var user = req.body;
		if (user._id == req.session.userId) {
			userController.editUser(user._id, user).then(function() {
				res.json({success: true});
			}).catch(function(error) {
				res.json({success: false, error: error});
			})
		} else {
			res.json({success: false, error: "Invalid editor"});
		}
	});

	return router;
}