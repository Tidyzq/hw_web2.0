var debug = require('debug')('blog:commentController');

module.exports = function(db) {

	var comments = db.collection('comments');
	var commentExample = {
		postId: 'postId',
		time: 'time',
		author: 'author',
		content: 'content'
	}

	var commentController = {
		// 添加post
		newComment: function(comment) {
			debug('newComment(' + comment + ')');
			return commentController.checkComment(comment).then(function() {	
				return comments.insert(commnet);
			});
		},
		editComment: function(commentId, comment) {
			debug('editComment(' + commentId + ', ' + comment + ')');
			return commentController.checkComment(comment).then(function() {
				return comments.update({'_id': commentId}, comment);
			});
		},
		deleteComment: function(commentId) {
			debug('deleteComment(' + commentId + ')');
			return comments.remove({'_id': commentId}, true);
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
		}
		checkComment: function(comment) {
			debug('checkComment(' + comment + ')');
			return new Promise(function(resolve, reject) {
				Object.getOwnPropertyNames(comment).sort().toString() == Object.getOwnPropertyNames(commentExample).sort().toString() ? resolve() : reject('Invalid format');
			});
		}
	};
	return commentController;
};