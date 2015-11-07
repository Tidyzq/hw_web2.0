window.onload = function () {

    var resultView = document.getElementById("result-view");
    var expressionView = document.getElementById("expression-view");
    var expressionArr = [];
    var resultArr = [];
    var inputNumber = false;
    var showSubResult = false; // whether the resultView is showing a sub-result
    var showResult = false; // whether the resultView is showing a result
    var brackets = 0; // count the number of unmatched left brackets

    var numberMap = {
        "one": "1",
        "two": "2",
        "three": "3",
        "four": "4",
        "five": "5",
        "six": "6",
        "seven": "7",
        "eight": "8",
        "nine": "9"
    };

    var operationMap = {
        "divide": "/",
        "multy": "*",
        "add": "+",
        "minus": "-"
    };

    // disable selection when double clicked
    // document.onselectstart = function () { return false; }

    // init calculator
    clearResult();

    var expressionType = {
        none: -1, number: 0, operation: 1, leftBracket: 2, rightBracket: 3, negative: 4
    }

    function lastExpression() {
        if (expressionArr.length) {
            return expressionArr[expressionArr.length - 1];
        }
        return "";
    }

    function preLastExpression() {
        if (expressionArr.length > 1) {
            return expressionArr[expressionArr.length - 2];
        }
        return "";
    }

    function replaceLastExpression(expression) {
        if (expressionArr.length) {
            expressionArr[expressionArr.length - 1] = expression;
        }
    }

    function getExpressionType(expression, preExpression) {
        var re = new RegExp("[0-9.]{1,}");
        if (re.test(expression)) return expressionType.number;
        switch (expression) {
            case "+": case "*": case "/":
                return expressionType.operation;
                break;
            case "-":
                var preType = getExpressionType(preExpression, "");
                if (preType == expressionType.none || preType == expressionType.operation
                    || preType == expressionType.rightBracket) {
                    return expressionType.negative;
                } else {
                    return expressionType.operation;
                }
                break;
            case "(":
                return expressionType.leftBracket;
                break;
            case ")":
                return expressionType.rightBracket;
        }
        return expressionType.none;
    }

    function refreshExpression() {
        expressionView.value = expressionArr.join(" ");
        // expressionView.style.fontSize = Math.min(16, 800 / expressionView.value.length) + "px";
    }

    function addExpression(add) {
        var addType = getExpressionType(add, lastExpression());
        var lastType = getExpressionType(lastExpression(), preLastExpression());
        switch (addType) {
            case expressionType.number: {
                if (lastType == expressionType.rightBracket) {
                    expressionArr.push("*");
                    resultArr.push("*");
                }
                expressionArr.push(add);
                resultArr.push(add);
                break;
            }
            case expressionType.operation: {
                switch (lastType) {
                    case expressionType.number: case expressionType.rightBracket: {
                        expressionArr.push(add);
                        resultArr.push(add);
                        break;
                    }
                    case expressionType.operation: {
                        replaceLastExpression(add);
                        resultArr[resultArr.length - 1] = add;
                        break;
                    }
                }
                break;
            }
            case expressionType.leftBracket: {
                switch (lastType) {
                    case expressionType.number: case expressionType.rightBracket: {
                        expressionArr.push("*");
                        resultArr.push("*");
                        break;
                    }
                }
                expressionArr.push(add);
                resultArr.push(add);
                ++brackets;
                break;
            }
            case expressionType.rightBracket: {
                if (brackets) {
                    switch (lastType) {
                        case expressionType.number: case expressionType.rightBracket: {
                            expressionArr.push(add);
                            resultArr.push(add);
                            --brackets;
                            calSubResult();
                            resultView.value = resultArr[resultArr.length - 1];
                            showSubResult = true;
                        }
                    }
                }
                break;
            }
            case expressionType.negative: {
                expressionArr.push(add);
                resultArr.push(add);
                break;
            }
        }
        refreshExpression();
    }

    function refreshResult(str) {
        resultView.value = str;
        resultView.style.fontSize = Math.min(60, 630 / resultView.value.length) + "px";
        showSubResult = false;
        showResult = false;
        inputNumber = true;
    }

    function resultAdd(str) {
        // if the number is over 39 digits then stop adding
        if (resultView.value.length < 39)
            refreshResult(resultView.value + str);
    }

    // clear resultView
    function clearResult() {
        refreshResult("0");
        inputNumber = false;
        showSubResult = false;
        showResult = false;
    }

    function calSubResult() {
        for (var i = 0; i < resultArr.length; ++i) {
            if (getExpressionType(resultArr[i], i ? resultArr[i - 1] : "") == expressionType.negative
                && getExpressionType(resultArr[i + 1], "") == expressionType.number) {
                var number = -eval(resultArr[i + 1])
                resultArr = resultArr.slice(0, i);
                resultArr.push(number);
            }
        }
        if (resultArr.length && resultArr[resultArr.length - 1] == ")") {
            var i = resultArr.lastIndexOf("(");
            var sub = resultArr.slice(i, resultArr.length);
            resultArr = resultArr.slice(0, i);
            resultArr.push(eval(eval(sub.join("")).toFixed(8)));
            calSubResult();
        } else {
            var flag = false;
            for (var i = 0; i < resultArr.length; ++i) {
                if (resultArr[i] == "*" || resultArr[i] == "/") {
                    if (getExpressionType(resultArr[i - 1], "") == expressionType.number
                        && getExpressionType(resultArr[i + 1], "") == expressionType.number) {
                        var sub = resultArr.slice(i - 1, resultArr.length);
                        resultArr = resultArr.slice(0, i - 1);
                        resultArr.push(eval(eval(sub.join("")).toFixed(8)));
                        flag = true;
                    }
                }
            }
            if (flag) calSubResult();
            console.log("resultArr:" + resultArr.join(""), 0);
        }
    }

    function addNumber() {
        var str = resultView.value;
        var i = str.length - 1;
        while (i > 0 && (str[i] == "." || str[i] == "0")) {
            --i;
        }
        str = str.substring(0, i + 1);
        addExpression(str);
        calSubResult();
        resultView.value = resultArr[resultArr.length - 1];
        showSubResult = true;
        inputNumber = false;
    }

    // clear all
    function clear() {
        clearResult();
        expressionArr = [];
        resultArr = [];
        expressionView.value = "";
        brackets = 0;
        showSubResult = false;
        showResult = false;
    }

    function clickZero() {
        if (!showResult && !showSubResult && resultView.value != "0") {
            resultAdd("0")
        } else {
            refreshResult("0");
        }
    };
    document.getElementById("zero").onclick = clickZero;

    for (var key in numberMap) {
        document.getElementById(key).onclick = function () {
            // if the number in resultView is 0, then replace it with 1, otherwise add 1 in the back
            if (resultView.value != "0" && !showResult && !showSubResult) {
                resultAdd(numberMap[this.id]);
            } else {
                refreshResult(numberMap[this.id]);
            }
        }
    }

    function clickLeftBracket() {
        addExpression("(");
    };
    document.getElementById("left-bracket").onclick = clickLeftBracket;

    function clickRightBracket() {
        if (inputNumber) {
            addNumber();
        }
        addExpression(")");
    }
    document.getElementById("right-bracket").onclick = clickRightBracket;

    function clickBackSpace() {
        if (!showSubResult && !showResult && resultView.value.length > 1) {
            refreshResult(resultView.value.substr(0, resultView.value.length - 1));
        } else {
            clearResult();
        }
    };
    document.getElementById("backspace").onclick = clickBackSpace;

    function clickdot() {
        if (showSubResult || showResult) {
            clearResult();
        }
        if (resultView.value.indexOf(".", 0) == -1) {
            resultAdd(".");
        }
    };
    document.getElementById("dot").onclick = clickdot;

    function clickClearEntry() {
        clear();
    };
    document.getElementById("clear-entry").onclick = clickClearEntry;

    for (var key in operationMap) {
        document.getElementById(key).onclick = function () {
            if (inputNumber || showResult) {
                addNumber();
            }
            addExpression(operationMap[this.id]);
            inputNumber = false;
        }
    }

    function clickEqual() {
        if (inputNumber) {
            addNumber();
        }
        var lastType = getExpressionType(lastExpression(), preLastExpression());
        if (lastType == expressionType.number || lastType == expressionType.rightBracket) {
            while (brackets) {
                resultArr.push(")");
                calSubResult();
                --brackets;
            }
            // sync check
            try {
                var result = eval(resultArr.join(""));
                clear();
                refreshResult(eval(result.toFixed(8)));
                showResult = true;
            }
            catch (exception) {
                alert(exception);
                clear();
            }
        }
    };
    document.getElementById("equal").onclick = clickEqual;
}