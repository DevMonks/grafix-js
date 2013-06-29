
var Utils = {
	merge: function( dest, target ) {

		if( !target )
			return dest;

		for( var i in target )
			dest[ i ] = target[ i ];

		return dest;
	},

	extend: function( parent, child ) {

		if( !child )
			return parent;
		
		var result = typeof parent === 'object' ? parent : new parent;

		for( var i in child )
			result[ i ] = child[ i ];

		return result;
	},

	inArray: function( array, value ) {

		if( array.indexOf )
			return array.indexOf( value ) != -1;

		for( var i in array )
			if( array[ i ] === value )
				return true;

		return false;
	},
	/* 
	Automagically initializes function arguments based on string patterns 
	
	Imagine we have a function like this:
	function( [ argName1, argName2, argName4, argName4 )

	It doesn't matter if you actually defined those arguments or you didn't

	You call the pattern like this

	Utils.init( '!argName1 argName2 argName4 argName4', arguments, this ); for class initialization
	for a mapping to "this"

	or

	var args = Utils.init( '!argName1 argName2 argName4 argName4', arguments, {} );
	for a mapping to "args"

	where properties prefixed with a ! can also take an object containing the arguments,
	e.g.
	{ argName1: value, argName3: value }

	*/
	init: function( pattern, args, context ) {

		var vars = pattern.split( ' ' );
		var possibleVars = pattern.replace( '!', '' ).split( ' ' );
		context = context || this;

		for( var i in vars ) {

			if( vars[ i ].charAt( 0 ) == '!' && typeof args[ i ] === 'object' ) {

				for( var j in args[ i ] ) {
					if( Utils.inArray( possibleVars, j ) )
						context[ j ] = args[ i ][ j ];
				}
				continue;
			}

			if( typeof args[ i ] !== 'undefined' )
				context[ vars[ i ].replace( '!', '' ) ] = args[ i ];
		}

		return context;
	},
	decToRad: function( dec ) {

		return dec * Math.PI / 180;
	},
	radToDec: function( rad ) {

		return ( rad * 180 ) / Math.PI;
	}
};
