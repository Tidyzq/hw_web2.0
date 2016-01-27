var debug = require('debug')('blog:postController');
var ObjectID = require('mongodb').ObjectID;

var first = true;

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
				return posts.insert(post).then(function(resultArr) {
					post._id = resultArr.insertedIds[1];
					return postController.processBeforeSend([post], post.author);
				});
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
			postId = ObjectID(postId); userId = ObjectID(userId);
			return posts.findOne({'_id': postId}).then(function (foundPost) {
				if (foundPost.author == userId) {
					return posts.remove({'_id': postId}, true);
				} else {
					return userController.getUserById(userId).then(function (foundUser) {
						return foundUser.isAdmin ? posts.remove({'_id': postId}, true) : Promise.reject('Invalid editor'); 
					});
				}
			});
		},
		hidePost: function (postId, userId) {
			debug('hidePost');
			postId = ObjectID(postId); userId = ObjectID(userId);
			return userController.getUserById(userId).then(function (foundUser) {
				return foundUser.isAdmin ? posts.update({_id: postId}, {$set: {hide: true}}) : Promise.reject('Invalid editor');
			});
		},
		unhidePost: function (postId, userId) {
			debug('unhidePost');
			postId = ObjectID(postId); userId = ObjectID(userId);
			return userController.getUserById(userId).then(function (foundUser) {
				return foundUser.isAdmin ? posts.update({_id: postId}, {$set: {hide: false}}) : Promise.reject('Invalid editor');
			});
		},
		// 获取对应post的全部信息
		getPost: function (postId, userId) {
			debug('getPost');
			postId = ObjectID(postId);
			return posts.find({'_id': postId}).toArray().then(function (postArr) {
				return postController.processBeforeSend(postArr, userId).then(function (postArr) {
					return Promise.resolve(postArr[0]);
				});
			});
		},
		// 获取全部post
		getAllPosts: function (userId, filter) {
			debug('getAllPosts');
			filter = postController.convertToRegExp(filter);
			return posts.find({$or: [{title: filter}, {content: filter}]}).sort({'time':1}).toArray().then(function (postArr) {
				return postController.processBeforeSend(postArr, userId).then(postController.shortenPost);
			});
		},
		// 获取post数量
		getPostCount: function () {
			debug('getPostCount');
			return posts.find().toArray().then(function (postArr) {
				return Promise.resolve(postArr.length);
			});
		},
		// 获取对应范围的post
		getPostsByRange: function (startIndex, count, userId, filter) {
			debug('getPostsByRange');
			filter = postController.convertToRegExp(filter);
			return posts.find({$or: [{title: filter}, {content: filter}]}).sort({'time': 1}).toArray().then(function (postArr) {
				var postCount = postArr.length;
				return postController.processBeforeSend(postArr.slice(startIndex, startIndex + count), userId).then(postController.shortenPost).then(function (postArr) {
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
				author: post.author,
				hide: post.hide
			}) : Promise.reject(error);
		},
		convertToRegExp: function (filter) {
			debug('convertToRegExp');
			return new RegExp(filter.replace(/([\[\]\(\)\{\}\+\-\*\\\/\.\&\^\%\$\!])/g, '\\$1').split(' ').map(function (element) {
				return '(' + element + ')';
			}).join('|'));
		},
		processBeforeSend: function (postArr, userId) {
			debug('processBeforeSend');
			return postController.hideInfo(postArr, userId).then(postController.addCommentCount).then(postController.replaceUser);
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
		},
		shortenPost: function (postArr) {
			debug('shortenPost');
			for (var i = 0; i < postArr.length; ++i) {
				if (!postArr[i].hide && postArr[i].content.length > 50) {
					postArr[i].content = postArr[i].content.substr(0, 50) + '...';
					postArr[i].shorten = true;
				}
			}
			return Promise.resolve(postArr);
		},
		hideInfo: function (postArr, userId) {
			debug('hideInfo');
			return userController.getUserById(userId).then(function (foundUser) {
				if (!foundUser.isAdmin) {
					for (var i = 0; i < postArr.length; ++i) {
						if (postArr[i].hide && postArr[i].author != userId) {
							postArr[i].content = "";
						}
					}
				}
				return Promise.resolve(postArr);
			}).catch(function (error) {
				debug(error);
				for (var i = 0; i < postArr.length; ++i) {
					if (postArr[i].hide) {
						postArr[i].content = "";
					}
				}
				return Promise.resolve(postArr);
			});
		}
	};

	// 当数据库为空时自动添加admin和初始post
	if (first) {
		first = false;
		userController.getAllUsers().then(function (arr) {
			if (arr.length == 0) {
				return userController.signUpUser({
					name: 'administrator',
					pwd: '123456',
					rpwd: '123456',
					email: 'admin@admin.com',
					isAdmin: true
				}).then(function (user) {
					return postController.newPost({
						author: user._id,
						title: 'Welcome!',
						time: new Date(),
						content: 'this is an example post, you can add new posts and reply after you signed in\nthe password of administrator is 123456',
						hide: false
					});
				});
			}
		}).then(function () {
			debug('init completed');
		}).catch(function (error) {
			debug(error);
		});;
	}

	return postController;
};