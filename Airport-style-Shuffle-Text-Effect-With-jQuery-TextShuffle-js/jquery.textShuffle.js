$.fn.textShuffle = function (options) {
    var elements = this;

    if (elements.length > 1) {
        tmp = [];
        for (var i = 0; i < elements.length; i++) {
            tmp.push(new TextShuffle(
                $.extend(
                    {bindElement: elements[i]},
                    options
                )
            ));
        }
        return tmp;
    }

    return new TextShuffle(
        $.extend(
            {bindElement: this},
            options
        )
    );
};
