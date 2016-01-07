var validator = require('../public/javascripts/validator');
var bcrypt = require('bcrypt-as-promised');
var debug = require('debug')('blog:userController');
var ObjectID = require('mongodb').ObjectID;

module.exports = function(db) {

	var users = db.collection('users');

	function isEmpty(obj) {
    	for (var name in obj) {
    	    return false;
    	}
    	return true;
	};

	var userController = {
		signinUser: function(user) {
			debug('signinUser(' + user.name + ')');
			return new Promise(function(resolve, reject) {
				userController.getUserByUserName(user.name).then(function(foundUser) {
					bcrypt.compare(user.pwd, foundUser.pwd).then(function() {
						debug('signin user ' + user.name + ' succeed');
						resolve(foundUser);
					}).catch(function(error) {
						debug('Incorrect password');
						reject({pwd: "Incorrect password"});
					});
				}).catch(function(error) {
					reject({name: 'No such user exists'});
				})
			})
		},
		signupUser: function(user) {
			debug('signupUser(' + user + ')');
			return userController.checkUser(user).then(function() {
				debug("passed userCheck");
				return bcrypt.hash(user.pwd, 10).then(function(pwd) {
					user.pwd = pwd;
					if (user.rpwd) delete user.rpwd;
					debug("insert");
					return users.insert(user);
				});
			});
		},
		showAllUsers: function() {
			debug('Showing users');
			return users.find().toArray().then(function(docs) {
				debug('current document in database: ', docs);
			}).catch(function(error) {
				debug("show users error:", error);
			});
		},
		getUserById: function(userId) {
			debug('getUserById(' + userId + ')');
			return new Promise(function(resolve, reject) {
				userId = ObjectID(userId);
				users.findOne({_id: userId}).then(function(foundUser) {
					foundUser ? resolve(foundUser) : reject('No such user exists');
				});
			});
		},
		getUserByUserName: function(username) {
			debug('getUserByUserName(' + username + ')');
			return new Promise(function(resolve, reject) {
				return users.findOne({name: username}).then(function(foundUser) {
					foundUser ? resolve(foundUser) : reject('No such user exists');
				});
			});
		},
		checkUser: function(user) {
			debug('checkUser(' + user + ')');
			var error = {};
			for (var item in validator.finalCheck) {
				if (!validator.finalCheck[item](user[item])) {
					error[item] = "Invalid format";
				}
			}
			debug('unique');
			return users.findOne({name: user.name}).then(function(foundUser) {
				if (foundUser) {
					error['name'] = "'" + user.name + "' has been taken";
				}
				debug(error);
				return Promise.resolve();
			}).then(function() {
				debug(error);
				return isEmpty(error) ? Promise.resolve() : Promise.reject(error);
			});
		}
	}

	return userController;
}