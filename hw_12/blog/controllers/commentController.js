var debug = require('debug')('blog:commentController');

module.exports = function(db) {

	var comments = db.collection('comments');
	var commentExample = {
		postId: 'postId',
		time: 'time',
		author: 'author',
		content: 'content'
	};

	var commentController = {
		// 添加post
		newComment: function(comment) {
			debug('newComment(' + comment + ')');
			return commentController.checkComment(comment).then(function() {	
				return comments.insert(commnet);
			});
		},
		editComment: function(comment) {
			debug('editComment(' + comment + ')');
			return commentController.checkComment(comment).then(function() {
				return commentController.getComment(comment._id).then(function(foundComment) {
					if (foundComment.author == comment.author) {
						return comments.update({'_id': commentId}, comment);
					} else {
						return Promise.reject('Invalid editor');
					}
				});
			});
		},
		deleteComment: function(commentId, userId) {
			debug('deleteComment(' + commentId + ', ' + userId + ')');
			return commentController.getComment(commentId).then(function(foundComment) {
				if (foundComment.author == userId) {
					return comments.remove({'_id': commentId}, true);
				} else {
					return Promise.reject('Invalid editor');
				}
			})
		},
		getComment: function(commentId) {
			debug('getComment(' + commentId + ')');
			return comments.findOne({'_id': commentId});
		},
		getAllComments: function(postId) {
			debug('getAllComments(' + postId + ')');
			return comments.find({'postId': postId}).sort({'time': 1}).toArray();
		},
		getCommentsByRange: function(postId, startIndex, count) {
			debug('getCommentsByRange(' + postId + ', ' + startIndex + ', ' + count + ')');
			return comments.find({'postId': postId}).sort({'time': 1}).skip(startIndex).limit(count).toArray();
		},
		checkComment: function(comment) {
			debug('checkComment(' + comment + ')');
			return new Promise(function(resolve, reject) {
				Object.getOwnPropertyNames(comment).sort().toString() == Object.getOwnPropertyNames(commentExample).sort().toString() ? resolve() : reject('Invalid format');
			});
		}
	};
	return commentController;
};