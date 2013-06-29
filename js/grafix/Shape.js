var Shape = function( x, y ) {
    EventObject.call( this );
    
    this.children_ = [];
    this.parent_ = null;
    
    this.position_ = new Point;
    this.position_.changed( this.changed );
    this.size_ = new Size;
    this.size_.changed( this.changed );
    
    /* Style Properties */
    this.offset_ = new Point;
    this.offset_.changed( this.changed );
	this.scale_ = new Point( 1, 1 );
    this.scale_.changed( this.changed );
	this.angle_ = 0;
	this.skew_ = new Point;
    this.skew_.changed( this.changed );
	this.color_ = Color.black;
	this.drawStyle_ = 'fill';  //stroke, fill...
	this.lineWidth_ = 1;
	this.lineCap_ = 'bull'; //bull, round, square...
	this.miterLimit_ = null;
	this.lineJoin_ = 'miter'; //miter, bevel, round...
	this.closePath_ = null;
    this.alignContext_ = 'parent'; //parent, root, [object Shape]
    this.align_ = 'top left'; //inner, outer, left, right, bottom, center, top, or all together...
    
    this.valid = false;
    this.changed( function() { this.valid = false; } );
    
    this.set( x, y );
};

Shape.prototype = Utils.extend( EventObject, {
    get clone() {
      
        return new Shape( this );
    },
    get position() { return this.position_; },
    set position( value ) {
        
        throw 'Cannot redeclare position, use Shape.position.set( x/Object, y ) instead';
    },
    get size() { return this.size_; },
    set size( value ) {
        
        throw 'Cannot redeclare size, use Shape.size.set( width/Object, height ) instead';
    },
    get x() { return this.position.x; },
    set x( value ) { this.position.x = value; },
    get y() { return this.position.y; },
    set y( value ) { this.position.y = value; },
    get width() { return this.size.width; },
    set width( value ) { this.size.width = value; },
    get height() { return this.size.height; },
    set height( value ) { this.size.height = value; },
    get center() {

        return new Point( this.x + this.width / 2, this.y + this.height / 2 );
    },
    set center( value ) {

        if( value.x )
            this.x = value.x - this.width / 2;

        if( value.y )
            this.y = value.y - this.height / 2;

    },
    get left() { return this.x; },
    set left( value ) { this.width -= this.x - value; this.x = value; },
    get right() { return this.width + this.x; },
    set right( value ) { this.width = value - this.x; },
    get top() { return this.y; },
    set top( value ) { this.height -= this.y - value; this.y = value; },
    get bottom() { return this.y + this.height; },
    set bottom( value ) { this.height = value - this.y; },
    get leftTop() { return new Point( this.left, this.top ); },
    set leftTop( value ) { this.left = value.x; this.top = value.y; },
    get rightTop() { return new Point( this.right, this.top ); },
    set rightTop( value ) { this.right = value.x; this.top = value.y; },
    get leftBottom() { return new Point( this.left, this.bottom ); },
    set leftBottom( value ) { this.left = value.x; this.bottom = value.y; },
    get rightBottom() { return new Point( this.right, this.bottom ); },
    set rightBottom( value ) { this.right = value.x; this.bottom = value.y; },
    get offset() { return this.offset_; },
    set offset( value ) {
        
        throw 'Cannot redeclare offset, use Shape.offset.set( x/Object, y ) instead';
    },
    get scale() { return this.scale_; },
    set scale( value ) {
        
        throw 'Cannot redeclare scale, use Shape.scale.set( x/Object, y ) instead';
    },
    get angle() { return this.angle_; },
    set angle( value ) { this.changed( { property: 'angle', oldValue: this.angle_, value: value } ); this.angle_ = value; },
    get skew() { return this.skew_; },
    set skew( value ) {
        
        throw 'Cannot redeclare skew, use Shape.skew.set( x/Object, y ) instead';
    },
    get color() { return this.color_; },
    set color( value ) { this.changed( { property: 'color', oldValue: this.color_, value: value } ); this.color_ = value; },
    get drawStyle() { return this.drawStyle_; },
    set drawStyle( value ) { 
        
        if( !Utils.inArray( [ 'stroke', 'fill', 'clear' ] ) )
            value = 'fill';
        
        this.changed( { property: 'drawStyle', oldValue: this.drawStyle_, value: value } );
        this.drawStyle_ = value; 
    },
    get lineWidth() { return this.lineWidth_; },
    set lineWidth( value ) { this.changed( { property: 'lineWidth', oldValue: this.lineWidth_, value: value } ); this.lineWidth_ = value; },
    get lineCap() { return this.lineCap_; },
    set lineCap( value ) { this.changed( { property: 'lineCap', oldValue: this.lineCap_, value: value } ); this.lineCap_ = value; },
    get miterLimit() { return this.miterLimit_; },
    set miterLimit( value ) { this.changed( { property: 'miterLimit', oldValue: this.miterLimit_, value: value } ); this.miterLimit_ = value; },
    get lineJoin() { return this.lineJoin_; },
    set lineJoin( value ) { this.changed( { property: 'lineJoin', oldValue: this.lineJoin_, value: value } ); this.lineJoin_ = value; },
    get closePath() { return this.closePath_; },
    set closePath( value ) { this.changed( { property: 'closePath', oldValue: this.closePath_, value: value } ); this.closePath_ = value; },
    get align() { return this.align_; },
    set align( value ) { 
        
        var alignContext = null;
        switch( this.alignContext ) {
            case 'parent':

                alignContext = this.parent;
                break;
            case 'root':

                alignContext = this.root;
                break;
            default:

                alignContext = this.alignContext;
        }
        var align = Utils.isString( this.align ) ? this.align : 'center center center';

        this.alignBy( alignContext, align );
        this.changed( { property: 'align', oldValue: this.align_, value: value } );
        this.align_ = value; 
    },
    get alignContext() { return this.alignContext_; },
    set alignContext( value ) { this.alignBy( value, this.align ); this.changed( { property: 'alignContext', oldValue: this.alignContext_, value: value } ); this.alignContext_ = value; },
    get children() { return this.children_; },
    set children( value ) { 
        
        throw 'Cannot set children manually, use addChild instead';
    },
    get parent() { return this.parent_; },
    set parent( value ) {
        
        if( value === this.parent_ )
            return;
        
        if( !value.hasChild( this ) )
            value.children.push( this );
        
        if( this.parent_ )
            this.parent.removeChild( this );
        
        this.changed( { property: 'parent', oldValue: this.parent_, value: value } );
        this.parent_ = value;
        
    },
    
    hasChild: function( shape ) {
        
        for( var i in this.children )
            if( shape === this.children[ i ] )
                return true;
        
        return false;
    },
            
    addChild: function( shape ) {

        if( Utils.isArray( shape ) ) {
            
            for( var i in shape )
                this.addChild( shape[ i ] );
                
            return this;
        }
        
        if( !( shape instanceof Shape ) )
            throw 'Can only add Shape instances to shape children';
        
        shape.parent = this;
        
        return this;
    },
            
    removeChild: function( shape ) {

        if( Utils.isArray( shape ) ) {
            
            for( var i in shape )
                this.removeChild( shape[ i ] );
            
            return this;
        }
        
        for( var i in this.children )
            if( this.children[ i ] === shape )
                this.children.splice( i, 1 );
        
        return this;
    },
    
    set: function( x, y, deep ) {
      
        deep = deep || true;
      
        if( Utils.isObject( x ) ) {
            
            if( x.width ) this.width = x.width;
            if( x.height ) this.height = x.height;
            if( x.parent ) this.parent = x.parent;
            if( x.offset ) this.offset.set( x.offset );
            if( x.scale ) this.scale.set( x.scale );
            if( x.angle ) this.angle = x.angle;
            if( x.skew ) this.skew.set( x.skew );
            if( x.color ) this.color = x.color;
            if( x.drawStyle ) this.drawStyle = x.drawStyle;
            if( x.lineWidth ) this.lineWidth = x.lineWidth;
            if( x.lineCap ) this.lineCap = x.lineCap;
            if( x.miterLimit ) this.miterLimit = x.miterLimit;
            if( x.lineJoin ) this.lineJoin = x.lineJoin;
            if( x.closePath ) this.closePath = x.closePath;
            if( x.alignContext ) this.alignContext_ = x.alignContext;
            if( x.align ) this.align = x.align;
            if( x.x ) this.x = x.x;
            if( x.y ) this.y = x.y;
            
            if( deep ) {
                
                //we allow those, too! they just dont make sense in a copy
                //this extends our possibilities in animating later on
                //They are not needed, because each of those properties
                //just modify x and y and we already set these in a plain copy
                //for a copy of an object, use either (new Shape).set( source ) or Shape.clone( source )
                if( x.position ) this.position.set( x.position );
                if( x.size ) this.size.set( x.size );
                if( x.center ) this.center = x.center;
                if( x.left ) this.left = x.left;
                if( x.right ) this.right = x.right;
                if( x.top ) this.top = x.top;
                if( x.bottom ) this.bottom = x.bottom;
                if( x.leftTop ) this.leftTop = x.leftTop;
                if( x.rightTop ) this.rightTop = x.rightTop;
                if( x.leftBottom ) this.leftBottom = x.leftBottom;
                if( x.rightBottom ) this.rightBottom = x.rightBottom;
            }
            
        } else {
            
            this.x = x;
        }
        
        if( y )
            this.y = y;
        
        return this;
    },
            
    applyStyles: function( context ) {

		//Apply styles if needed (If no style selected, properties won't change for performance reasons)
		if( this.offset instanceof Point && !this.offset.isZero() ) 
			context.translate( this.offset.x, this.offset.y );

		if( this.scale instanceof Point && ( this.scale.x !== 1 || this.scale.y !== 1 ) ) 
			context.scale( this.scale.x, this.scale.y );

		if( this.angle !== 0 )
			context.rotate( this.angle );

		if( context.lineWidth !== this.lineWidth )
			context.lineWidth = this.lineWidth;

		if( context.lineCap !== this.lineCap )
			context.lineCap = this.lineCap;

		if( context.miterLimit !== this.miterLimit )
			context.miterLimit = this.miterLimit;

		if( context.lineJoin !== this.lineJoin )
			context.lineJoin = this.lineJoin;

		if( this.skew instanceof Point && !this.skew.isZero() )
			context.transform( 1, this.skew.x, this.skew.y, 1, 0, 0 );
        
        var colorProp = this.drawStyle + 'Style';
        // the color will only be re-set, if it changes
        if( this.color !== context[ colorProp ] )
            context[ colorProp ] = this.color;
        
        return this;
    },
    fill: function( context ) {

		context.fillRect( this.x, this.y, this.width, this.height );

		return this;
	},
	stroke: function( context ) {

		context.strokeRect( this.x, this.y, this.width, this.height );

		return this;
	},
    clear: function( context ) {
        
        context.clearRect(  this.x, this.y, this.width, this.height );
    },
    style: function( properties ) {
        
        if( Utils.isString( properties ) ) {
            
            var parts = properties.split( ' ' );
            for( var i in parts ) {

                var token = parts[ i ];

                switch( token ) {
                    case 'stroke':
                        this.drawStyle = 'stroke';
                        break;
                    case 'fill':
                        this.drawStyle = 'fill';
                        break;
                    default:

                        if( token in Color )
                            this.color = Color[ token ];
                        else if( token.charAt( 0 ) === '#' || token.substr( 0, 3 ) === 'rgb' || token.substr( 0, 3 ) === 'hsl' )
                            this.color = token;
                }
            }
        } else if( Utils.isObject( properties ) ) {
            
            this.set( properties );
        }
        
        return this;
    },
            
    draw: function( context ) {
        
        context.save();
        
        this.applyStyles( context );
        
        this[ this.drawStyle ]( context );
        
        if( this.children.length )
            for( var i in this.children )
                //redraw shapes that are directly connected to this parent only
                if( this.collidesWith( this.children[ i ] ) && !this.children[ i ].valid )
                    this.children[ i ].draw( context );

		context.restore();
        
        this.valid = true;
        
        return this;
    },
            
    alignBy: function( context, position ) {
        
        position = ( position || '' ).split( ' ' );
        var type = 'center';
        var xType = null;
        var yType = null;

        var thisWidth = this.width || ( this.radius ? this.radius * 2 : 0 );
        var thatWidth = context.width || ( context.radius ? context.radius * 2 : 0 );
        var thisHeight = this.height || ( this.radius ? this.radius * 2 : 0 );
        var thatHeight = context.height || ( context.radius ? context.radius * 2 : 0 );
        
        for( var i in position ) {
            switch( position[ i ] ) {
                case 'center':
                    
                    if( xType !== null && yType !== null ) {
                        
                        type = 'center';
                    } else if( xType !== null ) {
                        
                        yType = 'center';
                    } else {
                        
                        xType = 'center';
                    }
                    
                    break;
                case 'left':
                case 'right':
                    
                    xType = position[ i ];
                    break;
                case 'top':
                case 'bottom':
                    
                    yType = position[ i ];
                    break;
                case 'inner':
                case 'outer':

                    type = position[ i ];
            }
        }
        
        if( !xType ) xType = 'center';
        if( !yType ) yType = 'center';
        
        //position
        switch( xType ) {
            case 'left':
                
                //position inner first
                this.x = context.x;
                
                switch( type ) {
                    case 'center':
                        
                        this.x -= thisWidth / 2;
                        break;
                    case 'outer':
                        
                        this.x -= thisWidth;
                }
                break;
            case 'right':
                
                //position outer first
                this.x = context.x + thatWidth;
                
                switch( type ) {
                    case 'center':
                        
                        this.x -= thisWidth / 2;
                        break;
                    case 'inner':
                        
                        this.x -= thisWidth;
                }
                break;
           case 'center':
               
               //position center first
               this.x = context.x + ( thatWidth / 2 ) - thisWidth / 2;
               break;
        }
        
        switch( yType ) {
            case 'top':
                
                //position inner first
                this.y = context.y;
                
                switch( type ) {
                    case 'center':
                        
                        this.y -= thisHeight/ 2;
                        break;
                    case 'outer':
                        
                        this.y -= thisHeight;
                }
                break;
            case 'bottom':
                
                //position outer first
                this.y = context.y + thatHeight;
                
                switch( type ) {
                    case 'center':
                        
                        this.y -= thisHeight / 2;
                        break;
                    case 'inner':
                        
                        this.y -= thisHeight;
                }
                break;
           case 'center':
               
               //position center first
               this.y = context.y + ( thatHeight / 2 ) - thisHeight / 2;
               break;
        }
        
        return this;
    },
            
    /* Collision stuff */
    collidesWith: function( rect ) {
        
        var left = rect.left ? rect.left : rect.x;
        var right = rect.right ? rect.right : rect.x + ( rect.width ? rect.width : 0 );
        var top = rect.top ? rect.top : rect.y;
        var bottom = rect.bottom ? rect.bottom : rect.y + ( rect.height ? rect.height : 0 );
        
        return !( left > this.right || right < this.left || top > this.bottom || bottom < this.top );
    },
    contains: function( rect ) {
        
        //the difference between collidesWith and contains is just that contains
        //checks if the WHOLE object is inside the shape while collidesWith checks,
        //if only a part of the shape touches the target shape
        var left = rect.left ? rect.left : rect.x;
        var right = rect.right ? rect.right : rect.x + ( rect.width ? rect.width : 0 );
        var top = rect.top ? rect.top : rect.y;
        var bottom = rect.bottom ? rect.bottom : rect.y + ( rect.height ? rect.height : 0 );
        
        return ( left > this.left && right < this.right && top > this.top && bottom < this.bottom );
    }
   
} );