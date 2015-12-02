function signin(response) {
    console.log("Request handler 'signin' was called.");
}

function showDetail(response) {
    console.log("Request handler 'showDetail' was called.");
}

var handle = {
    '/': signin
};

exports.handle = handle;