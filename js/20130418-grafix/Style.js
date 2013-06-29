
var Style = function() {

	this.offset = new Point();
	this.scale = new Point( 1, 1 );
	this.angle = 0;
	this.skew = new Point( 0, 0 );
	this.color = Color.black;
	this.fillStyle = 'stroke';  //fill...
	this.lineWidth = 1;
	this.lineCap = 'butt'; //round, square...
	this.miterLimit = 10;
	this.lineJoin = 'miter'; //bevel, round...
	this.closedPath = false;

	Utils.init( '!color fillStyle', arguments, this );
}

Style.prototype = {
	use: function( canvasContext, drawingLogicCallback, context, test ) {

		var colorProp = this.fillStyle + 'Style';
		var contextChanged = false;
		context = context || this;

		//Save current state for restoring it later
		canvasContext.save();

		//Apply styles if needed (If no style selected, properties won't change for performance reasons)
		if( !this.offset.isEmpty() ) 
			canvasContext.translate( this.offset.x, this.offset.y );

		if( this.scale.x !== 1 || this.scale.y !== 1 ) 
			canvasContext.scale( this.scale.x, this.scale.y );

		if( this.angle )
			canvasContext.rotate( this.angle );

		if( canvasContext.lineWith !== this.lineWidth )
			canvasContext.lineWidth = this.lineWidth;

		if( canvasContext.lineCap !== this.lineCap )
			canvasContext.lineCap = this.lineCap;

		if( canvasContext.miterLimit !== this.miterLimit )
			canvasContext.miterLimit = this.miterLimit;

		if( canvasContext.lineJoin !== this.lineJoin )
			canvasContext.lineJoin = this.lineJoin;

		if( !this.skew.isEmpty() )
			canvasContext.transform( 1, this.skew.x, this.skew.y, 1, 0, 0 );

		// the color will only be re-set, if it changes
		if( this.color != canvasContext[ colorProp ] )
			canvasContext[ colorProp ] = this.color;

		drawingLogicCallback.call( context, canvasContext );

		canvasContext.restore();

		return this;
	}
}

Style.parse = function( string, baseStyle ) {

	var parts = string.split( ' ' );
	var style = baseStyle ? baseStyle : new Style;

	for( var i in parts ) {

		var token = parts[ i ];

		switch( token ) {
			case 'stroke':
				style.fillStyle = 'stroke';
				break;
			case 'fill':
				style.fillStyle = 'fill';
				break;
			default:

				if( token in Color )
					style.color = Color[ token ];
				else if( token.charAt( 0 ) === '#' || token.substr( 0, 3 ) == 'rgb' )
					style.color = token;
		}
	}

	return style;
};
