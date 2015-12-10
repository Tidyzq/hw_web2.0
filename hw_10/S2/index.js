window.onload = function () {
    $(".icon").click(function () {
        if (!$(this).hasClass("disabled")) {
            $(this).addClass("disabled");
            var buttons = $(".button"), callbacks = [];
            for (var i = 0; i < buttons.length; ++i) {
                (function (i) {
                    callbacks[i] = function () {
                        $(buttons[i]).children(".number").text("...").show();
                        $(buttons[i]).siblings().addClass("disabled");
                        var button = buttons[i];
                        $.get('/', function (data) {
                            if (!$(button).children(".number:hidden").length && !$(button).hasClass("disabled")) {
                                $(button).children(".number").text(data);
                                $(button).addClass("disabled");
                                $(button).siblings(":has(.number:hidden)").removeClass("disabled");
                                if (!$(".button:has(.number:hidden)").length) {
                                    $("#info-bar").removeClass("disabled");
                                }
                                callbacks[i + 1]();
                            }
                        });
                    }
                })(i);
            }
            callbacks[buttons.length] = function () {
                var number = 0;
                $(".number").each(function () {
                    number += parseInt($(this).text());
                });
                $("#info").text(number);
                $("#info-bar").addClass("disabled");
            }
            callbacks[0]();
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