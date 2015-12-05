var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var dataBase = require('./dataBase.js');

var MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript'
}

var regexp = {
    name: /^[a-z]\w{5,17}$/i,
    id: /^[1-9]\d{7}$/,
    tel: /^[1-9]\d{10}$/,
    email: /^[a-z0-9]([\-_\.]?[a-z0-9]+)*@([a-z0-9_\-]+\.)+[a-zA-Z]{2,4}$/i
}

var signinPage = "/signin.html";
var detailPage = "/detail.html";

function dataCheck(pathname, query, response, postData) {
    console.log("checking data for '" + postData + "'");
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    var data = querystring.parse(postData);
    for (var i in data) {
        dataBase.query(i, data[i], function (rows) {
            if (rows[0]) {
                console.log("'" + data[i] + "' is already taken");
                response.end("'" + data[i] + "' is already taken");
            } else {
                response.end();
            }
        })
    }
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

function checkUser(user) { // 暂时没有想到如何异步检测于是先不提供判重
    for (var i in user) {
        if (!regexp[i].test(user[i])) {
            return false;
        }
    }
    console.log("User check passed");
    return true;
}

function signup(pathname, query, response, postData) {
    var user = querystring.parse(postData);
    delete user.submit;
    console.log("User info recived:", user);
    if (checkUser(user)) {
        console.log("Adding user '" + user.name + "' succeed");
        dataBase.addUser(user, function (err, res) {
            if (err) console.log("Adding failed");
            else console.log("Adding succeed");
        });
        console.log("Current user:");
        dataBase.showUser(function (rows) {
            console.log(rows);
        });
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
    if (userName) {
        dataBase.query('name', userName, function (rows) {
            if (rows[0]) {
                var realPath = "assets" + detailPage, user = rows[0];
                fs.readFile(realPath, "utf8", function (err, file) {
                    response.writeHead(200, { 'Content-Type': MIME[path.extname(realPath)] });
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
        })
    }
}

var handle = {
    '/signup': signup,
    '/': signin,
    '/dataCheck': dataCheck,
    'getFile': getFile
};

exports.handle = handle;