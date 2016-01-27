var debug = require('debug')('blog:commentController');
var ObjectID = require('mongodb').ObjectID;

module.exports = function (db) {

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
		newComment: function (comment) {
			debug('newComment');
			comment.postId = ObjectID(comment.postId);
			return commentController.checkComment(comment).then(function (comment) {	
				return comments.insert(comment).then(function (resultArr) {
					comment._id = resultArr.insertedIds[1];
					return commentController.replaceUser([comment]).then(function (commentArr) {
						return Promise.resolve(commentArr[0]);
					});
				});
			});
		},
		editComment: function (comment) {
			debug('editComment');
			var commentId = ObjectID(comment._id);
			delete comment._id;
			return commentController.checkComment(comment).then(function (comment) {
				return comments.findOne({'_id': commentId}).then(function (foundComment) {
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
		deleteComment: function (commentId, userId) {
			debug('deleteComment');
			commentId = ObjectID(commentId);
			return comments.findOne({'_id': commentId}).then(function (foundComment) {
				if (foundComment.author == userId) {
					return comments.remove({'_id': commentId}, true);
				} else {
					return userController.getUserById(userId).then(function (foundUser) {
						return foundUser.isAdmin ? comments.remove({'_id': commentId}, true) : Promise.reject('Invalid editor');
					});
				}
			});
		},
		deleteCommentByPostId: function (postId) {
			debug('deleteCommentByPostId');
			postId = ObjectID(postId);
			return comments.remove({'postId': postId});
		},
		hideComment: function (commentId, userId) {
			debug('hideComment');
			commentId = ObjectID(commentId);
			return userController.getUserById(userId).then(function (foundUser) {
				return foundUser.isAdmin ? comments.update({'_id': commentId}, {$set: {hide: true}}) : Promise.reject('Invalid editor');
			});
		},
		unhideComment: function (commentId, userId) {
			debug('unhideComment');
			commentId = ObjectID(commentId);
			return userController.getUserById(userId).then(function (foundUser) {
				return foundUser.isAdmin ? comments.update({'_id': commentId}, {$set: {hide: false}}) : Promise.reject('Invalid editor');
			});
		},
		getComment: function (commentId, userId) {
			debug('getComment');
			commentId = ObjectID(commentId);
			return comments.find({'_id': commentId}).toArray().then(function (commentArr) {
				return commentController.processBeforeSend(commentArr, userId).then(function (commentArr) {
					return Promise.resolve(commentArr[0]);
				});
			});
		},
		getCommentsOfPost: function (postId, userId) {
			debug('getAllComments');
			postId = ObjectID(postId);
			return comments.find({'postId': postId}).sort({'time': 1}).toArray().then(function (commentArr) {
				return commentController.processBeforeSend(commentArr, userId);
			});
		},
		getCommentsOfPostByRange: function (postId, startIndex, count, userId) {
			debug('getCommentsByRange');
			postId = ObjectID(postId);
			return comments.find({'postId': postId}).sort({'time': 1}).toArray().then(function (commentArr) {
				var commentCount = commentArr.length;
				return commentController.processBeforeSend(commentArr.slice(startIndex, startIndex + count), userId).then(function (commentArr) {
					return Promise.resolve(commentArr, commentCount);
				});
			});
		},
		getCommentCountOfPost: function (postId) {
			debug('getCommentCountOfPost');
			postId = ObjectID(postId);
			return comments.find({'postId': postId}).toArray().then(function (commentArr) {
				return Promise.resolve(commentArr.length);
			});
		},
		checkComment: function (comment) {
			debug('checkComment');
			var error = {};
			if (!comment.content) error.content = "shouldn't be empty";
			return isEmpty(error) ? Promise.resolve({
				postId: comment.postId,
				time: comment.time,
				content: comment.content,
				author: comment.author,
				reply: comment.reply,
				hide: comment.hide
			}) : Promise.reject(error);
		},
		processBeforeSend: function (commentArr, userId) {
			debug('processBeforeSend');
			return commentController.hideInfo(commentArr, userId).then(commentController.replaceUser);
		},
		replaceUser: function (commentArr) {
			debug('replaceUser');
			return new Promise(function (resolve, reject) {
				var callBacks = [];
				for (var i = 0; i < commentArr.length; ++i) {
					(function (i) {
						callBacks[i] = function () {
							userController.getUserById(commentArr[i].author).then(function (foundUser) {
								commentArr[i].author = foundUser;
								if (commentArr[i].reply) {
									userController.getUserById(commentArr[i].reply).then(function (foundUser) {
										commentArr[i].reply = foundUser;
										callBacks[i + 1]();
									});
								} else {
									callBacks[i + 1]();
								}
							});
						};	
					})(i);
				}
				callBacks[commentArr.length] = function () {
					resolve(commentArr);
				};
				callBacks[0]();
			});
		},
		hideInfo: function (commentArr, userId) {
			debug('hideInfo');
			return userController.getUserById(userId).then(function (foundUser) {
				if (!foundUser.isAdmin) {
					for (var i = 0; i < commentArr.length; ++i) {
						if (commentArr[i].hide && commentArr[i].author != userId) {
							commentArr[i].content = "";
						}
					}
					return Promise.resolve(commentArr);
				}
				return Promise.resolve(commentArr);
			}).catch(function (error) {
				debug(error);
				for (var i = 0; i < commentArr.length; ++i) {
					if (commentArr[i].hide) {
						commentArr[i].content = "";
					}
				}
				return Promise.resolve(commentArr);
			});
		} 
	};
	return commentController;
};