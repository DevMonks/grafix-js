var EventObject = function () {

    this._eventCallbacks = [];
};

EventObject.prototype = {
    get eventCallbacks() { return this._eventCallbacks; },

    /**
     * Binds a new event to trigger the given callback.
     *
     * @param {string} event
     * @param {function} callback
     * @returns {self}
     */
    bind: function ( event, callback ) {

        if ( Utils.isFunction( callback ) == false ) {
            throw 'Provided callback is not a function';
        }

        // Create some space
        if ( !(event in this._eventCallbacks) ) {
            this._eventCallbacks[event] = [];
        }

        this._eventCallbacks[event].push( callback );

        return this;
    },

    /**
     * Unbinds an existing callback.
     *
     * @param {string} event
     * @param {function} callback
     * @returns {self}
     */
    unbind: function ( event, callback ) {

        if ( !(event in this._eventCallbacks) ) {
            return this;
        }

        // Just remove them all
        if ( !callback ) {
            delete this._eventCallbacks[event];
            return this;
        }

        // Find the callback
        var k = -1;
        for ( var i = 0; i < this._eventCallbacks[event].length; i++ ) {
            if ( this._eventCallbacks[event][i] === callback ) {
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
        if ( !(event in this._eventCallbacks) ) {
            return this;
        }

        var events = this._eventCallbacks[event],
        // Create EventArgs
            eventArgs = args;

        if ( !(eventArgs instanceof EventArgs) ) {
            eventArgs.eventName = event;
            eventArgs = new EventArgs( eventArgs );
        }

        // We need a context!
        if ( !eventArgs.context ) {
            //throw 'Failed to trigger "' + eventArgs.eventName + '" event without a context.';
            eventArgs.updateContext( this );
        }

        for ( var i = 0; i < events.length; i++ ) {
            var callback = events[i];
            //console.log('EventObject.trigger(', eventArgs.eventName, ') in context', eventArgs.context);
            callback.call( eventArgs.context, eventArgs );
        }

        return this;
    },

    /**
     *  Some short-hands for default/most-used events
     */

    /**
     *
     * @param {function|object|EventArgs} callback
     * @returns {self}
     */
    changed: function ( callback ) {
        // Maximum call stack size prevention
        if ( this.changed === callback ) {
            throw "Please dont use this.changed as a callback; define a method as a callback handler";
        }

        // Register a new callback function for the "changed" event
        if ( Utils.isFunction( callback ) ) {
            this.bind( 'changed', callback );
            return this;
        }

        // Ensure a context
        var args = callback || {};
        if ( !args.context ) {
            if ( !(args instanceof EventArgs) ) {
                args.context = this;
            } else {
                args.updateContext( this );
            }
        }
        // Trigger "changed" event using the given parameters
        this.trigger( 'changed', args );

        return this;
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
            context:   this,
            property:  property,
            oldValue:  value_old,
            value:     value_new
        };
        return new EventArgs.ChangedProperty( args );
    }

};
