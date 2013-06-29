/*cached*/
	var Grafix = (function( undefined ) {

	"use strict";


var Utils = {
	merge: function( target, source, newObject ) {

		newObject = newObject || false;

		var context = target;
		if( newObject ) {
			var tmp = {};
			for( var i in target )
				tmp[ i ] = target[ i ];

			context = tmp;
		}

		for( var i in target )
			context[ i ] = source;

		return context;
	},

	extend: function( parent, child ) {

		result = this.merge( new parent, child );

		return result;
	},

	isType: function( val, type ) {

		return typeof val === type;
	},

	isString: function( val ) {

		return this.isType( val, 'string' );
	}

	isArray: function( val ) {

		return this.isType( val, 'array' );
	}

	isObject: function( val ) {

		return this.isType( val, 'object' );
	}

	isString: function( val ) {

		return this.isType( val, 'string' );
	},

	isNumber: function( val ) {

		return this.isType( val, 'number' );
	},

	isNumeric: function( val ) {

		return !isNaN( parseFloat( val ) ) && isFinite( val );
	},

	inArray: function( array, value ) {

		if( array.indexOf )
			return array.indexOf( value ) != -1;

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
};var Point = function( x, y ) {

	this.x = x;
	this.y = y;
}

Point.prototype = {
	isEmpty: function() {

		return !( this.x || this.y );
	},
	empty: function() {

		this.x = 0;
		this.y = 0;
	}
	point: function() {

		return new Point( this.x, this.y );
	},
	rect: function() {

		return new Rectangle( this.x, this.y );
	},
	distanceTo: function( point ) {

		return Math.sqrt( ( this.x - point.x ) * ( this.x - point.x ) + ( this.y - point.y ) * ( this.y - point.y ) )
	}
}var Shape = function( x, y ) {

}

Shape.prototype = Utils.extend( Point, {

} );
	var Export = {

		/*
			You can call "import()" somewhere for a namespace (global namespace is default)
			in order to export it to that namespace

			Using "LibraryName.import()" at the start of your page JS right after importing
			the library, the exported classes will be globally available
			(e.g. "var mc = new MyClass()" instead of "var mc = new LibraryName.MyClass()")

			Notice that this can break existing scripts, if you don't use anything else,
			you're perfectly fine with importing everything into the global namespace
		*/
		import: function( namespace ) {

			namespace = namespace || window;

			Utils.merge( namespace, Export );
		}
	};

	/* Export classes to namespace via mapping */
	return Export;
} )();
