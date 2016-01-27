var express = require('express');
var router = express.Router();
var debug = require('debug')('blog:router:post');
var moment = require('moment');

module.exports = function (db) {
	var postController = require('../controllers/postController')(db);

	router.get('/getPost', function (req, res, next) {
		debug('/getPost');
		var postId = req.query.postId;
		var userId = req.session.userId;
		postController.getPost(postId, userId).then(function (post) {
			res.json({success: true, post: post});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});	

	router.get('/getAllPosts', function (req, res, next) {
		debug('/getAllPosts');
		var userId = req.session.userId;
		var filter = req.query.filter;
		postController.getAllPosts(userId, filter).then(function (posts) {
			res.json({success: true, posts: posts});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});

	router.get('/getPostsByRange', function (req, res, next) {
		debug('/getPostsByRange');
		var userId = req.session.userId;
		var startIndex = req.query.startIndex, count = req.query.count;
		var filter = req.query.filter;
		postController.getPostsByRange(startIndex, count, userId, filter).then(function (response) {
			res.json({success: true, posts: response.posts, count: response.count});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});

	router.all('*', function (req, res, next) {
		req.session.userId ? next() : res.json({success: false, error: "You haven't signin yet"});
	});

	router.post('/newPost', function (req, res, next) {
		debug('/newPost');
		var post = req.body;
		post.author = req.session.userId;
		post.time = new Date();
		post.hide = false;
		postController.newPost(post).then(function (posts) {
			res.json({success: true, post: posts[0]});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});

	router.post('/editPost', function (req, res, next) {
		debug('/editPost');
		var post = req.body;
		post.author = req.session.userId;
		post.time = new Date();
		postController.editPost(post).then(function (result) {
			res.json({success: true});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});

	router.post('/deletePost', function (req, res, next) {
		debug('/deletePost');
		var postId = req.body.postId;
		userId = req.session.userId;
		postController.deletePost(postId, userId).then(function () {
			res.json({success: true});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});

	router.post('/hidePost', function (req, res, next) {
		debug('/hidePost');
		var postId = req.body.postId;
		userId = req.session.userId;
		postController.hidePost(postId, userId).then(function () {
			res.json({success: true});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});

	router.post('/unhidePost', function (req, res, next) {
		debug('/unhidePost');
		var postId = req.body.postId;
		userId = req.session.userId;
		postController.unhidePost(postId, userId).then(function () {
			res.json({success: true});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});

	return router;
}