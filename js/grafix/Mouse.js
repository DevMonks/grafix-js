var Mouse = function ( target ) {

    // Will store current mouse position
    this._position = new Point;
    // Will store currently pressed mouse buttons since last clear()
    this._buttonStates = [];
    this._lastButtonStates = [];
    // Will store clicked mouse buttons since last clear()
    this._clickStates = [];
    this._lastClickStates = [];
    this._locked = [];

    InputBase.call(this, target );
};

Mouse.KEY = {
    ANY:         -1,

    MOUSE1:      -2,
    MOUSE2:      -3,
    MOUSE3:      -4,
    MWHEEL_UP:   -5,
    MWHEEL_DOWN: -6
};

Mouse.prototype = Utils.extend( InputBase, {

    get position() { return this._position; },
    get buttonStates() { return this._buttonStates; },
    get lastButtonStates() { return this._lastButtonStates; },
    get clickStates() { return this._clickStates; },
    get lastClickStates() { return this._lastClickStates; },
    get locked() { return this._locked; },


    init: function (target)  {
        if (this._initialised) {
            return this;
        }

        this._initialised = true;

        var mouse = this;
        this._target.addEventListener( 'mousemove', function ( e ) {
            e.stopPropagation();
            e.preventDefault();

            var offsetX = mouse.target.offsetLeft || 0,
                offsetY = mouse.target.offsetTop || 0;

            mouse.position.set( {
                x: e.pageX - offsetX,
                y: e.pageY - offsetY
            } );

            // Trigger callbacks
            mouse.on( 'move' );
        } );

        this._target.addEventListener( 'mouseout', function ( e ) {
            e.stopPropagation();
            e.preventDefault();

            // @TODO: Shouldnt this DOM event trigger 'mousemove' anyways? Test this!
            mouse.on( 'move' );
        } );

        this._target.addEventListener( 'mousedown', function ( e ) {
            e.stopPropagation();
            e.preventDefault();

            mouse.buttonStates[ e.which ] = true;
            mouse.locked[ e.which ] = true;

            // Trigger callbacks
            mouse.on( 'down', { button: e.which } );
        } );

        this._target.addEventListener( 'mouseup', function ( e ) {
            e.stopPropagation();
            e.preventDefault();

            mouse.buttonStates[ e.which ] = false;
            mouse.locked[ e.which ] = false;

            // Trigger callbacks
            mouse.on( 'up', { button: e.which } );
        } );

        this._target.addEventListener( 'click', function ( e ) {
            e.stopPropagation();
            e.preventDefault();

            mouse.clickStates[ e.which ] = true;

            // Trigger callbacks
            mouse.on( 'click', { button: e.which } );
        } );

        this._target.addEventListener( 'mousewheel', function ( e ) {
            e.stopPropagation();

            var code = (e.wheel > 0 || e.wheelDelta > 0 ? Mouse.KEY.MWHEEL_UP : Mouse.KEY.MWHEEL_DOWN),
                codeName = (code == Mouse.KEY.MWHEEL_UP ? 'up' : 'down');

            mouse.buttonStates[ code ] = true;

            // Trigger callbacks
            mouse.on( 'wheel' + codeName, { wheel: e.wheel || e.wheelDelta } );
        });

        return this;
    },

    clear: function () {
        // Store last pressed
        this._lastButtonStates = this._buttonStates;
        this._lastClickStates = this._clickStates;
        // Free current pressed
        this._buttonStates = [];
        this._clickStates = [];

        return this;
    },

    export: function () {
        return [];
    },

    /**
     * Returns true, if the given button was released (mouseup) since last clear()
     *
     * @param btn
     * @returns {boolean}
     */
    isUp: function( btn ) {
        return (btn in this._buttonStates) && this._buttonStates[ btn ] === false;
    },

    /**
     * Returns true, if the given button was pressed (mousedown) since last clear()
     *
     * @param btn
     * @returns {boolean}
     */
    isDown: function( btn ) {
        return (
                ((btn in this._buttonStates) && this._buttonStates[ btn ] === true) ||
                ((btn in this._locked) && this._locked[ btn ] === true)
            );
    },

    /**
     * Returns true, if the given button was clicked (click) since last clear()
     *
     * @param btn
     * @returns {boolean}
     */
    isClicked: function( btn ) {
        return (btn in this._clickStates) && this._clickStates[ btn ] === true;
    },


    handleMouseEvent: function ( event, callback ) {
        if ( Utils.isBindable(callback) ) {
            return this.on( event, callback );
        }

        var args = Utils.merge( {
            eventName:    event,
            mouse:        this
        }, callback || {} );

        return this.on( event, args );
    },

    onMove: function ( callback ) {
        return this.handleMouseEvent( 'move', callback );
    },

    onDown: function ( callback ) {
        return this.handleMouseEvent( 'down', { button: callback } );
    },

    onUp: function ( callback ) {
        return this.handleMouseEvent( 'up', { button: callback } );
    },

    onClick: function ( callback ) {
        return this.handleMouseEvent( 'click', { button: callback } );
    }

} );

