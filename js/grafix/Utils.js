var Utils = {
    
	merge: function( target, source ) {
        
		for( var i in source )
			target[ i ] = source[ i ];

		return target;
	},

	extend: function( parent, childMethods ) {

        var instance = new parent();
        for( var i in childMethods ) {
            
            var desc = Object.getOwnPropertyDescriptor( childMethods, i );
            Object.defineProperty( instance, i, desc );
        }
        
        return instance;
	},

	isType: function( val, type ) {

		return typeof val === type;
	},

	isString: function( val ) {

		return this.isType( val, 'string' );
	},

	isArray: function( val ) {

		return Array.isArray( val );
	},

	isObject: function( val ) {

		return this.isType( val, 'object' );
	},

	isNumber: function( val ) {

		return this.isType( val, 'number' );
	},

	isNumeric: function( val ) {

		return !isNaN( parseFloat( val ) ) && isFinite( val );
	},
    
    isFunction: function( val ) {
        
        return this.isType( val, 'function' );
    },
    
	inArray: function( array, value ) {

		if( array.indexOf )
			return array.indexOf( value ) !== -1;

		for( var i in array )
			if( array[ i ] === value )
				return true;

		return false;
	},

	decToRad: function( dec ) {

		return dec * Math.PI / 180;
	},
            
	radToDec: function( rad ) {

		return ( rad * 180 ) / Math.PI;
	}
};