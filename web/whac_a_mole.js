initMoles = function() {
    var moleContent = document.getElementById("moles_content");
    for (var i = 0; i < 19 * 27; ++i) {
        var mole = document.createElement("div");
        mole.className = "mole";
        mole.onclick = WrongClick;
        moleContent.appendChild(mole);
    }
}

selectMole = function() {
    var moleContent = document.getElementById("moles_content");
    var select = Math.floor(Math.random() * 19 * 27);
    // console.log(moleContent.childNodes[select]);
    moleContent.childNodes[select].className = "mole_active";
    moleContent.childNodes[select].onclick = function() {
        rightClick();
        selectMole();
        this.onclick = WrongClick;
        this.className = "mole";
    }
}

resetMoles = function() {
    var moleContent = document.getElementById("moles_content");
    var moles = moleContent.childNodes;
    for (var i = 0; i < moles.length; ++i) {
        moles[i].className = "mole";
        moles[i].onclick = WrongClick;
    }
}

window.onload = function() {
    var scoreLable = document.getElementById("score");
    var timeLable = document.getElementById("time");
    var startButton = document.getElementById("start_button");
    var gameBegin = false;
    var time, score;
    var timer, clocker;
    WrongClick = function() {
        if (gameBegin) {
            console.log("wrong click");
            --score;
            refreshScore(score);
        }
    }
    rightClick = function() {
        if (gameBegin) {
            console.log("right click");
            ++score;
            refreshScore(score);
        }
    }
    refreshTime = function(number) {
        timeLable.textContent = "Time:" + number;
    }
    refreshScore = function(number) {
        scoreLable.textContent = "Score:" + number;
    }
    startGame = function() {
        gameBegin = true;
        time = 29;
        score = 0;
        refreshTime(time);
        refreshScore(score);
        selectMole();
        timer = setTimeout(stopGame ,30000);
        clocker = setInterval(updateTime, 1000);
        startButton.removeEventListener("click", startGame);
        startButton.addEventListener("click", stopGame);
    }
    stopGame = function() {
        clearTimeout(timer);
        clearInterval(clocker);
        resetMoles();
        gameBegin = false;
        startButton.addEventListener("click", startGame);
        startButton.removeEventListener("click", stopGame);
    }
    updateTime = function() {
        --time;
        refreshTime(time);
    }
    initMoles();
    startButton.addEventListener("click", startGame);
}