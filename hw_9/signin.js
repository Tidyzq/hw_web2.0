var Regexp = {
    name: /^[a-z]\w{5,17}$/i,
    id: /^[1-9]\d{7}$/,
    telephone: /^[1-9]\d{10}$/,
    email: /^[a-z0-9]([\-_\.]?[a-z0-9]+)*@([a-z0-9_\-]+\.)+[a-zA-Z]{2,4}$/i
}

window.onload = function () {
    $('input[type="text"]').blur(function () {
        if (Regexp[this.name].test($(this).val())) {
            $(this).removeClass("wrong").addClass("right");
        } else {
            $(this).removeClass("right").addClass("wrong");
        }
    });
    $('input[type="reset"]').click(function () {
        $('input[type="text"]').removeClass("wrong right");
    });
}