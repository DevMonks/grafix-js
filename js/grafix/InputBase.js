/**
 * Provides informations about a specific input type (Mouse, Keyboard, Touch, Gamepad, ..).
 *
 * @param target
 * @constructor
 */
var InputBase = function ( target ) {
    EventObject.call(this);

    this._target = target;
    this._initialised = false;

    if ( this._target ) {
        this.init( target );
    }
};

InputBase.prototype = Utils.extend( EventObject, {

    get target() { return this._target; },
    get context() { return this.target; },


    /**
     * If implemented, should install any state listener.
     *
     * @param target
     */
    init: function ( target ) {
        this._initialised = true;
    },

    /**
     * If implemented, should clear all sources and states which may be stored during a update period.
     */
    clear: function () {

    },

    /**
     * If implemented, will return an array of method names which should be implemented in a controler class.
     *
     * @returns {Array}
     */
    export: function () {
        return [];
    }

} );
