var puzzle = {
    matrix: new Array(),
    randomTimes: 150,
    gameStart: false,
    ableToClick: true,
    gameTime: 0,
    gameTimer: 0,
    gameMoves: 0,
    clearTime: function () {
        puzzle.gameTime = 0;
        document.getElementById("time_counter").textContent = "Time: 0";
    },
    clearMoves: function () {
        puzzle.gameMoves = 0;
        document.getElementById("moves_counter").textContent = "Moves: 0";
    },
    addMove: function () {
        ++puzzle.gameMoves;
        document.getElementById("moves_counter").textContent = "Moves: " + puzzle.gameMoves;
    },
    startGame: function () {
        puzzle.gameStart = true;
        puzzle.clearTime();
        puzzle.clearMoves();
        puzzle.ableToClick = true;
        puzzle.gameTimer = setInterval(function () {
            puzzle.gameTime += 1;
            document.getElementById("time_counter").textContent = "Time: " + Math.floor(puzzle.gameTime);
        }, 1000);
    },
    winGame: function () {
        puzzle.gameStart = false;
        puzzle.ableToClick = true;
        clearInterval(puzzle.gameTimer);
        var hoverMessage = document.createElement("div");
        hoverMessage.id = "hover_message";
        hoverMessage.innerHTML = "<div>You Win!<br/>You used " + puzzle.gameTime + " seconds<br/>with " + puzzle.gameMoves + " moves</div>";
        document.getElementById("main_content").className = "blur";
        hoverMessage.onclick = function () {
            document.getElementById("main_content").className = "no_blur";
            document.body.removeChild(document.getElementById("hover_message"));
        }
        document.body.appendChild(hoverMessage);
    },
    stopGame: function () {
        puzzle.gameStart = false;
        puzzle.ableToClick = true;
        clearInterval(puzzle.gameTimer);
    }
}
var dx = [-1, 0, 1, 0];
var dy = [0, -1, 0, 1];
var fac = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000];

var initPuzzle = function () {
    var puzzleContent = document.getElementById("puzzle_content");
    puzzle.matrix[0] = 0; // set the first block to be empty
    for (var i = 1; i < 16; ++i) {
        var newBlock = document.createElement("canvas");
        newBlock.className = "puzzle_block";
        newBlock.id = i;
        newBlock.position = i;
        // 改变dom位置
        newBlock.updatePosition = function () {
            this.style.left = (80 * (this.position % 4)) + "px";
            this.style.top = (80 * Math.floor(this.position / 4)) + "px";
        }
        // moveToPosition 将本滑块与对应位置滑块交换
        newBlock.moveToPosition = function (newPosition) {
            if (puzzle.matrix[newPosition] != "0") {
                var otherBlock = document.getElementById(puzzle.matrix[newPosition]);
                otherBlock.position = this.position;
                otherBlock.updatePosition();
            }
            puzzle.matrix[this.position] = puzzle.matrix[newPosition];
            puzzle.matrix[newPosition] = parseInt(this.id);
            this.position = newPosition;
            this.updatePosition();
        }
        newBlock.updatePosition();
        newBlock.onclick = function (event) {
            if (puzzle.ableToClick) {
                for (var i = 0; i < 4; ++i) {
                    var x = this.position % 4 + dx[i], y = Math.floor(this.position / 4) + dy[i];
                    var j = x + 4 * y;
                    if (x >= 0 && x < 4 && y >= 0 && y < 4 && puzzle.matrix[j] == '0') {
                        if (puzzle.gameStart) {
                            puzzle.addMove();
                        }
                        this.moveToPosition(j);
                        if (puzzle.gameStart && contor(puzzle.matrix) == 0) puzzle.winGame();
                        event.stopPropagation(); // 停止冒泡
                        break;
                    }
                }
            }
        }
        puzzle.matrix[i] = i;
        puzzleContent.appendChild(newBlock);
    }
}

drawPuzzle = function (imageName) {
    var image = new Image();
    image.src = imageName;
    image.onload = function () {
        for (var i = 1; i < 16; ++i) {
            var canvas = document.getElementById(i);
            canvas.getContext("2d").drawImage(image, (image.width / 4) * (i % 4), (image.height / 4) * Math.floor(i / 4), image.width / 4, image.height / 4, 0, 0, canvas.width, canvas.height);
        }
    }
    image.onload();
}

var breakPuzzle = function () {
    if (puzzle.ableToClick) {
        puzzle.stopGame();
        puzzle.ableToClick = false;
        var zero = puzzle.matrix.indexOf(0);
        (function randomMove(cur, pre, times) {
            if (times < puzzle.randomTimes) {
                var possiblePostion = new Array();
                for (var i = 0; i < 4; ++i) {
                    var x = cur % 4 + dx[i], y = Math.floor(cur / 4) + dy[i];
                    var pos = x + 4 * y;
                    if (x >= 0 && x < 4 && y >= 0 && y < 4) possiblePostion.push(pos);
                }
                var find = possiblePostion.indexOf(pre);
                if (find != -1) {
                    possiblePostion.splice(find, 1);
                }
                var pos = possiblePostion[Math.floor(Math.random() * possiblePostion.length)]
                document.getElementById(puzzle.matrix[pos]).moveToPosition(cur);
                setTimeout(function () {
                    randomMove(pos, cur, times + 1);
                }, 10);
            } else {
                puzzle.startGame();
            }
        })(zero, zero, 0);
    }
}

