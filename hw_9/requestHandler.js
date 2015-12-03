var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

var MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript'
}

var regexp = {
    name: /^[a-z]\w{5,17}$/i,
    id: /^[1-9]\d{7}$/,
    telephone: /^[1-9]\d{10}$/,
    email: /^[a-z0-9]([\-_\.]?[a-z0-9]+)*@([a-z0-9_\-]+\.)+[a-zA-Z]{2,4}$/i
}

function checkUser(user) {
    for (var i in regexp) {
        if (!regexp[i].test(user[i])) {
            console.log("User check failed at '" + i + "'");
            return false;
        }
    }
    console.log("User check passed");
    return true;
}

var userNameSet = new Set();
var userMap = {};

var signinPage = "signin.html";
var detailPage = "detail.html";

function getFile(pathname, query, response, postData) {
    console.log("Getting file " + pathname);
    var realPath = '.' + pathname;
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('file not found');
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, { 'Content-Type': 'text/plain' });
                    response.end(err);
                } else {
                    response.writeHead(200, { 'Content-Type': MIME[path.extname(realPath)] });
                    response.write(file, 'binary');
                    response.end();
                }
            });
        }
    });
}

function postData(pathname, query, response, postData) {
    var user = querystring.parse(postData);
    delete user.submit;
    console.log("User info recived:", user);
    if (checkUser(user) && !userNameSet.has(user.name)) {
        userNameSet.add(user.name);
        console.log("Adding user '" + user.name + "' succeed");
        console.log("Current user:", userNameSet);
        userMap[user.name] = user;
        showDetail(pathname, query, response, postData, user.name);
    } else {
        console.log("Adding user '" + user.name + "' failed");
        signin(pathname, query, response, postData);
    }
}

function signin(pathname, query, response, postData) {
    console.log("Showing signin page");
    var realPath = '.' + pathname + signinPage;
    fs.readFile(realPath, "binary", function (err, file) {
        response.writeHead(200, { 'Content-Type': MIME[path.extname(realPath)] });
        response.write(file, 'binary');
        response.end();
    });
}

function showDetail(pathname, query, response, postData, userName) {
    console.log("Showing detail for user '" + userName + "'");
    if (userNameSet.has(userName)) {
        var realPath = '.' + pathname + detailPage;
        fs.readFile(realPath, "utf8", function (err, file) {
            response.writeHead(200, { 'Content-Type': MIME[path.extname(realPath)] });
            var user = userMap[userName];
            for (var i in user) {
                file = file.replace('{{' + i + '}}', user[i]);
            }
            response.write(file, 'utf8');
            response.end();
        });
    } else {
        console.log("user '" + userName + "' donot exists");
        signin(pathname, query, response, postData);
    }
}

var handle = {
    'postData': postData,
    'getFile': getFile,
    'signin': signin,
    'showDetail': showDetail
};

exports.handle = handle;