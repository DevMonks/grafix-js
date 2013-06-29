
var Circle = function() {

	Shape.call( this );

	this.x = 0;
	this.y = 0;
	this.radius = 0;
	this.startAngle = 0;
	this.endAngle = 360;
	this.clockwise = true;
	this.rectInstance = false;

	Utils.init( '!x y radius startAngle endAngle clockwise', arguments, this );
};

Circle.prototype = Utils.extend( Shape, {
	set: function() {

		var c = Utils.init( '!x y radius startAngle endAngle clockwise', arguments, {} );

		Shape.prototype.set.call( this, c );
		if( c.radius ) this.radius = c.radius;
		if( c.startAngle ) this.startAngle = c.startAngle;
		if( c.endAngle ) this.endAngle = c.endAngle;
		if( c.clockwise ) this.clockwise = c.clockwise;

		return this;
	},
	add: function() {

		var c = Utils.init( '!x y radius startAngle endAngle clockwise', arguments, {} );

		Shape.prototype.add.call( this, c );
		if( c.radius ) this.radius += c.radius;
		if( c.startAngle ) this.startAngle += c.startAngle;
		if( c.endAngle ) this.endAngle += c.endAngle;
		if( c.clockwise ) this.clockwise += c.clockwise;

		return this;
	},
	sub: function() {

		var c = Utils.init( '!x y radius startAngle endAngle clockwise', arguments, {} );

		Shape.prototype.sub.call( this, c );
		if( c.radius ) this.radius -= c.radius;
		if( c.startAngle ) this.startAngle -= c.startAngle;
		if( c.endAngle ) this.endAngle -= c.endAngle;
		if( c.clockwise ) this.clockwise -= c.clockwise;

		return this;
	},
	mul: function() {

		var c = Utils.init( '!x y radius startAngle endAngle clockwise', arguments, {} );

		Shape.prototype.mul.call( this, c );
		if( c.radius ) this.radius *= c.radius;
		if( c.startAngle ) this.startAngle *= c.startAngle;
		if( c.endAngle ) this.endAngle *= c.endAngle;
		if( c.clockwise ) this.clockwise *= c.clockwise;

		return this;
	},
	div: function() {

		var c = Utils.init( '!x y radius startAngle endAngle clockwise', arguments, {} );

		Shape.prototype.div.call( this, c );
		if( c.radius ) this.radius /= c.radius;
		if( c.startAngle ) this.startAngle /= c.startAngle;
		if( c.endAngle ) this.endAngle /= c.endAngle;
		if( c.clockwise ) this.clockwise /= c.clockwise;

		return this;
	},
	empty: function() {

		Shape.prototype.empty.call( this );
		c.radius = 0;
		c.startAngle = 0;
		c.endAngle = 360;
		c.clockwise = true;

		return this;
	},
	isEmpty: function() {

		return Shape.prototype.isEmpty.call( this ) && !c.radius && !c.startAngle && c.endAngle === 360 && c.clockwise;
	},
	circle: function() {

		return new Circle( this.x, this.y, this.radius, this.startAngle, this.endAngle, this.clockwise );
	},
	rect: function() {

		if( !this.rectInstance )
			this.rectInstance = new Rectangle( this.x, this.y, this.radius * 2, this.radius * 2 );

		this.rectInstance.set( { x: this.x, y: this.y, width: this.radius * 2, height: this.radius * 2 } );

		return this.rectInstance;
	},
	center: function( center ) {

		center = center || {};

		if( center.x )
			this.x = center.x - this.radius;

		if( center.y )
			this.y = center.y - this.radius;

        return new Point( this.x + this.radius, this.y + this.radius );
    },
	fill: function( canvasContext ) {

		canvasContext.beginPath();
		canvasContext.arc( this.x + this.radius, this.y + this.radius, this.radius, Utils.decToRad( this.startAngle ), Utils.decToRad( this.endAngle ), !this.clockwise );
		if( this.style.closedPath ) canvasContext.closePath();
		canvasContext.fill();
	},
	stroke: function( canvasContext ) {

		canvasContext.beginPath();
		canvasContext.arc( this.x + this.radius, this.y + this.radius, this.radius, Utils.decToRad( this.startAngle ), Utils.decToRad( this.endAngle ), !this.clockwise );
		if( this.style.closedPath ) canvasContext.closePath();
		canvasContext.stroke();
	},
	clear: function() {

		return this.fill.apply( this, arguments );
	},
	contains: function( rect ) {

		//TODO: only checks the WHOLE circle currently, startAngle, endAngle and clockwise need to be used as well
		var distance = rect.distanceTo ? rect.distanceTo( this.center() ) : rect.point().distanceTo( this.center() );

		return distance <= this.radius;
	}
} );

