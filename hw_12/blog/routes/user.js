var express = require('express');
var router = express.Router();
var debug = require('debug')('blog:router:user');

module.exports = function (db) {

	var userController = require('../controllers/userController')(db);

	router.get('/checkSignIn', function (req, res, next) {
		debug('/checkSignIn');
		if (req.session.userId) {
			userController.getUserById(req.session.userId).then(function (user) {
				res.json({success: true, user: user});
			}).catch(function (error) {
				res.json({success: false, error: error});
			});
		} else {
			res.json({success: false, error: "You haven't signIn yet"});
		}
	});

	router.get('/getUser', function (req, res, next) {
		debug('/getUser');
		var userId = req.query.userId;
		userController.getUserById(userId).then(function (user) {
			res.json({success: true, user: user});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});

	router.get('/signOut', function (req, res, next) {
		debug('/signOut');
		delete req.session.userId;
		res.json({success: true});
	});

	// posts
	router.post('/signIn', function (req, res, next) {
		debug('/signIn');
		var user = req.body;
		userController.signInUser(user).then(function (user) {
			req.session.userId = user._id;
			res.json({success: true, user: user});
		}).catch(function (error) {
			res.json({success: false, error: error});
		})
	});

	router.post('/signUp', function (req, res, next) {
		debug('/signUp');
		var user = req.body;
		user.isAdmin = false;
		userController.signUpUser(user).then(function (user) {
			req.session.userId = user._id;
			res.json({success: true, user: user});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});

	router.all('*', function (req, res, next) {
		req.session.userId ? next() : res.json({success: false, error: "You haven't signIn yet"});
	});

	router.post('/edit', function (req, res, next) {
		debug('/edit');
		var user = req.body;
		if (user._id == req.session.userId) {
			userController.editUser(user._id, user).then(function () {
				res.json({success: true});
			}).catch(function (error) {
				res.json({success: false, error: error});
			})
		} else {
			res.json({success: false, error: "Invalid editor"});
		}
	});

	return router;
}