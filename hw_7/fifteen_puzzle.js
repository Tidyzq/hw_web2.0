var puzzle = {
    matrix: new Array(),
    blocks: new Array(),
    randomTimes: 100,
    randomDelay: 10,
    solveDelay: 50,
    gameStart: false,
    ableToClick: true,
    gameTime: 0,
    gameTimer: 0,
    gameMoves: 0,
    clearTime: function () {
        puzzle.gameTime = 0;
        $("#time_counter").html("Time: 0");
    },
    clearMoves: function () {
        puzzle.gameMoves = 0;
        $("#moves_counter").html("Moves: 0");
    },
    addMove: function () {
        ++puzzle.gameMoves;
        $("#moves_counter").html("Moves: " + puzzle.gameMoves);
    },
    startGame: function () {
        puzzle.gameStart = true;
        puzzle.clearTime();
        puzzle.clearMoves();
        puzzle.ableToClick = true;
        puzzle.gameTimer = setInterval(function () {
            puzzle.gameTime += 1;
            $("#time_counter").html("Time: " + puzzle.gameTime);
        }, 1000);
    },
    winGame: function () {
        puzzle.gameStart = false;
        puzzle.ableToClick = true;
        clearInterval(puzzle.gameTimer);
        showHoverMessage("You Win")
        $("#hover_message").click(hideHoverMessage);
    },
    stopGame: function () {
        puzzle.gameStart = false;
        puzzle.ableToClick = true;
        clearInterval(puzzle.gameTimer);
    }
}

function updatePosition(newPosition) {
    $(this).removeClass("puzzle_row_" + Math.floor(this.position / 4)).removeClass("puzzle_col_" + this.position % 4);;
    this.position = newPosition;
    $(this).addClass("puzzle_row_" + Math.floor(this.position / 4)).addClass("puzzle_col_" + this.position % 4);
}

function moveToPosition(newPosition) {
    puzzle.blocks[puzzle.matrix[newPosition]].updatePosition(this.position);
    puzzle.matrix[this.position] = puzzle.matrix[newPosition];
    puzzle.matrix[newPosition] = parseInt(this.id);
    this.updatePosition(newPosition);
}

function getNeighbour(position) {
    var dx = [-1, 0, 1, 0], dy = [0, -1, 0, 1];
    var neighbour = new Array(), x, y;
    for (var i = 0; i < 4; ++i) {
        x = position % 4 + dx[i], y = Math.floor(position / 4) + dy[i];
        if (x >= 0 && x < 4 && y >= 0 && y < 4) neighbour.push(x + 4 * y);
    }
    return neighbour;
}

function handleOnClick(event) {
    if (puzzle.ableToClick) {
        var neighbours = this.getNeighbour();
        for (var index in neighbours) {
            if (puzzle.matrix[neighbours[index]] == "0") {
                if (puzzle.gameStart) puzzle.addMove();
                this.moveToPosition(neighbours[index]);
                if (puzzle.gameStart && contor(puzzle.matrix) == 0) puzzle.winGame();
                event.stopPropagation(); // 停止冒泡
                break;
            }
        }
    }
}

function puzzleBlock() {
    var newBlock = document.createElement("canvas");
    newBlock.className = "puzzle_block puzzle_block_hover";
    newBlock.position = 0;
    newBlock.updatePosition = updatePosition;
    newBlock.moveToPosition = moveToPosition;
    newBlock.getNeighbour = function () { return getNeighbour(this.position); }
    newBlock.onclick = handleOnClick;
    return newBlock;
}

// 初始化puzzle
function initPuzzle() {
    for (var i = 0; i < 16; ++i) {
        var newBlock = puzzleBlock(i);
        newBlock.id = newBlock.position = i;
        newBlock.updatePosition(i);
        puzzle.matrix[i] = i;
        puzzle.blocks[i] = newBlock;
        $("#puzzle_content").append(newBlock);
    }
    $("#0").removeClass("puzzle_block_hover");
}

