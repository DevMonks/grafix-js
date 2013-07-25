/**
 * Collection of all supporter input methods ({InputBase] extensions).
 *
 * @param target
 * @constructor
 */
var Input = function ( target ) {
    EventObject.call( this );

    this._target = target || window;
    this._inputModules = [];

    this._mouse = null;
    this._keyboard = null;
};

// @TODO: Dynamic registration using addModul, use modul's .export() array to merge into Input instance
Input.prototype = Utils.extend( EventObject, {

    get target() { return this._target; },
    get context() { return this.target; },

    get mouse() {
        if (this._mouse) {
            return this._mouse;
        }

        this._mouse = new Mouse( this.target );
        return this._mouse;
    },
    get keyboard() {
        if (this._keyboard) {
            return this._keyboard;
        }

        this._keyboard = new Keyboard( this.target );
        return this._keyboard;
    },


    clear: function () {
        if (this._mouse) {
            this._mouse.clear();
        }
        if (this._keyboard) {
            this._keyboard.clear();
        }
    },


    addModul: function( name ) {
        this._inputModules[ name ] = true;
    },

    removeModul: function( name ) {
        delete this._inputModules[ name ];
    }

} );
