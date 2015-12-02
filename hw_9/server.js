var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var querystring = require('querystring');
var jq = require('jquery');
//var $ = require('jquery');

var MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript'
}

var signinPage = "signin.html";
var detailPage = "detail.html";

function start(route) {
    function onRequest(request, response) {
        var postData = "";
        var pathname = '.' + url.parse(request.url).pathname;
        console.log("Requesting for " + pathname);
        if (/\/$/.test(pathname)) {
            var query = querystring.parse(url.parse(request.url).query)['username'];
            console.log("Querying for username '" + query + "'");
            pathname += signinPage;
        }
        fs.exists(pathname, function (exists) {
            if (!exists) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end('file not found');
            } else {
                fs.readFile(pathname, "binary", function (err, file) {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'text/plain' });
                        response.end(err);
                    } else {
                        response.writeHead(200, { 'Content-Type': MIME[path.extname(pathname)] });
                        response.write(file, 'binary');
                        response.end();
                    }
                });
            }
        });
        request.setEncoding("utf8");

        request.on("data", function (postDataChunk) {
            postData += postDataChunk;
            console.log("Received Post data chunk '" + postDataChunk + "'");
        });
        request.on("end", function () {
            console.log("Reveived Post data '" + postData + "'");
        });
    }
    http.createServer(onRequest).listen(8000);
    console.log("Server starts at localhost:8000");
}

exports.start = start;