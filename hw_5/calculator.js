window.onload = function () {

    var resultView = document.getElementById("result-view");
    var expressionView = document.getElementById("expression-view");
    var expressionArr = [];
    var inputNumber = false; // whether the user just inputed number
    var showResult = false; // whether the resultView is showing a result
	var rightBracket = false; // whether the user just inputed a right bracket
    var brackets = 0; // count the number of unmatched left brackets
    
    var numberMap = {
        "one":"1",
        "two":"2",
        "three":"3",
        "four":"4",
        "five":"5",
        "six":"6",
        "seven":"7",
        "eight":"8",
        "nine":"9"
    };
    
    var operationMap = {
        "divide":"/",
        "multy":"*",
        "add":"+",
        "minus":"-"
    };
	
	// disable selection when double clicked
    document.onselectstart = function () { return false; }
	
	// init calculator
	clearResult();
    
    function refreshExpression() {
        expressionView.value = expressionArr.join(" ");
	}

    // clear resultView
    function clearResult() {
        resultView.value = "0";
        showResult = false;
	}

    // clear all
    function clear() {
        clearResult();
        expressionArr = [];
        expressionView.value = "";
        brackets = 0;
        inputNumber = false;
        showResult = false;
		rightBracket = false;
    }

    document.getElementById("zero").onclick = function () {
        // if just inputed right bracket, then add a *
		if (rightBracket) {
			expressionArr.push("*");
			rightBracket = false;
		}
        // if the resultView is showing result, then clear the resultView
        if (!showResult) {
            if (resultView.value != "0") {
                resultView.value += "0";
            }
        } else {
            clearResult();
        }
        inputNumber = true;
	};
    
    var numbers = document.getElementsByClassName("none-zero-number");
    for (var i = 0; i < numbers.length; ++i) {
        numbers[i].onclick = function () {
            if (rightBracket) {
                expressionArr.push("*");
                rightBracket = false;
            }
            // if the number in resultView is 0, then replace it with 1, otherwise add 1 in the back
            // if just inputed right bracket,
            if (resultView.value != "0" && !showResult) {
                resultView.value += numberMap[numbers[i].id];
            } else {
                resultView.value = numberMap[numbers[i].id];
            }
            inputNumber = true;
            showResult = false;
        }
    }
/*
    document.getElementById("one").onclick = function () {
		if (rightBracket) {
			expressionArr.push("*");
			rightBracket = false;
		}
        // if the number in resultView is 0, then replace it with 1, otherwise add 1 in the back
        // if just inputed right bracket, 
        if (resultView.value != "0" && !showResult) {
            resultView.value += "1";
        } else {
            resultView.value = "1";
        }
        inputNumber = true;
        showResult = false;
	};

    document.getElementById("two").onclick = function () {
		if (rightBracket) {
			expressionArr.push("*");
			rightBracket = false;
		}
        if (resultView.value != "0" && !showResult) {
            resultView.value += "2";
        } else {
            resultView.value = "2";
        }
        inputNumber = true;
        showResult = false;
	};

    document.getElementById("three").onclick = function () {
		if (rightBracket) {
			expressionArr.push("*");
			rightBracket = false;
		}
        if (resultView.value != "0" && !showResult) {
            resultView.value += "3";
        } else {
            resultView.value = "3";
        }
        inputNumber = true;
        showResult = false;
	};

    document.getElementById("four").onclick = function () {
		if (rightBracket) {
			expressionArr.push("*");
			rightBracket = false;
		}
        if (resultView.value != "0" && !showResult) {
            resultView.value += "4";
        } else {
            resultView.value = "4";
        }
        inputNumber = true;
        showResult = false;
	};

    document.getElementById("five").onclick = function () {
		if (rightBracket) {
			expressionArr.push("*");
			rightBracket = false;
		}
        if (resultView.value != "0" && !showResult) {
            resultView.value += "5";
        } else {
            resultView.value = "5";
        }
        inputNumber = true;
        showResult = false;
	};

    document.getElementById("six").onclick = function () {
		if (rightBracket) {
			expressionArr.push("*");
			rightBracket = false;
		}
        if (resultView.value != "0" && !showResult) {
            resultView.value += "6";
        } else {
            resultView.value = "6";
        }
        inputNumber = true;
        showResult = false;
	};

    document.getElementById("seven").onclick = function () {
		if (rightBracket) {
			expressionArr.push("*");
			rightBracket = false;
		}
        if (resultView.value != "0" && !showResult) {
            resultView.value += "7";
        } else {
            resultView.value = "7";
        }
        inputNumber = true;
        showResult = false;
	};

    document.getElementById("eight").onclick = function () {
		if (rightBracket) {
			expressionArr.push("*");
			rightBracket = false;
		}
        if (resultView.value != "0" && !showResult) {
            resultView.value += "8";
        } else {
            resultView.value = "8";
        }
        inputNumber = true;
        showResult = false;
	};

    document.getElementById("nine").onclick = function () {
		if (rightBracket) {
			expressionArr.push("*");
			rightBracket = false;
		}
        if (resultView.value != "0" && !showResult) {
            resultView.value += "9";
        } else {
            resultView.value = "9";
        }
        inputNumber = true;
        showResult = false;
	};
*/
    document.getElementById("left-bracket").onclick = function () {
        // if justed inputed number, then add a (
        if (!inputNumber) {
            expressionArr.push("(")
            refreshExpression();
            ++brackets;
        }
	};

    document.getElementById("right-bracket").onclick = function () {
        if (brackets > 0 && (showResult || inputNumber)) {
            expressionArr.push(resultView.value);
            expressionArr.push(")");
            refreshExpression();
            clearResult();
            --brackets;
			rightBracket = true;
        }
    }

    document.getElementById("backspace").onclick = function () {
        if (!showResult && resultView.value.length > 1) {
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
        if (!showResult && resultView.value.indexOf(".", 0) == -1) {
            resultView.value += ".";
        }
	};

    document.getElementById("clear-entry").onclick = function () {
        clear();
	};

    document.getElementById("divide").onclick = function () {
        if (!inputNumber && !showResult) {
            if (expressionArr.length) {
                expressionArr.pop();
                expressionArr.push("/");
                refreshExpression();
            }
        } else {
            if (!rightBracket) {
                expressionArr.push(resultView.value);
                clearResult();
            }
            expressionArr.push("/");
        }
        refreshExpression();
        inputNumber = false;
		rightBracket = false;
	};

    document.getElementById("multy").onclick = function () {
        if (!inputNumber && !showResult) {
            if (expressionArr.length) {
                expressionArr.pop();
                expressionArr.push("*");
                refreshExpression();
            }
        } else {
            if (!rightBracket) {
                expressionArr.push(resultView.value);
                clearResult();
            }
            expressionArr.push("*");
        }
        refreshExpression();
        inputNumber = false;
		rightBracket = false;
	};

    document.getElementById("add").onclick = function () {
        if (!inputNumber && !showResult) {
            if (expressionArr.length) {
                expressionArr.pop();
                expressionArr.push("+");
                refreshExpression();
            }
        } else {
            if (!rightBracket) {
                expressionArr.push(resultView.value);
                clearResult();
            }
            expressionArr.push("+");
        }
        refreshExpression();
        inputNumber = false;
		rightBracket = false;
	};

    document.getElementById("minus").onclick = function () {
        if (!inputNumber && !showResult) {
            if (expressionArr.length) {
                expressionArr.pop();
                expressionArr.push("-");
                refreshExpression();
            }
        } else {
            if (!rightBracket) {
                expressionArr.push(resultView.value);
                clearResult();
            }
            expressionArr.push("-");
        }
        refreshExpression();
        inputNumber = false;
        rightBracket = false;
	};

    document.getElementById("equal").onclick = function () {
        if (!showResult) {
            if (inputNumber && !rightBracket) {
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
	};
}