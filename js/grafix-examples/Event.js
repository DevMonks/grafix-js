
var Event = function() {

	this.name = 'Anonymous';
	this.callbacks = [];
	this.context = window;

	Utils.init( '!name context', arguments, this );
};

Event.prototype = {
	bind: function( callback ) {

		if( Utils.inArray( this.callbacks, callback ) )
			return this;

		this.callbacks.push( callback );

		return this;
	},
	unbind: function( callback ) {

		var k;
		for( var i in this.callbacks )
			if( this.callbacks[ i ] === callback )
				k = i;

		if( !k )
			return this;

		this.callbacks[ k ] = undefined;
	},
	trigger: function( args ) {

		args = Utils.merge( {
			time: new Date().getTime(),
			eventContext: this.context,
			name: this.name
		}, args || {} );

		for( var i in this.callbacks )
			if( typeof this.callbacks[ i ] == 'function' )
				this.callbacks[ i ].call( this.context, args );
	}
};
