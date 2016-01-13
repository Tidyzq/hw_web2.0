var debug = require('debug')('blog:commentController');
var ObjectID = require('mongodb').ObjectID;

module.exports = function(db) {

	var comments = db.collection('comments');
	var userController = require('../controllers/userController')(db);

	function isEmpty(obj) {
    	for (var name in obj) {
    	    return false;
    	}
    	return true;
	};

	var commentController = {
		// 添加post
		newComment: function(comment) {
			debug('newComment');
			comment.postId = ObjectID(comment.postId);
			return commentController.checkComment(comment).then(function(comment) {	
				return comments.insert(comment);
			});
		},
		editComment: function(comment) {
			debug('editComment');
			var commentId = ObjectID(comment._id);
			delete comment._id;
			return commentController.checkComment(comment).then(function(comment) {
				return comments.findOne({'_id': commentId}).then(function(foundComment) {
					if (foundComment) {
						if (foundComment.author == comment.author) {
							return comments.update({'_id': commentId}, {$set: {content: comment.content}});
						} else {
							return Promise.reject('Invalid editor');
						}
					} else {
						Promise.reject('No such comment id');
					}
				});
			});
		},
		deleteComment: function(commentId, userId) {
			debug('deleteComment');
			commentId = ObjectID(commentId);
			return comments.findOne({'_id': commentId}).then(function(foundComment) {
				if (foundComment.author == userId) {
					return comments.remove({'_id': commentId}, true);
				} else {
					return Promise.reject('Invalid editor');
				}
			})
		},
		getComment: function(commentId) {
			debug('getComment');
			commentId = ObjectID(commentId);
			return comments.find({'_id': commentId}).then(commentController.replaceUser);
		},
		getCommentsOfPost: function(postId) {
			debug('getAllComments');
			postId = ObjectID(postId);
			return comments.find({'postId': postId}).sort({'time': 1}).toArray().then(commentController.replaceUser);
		},
		getCommentsOfPostByRange: function(postId, startIndex, count) {
			debug('getCommentsByRange');
			postId = ObjectID(postId);
			return comments.find({'postId': postId}).sort({'time': 1}).toArray().then(function (commentArr) {
				var commentCount = commentArr.length;
				return commentController.replaceUser(commentArr.slice(startIndex, startIndex + count)).then(function (commentArr) {
					return Promise.resolve(commentArr, commentCount);
				});
			});
		},
		getCommentCountOfPost: function(postId) {
			debug('getCommentCountOfPost');
			postId = ObjectID(postId);
			return comments.find({'postId': postId}).toArray().then(function (commentArr) {
				return Promise.resolve(commentArr.length);
			});
		},
		checkComment: function(comment) {
			debug('checkComment');
			var error = {};
			if (!comment.content) error.content = "shouldn't be empty";
			return isEmpty(error) ? Promise.resolve({
				postId: comment.postId,
				time: comment.time,
				content: comment.content,
				author: comment.author
			}) : Promise.reject(error);
		},
		replaceUser: function(commentArr) {
			debug('replaceUser')
			return new Promise(function(resolve, reject) {
				var callBacks = [];
				for (var i = 0; i < commentArr.length; ++i) {
					(function(i) {
						callBacks[i] = function() {
							userController.getUserById(commentArr[i].author).then(function(foundUser) {
								commentArr[i].author = foundUser;
								callBacks[i + 1]();
							});
						};	
					})(i);
				}
				callBacks[commentArr.length] = function() {
					resolve(commentArr);
				};
				callBacks[0]();
			});
		},
	};
	return commentController;
};