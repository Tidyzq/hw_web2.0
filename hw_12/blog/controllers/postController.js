var debug = require('debug')('blog:postController');
var ObjectID = require('mongodb').ObjectID;

module.exports = function (db) {

	var posts = db.collection('posts');
	var postPropertyExample = "author,content,time,title";
	var userController = require('../controllers/userController')(db);

	var postController = {
		// 添加post
		newPost: function (post) {
			debug('newPost');
			return postController.checkPost(post).then(function () {
				return posts.insert(post);
			});
		},
		// 修改post
		editPost: function (post) {
			debug('editPost');
			var postId = ObjectID(post._id);
			delete post._id;
			return postController.checkPost(post).then(function () {
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
			return posts.find({'_id': postId}).then(postController.replaceUser);
		},
		// 获取全部post
		getAllPosts: function () {
			debug('getAllPosts');
			return posts.find().sort({'time':1}).toArray().then(postController.replaceUser);
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
			return posts.find().sort({'time':1}).skip(startIndex).limit(count).toArray().then(postController.replaceUser);
		},
		checkPost: function (post) {
			debug('checkPost');
			return new Promise(function (resolve, reject) {
				Object.getOwnPropertyNames(post).sort().toString() == postPropertyExample ? resolve() : reject("Invalid format");
			});
		},
		replaceUser: function (postArr) {
			debug('replaceUser')
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
		}
	}
	return postController;
};