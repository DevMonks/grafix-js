
var Grid = function() {

	Rectangle.call( this );

	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.rows = 8;
	this.columns = 8;
	this.rectangles = [];

	Utils.init( '!x y width height rows columns', arguments, this );
};

Grid.prototype = Utils.extend( Rectangle, {
	rectAt: function( x, y ) {

		var offset = 0;

		if( typeof x !== 'undefined' && typeof y !== 'undefined' )
			offset = Math.max( 0, x + ( y * this.columns ) );
		else if( typeof x !== 'undefined' ) {
			offset = Math.max( 0, x );
			x = offset % this.columns;
			y = Math.floor( offset / this.columns );
		} else {
			x = 0;
			y = 0;
		}

		//calculate rect at this position
		var rectSize = new Size( this.width / this.columns, this.height / this.rows );
		var rectPos = new Point( this.x + x * rectSize.width, this.y + y * rectSize.height );

		if( !this.rectangles[ x ] )
			this.rectangles[ x ] = [];

		if( !this.rectangles[ x ][ y ] )
			this.rectangles[ x ][ y ] = new Rectangle;

		this.rectangles[ x ][ y ].set( Utils.merge( rectSize, rectPos ) );

		return this.rectangles[ x ][ y ];
	},
	rectSize: function() {

		return this.rectAt( 0, 0 ).size();
	},
	rects: function( walker ) {

		if( walker ) {

			var rects = this.rects();
			for( var i in rects ) {

				var rect = rects[ i ];
				walker.call( rect, new Point( i % this.columns, Math.floor( i / this.columns ) ), this, i );
			}

			return this;
		}
		var rects = [];
		for( var y = 0; y < this.rows; y++ )
			for( var x = 0; x < this.columns; x++ )
				rects.push( this.rectAt( x, y ) );

		return rects;
	},
	draw: function( canvasContext, style ) {

		if( typeof style === 'string' )
			this.style = Style.parse( style, this.style );

		if( !this.style.fillStyle in this )
			throw 'The shape doesnt support this fill style';

		this.style.use( canvasContext, function() {

			this[ this.style.fillStyle ]( canvasContext );
			this.rects( function( pos, grid ) {

				//this.mouse( grid.mouse() );
				this[ this.style.fillStyle ]( canvasContext );
			} );
		}, this );

		return this;
	}
} );

