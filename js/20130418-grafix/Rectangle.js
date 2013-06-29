
var Rectangle = function() {

	Shape.call( this );

	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;

	Utils.init( '!x y width height', arguments, this );
};

Rectangle.prototype = Utils.extend( Shape, {
	set: function() {

		var r = Utils.init( '!x y width height', arguments, {} );

		Shape.prototype.set.call( this, r );
		Size.prototype.set.call( this, r );

		return this;
	},
	add: function() {

		var r = Utils.init( '!x y width height', arguments, {} );

		Shape.prototype.add.call( this, r );
		Size.prototype.add.call( this, r );

		return this;
	},
	sub: function() {

		var r = Utils.init( '!x y width height', arguments, {} );

		Shape.prototype.sub.call( this, r );
		Size.prototype.sub.call( this, r );

		return this;
	},
	mul: function() {

		var r = Utils.init( '!x y width height', arguments, {} );

		Shape.prototype.mul.call( this, r );
		Size.prototype.mul.call( this, r );

		return this;
	},
	div: function() {

		var r = Utils.init( '!x y width height', arguments, {} );
		Shape.prototype.div.call( this, r );
		Size.prototype.div.call( this, r );

		return this;
	},
	empty: function() {

		Shape.prototype.empty.call( this );
		Size.prototype.empty.call( this );

		return this;
	},
	isEmpty: function() {

		return Shape.isEmpty.call( this ) && Size.isEmpty.call( this );
	},
	rect: function() {

		return new Rectangle( this.x, this.y, this.width, this.height );
	},
    center: function( center ) {

        center = center || {};

        if( center.x )
            this.x = center.x - this.width / 2;

        if( center.y )
            this.y = center.y - this.height / 2;

        return new Point( this.x + this.width / 2, this.y + this.height / 2 );
    },
	fill: function( canvasContext ) {

		canvasContext.fillRect( this.x, this.y, this.width, this.height );

		return this;
	},
	stroke: function( canvasContext ) {

		canvasContext.strokeRect( this.x, this.y, this.width, this.height );

		return this;
	},
	clear: function( context ) {

		context.clearRect( this.x, this.y, this.width, this.height );

		return this;
	},
    left: function( left ) {
        
        if( left ) this.x = left;
        
        return this.x;
    },
    right: function( right ) {
        
        if( right ) this.width = right - this.x;
        
        return this.width + this.x;
    },
    top: function( top ) {
        
        if( top ) this.y = top;
        
        return this.y;
    },
    bottom: function( bottom ) {
        
        if( bottom ) this.height = bottom - this.y;

        return this.y + this.height;
    },
    topLeft: function( point ) {
        
        if( point && point.x ) this.left( point.x );
        if( point && point.y ) this.top( point.y );
        
        return new Point( this.x, this.y );
    },
    topRight: function( point ) {
        
        if( point && point.x ) this.right( point.x );
        if( point && point.y ) this.top( point.y );
        
        return new Point( this.right(), this.y );
    },
    bottomLeft: function( point ) {
        
        if( point && point.x ) this.left( point.x );
        if( point && point.y ) this.bottom( point.y );
        
        return new Point( this.x, this.bottom() );
    },
    bottomRight: function( point ) {

        if( point && point.x ) this.right( point.x );
        if( point && point.y ) this.bottom( point.y );
        
        return new Point( this.right(), this.bottom() );
    },
    collidesWith: function( rect ) {
        
        var left = rect.left ? rect.left() : rect.x;
        var right = rect.right ? rect.right() : rect.x + ( rect.width ? rect.width : 0 );
        var top = rect.top ? rect.top() : rect.y;
        var bottom = rect.bottom ? rect.bottom() : rect.y + ( rect.height ? rect.height : 0 );
        
        return !( left > this.right() || right < this.left() || top > this.bottom() || bottom < this.top() );
    },
    contains: function( rect ) {
        
        var left = rect.left ? rect.left() : rect.x;
        var right = rect.right ? rect.right() : rect.x + ( rect.width ? rect.width : 0 );
        var top = rect.top ? rect.top() : rect.y;
        var bottom = rect.bottom ? rect.bottom() : rect.y + ( rect.height ? rect.height : 0 );
        
        return ( left > this.left() && right < this.right() && top > this.top() && bottom < this.bottom() );
    }
} );

