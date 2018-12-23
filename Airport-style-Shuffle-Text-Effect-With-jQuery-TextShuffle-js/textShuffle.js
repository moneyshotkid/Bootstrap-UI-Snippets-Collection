var TextShuffle = function (options) {
    var chars = options.chars || "01#/&%$?_-%*";
    var animationSpeed = options.animationSpeed || 10;
    var $bindElement = $(options.bindElement);
    var bindEvent = options.bindEvent || "mouseover";
    var _criticalSection = false;

    function getRandomChar() {
        return chars.charAt(
            getRandomPosition(chars)
        );
    }

    function getRandomPosition(string) {
        return Math.floor(Math.random() * (string.length - 1))
    }

    function changeCharInText(string, position, char) {
        return string.substr(0, position)
            + char
            + string.substr(position + 1, string.length);
    }

    function permString($this, originalText, currentText, counter, callback) {
        counter = counter || 0;

        setTimeout(function ($this, originalText, currentText, counter, callback) {
            currentText = changeCharInText(currentText, counter, getRandomChar());
            $this.text(currentText);

            // Stop recursion condition
            if (++counter <= originalText.length) {
                permString($this, originalText, currentText, counter, callback);
            } else {
                restoreString($this, originalText, currentText, counter, callback);
            }
        }, animationSpeed, $this, originalText, currentText, counter, callback);
    }

    function restoreString($this, originalText, currentText, counter, callback) {
        setTimeout(function ($this, originalText, currentText, counter, callback) {
            currentText = changeCharInText(currentText, counter, originalText.charAt(counter));
            $this.text(currentText);

            // Stop recursion condition
            if (--counter >= 0) {
                restoreString($this, originalText, currentText, counter, callback);
            }
            else {
                callback();
            }
        }, animationSpeed, $this, originalText, currentText, counter, callback);
    }

    function _permPlay(event) {
        _criticalSection = true;
        var originalText = $bindElement.text();

        _unbindElement($bindElement);
        permString($bindElement, originalText, originalText, 0, (function () {
            _bindElement($bindElement);
            _criticalSection = false;
        }));
    }

    function _bindElement($this) {
        $this.on(bindEvent, $this, _permPlay);
    }

    function _unbindElement($this) {
        $this.off(bindEvent);
    }

    function _init() {
        $bindElement.on(bindEvent, _permPlay);
    }

    $(function () {
        _init();
    });

    function play() {
        if (!_criticalSection) {
            _criticalSection = true;
            _unbindElement($bindElement);
            var originalText = $bindElement.text();
            permString($bindElement, originalText, originalText, 0, (function () {
                _bindElement($bindElement);
                _criticalSection = false;
                _init
            }));
        }
    }

    return {
        play: play
    }
};
