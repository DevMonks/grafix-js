
var Size = function() {

	this.width = 0;
	this.height = 0;

	Utils.init( '!width height', arguments, this );
};

Size.prototype = {
	set: function() {

		var s = Utils.init( '!width height', arguments, {} );

		if( s.width ) this.width = s.width;
		if( s.height ) this.height = s.height;

		return this;
	},
	add: function() {

		var s = Utils.init( '!width height', arguments, {} );

		if( s.width ) this.width += s.width;
		if( s.height ) this.height += s.height;

		return this;
	},
	sub: function() {

		var s = Utils.init( '!width height', arguments, {} );

		if( s.width ) this.width -= s.width;
		if( s.height ) this.height -= s.height;

		return this;
	},
	mul: function() {

		var s = Utils.init( '!width height', arguments, {} );

		if( s.width ) this.width *= s.width;
		if( s.height ) this.height *= s.height;

		return this;
	},
	div: function() {

		var s = Utils.init( '!width height', arguments, {} );

		console.log( 'demacia', s );

		if( s.width ) this.width /= s.width;;
		if( s.height ) this.height /= s.height;

		console.log( this );

		return this;
	},
	empty: function() {

		this.width = 0;
		this.height = 0;

		return this;
	},
	isEmpty: function() {

		return !( this.width || this.height );
	},
	clone: function() {

		return new Size( this.width, this.height );
	},
	rect: function() {

		return new Rectangle( this );
	}
};

