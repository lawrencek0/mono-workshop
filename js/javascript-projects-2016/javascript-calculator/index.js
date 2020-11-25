$(document).ready(function() {
    var value = 0;
    var operator = 0;
    var total = 0;
    var operands = ['+', '-', '*', '/', '%'];
    var decimal = 0;

    //jQuery selectors
    var history = $("#history");
    var result = $("#result");
    var blink = $("#blink");

    function reset() {
        value = 0;
        operator = 0;
        total = 0;
        decimal = 0;
        result.empty();
        history.empty().html("&nbsp;");
        blink.show();
    }

    $(".btn").click(function() {
        if ($(this).hasClass("num")) {
            if (history.text().search("=") !== -1) {
                reset();
            }
            value = $(this).text();
            blink.hide();
            if ((result.text().slice(0) == "0")) {
                if (history.text().length === 0) {
                    result.text(value);
                    history.text(value);
                } else {
                    result.empty().append(value);
                    history.append(value);
                }
            } else {
                if (operands.includes(result.text().slice(0))) {
                    if (value != "0") {
                        result.empty();
                        result.append(value);
                        history.append(value);
                    }
                } else {
                    result.append(value);
                    history.append(value);
                }
                operator = 1;
            }
        }
        if (operator === 1 && $(this).hasClass("operator")) {
            if (history.text().search("=") !== -1) {
                history.empty().append(total);
            }
            if ($(this).is("#add")) {
                result.empty().text("+");
                history.append("+");
            } else if ($(this).is("#subtract")) {
                result.empty().text("-");
                history.append("-");
            } else if ($(this).is("#multiply")) {
                result.empty().text("*");
                history.append("*");
            } else if ($(this).is("#divide")) {
                result.empty().text("/");
                history.append("/");
            }
            operator = 0;
            decimal = 0;
        }
        if ($(this).is("#equal")) {
            if (operator == 1) {
                total = eval(history.text());
                if (total.toString().length > 10) {
                    total = total.toFixed(10);
                }
                if (typeof total != "undefined") {
                    history.append("=" + total);
                    result.text(total);
                }
            }
        }
        if ($(this).is("#delete")) {
            var str = (history.text()).split("");
            var index = 0;
            for (var i = 0; i < str.length; i++) {
                if (operands.indexOf(str[i]) > -1) {
                    index = i;
                }
            }
            if (operands.includes(history.text().slice(-1))) {
                result.text(result.text().slice(0, -1));
                history.text(history.text().slice(0, -1));
                result.text(0);
                operator = 1;
            }else if (index > 0) {
                result.empty().text(0);
                history.text(history.text().slice(0, index + 1));
                operator = 0;
            } else {
                reset()
            }
        }
        if ($(this).is("#clear")) {
            reset();
        }
        if ($(this).is("#decimal")) {
            if (decimal === 0) {
                blink.hide();
                if (operator === 0) {
                    result.empty();
                }
                result.append(".");
                history.append(".");
                decimal = 1;
            }
        }
    });
});