// 康拓展开压缩状态
contor = function (array) {
    var rst = 0, t = 0;
    for (var i = 0; i < array.length; ++i) {
        t = 0;
        for (var j = i + 1; j < array.length; ++j) {
            if (array[j] < array[i])++t;
        }
        rst += t * fac[array.length - i - 1];
    }
    return rst;
}

solvePuzzle = function () {
    if (puzzle.ableToClick) {
        puzzle.stopGame();
        puzzle.ableToClick = false;
        var hoverMessage = document.createElement("div");
        hoverMessage.id = "hover_message";
        hoverMessage.innerHTML = "<div><div class=\"loading_icon\"></div>Solving...</div>";
        document.getElementById("main_content").className = "blur";
        document.body.appendChild(hoverMessage);
        // 搜索状态
        statu = function (matrix, step, depth, zeroIndex) {
            this.matrix = matrix;
            this.step = step;
            this.depth = depth;
            this.zeroIndex = zeroIndex;
        }
        // A*启发函数
        value = function (statu) {
            var rst = 0;
            for (var x = 0; x < 4; ++x) {
                for (var y = 0; y < 4; ++y) {
                    var pos = statu.matrix[x + 4 * y];
                    // 到目标位置的曼哈顿距离
                    rst += Math.abs((pos % 4) - x) + Math.abs(Math.floor(pos / 4) - y);
                }
            }
            return -statu.depth - 4 * rst; // 曼哈顿距离乘上一定系数来改善启发函数
        }
        var sta = new statu(puzzle.matrix, new Array(), 0, puzzle.matrix.indexOf(0)); // 初始状态
        // A* 寻路
        setTimeout(function () {
            var close = new Set();
            var open = new PriorityQueue();
            open.insert(value(sta), sta);
            close.add(contor(sta.matrix));
            while (!open.empty()) {
                var curStatu = open.pop();
                var cur = curStatu.entry;
                if (contor(cur.matrix) == 0) { // 如果找到解法
                    console.log("search times: " + close.size, "solution steps: " + cur.depth);
                    document.getElementById("main_content").className = "no_blur";
                    document.body.removeChild(document.getElementById("hover_message"));
                    // 根据寻路结果操作
                    var j = puzzle.matrix.indexOf(0);
                    (function solveMove(i) {
                        if (i < cur.step.length) {
                            document.getElementById(puzzle.matrix[cur.step[i]]).moveToPosition(j);
                            j = cur.step[i];
                            setTimeout(function () {
                                solveMove(i + 1);
                            }, 80);
                        } else {
                            puzzle.ableToClick = true;
                        }
                    })(0);
                    return;
                }
                var index = cur.zeroIndex;
                for (var i = 0; i < 4; ++i) {
                    var x = index % 4 + dx[i], y = Math.floor(index / 4) + dy[i];
                    var nindex = x + 4 * y;
                    if (x >= 0 && x < 4 && y >= 0 && y < 4) {
                        var matrix = cur.matrix.slice(0);
                        var temp = matrix[index];
                        matrix[index] = matrix[nindex];
                        matrix[nindex] = temp;
                        var contorNumber = contor(matrix);
                        if (!close.has(contorNumber)) {
                            var step = cur.step.slice(0); // 复制step
                            step.push(nindex);
                            var nstatu = new statu(matrix, step, cur.depth + 1, nindex);
                            open.insert(value(nstatu), nstatu);
                            close.add(contorNumber);
                        }
                    }
                }
            }
        });
    }
}

handleFileSelect = function (event) {
    event.stopPropagation();
    event.preventDefault();
    var files = event.dataTransfer.files;
    if (files.length && files[0].type.indexOf("image") != -1) {
        var img = window.URL.createObjectURL(files[0]);
        drawPuzzle(img);
    }
}

handleDragOver = function (event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}

window.onload = function () {
    document.getElementById("break").onclick = breakPuzzle;
    document.getElementById("solve").onclick = solvePuzzle;
    var puzzleContent = document.getElementById("puzzle_content");
    var dropZone = document.getElementById("drop_zone");
    puzzleContent.addEventListener("dragover", handleDragOver, false);
    puzzleContent.addEventListener("drop", handleFileSelect, false);
    dropZone.addEventListener("dragover", handleDragOver, false);
    dropZone.addEventListener("drop", handleFileSelect, false);
    initPuzzle();
    drawPuzzle("images/panda.jpg");
}