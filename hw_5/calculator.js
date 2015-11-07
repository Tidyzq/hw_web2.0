window.onload = function () {

    var resultView = document.getElementById("result-view");
    var expressionView = document.getElementById("expression-view");
    var expressionArr = [];
    var inputNumber = false; // whether the user just inputed number
    var showSubResult = false; // whether the resultView is showing a sub-result
    var showResult = false; // whether the resultView is showing a result
    var leftBracket = false; // whether the user just inputed a left bracket
    var rightBracket = false; // whether the user just inputed a right bracket
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

    function refreshExpression() {
        expressionView.value = expressionArr.join(" ");
        // expressionView.style.fontSize = Math.min(16, 800 / expressionView.value.length) + "px";
    }

    function refreshResult(str) {
        resultView.value = str;
        resultView.style.fontSize = Math.min(60, 630 / resultView.value.length) + "px";
    }

    function resultAdd(str) {
        // if the number is over 39 digits then stop adding
        if (resultView.value.length < 39)
            refreshResult(resultView.value + str);
    }

    // clear resultView
    function clearResult() {
        refreshResult("0");
        showSubResult = false;
        showResult = false;
    }

    function addNumber() {
        var str = resultView.value;
        if (str.indexOf(".", 0) == str.length - 1) {
            str = str.substr(0, str.length - 1);
            refreshResult(str);
        }
        expressionArr.push(str);
        showSubResult = true;
    }

    // clear all
    function clear() {
        clearResult();
        expressionArr = [];
        expressionView.value = "";
        brackets = 0;
        inputNumber = false;
        showSubResult = false;
        showResult = false;
        leftBracket = false;
        rightBracket = false;
    }

    document.getElementById("zero").onclick = function () {
        // if just inputed right bracket, then add a *
        if (rightBracket) {
            expressionArr.push("*");
            rightBracket = false;
        }
        // if the resultView is showing result, then clear the resultView
        if (!showResult && !showSubResult && resultView.value != "0") {
            resultAdd("0")
        } else {
            clearResult();
        }
        inputNumber = true;
        leftBracket = false;
    };

    for (var key in numberMap) {
        document.getElementById(key).onclick = function () {
            // if just inputed right bracket, then add a *
            if (rightBracket) {
                expressionArr.push("*");
                rightBracket = false;
            }
            // if the number in resultView is 0, then replace it with 1, otherwise add 1 in the back
            if (resultView.value != "0" && !showResult && !showSubResult) {
                resultAdd(numberMap[this.id]);
            } else {
                refreshResult(numberMap[this.id]);
            }
            inputNumber = true;
            showSubResult = false;
            showResult = false;
            leftBracket = false;
        }
    }

    document.getElementById("left-bracket").onclick = function () {
        // if justed inputed number, then add a (
        if (rightBracket) {
            expressionArr.push("*");
            rightBracket = false;
        }
        expressionArr.push("(")
        refreshExpression();
        ++brackets;
        leftBracket = true;
    };

    document.getElementById("right-bracket").onclick = function () {
        if (brackets > 0 && (showSubResult || showResult || inputNumber)) {
            if (!rightBracket) {
                addNumber();
            }
            expressionArr.push(")");
            refreshExpression();
            --brackets;
            inputNumber = true;
            showSubResult = true;
            showResult = false;
            rightBracket = true;
        }
    }

    document.getElementById("backspace").onclick = function onBackSpace() {
        if (!showSubResult && !showResult && resultView.value.length > 1) {
            resultView.value = resultView.value.substr(0, resultView.value.length - 1);
        } else {
            clearResult();
        }
    };

    document.getElementById("point").onclick = function () {
        if (rightBracket) {
            expressionArr.push("*");
            rightBracket = false;
        }
        if (showSubResult || showResult) {
            clearResult();
        }
        if (resultView.value.indexOf(".", 0) == -1) {
            resultView.value += ".";
            inputNumber = true;
        }
    };

    document.getElementById("clear-entry").onclick = function () {
        clear();
    };

    for (var key in operationMap) {
        document.getElementById(key).onclick = function () {
            if (inputNumber || showResult) {
                if (!rightBracket) {
                    addNumber();
                }
                expressionArr.push(operationMap[this.id]);
                refreshExpression();
                inputNumber = false;
                showSubResult = true;
                showResult = false;
                leftBracket = false;
                rightBracket = false;
            } else if (!rightBracket && !leftBracket && expressionArr.length) {
                expressionArr.pop();
                expressionArr.push(operationMap[this.id]);
                refreshExpression();
            }
        }
    }

    document.getElementById("equal").onclick = function () {
        if (inputNumber) {
            if (!rightBracket) {
                addNumber();
            }
            while (brackets) {
                expressionArr.push(")");
                --brackets;
            }
            // sync check
            try {
                var result = eval(expressionArr.join(""));
                clear();
                refreshResult(result);
                showResult = true;
            }
            catch (exception) {
                alert(exception);
                clear();
            }
        }
    };
}