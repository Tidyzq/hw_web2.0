var puzzle = {
    matrix: new Array()
}

var initPuzzle = function () {
    var puzzleContent = document.getElementById("puzzle_content");
    puzzle.matrix[0] = 0; // set the first block to be empty
    for (var i = 1; i < 16; ++i) {
        var newBlock = document.createElement("div");
        newBlock.className = "puzzle_block";
        newBlock.id = i;
        newBlock.position = i;
        newBlock.updatePosition = function () {
            this.style.zIndex = this.position;
            this.style.left = (50 * (this.position % 4)) + "px";
            this.style.top = (50 * Math.floor(this.position / 4)) + "px";
        }
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
        var str = (-50 * (i % 4)) + "px " + (-50 * Math.floor(i / 4)) + "px";
        newBlock.style.backgroundPosition = (-50 * (i % 4)) + "px " + (-50 * Math.floor(i / 4)) + "px";
        newBlock.updatePosition();
        newBlock.onclick = function (event) {
            var dx = [-1, 0, 1, 0];
            var dy = [0, -1, 0, 1];
            for (var i = 0; i < 4; ++i) {
                var x = this.position % 4 + dx[i], y = Math.floor(this.position / 4) + dy[i];
                var j = x + 4 * y;
                if (x >= 0 && x < 4 && y >= 0 && y < 4 && puzzle.matrix[j] == '0') {
                    /* exchange the position of the two blocks */
                    this.moveToPosition(j);
                    //puzzle.matrix[j] = this.id;
                    //puzzle.matrix[this.position] = 0;
                    //this.position = j;
                    //this.updatePosition();
                    // console.log(puzzle.matrix);
                    event.stopPropagation(); // stop propagation in order to avoid some bugs
                    break;
                }
            }
        }
        puzzle.matrix[i] = i;
        puzzleContent.appendChild(newBlock);
    }
}

var breakPuzzle = function () {
    var maxTimes = 100;
    var zero = puzzle.matrix.indexOf(0);
    (function randomMove(cur, pre, times) {
        if (times < maxTimes) {
            var possiblePostion = new Array();
            var dx = [-1, 0, 1, 0];
            var dy = [0, -1, 0, 1];
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
            }, 30);
        }
    })(zero, zero, 0);
}

solvePuzzle = function () {
    statu = function (matrix, step, g, zeroIndex) {
        this.matrix = matrix;
        this.step = step;
        this.g = g;
        this.zeroIndex = zeroIndex;
    }
    value = function (statu) {
        var rst = statu.g;
        var vis = new Array();
        for (var x = 0; x < 4; ++x) {
            for (var y = 0; y < 4; ++y) {
                if (!vis[x + 4 * y]) {
                    rst += Math.pow(2, (function dfsFinder(x, y) {
                        vis[x + 4 * y] = true;
                        if (statu.matrix[x + 4 * y] == (x + 4 * y)) {
                            var rst = 1 + (x % 3 || y % 3 ? 0 : 1);
                            var dx = [-1, 0, 1, 0];
                            var dy = [0, -1, 0, 1];
                            for (var i = 0; i < 4; ++i) {
                                var nx = x + dx[i], ny = y + dy[i];
                                var index = nx + 4 * ny;
                                if (nx >= 0 && nx < 4 && ny >= 0 && ny < 4 && !vis[index]) {
                                    rst += dfsFinder(nx, ny);
                                }
                            }
                            return rst;
                        }
                        return 0;
                    })(x, y)) - 1;
                }
            }
        }
        return rst;
    }
    var sta = new statu(puzzle.matrix, new Array(), 0, puzzle.matrix.indexOf(0));
    /* use A* to solve puzzle */
    var step = (function (sta) {
        var vis = new Set();
        var open = new PriorityQueue();
        open.insert(value(sta), sta);
        vis.add(sta.matrix.join(""));
        while (!open.empty()) {
            var curStatu = open.pop();
            var cur = curStatu.entry;
            if (cur.matrix.join("") == "0123456789101112131415") {
                console.log(vis.size, cur.g);
                return cur.step;
            }
            var dx = [-1, 0, 1, 0];
            var dy = [0, -1, 0, 1];
            var index = cur.zeroIndex;
            for (var i = 0; i < 4; ++i) {
                var x = index % 4 + dx[i], y = Math.floor(index / 4) + dy[i];
                var nindex = x + 4 * y;
                if (x >= 0 && x < 4 && y >= 0 && y < 4) {
                    var matrix = cur.matrix.slice(0);
                    var temp = matrix[index];
                    matrix[index] = matrix[nindex];
                    matrix[nindex] = temp;
                    if (!vis.has(matrix.join(""))) {
                        var step = cur.step.slice(0);
                        step.push(nindex);
                        var nstatu = new statu(matrix, step, cur.g - 1, nindex);
                        open.insert(value(nstatu), nstatu);
                        vis.add(matrix.join(""));
                    }
                }
            }
        }
    })(sta);
    var j = puzzle.matrix.indexOf(0);
    (function solveMove(cur) {
        if (cur < step.length) {
            document.getElementById(puzzle.matrix[step[cur]]).moveToPosition(j);
            j = step[cur];
            setTimeout(function () {
                solveMove(cur + 1);
            }, 30);
        }
    })(0);
}

window.onload = function () {
    document.getElementById("break").onclick = breakPuzzle;
    document.getElementById("solve").onclick = solvePuzzle;
    initPuzzle();
}