
var EventObject = function() {

	this.eventCallbacks_ = [];
};

EventObject.prototype = {
    get eventCallbacks() { return this.eventCallbacks_; },
	bind: function( event, callback ) {

        if( Utils.isFunction( callback ) ) {
            
            if( !( event in this.eventCallbacks_ ) )
                this.eventCallbacks_[ event ] = [];
            
            this.eventCallbacks_[ event ].push( callback );
            
        } else
            throw 'Provided callback is not a function';

		return this;
	},
	unbind: function( event, callback ) {

        if( !( event in this.eventCallbacks_ ) )
            return this;
        
        if( !callback )
            this.eventCallbacks_.slice( event, 1 );

		var k;
		for( var i = 0; i < this.eventCallbacks_[ event ].length; i++ ) {
			if( this.eventCallbacks_[ event ][ i ] === callback )
				k = i;
		}

		if( k )
			this.eventCallbacks_[ event ].splice( k, 1 );

        return this;
	},
	trigger: function( event, args ) {

        if( !( event in this.eventCallbacks_ ) )
            return this;

		args = Utils.merge( {
			time: new Date().getTime(),
			context: this.context,
			event: event
		}, args || {} );

		for( var i = 0; i < this.eventCallbacks_[ event ].length; i++ ) {
            this.eventCallbacks_[ event ][ i ].call( args.context, args );
		}

        return this;
	},
            
    /* Some default events */
    changed: function( callback ) {
        
        console.log( this );
        
        if( Utils.isFunction( callback ) ) {
            this.bind( 'changed', callback );
	        return this;
        }

	    if (!('context' in callback)) {
		    // @FIXME: Causes an endless loop 'cause of Shape changed() registration
		    return this;
	    }

	    this.trigger( 'changed', callback );
        
        return this;
    }
};
