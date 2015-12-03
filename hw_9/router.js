var querystring = require('querystring');
var handle = require("./requestHandler.js").handle;

function route(pathname, query, response, postData) {
    if (pathname == '/') {
        if (postData) handle.postData(pathname, query, response, postData);
        else if (/username/.test(query)) handle.showDetail(pathname, query, response, postData, querystring.parse(query).username);
        else handle.signin(pathname, query, response, postData);
    } else {
        handle.getFile(pathname, query, response, postData);
    }
}

exports.route = route;