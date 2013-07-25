var Keyboard = function ( target ) {

    // Will store current pressed keys (key down)
    this._keyStates = [];
    // Will store current pressed keys (key down) and wont be released in clear()
    this._locked = [];
    // Will store last pressed keys (key down)
    this._lastKeyStates = [];

    InputBase.call( this, target );
};


Keyboard.KEY = {
    ANY:         -1,

    MOUSE1:      -2,
    MOUSE2:      -3,
    MOUSE3:      -4,

    BACKSPACE:   8,
    TAB:         9,
    ENTER:       13,
    PAUSE:       19,
    CAPS:        20,
    ESC:         27,
    SPACE:       32,
    PAGE_UP:     33,
    PAGE_DOWN:   34,
    END:         35,
    HOME:        36,
    LEFT_ARROW:  37,
    UP_ARROW:    38,
    RIGHT_ARROW: 39,
    DOWN_ARROW:  40,
    INSERT:      45,
    DELETE:      46,
    _0:          48,
    _1:          49,
    _2:          50,
    _3:          51,
    _4:          52,
    _5:          53,
    _6:          54,
    _7:          55,
    _8:          56,
    _9:          57,
    A:           65,
    B:           66,
    C:           67,
    D:           68,
    E:           69,
    F:           70,
    G:           71,
    H:           72,
    I:           73,
    J:           74,
    K:           75,
    L:           76,
    M:           77,
    N:           78,
    O:           79,
    P:           80,
    Q:           81,
    R:           82,
    S:           83,
    T:           84,
    U:           85,
    V:           86,
    W:           87,
    X:           88,
    Y:           89,
    Z:           90,
    NUMPAD_0:    96,
    NUMPAD_1:    97,
    NUMPAD_2:    98,
    NUMPAD_3:    99,
    NUMPAD_4:    100,
    NUMPAD_5:    101,
    NUMPAD_6:    102,
    NUMPAD_7:    103,
    NUMPAD_8:    104,
    NUMPAD_9:    105,
    MULTIPLY:    106,
    ADD:         107,
    SUBSTRACT:   109,
    DECIMAL:     110,
    DIVIDE:      111,
    F1:          112,
    F2:          113,
    F3:          114,
    F4:          115,
    F5:          116,
    F6:          117,
    F7:          118,
    F8:          119,
    F9:          120,
    F10:         121,
    F11:         122,
    F12:         123,
    SHIFT:       16,
    CTRL:        17,
    ALT:         18,
    PLUS:        187,
    COMMA:       188,
    MINUS:       189,
    PERIOD:      190
};

Keyboard.prototype = Utils.extend( InputBase, {

    get keyStates() { return this._keyStates; },
    get lastKeyStates() { return this._lastKeyStates; },
    get locked() { return this._locked; },


    init: function ( target ) {
        var keyboard = this;

        target.addEventListener( 'keydown', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var code = e.type == 'keydown' ? e.keyCode : (e.button == 2 ? Keyboard.KEY.MOUSE2 : Keyboard.KEY.MOUSE1);
            keyboard.keyStates[code] = true;
            keyboard.locked[code] = true;

            // Trigger callbacks
            if ( keyboard.has('down') ) {
                keyboard.trigger( 'down', { key: code } );
            }
        }, false );

        target.addEventListener( 'keyup', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var code = e.type == 'keyup' ? e.keyCode : (e.button == 2 ? Keyboard.KEY.MOUSE2 : Keyboard.KEY.MOUSE1);
            keyboard.keyStates[code] = false;
            keyboard.locked[code] = false;

            // Trigger callbacks
            if ( keyboard.has('up') ) {
                keyboard.trigger( 'up', { key: code } );
            }
        }, false );
    },

    clear: function () {
        // Store last pressed
        this._lastKeyStates = this._keyStates;
        // Free current pressed
        this._keyStates = [];
    },


    /**
     * Returns true, is the given key is currently pressed.
     *
     * @param key
     * @returns {boolean}
     */
    isLocked: function(key) {
        return this._locked[key] === true;
    },

    /**
     * Returns true, if the given key is currently pressed.
     * Handles only keys which are pressed since the last clear().
     *
     * @param key
     * @returns {boolean}
     */
    isDown: function(key) {
        return this._keyStates[key] === true;
    },

    /**
     * Returns true, if the given key was released after the last clear().
     *
     * @param key
     * @returns {boolean}
     */
    isUp: function(key) {
        return !this._keyStates[key] === true && this._lastKeyStates[key] === true;
    },


    /**
     * Handles a direct bind to an event
     *
     * @param event
     * @param callback
     * @returns {*}
     */
    handleKeyEvent: function ( event, callback ) {
        if ( Utils.isFunction( callback ) ) {
            return this.bind( event, callback );
        }

        // Only trigger if we got a callback attached
        if (this.has(event) == false) {
            return this;
        }

        var args = Utils.merge( {
            eventName:    event,
            keyboard:     this
        }, callback || {} );

        return this.trigger( event, new EventArgs(args) );
    },

    /**
     * Binds to the key-down event
     *
     * @param callback
     * @returns {*}
     */
    onDown: function ( callback ) {
        return this.handleKeyEvent( 'down', { key: callback } );
    },

    /**
     * Binds to the key-up event
     *
     * @param callback
     * @returns {*}
     */
    onUp: function ( callback ) {
        return this.handleKeyEvent( 'up', { key: callback } );
    }

} );
