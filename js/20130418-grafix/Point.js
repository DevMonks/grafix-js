
var Point = function() {

	this.x = 0;
	this.y = 0;

	Utils.init( '!x y', arguments, this );
};

Point.prototype = {
	set: function() {

		var p = Utils.init( '!x y', arguments, {} );

		if( p.x ) this.x = p.x;
		if( p.y ) this.y = p.y;

		return this;
	},
	add: function() {

		var p = Utils.init( '!x y', arguments, {} );

		if( p.x ) this.x += p.x;
		if( p.y ) this.y += p.y;

		return this;
	},
	sub: function() {

		var p = Utils.init( '!x y', arguments, {} );

		if( p.x ) this.x -= p.x;
		if( p.y ) this.y -= p.y;

		return this;
	},
	mul: function() {

		var p = Utils.init( '!x y', arguments, {} );

		if( p.x ) this.x *= p.x;
		if( p.y ) this.y *= p.y;

		return this;
	},
	div: function() {

		var p = Utils.init( '!x y', arguments, {} );

		if( p.x ) this.x /= p.x;
		if( p.y ) this.y /= p.y;

		return this;
	},
	empty: function() {

		this.x = 0;
		this.y = 0;

		return this;
	},
	isEmpty: function() {

		return !( this.x || this.y );
	},
	clone: function() {

		return new Point( this.x, this.y );
	},
	rect: function() {

		return new Rectangle( this );
	},
	point: function() {

		return new Point( this.x, this.y );
	},
	distanceTo: function( point ) {

		return Math.sqrt( ( this.x - point.x ) * ( this.x - point.x ) + ( this.y - point.y ) * ( this.y - point.y ) )
	}
};

