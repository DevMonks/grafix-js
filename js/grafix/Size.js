var Size = function( width, height ) {
    EventObject.call( this );
    
	this.width_ = 0;
	this.height_ = 0;
    
    this.set( width, height );
};

Size.prototype = Utils.extend( EventObject, {
    get width() { return this.width_; },
    set width( value ) { this.changed( { property: 'width', oldValue: this.width_, value: value } ); this.width_ = value; },
    get height() { return this.height_; },
    set height( value ) { this.changed( { property: 'height', oldValue: this.height_, value: value } ); this.height_ = value; },
    set: function( width, height ) {
        
        if( Utils.isObject( width ) ) {
            
            if( width.width ) this.width = width.width;
            if( width.height ) this.height = width.height;
        } else if( Utils.isNumeric( width ) ) {
            
            this.width = parseInt( width );
        }
        
        if( Utils.isNumeric( height ) )
            this.height = parseInt( height );
        
        return this;
    },
	isZero: function() {

		return !( this.width || this.height );
	},
	get clone() {

		return new Point( this );
	},
    equals: function( size ) {

        return this.width === size.width && this.height === size.height;
    },       
    /* Calculation operations */
    add: function( size ) {
        
        if( Utils.isNumeric( size ) ) 
            size = { width: size, height: size };
        
        if( size.width ) this.width += size.width;
        if( size.height ) this.height += size.height;
        
        return this;
    },
            
    sub: function( size ) {

        if( Utils.isNumeric( size ) ) 
            size = { width: size, height: size };
        
        if( size.width ) this.width -= size.width;
        if( size.height ) this.height -= size.height;
        
        return this;
    },
    
    mul: function( size ) {

        if( Utils.isNumeric( size ) ) 
            size = { width: size, height: size };
        
        if( size.width ) this.width *= size.width;
        if( size.height ) this.height *= size.height;
        
        return this;
    },
            
    div: function( size ) {

        if( Utils.isNumeric( size ) ) 
            size = { width: size, height: size };
        
        if( size.width ) this.width /= size.width;
        if( size.height ) this.height /= size.height;
        
        return this;
    }
} );