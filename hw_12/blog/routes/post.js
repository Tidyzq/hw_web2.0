var express = require('express');
var router = express.Router();
var debug = require('debug')('blog:router:post');
var moment = require('moment');


module.exports = function(db) {
	var postController = require('../controllers/postController')(db);

	router.get('/', function(req, res, next) {
		debug('index/');
		res.end();
	});

	router.get('/newPost', function(req, res, next) {
		debug(req);
		res.render('newPost');
	});

	router.get('/editPost', function(req, res, next) {
		debug(req);
		res.render('editPost');
	});

	router.get('/viewPost', function(req, res, next) {
		debug(req);
		res.render('viewPost');
	});

	router.get('/getPost', function(req, res, next) {
		debug(req);
		var postId = req.query.postId;
		postController.getPost(postId).then(function(post) {
			res.json(post);
		});
	});

	router.get('/getPostsByRange', function(req, res, next) {
		debug(req);
		var startIndex = req.query.startIndex, count = req.query.count;
		postController.getPostByRange(startIndex, count).then(function(posts) {
			res.json(posts);
		});
	});

	router.all('*', function(req, res, next) {
		req.session.userId ? next() : res.json({success: false, error: "You haven't signin yet"});
	});

	router.post('/newPost', function(req, res, next) {
		debug(req);
		var post = req.body;
		post.author = req.session.userId;
		post.time = moment();
		postController.newPost(post).then(function() {
			res.json({success: true});
		}).catch(function(error) {
			res.json({success: false, error: error});
		});
	});

	router.post('/editPost', function(req, res, next) {
		debug(req);
		var post = req.body;
		post.author = req.session.userId;
		post.time = moment();
		postController.editPost(post).then(function() {
			res.json({success: true});
		}).catch(function(error) {
			res.json({success: false, error: error});
		});
	});

	router.post('/deletePost', function(req, res, next) {
		debug(req);
		var postId = req.body;
		userId = req.session.userId;
		postController.deletePost(postId, userId).then(function() {
			res.json({success: true});
		}).catch(function(error) {
			res.json({success: false, error: error});
		})
	});

	return router;
}