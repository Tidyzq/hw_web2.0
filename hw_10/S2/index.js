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

window.onload = function () {
    $("#button").on("mouseenter", function () {
        $(".number").hide();
        $(".button").removeClass("disabled");
        $("#info").text("");
        $("#info-bar").addClass("disabled");
    });
    $(".button").click(btnClickHandler);
    $("#info-bar").click(bubbleHandler);
    $(".apb").click(function () {
        $("#button").trigger("mouseenter");
        var buttons = $(".button"), callbacks = [];
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