function redrawTable() {
    $(this).find("tbody > tr").removeClass("odd_row even_row");
    $(this).find("tbody > tr:odd").addClass("odd_row");
    $(this).find("tbody > tr:even").addClass("even_row");
}

function sortFnGenerator(index, reverse) {
    return function (a, b) {
        var aText = $(a).find("td:nth-child(" + index + ")").html(), bText = $(b).find("td:nth-child(" + index + ")").html();
        if (/^[+-]?\d+\.?\d*$/.test(aText) && /^[+-]?\d+\.?\d*$/.test(bText)) {
            aText = parseFloat(aText); bText = parseFloat(bText);
        }
        return (aText < bText ? 1 : aText > bText ? -1 : 0) * (reverse ? -1 : 1);
    }
}

function sortActivity(table, tbody, index) {
    return function () {
        $(this).siblings().removeClass("sorting_ascending sorting_descending");
        var isAscending = !$(this).hasClass("sorting_ascending");
        $(this).removeClass("sorting_descending sorting_ascending").addClass(isAscending ? "sorting_ascending" : "sorting_descending");
        $(tbody).append($(tbody).find("tr").sort(sortFnGenerator(index + 1, isAscending)));
        redrawTable.call(table);
    }
}


window.onload = function () {
    $("table").each(function () {
        redrawTable.call(this);
        var table = this, tbody = $(this).find("tbody");
        $(this).find("th").each(function (index) {
            $(this).click(sortActivity(table, tbody, index));
        });
    })
}
