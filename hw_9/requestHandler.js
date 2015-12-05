var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'tidyzq.com',
    user: 'hw_9',
    password: '123456',
    database: 'hw_web',
    port: 3306
});

conn.connect();
function DBShowUser() {
    conn.query('SELECT * FROM user', function (err, rows, fields) {
        console.log(rows);
    });
}

function DBAddUser(user) {
    conn.query('INSERT INTO user (name, id, tel, email) values("' + user.name + '", "' + user.id + '", "' + user.tel + '", "' + user.email + '")', function (err, res) {
        if (err) {
            console.log("Adding user failed");
        } else {
            console.log("Adding user succeed");
        }
    });
}

function DBQuery(item, value, fn) {
    conn.query('SELECT * FROM user WHERE ' + item + '="' + value + '"', function (err, rows, fields) {
        fn(rows);
    });
}

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
        DBQuery(i, data[i], function (rows) {
            if (rows[0]) {
                console.log("'" + data[i] + "' is already taken");
                response.end("'" + data[i] + "' is already taken");
            } else {
                response.end();
            }
        })
        //if (sets[i].has(data[i])) {
        //    console.log("'" + data[i] + "' is already taken");
        //    response.write("'" + data[i] + "' is already taken");
        //}
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

//function checkUser(user) {
//    for (var i in user) {
//        if (!regexp[i].test(user[i]) || sets[i].has(user[i])) {
//            console.log("User check failed at '" + i + "'");
//            return false;
//        }
//    }
//    console.log("User check passed");
//    return true;
//}

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
        DBAddUser(user);
        console.log("Current user:");
        DBShowUser();
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
        DBQuery('name', userName, function (rows) {
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
    //if (userName && sets.name.has(userName)) {
    //    var realPath = "assets" + detailPage;
    //    fs.readFile(realPath, "utf8", function (err, file) {
    //        response.writeHead(200, { 'Content-Type': MIME[path.extname(realPath)] });
    //        var user = userMap[userName];
    //        for (var i in user) {
    //            file = file.replace('{{' + i + '}}', user[i]);
    //        }
    //        response.write(file, 'utf8');
    //        response.end();
    //    });
    //} else {
    //    if (userName) console.log("user '" + userName + "' donot exists");
    //    getFile(signinPage, query, response, postData);
    //}
}

var handle = {
    '/signup': signup,
    '/': signin,
    '/dataCheck': dataCheck,
    'getFile': getFile
};

exports.handle = handle;