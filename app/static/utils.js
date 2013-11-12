jQuery.fn.forceNumeric = function () {
    return this.each(function () {
        $(this).keypress(function (e) {
            var key = e.which || e.keyCode;

            if(key == 32)
            {
                return false;
            }

            /*if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                     // numbers   
                         key >= 48 && key <= 57 ||
                     // Numeric keypad
                         key >= 96 && key <= 105 ||
                     // comma, period and minus, . on keypad
                        key == 190 || key == 188 || key == 109 || key == 110 ||
                     // Backspace and Tab and Enter
                        key == 8 || key == 9 || key == 13 ||
                     // Home and End
                        key == 35 || key == 36 ||
                     // left and right arrows
                        key == 37 || key == 39 ||
                     // Del and Ins
                key == 46 || key == 45)
                return true;*/

            if(!(/^[+\-]?(?:[0-9]\d*)(?:\.?\d*)?(?:[eE]?[+\-]?\d+)?$/.test($(this).val() + String.fromCharCode(key))))
            {
                return false;
            }

            return true;
        });
    });
};

var __templates = 0;
var loadTemplate = function(selectorName, path) {
    __templates++;

    selector = $( '<div />' ).hide().prop("id", selectorName).appendTo( $( 'head' ) );

    selector.load(path, function(data) {
        __templates--;
    });

    return selector;
}

var waitForTemplates = function(callable)
{
    if(__templates > 0)
    {
        setTimeout(_.partial(waitForTemplates, callable), 100);
    }
    else
    {
        callable();
    }
}
