function buttonHandler(button, rate, curSum, succeedMessage, faildMessage, callback) {
    $(button).children(".number").text("...").show();
    $(button).siblings().addClass("disabled");
    $.get('/', function (data) {
        if (!$(button).children(".number:hidden").length && !$(button).hasClass("disabled")) {
            $(button).children(".number").text(data);
            $(button).siblings(":has(.number:hidden)").removeClass("disabled");
            if (Math.random() < rate) {
                if (!$(".button:has(.number:hidden)").length) {
                    $("#info-bar").removeClass("disabled");
                }
                $(button).addClass("disabled");
                callback(null, succeedMessage, curSum + parseInt(data));
            } else {
                $(button).children(".number").hide();
                callback({ message: faildMessage, curSum: curSum }, null, null);
            }
        }
    });
}

function aHandler(curSum, callback) {
    buttonHandler($("#A"), 0.8, curSum, "����һ����������", "�ⲻ��һ����������", callback);
}

function bHandler(curSum, callback) {
    buttonHandler($("#B"), 0.8, curSum, "�Ҳ�֪��", "��֪��", callback);
}

function cHandler(curSum, callback) {
    buttonHandler($("#C"), 0.8, curSum, "�㲻֪��", "��֪��", callback);
}

function dHandler(curSum, callback) {
    buttonHandler($("#D"), 0.8, curSum, "����֪��", "��֪��", callback);
}

function eHandler(curSum, callback) {
    buttonHandler($("#E"), 0.8, curSum, "�Ź�", "�Ų���", callback);
}

function bubbleHandler(curSum, callBack) {
    $("#info").text("¥���첽����ս�������ˣ�Ŀ�ⲻ����" + curSum);
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