function drawPuzzle(imageName) {
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

// 随机选择一个格子移动
function randomMove(cur, pre, times) {
    if (times < puzzle.randomTimes) {
        var possiblePostion = puzzle.blocks[0].getNeighbour();
        possiblePostion.splice(possiblePostion.indexOf(pre), 1); // 删除上一次移动的方块
        var pos = possiblePostion[Math.floor(Math.random() * possiblePostion.length)]
        puzzle.blocks[puzzle.matrix[pos]].moveToPosition(cur);
        setTimeout(function () {
            randomMove(pos, cur, times + 1);
        }, puzzle.randomDelay);
    } else {
        puzzle.startGame();
    }
}

// 打乱puzzle
function breakPuzzle() {
    if (puzzle.ableToClick) {
        puzzle.stopGame();
        puzzle.ableToClick = false;
        var zero = puzzle.matrix.indexOf(0);
        randomMove(zero, zero, 0);
    }
}

// 康拓展开
function contor(array) {
    var fac = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000];
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

// A* 搜索状态
function statu(matrix, steps, depth, zeroIndex) {
    this.matrix = matrix;
    this.steps = steps;
    this.depth = depth;
    this.zeroIndex = zeroIndex;
}

// A* 估值函数
function value(statu) {
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

// 将steps中存储的步骤作用于puzzle
function solveMove(steps, index, pre) {
    if (index < steps.length) {
        puzzle.blocks[puzzle.matrix[steps[index]]].moveToPosition(pre);
        setTimeout(function () {
            solveMove(steps, index + 1, steps[index]);
        }, puzzle.solveDelay);
    } else {
        puzzle.ableToClick = true;
    }
}

// A*
function AStar(sta) {
    var close = new Set(); // 已搜索状态
    var open = new PriorityQueue(); // 待搜索状态
    open.insert(value(sta), sta);
    close.add(contor(sta.matrix));
    while (!open.empty()) {
        var curStatu = open.pop();
        var cur = curStatu.entry;
        if (contor(cur.matrix) == 0) { // 如果找到解法
            hideHoverMessage();
            solveMove(cur.steps, 0, puzzle.matrix.indexOf(0));
            return;
        }
        var neighbours = getNeighbour(cur.zeroIndex);
        for (var i in neighbours) {
            var matrix = _.cloneDeep(cur.matrix); // 复制matrix
            var temp = matrix[cur.zeroIndex]; matrix[cur.zeroIndex] = matrix[neighbours[i]]; matrix[neighbours[i]] = temp; // 交换位置
            var contorNumber = contor(matrix);
            if (!close.has(contorNumber)) {
                close.add(contorNumber);
                var steps = _.cloneDeep(cur.steps); // 复制steps
                steps.push(neighbours[i]);
                var nstatu = new statu(matrix, steps, cur.depth + 1, neighbours[i]);
                open.insert(value(nstatu), nstatu);
            }
        }
    }
}

function solvePuzzle() {
    if (puzzle.ableToClick) {
        puzzle.stopGame();
        puzzle.ableToClick = false;
        showHoverMessage("<div class=\"loading_icon\"></div>Solving...");
        var sta = new statu(puzzle.matrix, new Array(), 0, puzzle.matrix.indexOf(0)); // 初始状态
        setTimeout(function () { AStar(sta); }); // A* 寻路
    }
}


// 获取拖入图片
function handleFileSelect(event) {
    event = event.originalEvent;
    event.stopPropagation();
    event.preventDefault();
    var files = event.dataTransfer.files;
    if (files.length && files[0].type.indexOf("image") != -1) {
        var img = window.URL.createObjectURL(files[0]);
        drawPuzzle(img);
    }
}

// 改变拖入时的效果
function handleDragOver(event) {
    event = event.originalEvent;
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}

// 在最上层显示message
function showHoverMessage(message) {
    $("#message").html(message);
    $("#hover_message").show();
    $("#main_content").addClass("blur");
}

function hideHoverMessage() {
    $("#hover_message").hide();
    $("#main_content").removeClass("blur");
}

window.onload = function () {
    $("#break").click(breakPuzzle);
    $("#solve").click(solvePuzzle);
    $("#drop_zone, #puzzle_content").bind({ "drop": handleFileSelect, "dragover": handleDragOver });
    initPuzzle();
    drawPuzzle("images/panda.jpg");
    hideHoverMessage();
}