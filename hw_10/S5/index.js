function aHandler(curSum, callback) {
    var button = $("#A");
    $(button).children(".number").text("...").show();
    $(button).siblings().addClass("disabled");
    $.get('/', function (data) {
        if (!$(button).children(".number:hidden").length && !$(button).hasClass("disabled")) {
            $(button).children(".number").text(data);
            $(button).siblings(":has(.number:hidden)").removeClass("disabled");
            if (Math.random() < 0.8) {
                if (!$(".button:has(.number:hidden)").length) {
                    $("#info-bar").removeClass("disabled");
                }
                $(button).addClass("disabled");
                callback(null, "这是一个天大的秘密", curSum + parseInt(data));
            } else {
                $(button).children(".number").hide();
                callback({ message: "这不是一个天大的秘密", curSum: curSum }, null, null);
            }
        }
    });
}

function bHandler(curSum, callback) {
    var button = $("#B");
    $(button).children(".number").text("...").show();
    $(button).siblings().addClass("disabled");
    $.get('/', function (data) {
        if (!$(button).children(".number:hidden").length && !$(button).hasClass("disabled")) {
            $(button).children(".number").text(data);
            $(button).siblings(":has(.number:hidden)").removeClass("disabled");
            if (Math.random() < 0.8) {
                if (!$(".button:has(.number:hidden)").length) {
                    $("#info-bar").removeClass("disabled");
                }
                $(button).addClass("disabled");
                callback(null, "我不知道", curSum + parseInt(data));
            } else {
                $(button).children(".number").hide();
                callback({ message: "我知道", curSum: curSum }, null, null);
            }
        }
    });
}

function cHandler(curSum, callback) {
    var button = $("#C");
    $(button).children(".number").text("...").show();
    $(button).siblings().addClass("disabled");
    $.get('/', function (data) {
        if (!$(button).children(".number:hidden").length && !$(button).hasClass("disabled")) {
            $(button).children(".number").text(data);
            $(button).siblings(":has(.number:hidden)").removeClass("disabled");
            if (Math.random() < 0.8) {
                if (!$(".button:has(.number:hidden)").length) {
                    $("#info-bar").removeClass("disabled");
                }
                $(button).addClass("disabled");
                callback(null, "你不知道", curSum + parseInt(data));
            } else {
                $(button).children(".number").hide();
                callback({ message: "你知道", curSum: curSum }, null, null);
            }
        }
    });
}

function dHandler(curSum, callback) {
    var button = $("#D");
    $(button).children(".number").text("...").show();
    $(button).siblings().addClass("disabled");
    $.get('/', function (data) {
        if (!$(button).children(".number:hidden").length && !$(button).hasClass("disabled")) {
            $(button).children(".number").text(data);
            $(button).siblings(":has(.number:hidden)").removeClass("disabled");
            if (Math.random() < 0.8) {
                if (!$(".button:has(.number:hidden)").length) {
                    $("#info-bar").removeClass("disabled");
                }
                $(button).addClass("disabled");
                callback(null, "他不知道", curSum + parseInt(data));
            } else {
                $(button).children(".number").hide();
                callback({ message: "他知道", curSum: curSum }, null, null);
            }
        }
    });
}

function eHandler(curSum, callback) {
    var button = $("#E");
    $(button).children(".number").text("...").show();
    $(button).siblings().addClass("disabled");
    $.get('/', function (data) {
        if (!$(button).children(".number:hidden").length && !$(button).hasClass("disabled")) {
            $(button).children(".number").text(data);
            $(button).siblings(":has(.number:hidden)").removeClass("disabled");
            if (Math.random() < 0.8) {
                if (!$(".button:has(.number:hidden)").length) {
                    $("#info-bar").removeClass("disabled");
                }
                $(button).addClass("disabled");
                callback(null, "才怪", curSum + parseInt(data));
            } else {
                $(button).children(".number").hide();
                callback({ message: "才不怪", curSum: curSum }, null, null);
            }
        }
    });
}

function bubbleHandler(curSum, callBack) {
    $("#info").text("楼主异步调用战斗力感人，目测不超过" + curSum);
    $("#info-bar").addClass("disabled");
    callBack();
}

function showMessage(message) {
    $("#info").text(message);
}

window.onload = function () {
    $(".icon").click(function () {
        if (!$(this).hasClass("disabled")) {
            $(this).addClass("disabled");
            var handlers = [aHandler, bHandler, cHandler, dHandler, eHandler], callbacks = [];
            var random_handlers = [], callbacks = [];
            while (handlers.length) {
                var select = Math.floor(Math.random() * handlers.length);
                random_handlers.push(handlers[select]);
                handlers.splice(select, 1);
            }
            random_handlers.forEach(function (element) {
                $("#info").text($("#info").text() + element.toString()[9].toUpperCase());
            });
            for (var i = 0; i < random_handlers.length; ++i) {
                (function (i) {
                    callbacks[i] = function (curSum) {
                        var handler = random_handlers[i];
                        handler(curSum, function (err, message, curSum) {
                            if (err) {
                                console.log("failed at " + random_handlers[i].toString().match(/function\s+(\w+)/)[1]);
                                showMessage(err.message);
                                callbacks[i](err.curSum);
                            } else {
                                showMessage(message);
                                callbacks[i + 1](curSum);
                            }
                        });
                    }
                })(i);
            }
            callbacks[random_handlers.length] = function (curSum) {
                bubbleHandler(curSum, function () {
                    console.log("succeed");
                });
            }
            callbacks[0](0);
        }
    });
    $("#button").on("mouseenter", function () {
        $(".icon").removeClass("disabled");
        $(".number").hide();
        $(".button").removeClass("disabled");
        $("#info").text("");
        $("#info-bar").addClass("disabled");
    });
}