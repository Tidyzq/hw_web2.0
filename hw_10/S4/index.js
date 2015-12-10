window.onload = function () {
    $(".icon").click(function () {
        if (!$(this).hasClass("disabled")) {
            $(this).addClass("disabled");
            var buttons = $(".button"), callbacks = [];
            var random_buttons = [];
            while (buttons.length) {
                var select = Math.floor(Math.random() * buttons.length);
                random_buttons.push(buttons[select]);
                buttons.splice(select, 1);
            }
            random_buttons.forEach(function (element) {
                $("#info").text($("#info").text() + element.id);
            });
            for (var i = 0; i < random_buttons.length; ++i) {
                (function (i) {
                    callbacks[i] = function () {
                        var button = random_buttons[i];
                        $(button).children(".number").text("...").show();
                        $(button).siblings().addClass("disabled");
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
            callbacks[random_buttons.length] = function () {
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