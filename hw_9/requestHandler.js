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

var sets = {
    name: new Set(),
    id: new Set(),
    telephone: new Set(),
    email: new Set()
}

var userMap = {};

var signinPage = "/signin.html";
var detailPage = "/detail.html";

function dataCheck(pathname, query, response, postData) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    var data = querystring.parse(postData);
    for (var i in data) {
        if (sets[i].has(data[i])) response.write("'" + data[i] + "' is already taken")
    }
    response.end();
}

function getFile(pathname, query, response, postData) {
    console.log("Getting file " + pathname);
    var realPath = "assets" + pathname;
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

function signup(pathname, query, response, postData) {
    var user = querystring.parse(postData);
    delete user.submit;
    var flag = true;
    for (var i in user) {
        if (sets[i].has(user[i])) flag = false;
    }
    console.log("User info recived:", user);
    if (checkUser(user) && flag) {
        console.log("Adding user '" + user.name + "' succeed");
        for (var i in user) {
            sets[i].add(user[i]);
        }
        userMap[user.name] = user;
        console.log("Current user:", sets.name);
        showDetail(pathname, query, response, postData, user.name);
    } else {
        console.log("Adding user '" + user.name + "' failed");
        getFile(signinPage, query, response, postData);
    }
}

function signin(pathname, query, response, postData) {
    console.log("request for sign in");
    var userName = querystring.parse(query).username;
    if (userName) {
        showDetail(pathname, query, response, postData, userName);
    } else {
        getFile(signinPage, query, response, postData);
    }
}

function showDetail(pathname, query, response, postData, userName) {
    console.log("Showing detail for user '" + userName + "'");
    if (userName && sets.name.has(userName)) {
        var realPath = "assets" + detailPage;
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
        if (userName) console.log("user '" + userName + "' donot exists");
        getFile(signinPage, query, response, postData);
    }
}

var handle = {
    '/signup': signup,
    '/': signin,
    '/dataCheck': dataCheck,
    'getFile': getFile
};

exports.handle = handle;