var express = require('express');
var router = express.Router();
var debug = require('debug')('blog:router:comment');

module.exports = function (db) {
	var commentController = require('../controllers/commentController')(db);

	router.get('/getComment', function (req, res, next) {
		debug('/getComment');
		var commentId = req.query.commentId;
		commentController.getComment(commentId).then(function (comment) {
			res.json({success: true, comment: comment});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});
	
	router.get('/getCommentsOfPost', function (req, res, next) {
		debug('/getCommentsOfPost');
		var postId = req.query.postId;
		commentController.getCommentsOfPost(postId).then(function (comments) {
			res.json({success: true, comments: comments});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});

	router.get('/getCommentsOfPostByRange', function (req, res, next) {
		debug('/getCommentsOfPostByRange');
		var postId = req.query.postId, startIndex = req.query.startIndex, count = req.query.count;
		commentController.getCommentsOfPostByRange(postId, startIndex, count).then(function (comments, count) {
			res.json({success: true, comments: comments, count: count});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});
	
	router.all('*', function (req, res, next) {
		req.session.userId ? next() : res.json({success: false, error: "You haven't signin yet"});
	});

	router.post('/newComment', function (req, res, next) {
		debug('/newComment');
		var comment = req.body;
		comment.author = req.session.userId;
		comment.time = new Date();
		commentController.newComment(comment).then(function () {
			res.json({success: true});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});

	router.post('/editComment', function (req, res, next) {
		debug('/editComment');
		var comment = req.body;
		comment.author = req.session.userId;
		comment.time = new Date();
		commentController.editComment(comment).then(function () {
			res.json({success: true});
		}).catch(function (error) {
			res.json({success: false, error: error});
		});
	});

	router.post('/deleteComment', function (req, res, next) {
		debug('/deleteComment');
		var commentId = req.body.commentId;
		userId = req.session.userId;
		commentController.deleteComment(commentId, userId).then(function () {
			res.json({success: true});
		}).catch(function (error) {
			res.json({success: false, error: error});
		})
	});

	return router;
}