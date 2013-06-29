var Point = function( x, y ) {
    EventObject.call( this );
    
	this.x_ = 0;
	this.y_ = 0;
    
    this.set( x, y );
};

Point.prototype = Utils.extend( EventObject, {
    get x() { return this.x_; },
    set x( value ) { this.changed( { property: 'x', oldValue: this.x_, value: value } ); this.x_ = value; },
    get y() { return this.y_; },
    set y( value ) { this.changed( { property: 'y', oldValue: this.y_, value: value } ); this.y_ = value; },
    set: function( x, y ) {
        
        if( Utils.isObject( x ) ) {
            
            if( x.x ) this.x = x.x;
            if( x.y ) this.y = x.y;
        } else if( Utils.isNumeric( x ) ) {
            
            this.x = parseInt( x );
        }
        
        if( Utils.isNumeric( y ) )
            this.y = parseInt( y );
        
        return this;
    },
	isZero: function() {

		return !( this.x || this.y );
	},
    get clone() {

		return new Point( this );
	},
    equals: function( point ) {

        return this.x === point.x && this.y === point.y;
    },
	distanceTo: function( point ) {

		return Math.sqrt( 
            ( this.x - point.x ) * ( this.x - point.x ) + ( this.y - point.y ) * ( this.y - point.y ) 
        );
	},
    
    /* Calculation operations */
    add: function( point ) {
        
        if( Utils.isNumeric( point ) ) 
            point = { x: point, y: point };
        
        if( point.x ) this.x += point.x;
        if( point.y ) this.y += point.y;
        
        return this;
    },
            
    sub: function( point ) {
        
        if( Utils.isNumeric( point ) ) 
            point = { x: point, y: point };
        
        if( point.x ) this.x -= point.x;
        if( point.y ) this.y -= point.y;
        
        return this;
    },
            
    mul: function( point ) {
        
        if( Utils.isNumeric( point ) ) 
            point = { x: point, y: point };
        
        if( point.x ) this.x *= point.x;
        if( point.y ) this.y *= point.y;
        
        return this;
    },
            
    div: function( point ) {
        
        if( Utils.isNumeric( point ) ) 
            point = { x: point, y: point };
        
        if( point.x ) this.x /= point.x;
        if( point.y ) this.y /= point.y;
        
        return this;
    }
} );