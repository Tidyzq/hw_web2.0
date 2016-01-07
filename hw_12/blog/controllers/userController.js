var validator = require('../public/javascripts/validator');
var bcrypt = require('bcrypt-as-promised');
var debug = require('debug')('blog:userController');

module.exports = function(db) {

	var users = db.collection('users');

	debug('Clearing database');
	users.remove({}).then(function() {
		users.find().toArray().then(function(users) {
			debug('current document in database: ', users);
		});
	});

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
			return checkUser(user).then(function() {
				debug("passed userCheck");
				return bcrypt.hash(user.pwd, 10).then(function(pwd) {
					user.pwd = pwd;
					if (user.rpwd) delete user.rpwd;
					if (user.submit) delete user.submit;
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
		getUserByUserName: function(username) {
			debug('getUserByUserName(' + username + ')');
			return new Promise(function(resolve, reject) {
				users.findOne({name: username}).then(function(foundUser) {
					foundUser ? resolve(foundUser) : reject('No such user exists');
				});
			});
		},
		checkUser: function(user) {
			debug('checkUser(' + user + ')');
			var error = {};
			debug(!!error); // to do 
			return new Promise(function(resolve, reject) {
				for (var item in validator.finalCheck) {
					if (!validator.finalCheck[item](user[item])) {
						error[item] = "Invalid format";
					}
				}
				users.findOne({name: user.name}).then(function(foundUser) {
					if (foundUser) {
						error[name] = "'" + user.name + "' has been taken";
					}
				});
				error ? reject(error) : resolve();
			});
		}
	}

	return userController;
}