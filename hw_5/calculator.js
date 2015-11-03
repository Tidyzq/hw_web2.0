window.onload = function () {
    var resultView = document.getElementById("result-view");
    var expressionView = document.getElementById("expression-view");
    var expressionArr = [];
    var inputNumber = false;
    var showResult = false;
    var brackets = 0;
    resultView.value = "0";

    document.onselectstart = function () { return false; }

    function refreshExpression() {
        expressionView.value = expressionArr.join(" ");
    }

    function clearResult() {
        resultView.value = "0";
        showResult = false;
    }

    function clear() {
        clearResult();
        expressionArr = [];
        expressionView.value = "";
        brackets = 0;
        inputNumber = false;
        showResult = false;
    }

    document.getElementById("zero").onclick = function () {
        if (!showResult) {
            if (resultView.value != "0") {
                resultView.value += "0";
            }
        } else {
            clearResult();
        }
        inputNumber = true;
    }

    document.getElementById("one").onclick = function () {
        if (resultView.value != "0" && !showResult) {
            resultView.value += "1";
        } else {
            resultView.value = "1";
        }
        inputNumber = true;
        showResult = false;
    }

    document.getElementById("two").onclick = function () {
        if (resultView.value != "0" && !showResult) {
            resultView.value += "2";
        } else {
            resultView.value = "2";
        }
        inputNumber = true;
        showResult = false;
    }

    document.getElementById("three").onclick = function () {
        if (resultView.value != "0" && !showResult) {
            resultView.value += "3";
        } else {
            resultView.value = "3";
        }
        inputNumber = true;
        showResult = false;
    }

    document.getElementById("four").onclick = function () {
        if (resultView.value != "0" && !showResult) {
            resultView.value += "4";
        } else {
            resultView.value = "4";
        }
        inputNumber = true;
        showResult = false;
    }

    document.getElementById("five").onclick = function () {
        if (resultView.value != "0" && !showResult) {
            resultView.value += "5";
        } else {
            resultView.value = "5";
        }
        inputNumber = true;
        showResult = false;
    }

    document.getElementById("six").onclick = function () {
        if (resultView.value != "0" && !showResult) {
            resultView.value += "6";
        } else {
            resultView.value = "6";
        }
        inputNumber = true;
        showResult = false;
    }

    document.getElementById("seven").onclick = function () {
        if (resultView.value != "0" && !showResult) {
            resultView.value += "7";
        } else {
            resultView.value = "7";
        }
        inputNumber = true;
        showResult = false;
    }

    document.getElementById("eight").onclick = function () {
        if (resultView.value != "0" && !showResult) {
            resultView.value += "8";
        } else {
            resultView.value = "8";
        }
        inputNumber = true;
        showResult = false;
    }

    document.getElementById("nine").onclick = function () {
        if (resultView.value != "0" && !showResult) {
            resultView.value += "9";
        } else {
            resultView.value = "9";
        }
        inputNumber = true;
        showResult = false;
    }

    document.getElementById("left-bracket").onclick = function () {
        if (!inputNumber) {
            expressionArr.push("(")
            refreshExpression();
            ++brackets;
        }
    }

    document.getElementById("right-bracket").onclick = function () {
        if (brackets > 0 && (showResult || inputNumber)) {
            expressionArr.push(resultView.value);
            expressionArr.push(")");
            refreshExpression();
            clearResult();
            --brackets;
        }
    }

    document.getElementById("backspace").onclick = function () {
        if (!showResul && resultView.value.length > 1) {
            resultView.value = resultView.value.substr(0, resultView.value.length - 1);
        } else {
            clearResult();
        }
    }

    document.getElementById("point").onclick = function () {
        if (!showResul && resultView.value.indexOf(".", 0) == -1) {
            resultView.value += ".";
        }
    }

    document.getElementById("clear-entry").onclick = function () {
        clear();
    }

    document.getElementById("divide").onclick = function () {
        if (!inputNumber && !showResult) {
            if (expressionArr.length) {
                expressionArr.pop();
                expressionArr.push("/");
                refreshExpression();
            }
        } else {
            expressionArr.push(resultView.value);
            clearResult();
            expressionArr.push("/");
        }
        refreshExpression();
        inputNumber = false;
    }

    document.getElementById("multy").onclick = function () {
        if (!inputNumber && !showResult) {
            if (expressionArr.length) {
                expressionArr.pop();
                expressionArr.push("*");
                refreshExpression();
            }
        } else {
            expressionArr.push(resultView.value);
            clearResult();
            expressionArr.push("*");
        }
        refreshExpression();
        inputNumber = false;
    }

    document.getElementById("add").onclick = function () {
        if (!inputNumber && !showResult) {
            if (expressionArr.length) {
                expressionArr.pop();
                expressionArr.push("+");
                refreshExpression();
            }
        } else {
            expressionArr.push(resultView.value);
            clearResult();
            expressionArr.push("+");
        }
        refreshExpression();
        inputNumber = false;

    }

    document.getElementById("minus").onclick = function () {
        if (!inputNumber && !showResult) {
            if (expressionArr.length) {
                expressionArr.pop();
                expressionArr.push("-");
                refreshExpression();
            }
        } else {
            expressionArr.push(resultView.value);
            clearResult();
            expressionArr.push("-");
        }
        refreshExpression();
        inputNumber = false;
        showResult = false;
    }

    document.getElementById("equal").onclick = function () {
        if (!showResult) {
            if (inputNumber) {
                expressionArr.push(resultView.value);
            }
            while (brackets) {
                expressionArr.push(")");
                --brackets;
            }
            var result = eval(expressionArr.join(""));
            clear();
            resultView.value = result;
            showResult = true;
        }
    }
}