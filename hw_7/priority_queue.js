function PriorityQueue() {
    var node = function (priority, entry) {
        this.priority = priority;
        this.entry = entry;
    }
    this.data = new Array();
    this.data.push(new node(0, 0));
    this.insert = function (priority, entry) {
        this.data.push(new node(priority, entry));
        var index = this.data.length - 1;
        while (index > 1) {
            var father = index >> 1;
            if (this.data[father].priority < this.data[index].priority) {
                var temp = this.data[father];
                this.data[father] = this.data[index];
                this.data[index] = temp;
            } else {
                break;
            }
            index = father;
        }
    }
    this.pop = function () {
        var rst = this.data[1];
        this.data[1] = this.data[this.data.length - 1];
        delete this.data[this.data.length - 1];
        this.data.pop();
        var index = 1;
        while (1) {
            var lson = index << 1, rson = (index << 1) | 1;
            var maxson = index;
            if (lson < this.data.length && this.data[lson].priority > this.data[maxson].priority) maxson = lson;
            if (rson < this.data.length && this.data[rson].priority > this.data[maxson].priority) maxson = rson;
            if (index == maxson) break;
            else {
                var temp = this.data[index];
                this.data[index] = this.data[maxson];
                this.data[maxson] = temp;
                index = maxson;
            }
        }
        return rst;
    }
    this.empty = function () {
        return this.data.length <= 1;
    }
}