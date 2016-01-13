var debug = require('debug')('blog:postController');
var ObjectID = require('mongodb').ObjectID;

module.exports = function (db) {

	var posts = db.collection('posts');
	var userController = require('../controllers/userController')(db);
	var commentController = require('../controllers/commentController')(db);

	function isEmpty(obj) {
    	for (var name in obj) {
    	    return false;
    	}
    	return true;
	};

	var postController = {
		// 添加post
		newPost: function (post) {
			debug('newPost');
			return postController.checkPost(post).then(function (post) {
				return posts.insert(post);
			});
		},
		// 修改post
		editPost: function (post) {
			debug('editPost');
			var postId = ObjectID(post._id);
			delete post._id;
			return postController.checkPost(post).then(function (post) {
				return posts.findOne({'_id': postId}).then(function (foundPost) {
					if (foundPost.author == post.author) {
						return posts.update({'_id': postId}, {$set: {title: post.title, content: post.content}}); 
					} else {
						return Promise.reject('Invalid editor');
					}
				});
			});
		},
		// 删除post
		deletePost: function (postId, userId) {
			debug('deletePost');
			postId = ObjectID(postId);
			return posts.findOne({_id: postId}).then(function (foundPost) {
				if (foundPost.author == userId) {
					return posts.remove({_id: postId});
				} else {
					return Promise.reject('Invalid editor');
				}
			});
		},
		// 获取对应post的全部信息
		getPost: function (postId) {
			debug('getPost');
			postId = ObjectID(postId);
			return posts.find({'_id': postId}).then(postController.replaceUser).then(postController.addCommentCount);
		},
		// 获取全部post
		getAllPosts: function () {
			debug('getAllPosts');
			return posts.find().sort({'time':1}).toArray().then(postController.replaceUser).then(postController.addCommentCount);
		},
		// 获取post数量
		getPostCount: function () {
			debug('getPostCount');
			return posts.find().toArray().then(function (postArr) {
				return Promise.resolve(postArr.length);
			});
		},
		// 获取对应范围的post
		getPostsByRange: function (startIndex, count) {
			debug('getPostsByRange');
			return posts.find().sort({'time':1}).toArray().then(function (postArr) {
				var postCount = postArr.length;
				return postController.replaceUser(postArr.slice(startIndex, startIndex + count)).then(postController.addCommentCount).then(function (postArr) {
					return Promise.resolve({posts: postArr, count: postCount});
				});
			});
		},
		checkPost: function (post) {
			debug('checkPost');
			var error = {};
			if (!post.title) error.title = "shouldn't be empty";
			if (!post.content) error.content = "shouldn't be empty";
			return isEmpty(error) ? Promise.resolve({
				title: post.title,
				time: post.time,
				content: post.content,
				author: post.author
			}) : Promise.reject(error);
		},
		replaceUser: function (postArr) {
			debug('replaceUser');
			return new Promise(function (resolve, reject) {
				var callBacks = [];
				for (var i = 0; i < postArr.length; ++i) {
					(function (i) {
						callBacks[i] = function () {
							userController.getUserById(postArr[i].author).then(function (foundUser) {
								postArr[i].author = foundUser;
								callBacks[i + 1]();
							});
						};	
					})(i);
				}
				callBacks[postArr.length] = function () {
					resolve(postArr);
				};
				callBacks[0]();
			});
		},
		addCommentCount: function (postArr) {
			debug('addCommentCount');
			return new Promise(function (resolve, reject) {
				var callBacks = [];
				for (var i = 0; i < postArr.length; ++i) {
					(function (i) {
						callBacks[i] = function () {
							commentController.getCommentCountOfPost(postArr[i]._id).then(function (count) {
								postArr[i].commentCount = count;
								callBacks[i + 1]();
							});
						};	
					})(i);
				}
				callBacks[postArr.length] = function () {
					resolve(postArr);
				};
				callBacks[0]();
			});
		}
	}
	return postController;
};