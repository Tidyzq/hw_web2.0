var regexp = {
    name: /^[a-z]\w{5,17}$/i,
    id: /^[1-9]\d{7}$/,
    telephone: /^[1-9]\d{10}$/,
    email: /^[a-z0-9]([\-_\.]?[a-z0-9]+)*@([a-z0-9_\-]+\.)+[a-zA-Z]{2,4}$/i
}

function check(input) {
    return regexp[input.name].test($(input).val());
}

window.onload = function () {
    $('input[type="text"]').blur(function () {
        $(this).removeClass("wrong right").addClass(check(this) ? "right" : "wrong");
    });
    $('input[type="reset"]').click(function () {
        $('input[type="text"]').removeClass("wrong right");
    });
    $('input[type="submit"]').click(function (event) {
        $('input[type="text"]').each(function () {
            if (!check(this)) event.preventDefault();
        });
    });
}