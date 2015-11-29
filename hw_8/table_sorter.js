function sortFnGenerator(index, reverse) {
    return function (a, b) {
        var aText = $(a).find("td:nth-child(" + index + ")").text(), bText = $(b).find("td:nth-child(" + index + ")").text();
        if (/^[+-]?\d+\.?\d*$/.test(aText) && /^[+-]?\d+\.?\d*$/.test(bText)) {
            aText = parseFloat(aText); bText = parseFloat(bText);
        }
        return (aText < bText ? 1 : aText > bText ? -1 : 0) * (reverse ? -1 : 1);
    }
}

function sortActivity(tbody, index) {
    return function () {
        $(this).siblings().removeClass("sorting_ascending sorting_descending");
        var isAscending = !$(this).hasClass("sorting_ascending");
        $(this).removeClass("sorting_descending sorting_ascending").addClass(isAscending ? "sorting_ascending" : "sorting_descending");
        $(tbody).append($(tbody).find("tr").sort(sortFnGenerator(index + 1, isAscending)));
    }
}

window.onload = function () {
    $("table").each(function () {
        var tbody = $(this).children("tbody");
        $(this).find("th").each(function (index) {
            $(this).click(sortActivity(tbody, index));
        });
    })
}
