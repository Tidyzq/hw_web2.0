var checkCases = {
    name: {
        'should only contain alphabet, number and underline': /^\w*$/,
        'should begin with alphabet': /^[a-z]/i,
        'should have a length of 6~18 digits': /^\w{6,18}$/
    },
    id: {
        'should only contain numbers': /^\d*$/,
        'should begin with non-zero number': /^[1-9]/,
        'should have a length of 8 numbers': /^\d{8}$/
    },
    telephone: {
        'should only contain numbers': /^\d*$/,
        'should begin with non-zero number': /^[1-9]/,
        'should have a length of 11 numbers': /^\d{11}$/
    },
    email: {
        "should only contain alphabet, number, '.', '_', '-' and '@'": /^(\w|\.|-|@)*$/i,
        'should have exactly one @': /^(\w|\.|-)*@(\w|\.|-)*$/i,
        "'@' should surround by alphabets and numbers": /\w@\w/,
        'should begin with alphabet or number': /^[a-z0-9]/i,
        'should end with alphabet': /[a-z]$/i,
        "'-' or '.' should not appear continuously": /^[a-z0-9]([\-\.]?\w+)*@(\w+[\-\.]?)*[a-z]$/i,
        'should have a valid server postfix': /\.[a-z]{2,4}$/i
    }
}

var timer = {};
function delayTillLast(id, fn, wait) {
    if (timer[id]) {
        window.clearTimeout(timer[id]);
        delete timer[id];
    }
    return timer[id] = window.setTimeout(function () {
        fn();
        delete timer[id];
    }, wait);
}

function inputCheck(input) {
    for (var checkCase in checkCases[input.name]) {
        if (!checkCases[input.name][checkCase].test(input.value)) return checkCase;
    }
    $.post('/dataCheck', input.name + '=' + input.value, function (data) {
        if (data) showError(input, data);
    })
    return null;
}

function showError(input, message) {
    var messageBar;
    $(input).removeClass("pass").addClass('error');
    $(input).after(messageBar = $('<div />', {
        class: "error"
    }).text(message).hide());
    messageBar.animate({
        left: 'toggle'
    }, 400)
}

function hideError(input) {
    $(input).removeClass('error');
    $(input).siblings('div.error').animate({
        left: 'toggle'
    }, 200, function () {
        $(this).remove();
    });
}

function check(input) {
    delayTillLast(input.name, function () {
        if (input.value) {
            var info = inputCheck(input);
            if (info) {
                showError(input, info);
            } else {
                $(input).removeClass('error').addClass("pass");
            }
        }
        checkAllValid();
    }, 700);
    hideError(input);
}

function checkAllValid() {
    var flag = true;
    $('.textfield').each(function () {
        if (!$(this).hasClass('pass')) flag = false;
    });
    if (flag) {
        $('#submit').removeAttr("disabled");
    } else {
        $('#submit').attr("disabled", "disabled");
    }
}

window.onload = function () {
    $('.textfield').each(function () {
        var that = this;
        this.oninput = function () {
            check(this);
        };
    });
    $('#reset').click(function () {
        $('input.error').each(function () {
            hideError(this);
        })
        $('.textfield').removeClass("error pass");
    });
}