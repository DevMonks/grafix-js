/**
 * Collection of all supporter input methods ({InputBase] extensions).
 *
 * @param target
 * @constructor
 */
var Input = function ( target ) {
    EventBase.call( this );

    this._target = target || window;
    this._inputModules = [];

    // Add default modules
    // @TODO: Maybe create a global static register which contains all input interface names
    // The module system wont create any instance of the modules until some module is requested
    // So it would be okay to register all modules per defaut
    this.add( Mouse.moduleName );
    this.add( Keyboard.moduleName );
};

// @TODO: Dynamic registration using addModul, use modul's .export() array to merge into Input instance
Input.prototype = Utils.extend( EventBase, {

    /**
     * Returns the target of this class.
     *
     * @returns {EventBase}
     */
    get target() { return this._target; },
    /**
     * Returns the target of this class.
     * Just an alias to {this.target}.
     *
     * @returns {EventBase}
     */
    get context() { return this.target; },

    /**
     * Returns the instance of the {Mouse} module.
     *
     * @property mouse
     * @returns {Mouse}
     */


    /**
     * Returns the instance of the {Keyboard} module.
     *
     * @property keyboard
     * @returns {keyboard}
     */


    /**
     * Maps over the {InputBase} API and calls {InputBase.clear} on all stored modules.
     *
     * @returns {self}
     */
    clear: function () {
        for ( var moduleName in this._inputModules ) {
            var module = this._inputModules[ moduleName ];
            if ( module ) {
                module.clear();
            }
        }

        return this;
    },

    /**
     * Stores the {moduleName} as a reference and injects a lazyLoad getter into this class.
     *
     * @param moduleName
     * @returns {self}
     */
    add: function( moduleName ) {
        this._inputModules[ moduleName ] = null;
        // Inject a getter for this modul,
        var moduleGetterName = moduleName.toLowerCase();
        this.__defineGetter__( moduleGetterName, function () {
            return this._lazyLoad( moduleName );
        } );

        return this;
    },

    /**
     * Removes the reference of the instance of the given {moduleName} and delete's the lazyLoad getter from this class.
     *
     * @param moduleName
     * @returns {self}
     */
    remove: function( moduleName ) {
        // Remove the getter
        if ( ( moduleName in this ) ) {
            delete this [ moduleName ];
        }

        // Remove from array
        delete this._inputModules[ moduleName ];

        return this;
    },

    /**
     * Returns the instance of the {moduleName}
     *
     * @param moduleName
     * @returns {InputBase}
     * @private
     */
    _lazyLoad: function ( moduleName ) {
        if ( this._inputModules[ moduleName ] !== null ) {
            return this._inputModules[ moduleName ];
        }

        // @TODO: I think this uses eval() internally.. maybe fnd a better way
        // @FIXED: BUT, I don't think think this is nessecary anyways
        //         This will give problems in Node.js I guess
        
        var that = this;
        // Create the instance
        
        if( !( moduleName in Grafix ) )
            throw 'Invalid input module ' + moduleName;
        
        this._inputModules[ moduleName ] = new Grafix[ moduleName ]( this.target );

        // Return the instance
        return this._inputModules[ moduleName ];
    }

} );
