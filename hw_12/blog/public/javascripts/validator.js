var checkCases = {
    name: {
        'should only contain alphabet, number and underline': function(text) {
            return /^\w*$/.test(text);
        },
        'should begin with alphabet': function(text) {
            return /^[a-z]/i.test(text);
        },
        'should have a length of 6~18 characters': function(text) {
            return /^\w{6,18}$/.test(text);
        }
    },
    pwd: {
        'should only contain alphabet, number, underline and dash': function(text) {
            pwdRecord = text;
            return /^[a-z0-9_\-]*$/i.test(text);
        },
        'should have a length of 6~11 characters': function(text) {
            return /^[a-z0-9\-_]{6,11}$/i.test(text);
        }
    },
    rpwd: {
        'passwords should be the same' : function(text) {
            return text == pwdRecord;
        }
    },
    email: {
        "should only contain alphabet, number, '.', '_', '-' and '@'": function(text) {
            return /^(\w|\.|-|@)*$/i.test(text);
        },
        'should have exactly one @': function(text) {
            return /^(\w|\.|-)*@(\w|\.|-)*$/i.test(text);
        },
        "'@' should surround by alphabets and numbers": function(text) {
            return /\w@\w/.test(text);
        },
        'should begin with alphabet or number': function(text) {
            return /^[a-z0-9]/i.test(text);
        },
        'should end with alphabet': function(text) {
            return /[a-z]$/i.test(text);
        },
        "'-' or '.' should not appear continuously": function(text) {
            return /^[a-z0-9]([\-\.]?\w+)*@(\w+[\-\.]?)*[a-z]$/i.test(text);
        },
        'should have a valsid server postfix': function(text) {
            return /\.[a-z]{2,4}$/i.test(text);
        }
    }
}

var pwdRecord;

var finalCheck = {
    name: function(text) { return /^[a-z]\w{5,17}$/i.test(text); },
    pwd : function(text) { pwdRecord = text; return /^[a-z0-9\-_]{6,11}$/i.test(text); },
    rpwd : function(text) { return text == pwdRecord;},
    email: function(text) { return /^[a-z0-9]([\-_\.]?[a-z0-9]+)*@([a-z0-9_\-]+\.)+[a-zA-Z]{2,4}$/i.test(text); }
}

if (typeof module == 'object') {
    module.exports = {checkCases: checkCases, finalCheck: finalCheck};
}