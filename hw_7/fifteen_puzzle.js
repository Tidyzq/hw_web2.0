window.onload = function() {
    var puzzleContent = document.getElementById("puzzle_content");
    for (var i = 0; i < 16; ++i) {
        var newBlock = document.createElement("div");
        newBlock.className = "puzzle_block";
        newBlock.id = i;
        newBlock.innerHTML = i;
        newBlock.position = i;
        newBlock.onclick = function() {
            var dx = [-1, 0, 1, 0];
            var dy = [0, -1, 0, 1];
            for (var i = 0; i < 4; ++i) {
                var j = this.position + dx[i] + 4 * dy[i];
                if (j >= 0 && j < 16 && puzzleContent.childNodes[j + 1].id == '0') {
                    var temp = puzzleContent.childNodes[j + 1].id;
                    puzzleContent.childNodes[j + 1].id = puzzleContent.childNodes[this.position + 1].id;
                    puzzleContent.childNodes[this.position + 1].id = temp;
                }
            }
        }
        puzzleContent.appendChild(newBlock);
    }
}