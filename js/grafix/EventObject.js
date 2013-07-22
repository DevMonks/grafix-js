var EventObject = function () {

    this._eventCallbacks = [];
};

EventObject.prototype = {
    get eventCallbacks() { return this._eventCallbacks; },

    /**
     *
     * @param {string} event
     * @returns {boolean}
     */
    has: function ( event ) {
        return ( event in this._eventCallbacks) && this._eventCallbacks[ event ].length > 0;
    },

    /**
     * Binds a new event to trigger the given callback.
     *
     * @param {string} event
     * @param {EventHandler} handler
     * @returns {self}
     */
    bind: function ( event, handler ) {

        if ( !(handler instanceof EventHandler) ) {
            if ( Utils.isFunction( handler ) == false ) {
                throw 'Provided callback is not a EventHandler';
            }

            handler = new EventHandler(handler, this);
        }

        // Create some space
        if ( this.has(event) == false ) {
            this._eventCallbacks[event] = [];
        }

        this._eventCallbacks[event].push( handler );

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

        if ( this.has(event) == false ) {
            return this;
        }

        // Just remove them all
        if ( !handler ) {
            delete this._eventCallbacks[event];
            return this;
        }

        // Find the callback
        var k = -1;
        for ( var i = 0; i < this._eventCallbacks[event].length; i++ ) {
            if ( this._eventCallbacks[event][i] === handler ) {
                k = i;
                break;
            }
        }

        // Remove the callback, if found
        if ( k != -1 ) {
            this._eventCallbacks[event].splice( k, 1 );
        }

        return this;
    },

    /**
     * Triggers an event callback which was priviously registred.
     *
     * @param {string} event
     * @param {object|EventArgs} args
     * @returns {self}
     */
    trigger: function ( event, args ) {
        if ( this.has(event) == false ) {
            return this;
        }

        var events = this._eventCallbacks[event],
            eventArgs = args || {};

        // Create EventArgs
        if ( !(eventArgs instanceof EventArgs) ) {
            eventArgs.eventName = event;
            eventArgs = new EventArgs( eventArgs );
        }

        for ( var i = 0; i < events.length; i++ ) {
            /** @var callback EventHandler*/
            var callback = events[i];
            callback.trigger( eventArgs );
        }

        return this;
    },

    /**
     *  Some short-hands for default/most-used events
     */

    /**
     *
     * @param {EventHandler|EventArgs|object} callback
     * @param {object} context
     *
     * @returns {self}
     */
    changed: function ( callback, context ) {
        // Register a new callback function for the "changed" event
        if ( (callback instanceof EventHandler) ) {
            return this.bind( 'changed', callback );
        }

        // Trigger "changed" event using the given parameters
        if ( (callback instanceof EventArgs) || Utils.isObject(callback) ) {
            return this.trigger( 'changed', callback );
        }

        // Support (function, context) for older calls
        if ( context && Utils.isObject(context) ) {
            if ( Utils.isFunction(callback) == false ) {
                throw 'Provided callback needs to be a callable function';
            }

            return this.bind( 'changed', new EventHandler(callback, context) );
        }

        throw 'Invalid parameters in changed() call';
    },

    /**
     * Create a {ChangedPropertyEventArgs} object using the given parameters.
     *
     * @param {string} property
     * @param {*} value_old
     * @param {*} value_new
     * @returns {EventArgs.ChangedProperty}
     */
    prepareChanged: function ( property, value_old, value_new ) {
        var args = {
            eventName: 'change',
            property:  property,
            oldValue:  value_old,
            value:     value_new
        };
        return new EventArgs.ChangedProperty( args );
    }

};
