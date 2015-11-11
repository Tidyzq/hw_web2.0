// generate the maze ramdomly
generateMaze = function () {
    function point(x, y) {
        this.x = x;
        this.y = y;
    }
    function haveWall(hor, ver) {
        this.hor = hor;
        this.ver = ver;
    }
    var mazeContent = document.getElementById("maze_content");
    var vis = new Array()
    var wall = new Array()
    var dirX = [1, 0, -1, 0], dirY = [0, 1, 0, -1]
    var borderX = 27, borderY = 19
    // init the maze, which has the max number of walls
    for (var i = 0; i < borderX; ++i) {
        vis[i] = new Array();
        wall[i] = new Array();
        for (var j = 0; j < borderY; ++j) {
            vis[i][j] = false;
            wall[i][j] = new haveWall(true, true);
        }
    }
    // definition of functions
    removeWall = function (p1, p2) {
        if (p1.x == p2.x) {
            wall[p1.x][Math.max(p1.y, p2.y)].hor = false;
        } else {
            wall[Math.max(p1.x, p2.x)][p1.y].ver = false;
        }
    }
    addWall = function (width, height, left, top) {
        var wallBlock = document.createElement("div");
        wallBlock.className = "wall_normal";
        wallBlock.style.position = "absolute";
        wallBlock.style.left = left + "px";
        wallBlock.style.top = top + "px";
        wallBlock.style.width = width + "px"
        wallBlock.style.height = height + "px";
        mazeContent.appendChild(wallBlock);
    }
    findPath = function (curPoint) {
        var neighbor = new Array();
        var x = curPoint.x, y = curPoint.y;
        var nx, ny;
        for (var i = 0; i < 4; ++i) {
            nx = x + dirX[i]; ny = y + dirY[i];
            if (nx >= 0 && nx < borderX && ny >= 0 && ny < borderY && !vis[nx][ny]) {
                neighbor.push(new point(nx, ny));
            }
        }
        while (neighbor.length) {
            var select = Math.floor(Math.random() * neighbor.length);
            nx = neighbor[select].x;
            ny = neighbor[select].y;
            if (!vis[nx][ny]) {
                removeWall(curPoint, neighbor[select]);
                vis[nx][ny] = true;
                findPath(neighbor[select]);
            }
            neighbor.splice(select, 1);
        }
    }
    // start to generate the maze
    vis[0][0] = true;
    findPath(new point(0, 0));
    // translate walls to divs
    for (var i = 0; i < borderX; ++i) {
        var last = -1;
        for (var j = 0; j <= borderY; ++j) {
            if (j == borderY || !wall[i][j].ver) {
                if (last < j - 1) {
                    addWall(10, (j - last - 1) * 30 + 10, 30 * i, 30 * (last + 1));
                }
                last = j;
            }
        }
    }
    addWall(10, borderY * 30 + 10, 30 * borderX, 0);
    for (var j = 0; j < borderY; ++j) {
        var last = -1;
        for (var i = 0; i <= borderX; ++i) {
            if (i == borderX || !wall[i][j].hor) {
                if (last < i - 1) {
                    addWall((i - last - 1) * 30 + 10, 10, 30 * (last + 1), 30 * j);
                }
                last = i;
            }
        }
    }
    addWall(borderX * 30 + 10, 10, 0, 30 * borderY);
}

crash = function() {
    //console.log("crashed");
    var _walls = document.getElementsByClassName("wall_normal");
        while (_walls.length) {
        _walls[0].className = "wall_crash";
    }
}

reset = function() {
    //console.log("reseted");
    var _walls = document.getElementsByClassName("wall_crash");
    while (_walls.length) {
        _walls[0].className = "wall_normal";
    }
}

window.onload = function () {
    generateMaze();
    var walls = document.getElementsByClassName("wall_normal");
    var start = document.getElementById("start");
    var end = document.getElementById("end");
    var message = document.getElementById("message");
    var checkPoint = document.getElementById("check_point");
    var maze = document.getElementById("maze_content");
    var gameBegin = false; // set to true for purpose
    var overCheckPoint = false;
    for (var i = 0; i < walls.length; ++i) {
        walls[i].onmouseover = function() {
            if (gameBegin) {
                gameBegin = false;
                crash();
                message.className = "alert";
                message.textContent = "You faild, please try again";
            }
        }
    }
    start.onmouseover = function () {
        gameBegin = true;
        overCheckPoint = false;
        reset();
        message.className = "normal";
        message.textContent = "Be careful! don't touch the walls!";
    }
    end.onmouseover = function () {
        if (gameBegin) {
            if (overCheckPoint) {
                message.className = "normal";
                message.textContent = "Congratulations! You Win!!!!!!!";
                overCheckPoint = false;
            } else {
                message.className = "alert";
                message.textContent = "Don't cheat, you should start form the 'S' and move to the 'E' inside the maze!";
                crash();
            }
            gameBegin = false;
        }
    }
    checkPoint.onmouseover = function() {
        overCheckPoint = true;
    }
    maze.onmouseout = function(event) {
        var left = maze.offsetLeft;
        var right = maze.offsetLeft + maze.offsetWidth;
        var top = maze.offsetTop;
        var bottom = maze.offsetTop + maze.offsetHeight;
        console.log(left, right, top, bottom);
        console.log(event.pageX, event.pageY);
        if (event.pageX < left || event.pageX > right || event.pageY < top || event.pageY > bottom) {
            reset();
        }
    }
}