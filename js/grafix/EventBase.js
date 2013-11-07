var EventBase = function () {

    // Allow to report changes if we got a 'change' and/or 'changed' callback
    this._reportsChanges = false;
    // Array of callbacks, sorted by event name
    this._eventCallbacks = [];
};

EventBase.prototype = {

    get eventCallbacks() { return this.prop( 'eventCallbacks' ); },

    get reportsChanges() { return this.prop( 'reportsChanges' ); },

    /**
     * Returns the name of this class, usefull for type checks.
     *
     * @TODO: This is more a hack because either typeof or instanceof works on our object-classes
     * @returns {string}
     */
    get className() { return 'EventBase'; },

    /**
     *
     * @param {string} event
     * @returns {boolean}
     */
    has: function ( event ) {
        return ( event in this._eventCallbacks ) && this._eventCallbacks[ event ].length > 0;
    },

    /**
     * Binds a new event to trigger the given callback.
     *
     * @param {string} event
     * @param {EventHandler|Function|function} handler
     * @returns {self}
     */
    bind: function ( event, handler ) {

        if ( !(handler instanceof EventHandler) ) {
            if ( Utils.isFunction( handler ) === false ) {
                throw 'Provided callback is not a EventHandler';
            }

            handler = new EventHandler(handler, this);
        }

        // Create some space
        if ( this.has(event) === false ) {
            this._eventCallbacks[event] = [];
        }

        this._eventCallbacks[event].push( handler );

        // If we bind a 'change' or 'changed' event, we will report changes
        if( event === 'change' || event == 'changed' ) {
            this._reportsChanges = true;
        }

        return this;
    },

    /**
     * Unbinds an existing callback.
     *
     * @param {string} event
     * @param {EventHandler} handler
     * @returns {self}
     */
    unbind: function ( event, handler ) {

        if ( this.has(event) === false ) {
            return this;
        }

        // Just remove them all
        if ( !handler ) {
            delete this._eventCallbacks[event];

            // If we unbind a 'change' and didnt have 'changed' event anymore (or vise versa),
            // we wont report changes
            if( this._reportsChanges && this.has( 'change' ) === false && this.has( 'changes' ) === false ) {
                this._reportsChanges = false;
            }
            return this;
        }

        // Find the callback
        var k = -1,
            events = this._eventCallbacks[event],
            callback = handler.callback || handler,
            context = handler.context || null;

        for ( var i = 0; i < events.length; i++ ) {
            var evt = events[i];
            if ( evt.callback === callback && evt.context === context ) {
                k = i;
                break;
            }
        }

        // Remove the callback, if found
        if ( k != -1 ) {
            this._eventCallbacks[event].splice( k, 1 );

            // If we unbind a 'change' and didnt have 'changed' event anymore (or vise versa),
            // we wont report changes
            if( this._reportsChanges && this.has( 'change' ) === false && this.has( 'changes' ) === false ) {
                this._reportsChanges = false;
            }
        }

        return this;
    },

    /**
     * Triggers an event callback which was priviously registred.
     *
     * @param {string} event
     * @param {object|EventArgs} args
     *
     * @returns {self|boolean|*[]}
     */
    trigger: function ( event, args, returnResults ) {

        if ( this.has(event) === false ) {

            // @TODO: If we have to return the results back, but event has not been triggered..
            //        Should we return null or undefined or anything to indicate this situation?
            return this;
        }

        var events = this._eventCallbacks[event],
            eventArgs = args || {},
            results = [];

        // Create EventArgs
        if ( !(eventArgs instanceof EventArgs) ) {
            eventArgs.eventName = event;
            eventArgs = new EventArgs( eventArgs );
        }

        for ( var i = 0; i < events.length; i++ ) {
            /** @var callback EventHandler*/
            var callback = events[i];
            results[ i ] = callback.trigger( eventArgs );
        }

        if ( returnResults ) {
            // If we got just one result, we dont have to return an array
            if( results.length === 1 ) {
                return results[ 0 ];
            }

            // If every result is the samee, we also dont have to return an array
            var firstResult = results[ 0 ];
            for( var r = 1; r < results.length; r++ ) {
                if( results[ r ] !== firstResult ) {
                    return results;
                }
            }
            return firstResult;
        }

        return this;
    },

    /**
     * Either binds a given {EventHandler} or object to an event or triggers the event using given arguments, if any.
     *
     * @param {string} event
     * @param {EventHandler|EventArgs|object} args
     *
     * @returns {self|boolean|*[]}
     */
    on: function ( event, args ) {

        // Register a new callback function for the event
        if ( Utils.isBindable( args ) ) {
            return this.bind( event, args );
        }

        // Trigger event using the given parameters, if any
        return this.trigger( event, args || {} );
    },


    change: function( name, value ) {

        // Register a new handler for change-event
        if ( Utils.isBindable( value ) ) {
            return this.bind( 'change', value );
        }

        // Do we report changes?
        if( this._reportsChanges === false ) {
            return this;
        }

        // Trigger all change callbacks and return the result
        return this.trigger( 'change', {
            property: name,
            valueOld: this[ '_' + name ],
            valueNew: value
        }, true );
    },

    changed: function( name ) {

        // Register a new handler for changed-event
        if ( Utils.isBindable( name ) ) {
            return this.bind( 'changed', name );
        }

        // Do we report changes?
        if( this._reportsChanges === false ) {
            return this;
        }

        // Trigger all changed callbacks for the given property name
        return this.trigger( 'changed', {
            property: name,
            value: (name && (name in this) ? this[ '_' + name ] : null)
        } );
    },

    /**
     * Gets or sets the value of a private property, named _{name}.
     * If this object reports changes, the change event will be called before update.
     * If the event returns {false} no update will be done.
     *
     * @param {string} name
     * @param {*} [value]
     * @returns {self|boolean|*}
     */
    prop: function( name, value ) {

        // Acting as getter for private property
        if( value === undefined ) {
            return this[ '_' + name ];
        }

        // Only set if changed
        if( this[ '_' + name ] === value ) {
            return false;
        }

        // Acting as evented setter
        if( this.change( name, value ) === false ) {
            // A callback returned {false}, cancel value update
            return false;
        }

        // Update values
        this[ '_' + name ] = value;

        // Trigger changed event and report it back
        return this.changed( name );
    }

};
