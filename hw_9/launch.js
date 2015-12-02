var server = require("./server.js");
var router = require("./router.js");

server.start(router.route);

//http.createServer(function (request, response) {
//    var pathname = url.parse(request.url).query;
//    console.log(pathname);
//    //if (pathname == '/') {
//        fs.readFile(signinPage, 'binary', function (err, file) {
//            response.writeHead(200, { 'Content-Type': 'text/html' });
//            response.write(file, "binary");
//            response.end();
//        });
//    //} else if (pathname == '/?username=abc') {
//    //    fs.readFile(detailPage, 'binary', function (err, file) {
//    //        response.writeHead(200, { 'Content-Type': 'text/html' });
//    //        response.write(file, "binary");
//    //        response.end();
//    //    });
//    //} else {
//        //fs.exists(pathname, function (exists) {
//        //    if (!exists) {
//        //        response.writeHead(404, { 'Content-Type': 'text/plain' });
//        //        response.end('file not found');
//        //    } else {
//        //        fs.readFile(pathname, "binary", function (err, file) {
//        //            if (err) {
//        //                response.writeHead(500, { 'Content-Type': 'text/plain' });
//        //                response.end(err);
//        //            } else {
//        //                response.writeHead(200, { 'Content-Type': 'text/html' });
//        //                response.write(file, 'binary');
//        //                response.end();
//        //            }
//        //        });
//        //    }
//        //});
//    //}
//}).listen(8000);

//console.log('Server running at http://127.0.0.1:8000/');