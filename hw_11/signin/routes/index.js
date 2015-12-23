var express = require('express');
var router = express.Router();
var validator = require('../public/javascripts/validator');

/* GET home page. */
router.get('/signup', function(req, res, next) {
	res.render('signup', { title: 'signup' });
});

router.post('/signup', function(req, res, next) {
	var user = req.body;
	console.log(user);
	checkUser(user, function(success) {
		if (success) {
			res.redirect('/detail');
		} else {
			res.end();
		}
	})
});

router.get('/detail', function(req, res, next) {
	res.render('detail', { title : 'detail', user: {} });
});

function checkUser(user, callback) {
	console.log(validator);
    for (var i in validator.finalCheck) {
    	console.log('checking ' + i);
        if (!validator.finalCheck[i](user[i])) {
        	console.log('failed at ' + i);
            callback(false);
            return;
        }
    }
    // check repeat here
    callback(true);
}

module.exports = router;