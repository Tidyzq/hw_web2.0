function btnClickHandler(event, callback) {
    if (!$(this).hasClass("disabled") && $(this).children(".number:hidden").length) {
        callback = arguments[1] ? arguments[1] : tryEnableInfobar;
        $(this).children(".number").text("...").show();
        $(this).siblings().addClass("disabled");
        var button = this;
        $.get('/' + this.id, function (data) {
            if (!$(button).children(".number:hidden").length && !$(button).hasClass("disabled")) {
                $(button).children(".number").text(data);
                $(button).addClass("disabled");
                $(button).siblings(":has(.number:hidden)").removeClass("disabled");
                callback.call(button);
            }
        });
    }
}

function btnHandler(button, rate, curSum, succeedMessage, faildMessage, callback) {
    $(button).trigger('click', function () {
        if (Math.random() < rate) {
            tryEnableInfobar();
            callback(null, succeedMessage, curSum + parseInt($(button).children(".number").text()));
        } else {
            $(button).removeClass("disabled");
            $(button).children(".number").hide();
            callback({ message: faildMessage, curSum: curSum }, null, null);
        }
    });
}

function aHandler(curSum, callback) {
    btnHandler($("#A"), 0.8, curSum, "A:这是一个天大的秘密", "A:这不是一个天大的秘密", callback);
}

function bHandler(curSum, callback) {
    btnHandler($("#B"), 0.8, curSum, "B:我不知道", "B:我知道", callback);
}

function cHandler(curSum, callback) {
    btnHandler($("#C"), 0.8, curSum, "C:你不知道", "C:你知道", callback);
}

function dHandler(curSum, callback) {
    btnHandler($("#D"), 0.8, curSum, "D:他不知道", "D:他知道", callback);
}

function eHandler(curSum, callback) {
    btnHandler($("#E"), 0.8, curSum, "E:才怪", "E:才不怪", callback);
}

function bubbleHandler(event, callback) {
    if (!$(this).hasClass("disabled")) {
        var number = 0;
        $(".number").each(function () {
            number += parseInt($(this).text());
        });
        $("#info").text(number);
        $(this).addClass("disabled");
        if ($.isFunction(callback)) callback.call(this);
    }
}

function tryEnableInfobar() {
    if (!$(".button:not(.disabled),.button:has(.number:hidden)").length) {
        $("#info-bar").removeClass("disabled");
    }
}

function getRandom(sourceOrder) {
    var randomOrder = [];
    while (sourceOrder.length) {
        var select = Math.floor(Math.random() * sourceOrder.length);
        randomOrder.push(sourceOrder[select]);
        sourceOrder.splice(select, 1);
    }
    return randomOrder;
}

function showMessage(message) {
    $("#hover_message").text(message);
}

window.onload = function () {
    $("#button").on("mouseenter", function () {
        $(".number").hide();
        $(".button").removeClass("disabled");
        $("#info").text("");
        $("#info-bar").addClass("disabled");
        $("#hover_message").text("");
    });
    $(".button").click(btnClickHandler);
    $("#info-bar").click(bubbleHandler);
    $(".apb").click(function () {
        $("#button").trigger("mouseenter");
        var handlers = getRandom([aHandler, bHandler, cHandler, dHandler, eHandler]), callbacks = [], order = '';
        handlers.forEach(function (element) {
            order += element.toString()[9].toUpperCase();
        });
        showMessage(order);
        for (var i = 0; i < handlers.length; ++i) {
            (function (i) {
                callbacks[i] = function (curSum) {
                    handlers[i](curSum, function (err, message, curSum) {
                        if (err) {
                            showMessage(err.message);
                            callbacks[i](err.curSum);
                        } else {
                            showMessage(message);
                            callbacks[i + 1](curSum);
                        }
                    })
                }
            })(i);
        }
        callbacks[handlers.length] = function () {
            $("#info-bar").trigger('click', function () {
                showMessage("大气泡：楼主异步调用战斗力感人，目测不超过" + $("#info").text());
            });
        };
        callbacks[0](0);
    })
}