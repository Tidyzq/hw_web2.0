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
        var buttons = getRandom($(".button")), callbacks = [], order = '';
        buttons.forEach(function (element) {
            order += element.id;
        });
        showMessage(order);
        for (var i = 0; i < buttons.length; ++i) {
            (function (i) {
                callbacks[i] = function () {
                    $(buttons[i]).triggerHandler('click', function () {
                        tryEnableInfobar();
                        callbacks[i + 1]();
                    });
                };
            })(i);
        }
        callbacks[buttons.length] = function () {
            $("#info-bar").trigger('click');
        };
        callbacks[0]();
    })
}