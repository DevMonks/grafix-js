
var Font = function() {
	Style.call( this );

	this.family = 'helvetica';
	this.align = 'left';
	this.size = 12;
	this.baseLine = 'top';
	this.style = 'normal'; //italic, oblique...
	this.weight = 'normal', //normal, bold, bolder, lighter, 100, 200, ..., 900...

	Utils.init( '!family size style weight', arguments, this );
}


Font.prototype = Utils.extend( Style, {
	use: function( canvasContext, drawingLogicCallback, context, font ) {

		Style.prototype.use.call( this, canvasContext, function() {

			var font = [ this.style, this.weight, this.size + 'px', this.family ].join( ' ' );
			canvasContext.save();

			if( canvasContext.font !== font )
				canvasContext.font = font;

			if( canvasContext.textAlign !== this.align )
				canvasContext.textAlign = this.align;

			if( canvasContext.textBaseline !== this.baseLine )
				canvasContext.textBaseline = this.baseLine;

			drawingLogicCallback.call( context, canvasContext );

			canvasContext.restore();
		} );

		return this;
	}
} );

Font.parse = function( string, baseFont ) {

	var parts = string.split( ' ' );
	var font = new Font;

	if( baseFont )
		for( var i in baseFont )
			if( !Utils.inArray( [ 'use' ], i ) ) 
				font[ i ] = baseFont[ i ];

	for( var i in parts ) {
		switch( parts[ i ] ) {
			case 'bold':
			case 'bolder':
			case 'lighter':

				font.weight = parts[ i ];
				break;
			case 'italic':
			case 'oblique':

				font.style = parts[ i ];
				break;
			case 'left':
			case 'center':
			case 'right':

				font.align = parts[ i ];
				break;
			case 'top':
			case 'bottom':
			case 'middle':
			case 'alphabetic':
			case 'hanging':

				font.baseLine = parts[ i ];
				break;
			default:

				if( !isNaN( parts[ i ] ) ) {

					font.size = parseInt( parts[ i ] );
				} else {

					font.family = parts[ i ];
				}

		}
	}

	return font;
}