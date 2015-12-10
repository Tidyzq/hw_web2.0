window.onload = function () {
    $(".icon").click(function () {
        if (!$(this).hasClass("disabled")) {
            $(this).addClass("disabled");
            var buttons = $(".button");
            for (var i = 0; i < buttons.length; ++i) {
                (function (i) {
                    $(buttons[i]).children(".number").text("...").show();
                    $.get('/', function (data) {
                        if (!$(buttons[i]).children(".number:hidden").length && !$(buttons[i]).hasClass("disabled")) {
                            $(buttons[i]).children(".number").text(data);
                            $(buttons[i]).addClass("disabled");
                            if (!$(".button:not(.disabled)").length) {
                                var number = 0;
                                $(".number").each(function () {
                                    number += parseInt($(this).text());
                                });
                                $("#info").text(number);
                            }
                        }
                    });
                })(i);
            }
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