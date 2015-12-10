window.onload = function () {
    $("#button").on("mouseenter", function () {
        $(".number").hide();
        $(".button").removeClass("disabled");
        $("#info").text("");
        $("#info-bar").addClass("disabled");
    });
    $(".button").click(function () {
        if ($(this).children(".number:hidden").length) {
            $(this).children(".number").text("...").show();
            $(this).siblings().addClass("disabled");
            var button = this;
            $.get('/', function (data) {
                if (!$(button).children(".number:hidden").length && !$(button).hasClass("disabled")) {
                    $(button).children(".number").text(data);
                    $(button).addClass("disabled");
                    $(button).siblings(":has(.number:hidden)").removeClass("disabled");
                    if (!$(".button:has(.number:hidden)").length) {
                        $("#info-bar").removeClass("disabled");
                    }
                }
            });
        }
    });
    $("#info-bar").click(function () {
        var number = 0;
        $(".number").each(function () {
            number += parseInt($(this).text());
        });
        $("#info").text(number);
        $(this).addClass("disabled");
    })
}