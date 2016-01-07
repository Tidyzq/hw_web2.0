var debug = require('debug')('blog:postController');

module.exports = function(db) {

	var posts = db.collection('posts');
	var postPropertyExample = "author,content,time,title";
	var userController = require('../controllers/userController')(db);

	var postController = {
		// 添加post
		newPost: function(post) {
			debug('newPost(' + post + ')');
			return postController.checkPost(post).then(function() {
				return posts.insert(post);
			});
		},
		// 修改post
		editPost: function(post) {
			debug('editPost(' + post + ')');
			return postController.checkPost(post).then(function () {
				return postController.getPost(post._id).then(function(foundPost) {
					if (foundPost.author == post.author) {
						return posts.update({'_id': post._id}, {$set: post}); 
					} else {
						return Promise.reject('Invalid editor');
					}
				});
			});
		},
		// 删除post
		deletePost: function(postId, userId) {
			debug('deletePost(' + postId + ', ' + userId + ')');
			return postController.getPost(postId).then(function(foundPost) {
				if (foundPost.author == userId) {
					return posts.remove({'_id': postId}, true);
				} else {
					return Promise.reject('Invalid editor');
				}
			});
		},
		// 获取对应post的全部信息
		getPost: function(postId) {
			debug('getPost(' + postId + ')');
			return posts.findOne({'_id': postId});
		},
		// 获取全部post
		getAllPosts: function() {
			debug('getAllPosts()');
			return posts.find().sort({'time':1}).toArray().then(function(foundPosts) {
				return new Promise(function(resolve, reject) {
					var callBacks = [];
					for (i in foundPosts) {
						(function(i) {
							callBacks[i] = function() {
								userController.getUserById(foundPosts[i].author).then(function(foundUser) {
									delete foundUser.pwd;
									delete foundUser.email;
									foundPosts[i].author = foundUser;
									callBacks[parseInt(i) + 1]();
								});
							};	
						})(i);
					}
					callBacks[foundPosts.length] = function() {
						debug(foundPosts.length);
						resolve(foundPosts);
					};
					callBacks[0]();
				});
			});
		},
		// 获取对应范围的post
		getPostsByRange: function(startIndex, count) {
			debug('getPostsByRange(' + startIndex + ', ' + count + ')');
			return posts.find().sort({'time':1}).skip(startIndex).limit(count).toArray();
		},
		checkPost: function(post) {
			debug('checkPost(' + post + ')');
			return new Promise(function(resolve, reject) {
				Object.getOwnPropertyNames(post).sort().toString() == postPropertyExample ? resolve() : reject("Invalid format");
			});
		},
		replaceUser: function(post) {

		}
	}
	return postController;
};