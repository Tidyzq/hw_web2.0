window.onload = function () {
    var scoreLable = document.getElementById("score");
    var timeLable = document.getElementById("time");
    var startButton = document.getElementById("start_button");
    var modeButton = document.getElementById("mode");
    var mainContent = document.getElementById("main_content");
    var body = document.lastChild.lastChild;
    var gameMode = 0;
    var gameBegin = false;
    var time, score;
    var timer, clocker;
    var highSpeedTimer;
    initMoles = function () {
        var moleContent = document.getElementById("moles_content");
        for (var i = 0; i < 18 * 24; ++i) {
            var mole = document.createElement("div");
            mole.className = "mole";
            mole.onclick = WrongClick;
            moleContent.appendChild(mole);
        }
    }
    selectMole = function () {
        var className = (gameMode == 1) ? "color_mole" : "mole";
        var moles = document.getElementsByClassName(className);
        var select = Math.floor(Math.random() * moles.length);
        if (gameMode == 0) {
            moles[select].onclick = function () {
                rightClick();
                this.onclick = WrongClick;
                this.className = "mole";
                selectMole();
            }
            moles[select].className = "mole_active";
        } else if (gameMode == 1) {
            var r = Math.floor(Math.random() * 200) + 20;
            var g = Math.floor(Math.random() * 200) + 20;
            var b = Math.floor(Math.random() * 200) + 20;
            var ar = r + (Math.random() <= 0.5 ? -1 : 1) * Math.floor(Math.random() * 5 + 7);
            var ag = g + (Math.random() <= 0.5 ? -1 : 1) * Math.floor(Math.random() * 5 + 7);
            var ab = b + (Math.random() <= 0.5 ? -1 : 1) * Math.floor(Math.random() * 5 + 7);
            moles[select].onclick = function () {
                rightClick();
                this.onclick = WrongClick;
                this.className = "color_mole";
                selectMole();
            }
            for (var i = 0; i < moles.length; ++i) {
                moles[i].style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";
                moles[i].onmousedown = function () { this.style.backgroundColor = "crimson" };
                moles[i].onmouseout = function () { this.style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")"; };
            }
            moles[select].style.backgroundColor = "rgb(" + ar + ", " + ag + ", " + ab + ")";
            moles[select].onmousedown = function () { this.style.backgroundColor = "rgb(" + (ar + 10) + ", " + (ag + 10) + ", " + (ab + 10) + ")" };
            moles[select].onmouseout = function () { this.style.backgroundColor = "rgb(" + ar + ", " + ag + ", " + ab + ")"; };
            moles[select].className = "color_mole_active";
        } else if (gameMode == 2) {
            moles[select].timeCounter = setTimeout(WrongClick, 3000);
            moles[select].onclick = function () {
                rightClick();
                clearTimeout(this.timeCounter);
                this.timeCounter = undefined;
                this.onclick = WrongClick;
                this.className = "mole";
            }
            moles[select].className = "high_speed_mole";
            highSpeedTimer = setTimeout(function () {
                selectMole();
            }, time * 10 + 200);
        }
    }
    resetMoles = function () {
        var moleContent = document.getElementById("moles_content");
        var className = (gameMode == 1) ? "color_mole" : "mole";
        var moles = moleContent.childNodes;
        for (var i = 1; i < moles.length; ++i) {
            moles[i].style.backgroundColor = "";
            moles[i].onmousedown = function () { };
            moles[i].onmouseout = function () { };
            moles[i].className = className;
            moles[i].onclick = WrongClick;
            if (moles[i].timeCounter) {
                clearTimeout(moles[i].timeCounter);
            }
        }
    }
    WrongClick = function () {
        if (gameBegin) {
            console.log("wrong click");
            --score;
            refreshScore(score);
        }
    }
    rightClick = function () {
        if (gameBegin) {
            console.log("right click");
            ++score;
            refreshScore(score);
        }
    }
    refreshTime = function (number) {
        timeLable.textContent = "Time:" + number;
    }
    refreshScore = function (number) {
        scoreLable.textContent = "Score:" + number;
    }
    showScore = function () {
        mainContent.className = "blur";
        var hoverMessage = document.createElement("div");
        hoverMessage.className = "hover_message";
        hoverMessage.innerHTML = "<p>You Got:<br/>" + score + "<br/>Scores</p>";
        hoverMessage.style.animation = "fade_in 0.1s";
        body.appendChild(hoverMessage);
        setTimeout(function () {
            hoverMessage.onclick = function () {
                mainContent.className = "no_blur";
                hoverMessage.style.animation = "fade_out 0.1s";
                setTimeout(function () {
                    body.removeChild(hoverMessage);
                }, 100);
            }
        }, 1000);
    }
    startGame = function () {
        mainContent.className = "blur";
        gameBegin = true;
        startButton.textContent = "Stop Game";
        time = 29;
        score = 0;
        refreshTime(30);
        refreshScore(score);
        var hoverMessage = document.createElement("div");
        hoverMessage.className = "hover_message";
        var counter = 3;
        hoverMessage.innerHTML = "<p>" + counter + "</p>";
        hoverMessage.style.animation = "fade_in 0.1s";
        body.appendChild(hoverMessage);
        setTimeout(function () {
            setTimeout(function () {
                clearInterval(downClocker);
                mainContent.className = "no_blur";
                hoverMessage.style.animation = "fade_out 0.1s";
                setTimeout(function () {
                    body.removeChild(hoverMessage);
                    selectMole();
                    timer = setTimeout(function () {
                        stopGame();
                        showScore();
                    }, 30000);
                    clocker = setInterval(updateTime, 1000);
                    startButton.removeEventListener("click", startGame);
                    startButton.addEventListener("click", stopGame);
                }, 100);
            }, 3000);
            var downClocker = setInterval(function () {
                --counter;
                hoverMessage.innerHTML = "<p>" + counter + "</p>";
            }, 1000);
        }, 100);
    }
    stopGame = function () {
        clearTimeout(highSpeedTimer);
        clearTimeout(timer);
        clearInterval(clocker);
        resetMoles();
        gameBegin = false;
        startButton.textContent = "Start Game";
        startButton.addEventListener("click", startGame);
        startButton.removeEventListener("click", stopGame);
    }
    updateTime = function () {
        --time;
        refreshTime(time);
    }
    changeGameMode = function () {
        if (!gameBegin) {
            gameMode = (gameMode + 1) % 3;
            switch (gameMode) {
                case 0:
                    body.className = "normal_mode";
                    modeButton.textContent = "Normal Mode";
                    break;
                case 1:
                    body.className = "color_mode";
                    modeButton.textContent = "Color Mode";
                    break;
                case 2:
                    body.className = "high_speed_mode";
                    modeButton.textContent = "High Speed";
                    break;
            }
            resetMoles();
        }
    }
    initMoles();
    startButton.addEventListener("click", startGame);
    modeButton.onclick = changeGameMode;
}