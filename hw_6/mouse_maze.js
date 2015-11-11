window.onload = function () {
    var mazeContent = document.getElementById("maze_content");

    function point(x, y) {
        this.x = x;
        this.y = y;
    }

    function haveWall(hor, ver) {
        this.hor = hor;
        this.ver = ver;
    }

    genrgenerateMaze = function () {
        var vis = new Array()
        var wall = new Array()
        var dirX = [1, 0, -1, 0], dirY = [0, 1, 0, -1]
        var borderX = 27, borderY = 19
        for (var i = 0; i < borderX; ++i) {
            vis[i] = new Array();
            wall[i] = new Array();
            for (var j = 0; j < borderY; ++j) {
                vis[i][j] = false;
                wall[i][j] = new haveWall(true, true);
            }
        }
        removeWall = function (x1, x2, y1, y2) {
            if (x1 == x2) {
                wall[x1][Math.max(y1, y2)].hor = false;
            } else {
                wall[Math.max(x1, x2)][y1].ver = false;
            }
        }
        findPath = function (x, y) {
            var neighbor = new Array();
            var nx, ny;
            for (var i = 0; i < 4; ++i) {
                nx = x + dirX[i]; ny = y + dirY[i];
                if (nx >= 0 && nx < borderX && ny >= 0 && ny < borderY && !vis[nx][ny]) {
                    neighbor.push(new Array(nx, ny));
                }
            }
            while (neighbor.length) {
                var select = Math.floor(Math.random() * neighbor.length);
                nx = neighbor[select][0];
                ny = neighbor[select][1];
                if (!vis[nx][ny]) {
                    removeWall(x, nx, y, ny);
                    vis[nx][ny] = true;
                    findPath(nx, ny);
                }
                neighbor.splice(select, 1);
            }
        }
        vis[0][0] = true;
        findPath(0, 0);
        for (var i = 0; i < borderX; ++i) {
            for (var j = 0; j < borderY; ++j) {
                if (wall[i][j].ver) {
                    var wallBlock = document.createElement("div");
                    wallBlock.className = "wall vertical";
                    wallBlock.style.left = (30 * i) + "px";
                    wallBlock.style.top = (30 * j) + "px";
                    mazeContent.appendChild(wallBlock);
                }
                if (wall[i][j].hor) {
                    var wallBlock = document.createElement("div");
                    wallBlock.className = "wall horizontal";
                    wallBlock.style.left = (30 * i) + "px";
                    wallBlock.style.top = (30 * j) + "px";
                    mazeContent.appendChild(wallBlock);
                }
            }
        }
    }
    genrgenerateMaze();
}