
var Line = function() {
	Shape.call( this );

	this.x = 0;
	this.y = 0;
	this.to = new Point( 1, 1 );
	this.checkpoints = [];

	var args = Utils.init( '!x y toX toY', arguments, {} );

	if( args.x )
		this.x = args.x;

	if( args.y)
		this.y = args.y;

	if( args.toX )
		this.to.x = args.toX;

	if( args.toY )
		this.to.y = args.toY;
}

Line.prototype = Utils.extend( Shape, {
	draw: function( canvasContext, style ) {

		if( typeof style === 'string' )
			this.style = Style.parse( style, this.style );

		this.style.use( canvasContext, function() {

			canvasContext.beginPath();
			canvasContext.moveTo( this.x, this.y );
			if( this.checkpoints.length > 1 )
				canvasContext.bezierCurveTo( this.checkpoints[ 0 ].x, this.checkpoints[ 0 ].y, this.checkpoints[ 1 ].x, this.checkpoints[ 1 ].y, this.to.x, this.to.y );
			else if( this.checkpoints.length == 1 )
				canvasContext.quadraticCurveTo( this.checkpoints[ 0 ].x, this.checkpoints[ 0 ].y, this.to.x, this.to.y );
			else
				canvasContext.lineTo( this.to.x, this.to.y );
			canvasContext.stroke();
			canvasContext.closePath();

		}, this );
		

		return this;
	},
	checkpoint: function( cp ) {

		this.checkpoints.push( cp );

		return this;
	}
} );