var express = require('express');
var router = express.Router();
var debug = require('debug')('blog:router:comment');
var moment = require('moment');


module.exports = function(db) {
	var commentController = require('../controllers/commentController')(db);

	router.get('/', function(req, res, next) {
		debug(req);
		res.end();
	});

	router.get('/newComment', function(req, res, next) {
		debug(req);
		res.render('newComment');
	});
	
	router.get('/editComment', function(req, res, next) {
		debug(req);
		res.render('editComment');
	});

	router.get('/viewComment', function(req, res, next) {
		debug(req);
		res.render('viewComment');
	});

	router.get('/getComment', function(req, res, next) {
		debug(req);
		var commentId = req.query.commentId;
		commentController.getComment(commentId).then(function(comment) {
			res.json(comment);
		});
	});
	
	router.get('/getCommentOfPost', function(req, res, next) {
		debug(req);
		var postId = req.query.postId;
		commentController.getAllComments(postId).then(function(comments) {
			res.json(comments);
		});
	});

	router.get('/getCommentsByRange', function(req, res, next) {
		debug(req);
		var postId = req.query.postId, startIndex = req.query.startIndex, count = req.query.count;
		commentController.getCommentByRange(postId, startIndex, count).then(function(comments) {
			res.json(comments);
		});
	});
	
	router.all('*', function(req, res, next) {
		req.session.userId ? next() : res.json({success: false, error: "You haven't signin yet"});
	});

	router.post('/newComment', function(req, res, next) {
		debug(req);
		var comment = req.body;
		comment.author = req.session.userId;
		comment.time = moment();
		commentController.newComment(comment).then(function() {
			res.json({success: true});
		}).catch(function(error) {
			res.json({success: false, error: error});
		});
	});

	router.post('/editComment', function(req, res, next) {
		debug(req);
		var comment = req.body;
		comment.author = req.session.userId;
		comment.time = moment();
		commentController.editComment(comment).then(function() {
			res.json({success: true});
		}).catch(function(error) {
			res.json({success: false, error: error});
		});
	});

	router.post('/deleteComment', function(req, res, next) {
		debug(req);
		var commentId = req.body;
		userId = req.session.userId;
		commentController.deleteComment(commentId, userId).then(function() {
			res.json({success: true});
		}).catch(function(error) {
			res.json({success: false, error: error});
		})
	});

	return router;
}