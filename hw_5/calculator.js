window.onload = function () {
    var resultView = document.getElementById("result-view");
    var expressionView = document.getElementById("expression-view");
    var expressionArr = [];
    var inputNumber = false;
    var brackets = 0;
    resultView.value = "0";

    function refreshExpression() {
        expressionView.value = expressionArr.join(" ");
    }

    document.getElementById("zero").onclick = function () {
        if (parseInt(resultView.value)) {
            resultView.value += "0";
        }
    }

    document.getElementById("one").onclick = function () {
        resultView.value += "1";
    }

    document.getElementById("two").onclick = function () {
        resultView.value += "2";
    }

    document.getElementById("three").onclick = function () {
        resultView.value += "3";
    }

    document.getElementById("four").onclick = function () {
        resultView.value += "4";
    }

    document.getElementById("five").onclick = function () {
        resultView.value += "5";
    }

    document.getElementById("six").onclick = function () {
        resultView.value += "6";
    }

    document.getElementById("seven").onclick = function () {
        resultView.value += "7";
    }

    document.getElementById("eight").onclick = function () {
        resultView.value += "8";
    }

    document.getElementById("nine").onclick = function () {
        resultView.value += "9";
    }

    document.getElementById("left-bracket").onclick = function () {
        if (!inputNumber) {
            expressionArr.push("(")
            refreshExpression();
            ++brackets;
        }
    }

    document.getElementById("right-bracket").onclick = function () {
        if (brackets > 0 && inputNumber) {
            expressionArr.push(resultView.value);
            expressionArr.push(")");
            resultView.value = "0";
            --brackets;
        }
    }

    document.getElementById("backspace").onclick = function () {
        if (resultView.value.length) {
            resultView.value = resultView.value.substr(0, resultView.value.length - 1);
        }
    }
}