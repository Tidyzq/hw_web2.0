var querystring = require('querystring');
var handle = require("./requestHandler.js").handle;

function route(pathname, query, response, postData) {
    if (handle[pathname]) {
        handle[pathname](pathname, query, response, postData);
    } else {
        handle['getFile'](pathname, query, response, postData);
    }
}

exports.route = route;