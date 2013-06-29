var Text = function() {
	Rectangle.call( this );

	this.string = "";
	this.style = new Font;
	this.align = 'left';
	this.baseLine = 'top';
	this.lineHeight = 14;

	Utils.init( '!string x y align width height', arguments, this );
}

Text.prototype = Utils.extend( Rectangle, {
	measure: function( canvasContext, text, fontActive ) {

		var s = new Size( { height: this.style.size } );
		if( !fontActive ) {

			this.style.use( canvasContext, function() {

				var bounds = canvasContext.measureText( typeof text === 'string' ? text : this.string );
			}, this );
		} else {

			var bounds = canvasContext.measureText( typeof text === 'string' ? text : this.string );
		}

		s.width = bounds.width;

		return s;
	},
	draw: function( canvasContext, font ) {

		if( typeof font === 'string' )
			this.style = Font.parse( font, this.style );

		if( !( this.style.fillStyle + "Text" ) in canvasContext )
			throw 'Text doesnt support this fill style';

		var drawFunc = this.style.fillStyle + 'Text';
		this.style.use( canvasContext, function() {	

			//calculate shit
			var lines = ( this.string + "" ).split( '\n' );
            for( var i in lines ) {
                
                var line = lines[ i ];
                var textRect = this.measure( canvasContext, line, true ).rect();
                var lineRect = new Rectangle( 
                    this.x, 
                    this.y + ( i * this.lineHeight ), 
                    this.width > textRect.width ? this.width : textRect.width, 
                    this.lineHeight 
                );

                textRect.position( lineRect, [ this.align, this.baseLine ].join( ' ' )  );
                
                canvasContext[ drawFunc ]( line, textRect.x, textRect.y );
            }

		}, this );

		return this;

	}
} );

Text.create = function( text, font ) {

	if( typeof font === 'string' )
		font = Font.parse( font, Style.parse( font ) );

	var t = new Text( text );
	t.style = font;

	return t;
}