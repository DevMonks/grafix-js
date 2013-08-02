var Shape = function( x, y ) {
    ShapeBase.call( this, x, y );

    // Some positions for click and drag & drop support
    this._lastPositions = {
        mouse: new Point,
        mouseDown: new Point,
        mouseUp: new Point
    };
    this._mouseDragLazyness = 1;
    this._mouseOnState = false;
    this._isMouseDragging = false;


    // Shape position and style properties
    this._position = new Point( { parent: this } );
    this._size = new Size( { parent: this } );

    /* Style Properties */
    this._offset = new Point( { parent: this } );
    this._scale = new Size( { width: 1, height: 1, parent: this } );
    this._angle = 0;
    this._skew = new Point( { parent: this } );
    this._color = Color.black;
    this._drawStyle = Shape.defaults.drawStyle;
    this._lineWidth = 1;
    this._lineCap = Shape.defaults.lineCap;
    this._miterLimit = null;
    this._lineJoin = Shape.defaults.lineJoin;
    this._closePath = null;
    this._alignContext = Shape.defaults.alignContext;
    this._align = Shape.defaults.align;

    this.set( x, y );
};

Shape.defaults = {
    drawStyles: [ 'fill', 'stroke', 'clear' ],
    drawStyle: 'fill',
    lineCaps: [ 'butt', 'round', 'square' ],
    lineCap: 'butt',
    lineJoins: [ 'miter', 'bevel', 'round' ],
    lineJoin: 'miter',
    alignContexts: [ 'parent', 'root' ],
    alignContext: 'parent',
    aligns: [ 'top', 'bottom', 'left', 'ritght', 'inner', 'outer' ],
    align: 'top left'
};

Shape.prototype = Utils.extend( ShapeBase, {
    get clone() {
        return new Shape( this );
    },

    get position() { return this.prop('position'); },
    set position( value ) { throw 'Cannot redeclare position, use Shape.position.set( x/Object, y ) instead';},

    get size() { return this.prop('size'); },
    set size( value ) { throw 'Cannot redeclare size, use Shape.size.set( width/Object, height ) instead'; },

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
        if( value.x ) {
            this.x = value.x - this.width / 2;
        }

        if( value.y ) {
            this.y = value.y - this.height / 2;
        }
    },

    get left() { return this.x; },
    set left( value ) {
        this.width -= this.x - value;
        this.x = value;
    },

    get right() { return this.width + this.x; },
    set right( value ) {
        if( Utils.isNumeric( value ) === false ) {
            return;
        }

        this.width = value - this.x;
    },

    get top() { return this.y; },
    set top( value ) {
        if( Utils.isNumeric( value ) === false ) {
            return;
        }

        this.height -= this.y - value;
        this.y = value;
    },

    get bottom() { return this.y + this.height; },
    set bottom( value ) {
        if( Utils.isNumeric( value ) === false ) {
            return;
        }

        this.height = value - this.y;
    },

    get leftTop() { return new Point( this.left, this.top ); },
    set leftTop( value ) {
        this.left = value.x;
        this.top = value.y;
    },

    get rightTop() { return new Point( this.right, this.top ); },
    set rightTop( value ) {
        this.right = value.x;
        this.top = value.y;
    },

    get leftBottom() { return new Point( this.left, this.bottom ); },
    set leftBottom( value ) {
        this.left = value.x;
        this.bottom = value.y;
    },

    get rightBottom() { return new Point( this.right, this.bottom ); },
    set rightBottom( value ) {
        this.right = value.x;
        this.bottom = value.y;
    },

    get offset() { return this.prop( 'offset' ); },
    set offset( value ) { throw 'Cannot redeclare offset, use Shape.offset.set( x/Object, y ) instead'; },

    get scale() { return this.prop( 'scale' ); },
    set scale( value ) { throw 'Cannot redeclare scale, use Shape.scale.set( width/Object, height ) instead'; },

    get angle() { return this.prop( 'angle' ); },
    set angle( value ) {
        if( Utils.isNumeric( value ) === false ) {
            return;
        }

        if( this.prop( 'angle', value ) !== false ) {
            // Informs also parent
            this.invalid = true;
        }
    },

    get skew() { return this.prop( 'skew' ); },
    set skew( value ) { throw 'Cannot redeclare skew, use Shape.skew.set( x/Object, y ) instead'; },

    get color() { return this.prop( 'color' ); },
    set color( value ) {
        if( this.prop( 'color', value ) !== false ) {
            // Informs also parent
            this.invalid = true;
        }
    },

    get drawStyle() { return this.prop( 'drawStyle' ); },
    set drawStyle( value ) {

        if( !(value in Shape.defaults.drawStyles) ) {
            value = Shape.defaults.drawStyle;
        }

        if( this.prop( 'drawStyle', value ) !== false ) {
            // Informs also parent
            this.invalid = true;
        }
    },

    get lineWidth() { return this.prop( 'lineWidth' ); },
    set lineWidth( value ) {
        this.prop( 'lineWidth', value );
        // Informs also parent
        this.invalid = true;
    },

    get lineCap() { return this.prop( 'lineCap' ); },
    set lineCap( value ) {
        if( this.prop( 'lineCap', value ) !== false ) {
            // Informs also parent
            this.invalid = true;
        }
    },

    get miterLimit() { return this.prop( 'miterLimit' ); },
    set miterLimit( value ) {
        if( Utils.isNumeric( value ) === false ) {
            return;
        }

        if( this.prop( 'miterLimit', value ) !== false ) {
            // Informs also parent
            this.invalid = true;
        }
    },

    get lineJoin() { return this.prop( 'lineJoin' ); },
    set lineJoin( value ) {
        if( this.prop( 'lineJoin', value ) !== false ) {
            // Informs also parent
            this.invalid = true;
        }
    },

    get closePath() { return this.prop( 'closePath' ); },
    set closePath( value ) {
        if( this.prop( 'closePath', value ) !== false ) {
            // Informs also parent
            this.invalid = true;
        }
    },

    get align() { return this.prop( 'align' ); },
    set align( value ) {
        var alignContext = null;
        // @TODO: Make this using Shape.defaults.alignContexts!
        switch ( this.alignContext ) {
            case 'parent':

                alignContext = this.parent;
                break;
            case 'root':

                alignContext = this.root;
                break;
            default:
                alignContext = this.alignContext;
                break;
        }

        if( alignContext ) {
            // @TODO: Shouln'd this use Shape.defaults.align?
            var align = Utils.isString( this.align ) ? this.align : 'center center center';
            this.alignBy( alignContext, align );
        }

        if( this.prop( 'align', value ) !== false ) {
            this.alignBy();
            // Informs also parent
            this.invalid = true;
        }
    },

    get alignContext() { return this.prop( 'alignContext' ); },
    set alignContext( value ) {
        this.alignBy( value, this.align );
        if( this.prop( 'alignContext', value ) !== false ) {
            this.alignBy();
            // Informs also parent
            this.invalid = true;
        }
    },

    set: function( x, y, deep ) {
        deep = deep || true;

        ShapeBase.prototype.set.call(this, x, y);

        this.position.set( x, y );

        if( Utils.isObject( x ) ) {
            
            if( 'width' in x ) {
                this.width = x.width;
            }
            if( 'height' in x ) {
                this.height = x.height;
            }
            if( 'offset' in x ) {
                this.offset.set( x.offset );
            }
            if( 'scale' in x ) {
                this.scale.set( x.scale );
            }
            if( 'angle' in x ) {
                this.angle = x.angle;
            }
            if( 'skew' in x ) {
                this.skew.set( x.skew );
            }
            if( 'color' in x ) {
                this.color = x.color;
            }
            if( 'drawStyle' in x ) {
                this.drawStyle = x.drawStyle;
            }
            if( 'lineWidth' in x ) {
                this.lineWidth = x.lineWidth;
            }
            if( 'lineCap' in x ) {
                this.lineCap = x.lineCap;
            }
            if( 'miterLimit' in x ) {
                this.miterLimit = x.miterLimit;
            }
            if( 'lineJoin' in x ) {
                this.lineJoin = x.lineJoin;
            }
            if( 'closePath' in x ) {
                this.closePath = x.closePath;
            }
            if( 'alignContext' in x ) {
                this._alignContext = x.alignContext;
            }
            if( 'align' in x ) {
                this.align = x.align;
            }
            if( 'x' in x ) {
                this.x = x.x;
            }
            if( 'y' in x ) {
                this.y = x.y;
            }
            
            // Also clone child shapes!
            // @TODO: ShapeBase.set have to take care of childrens
            //        Also clone wont work as expected because we have to store a reference to the exact child
            //        Clone would create a new instance instead
            /*
            if( 'children' in x && x.children.length > 0 ) {
                for( var i in x.children ) {
                    
                    var child = x.children[ i ];
                    
                    if( 'clone' in child )
                        this.addChild( child.clone );
                }
            }
            */

            if( deep ) {

                //we allow those, too! they just dont make sense in a copy
                //this extends our possibilities in animating later on
                //They are not needed, because each of those properties
                //just modify x and y and we already set these in a plain copy
                //for a copy of an object, use either (new Shape).set( source ) or Shape.clone( source )
                if( 'position' in x )
                    this.position.set( x.position );
                
                if( 'size' in x ) {
                    this.size.set( x.size );
                }
                if( 'center' in x ) {
                    this.center = x.center;
                }
                if( 'left' in x ) {
                    this.left = x.left;
                }
                if( 'right' in x ) {
                    this.right = x.right;
                }
                if( 'top' in x ) {
                    this.top = x.top;
                }
                if( 'bottom' in x ) {
                    this.bottom = x.bottom;
                }
                if( 'leftTop' in x ) {
                    this.leftTop = x.leftTop;
                }
                if( 'rightTop' in x ) {
                    this.rightTop = x.rightTop;
                }
                if( 'leftBottom' in x ) {
                    this.leftBottom = x.leftBottom;
                }
                if( 'rightBottom' in x ) {
                    this.rightBottom = x.rightBottom;
                }
            }

        } else if( x !== undefined ) {
            this.x = x;
        }

        return this;
    },

    applyStyles: function( context ) {

        if( !context ) {
            context = this.canvasContext;
        }

        // Apply styles if needed (If no style selected, properties won't change for performance reasons)
        if( this.offset instanceof Point && this.offset.isZero() === false ) {
            context.translate( this.offset.x, this.offset.y );
        }

        if( this.scale instanceof Size && (this.scale.width !== 1 || this.scale.height !== 1) ) {
            context.scale( this.scale.width, this.scale.height );
        }

        if( this.angle !== 0 ) {
            context.rotate( this.angle );
        }

        if( context.lineWidth !== this.lineWidth ) {
            context.lineWidth = this.lineWidth;
        }

        if( context.lineCap !== this.lineCap ) {
            context.lineCap = this.lineCap;
        }

        if( context.miterLimit !== this.miterLimit ) {
            context.miterLimit = this.miterLimit;
        }

        if( context.lineJoin !== this.lineJoin ) {
            context.lineJoin = this.lineJoin;
        }

        if( this.skew instanceof Point && this.skew.isZero() === false ) {
            context.transform( 1, this.skew.x, this.skew.y, 1, 0, 0 );
        }

        var colorProp = this.drawStyle + 'Style';
        // the color will only be re-set, if it changes
        if( this.color !== context[ colorProp ] ) {
            context[ colorProp ] = this.color;
        }

        return this;
    },

    fill: function( context ) {

        context = context || this.canvasContext;
        context.fillRect( this.x, this.y, this.width, this.height );

        return this;
    },

    stroke: function( context ) {

        context = context || this.canvasContext;
        context.strokeRect( this.x, this.y, this.width, this.height );

        return this;
    },

    clear: function( context ) {

        context = context || this.canvasContext;
        context.clearRect( this.x, this.y, this.width, this.height );
    },

    // style is like set(), but only for style properties
    style: function( style ) {

        if( Utils.isString( style ) ) {

            var tokens = style.split( ' ' );
            for( var i in tokens ) {

                var token = tokens[ i ];
                if( (token in Shape.defaults.drawStyles) ) {

                    this.drawStyle = token;
                }
                else if( (token in Shape.defaults.lineCaps) ) {

                    this.lineCap = token;
                }
                else if( (token in Shape.defaults.lineJoins) ) {

                    this.lineJoin = token;
                }
                else if( (token in Shape.defaults.alignContexts) ) {

                    this.alignContext = token;
                }
                else if( (token in Shape.defaults.aligns) ) {

                    // @TODO: These would need to be collected and passed as one string to this.align
                }
                else {
                    // @FIXME: Bad default suggestion..
                    if( Utils.isNumeric( token ) )
                    //lets take it as the lineWidth
                        this.lineWidth = parseInt( token );
                    else
                    //it's probably the color, heh
                        this.color = token;
                }

            }
        } else if( Utils.isObject( style ) ) {

            //You can just pass a shape and copy its styles
            if( style.offset ) this.offset.set( style.offset );
            if( style.scale ) this.scale.set( style.scale );
            if( style.angle ) this.angle = style.angle;
            if( style.skew ) this.skew.set( style.skew );
            if( style.color ) this.color = style.color;
            if( style.drawStyle ) this.drawStyle = style.drawStyle;
            if( style.lineWidth ) this.lineWidth = style.lineWidth;
            if( style.lineCap ) this.lineCap = style.lineCap;
            if( style.miterLimit ) this.miterLimit = style.miterLimit;
            if( style.lineJoin ) this.lineJoin = style.lineJoin;
            if( style.closePath ) this.closePath = style.closePath;
            //maybe a bad idea
            //if( style.alignContext ) this._alignContext = style.alignContext;
            if( style.align ) this.align = style.align;
        }

        return this;
    },


    /**
     * Executed before a draw() happens, should update inner properties and handle input states
     *
     * @returns {self}
     */
    _update: function() {

        // Set some hover and drag states based on input
        var input = this.input;

        if( input ) {
            // Only trigger new mouseMove() if the user moved
            if( this._lastPositions.mouse.equals(input.mouse.position) === false ) {
                // Store last used/seen position
                this._lastPositions.mouse.set(input.mouse.position);

                if( this.contains( input.mouse.position ) ) {

                    this.mouseMove();

                    if( !this._mouseOnState ) {

                        this._mouseOnState = true;
                        this.mouseOn();
                    }
                }

                else if( this._mouseOnState ) {

                    this._mouseOnState = false;
                    this.mouseOff();
                }
            }

            if( input.keyboard.isDown(Keyboard.KEY.MOUSE1) && this._isMouseDragging === false ) {
                var dragLazyness = this._mouseDragLazyness || 1;

                if( this._lastPositions.mouseDown.distanceTo( input.mouse.position ) > dragLazyness ) {
                    this._isMouseDragging = true;
                    this.mouseDrag();
                }
            }

            else if( this._isMouseDragging ) {

                this.mouseDragMove();
            }


            if( input.mouse.isDown(Keyboard.KEY.MOUSE1) || input.mouse.isDown(Keyboard.KEY.MOUSE2) ) {

                if( this.contains( input.mouse.position ) ) {
                    // @TODO: Whats about other mouse buttons? This would handle everything as right button
                    var btn = input.mouse.isDown(Keyboard.KEY.MOUSE1) ? Keyboard.KEY.MOUSE1 : Keyboard.KEY.MOUSE2;

                    this.mouseDown( btn );
                    this._lastPositions.mouseDown.set(input.mouse.position);

                }
            }

            else if( input.mouse.isUp(Keyboard.KEY.MOUSE1) || input.mouse.isUp(Keyboard.KEY.MOUSE2) ) {
                // @TODO: Whats about other mouse buttons? This would handle everything as right button
                var btn = input.mouse.isUp(Keyboard.KEY.MOUSE1) ? Keyboard.KEY.MOUSE1 : Keyboard.KEY.MOUSE2;

                this.mouseUp( btn );
                this._lastPositions.mouseUp.set(input.mouse.position);

                if( this._isMouseDragging !== false ) {
                    this.mouseDrop( this._isMouseDragging );
                    this._isMouseDragging = false;
                }

                if( this.contains( input.mouse.position ) ) {

                    this.mouseClick( btn );

                }
            }

        }

        return this;
    },

    _draw: function( context, forceChildDraw ) {

        // Apply styles
        this.applyStyles( context );
        // Draw it using the current style (stroke, fill or clear)
        this[this.drawStyle].call( this, context );

        // Draw dirty children
        if( this.children.length ) {
            var shape = this;
            this.eachChild( function( childIndex ) {
                // Redraw shapes that are directly connected to this parent only
                // @TODO: This causes an overlay problem..
                //        We have to check if any child needs a redraw and, if so, we have to redraw everything
                //        Only redrawing dirty childs will make them overlapping ther other not-yet-dirty childs
                // @TODO: This is not always the case
                if( shape.collidesWith( this )/* && child.isDirty */) {
                    //console.log('Shape.draw() poke child for draw (dirty=', child.isDirty, '):', child);
                    this.draw( context, forceChildDraw );
                }
            } );
        }

        return this;
    },

    alignBy:      function( context, position ) {

        context = context || this.alignContext;

        switch ( context ) {
            case 'parent':

                context = this.parent;
                break;
            case 'root':

                context = this.root;
                break;
        }

        if( !context )
            return this;

        position = ( position || this.align ).split( ' ' );
        var type = 'center';
        var xType = null;
        var yType = null;

        var thisWidth = this.width || (this.radius ? this.radius * 2 : 0);
        var thatWidth = context.width || (context.radius ? context.radius * 2 : 0);
        var thisHeight = this.height || (this.radius ? this.radius * 2 : 0);
        var thatHeight = context.height || (context.radius ? context.radius * 2 : 0);

        for ( var i = 0; i < position.length; i++ ) {
            switch ( position[i] ) {

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
                    xType = position[i];
                    break;

                case 'top':
                case 'bottom':
                    yType = position[i];
                    break;

                case 'inner':
                case 'outer':
                    type = position[i];
                    break;
            }
        }

        if( !xType ) {
            xType = 'center';
        }
        if( !yType ) {
            yType = 'center';
        }

        //position
        switch ( xType ) {

            case 'left':
                //position inner first
                this.x = context.x;

                switch ( type ) {
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

                switch ( type ) {
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

        switch ( yType ) {

            case 'top':
                //position inner first
                this.y = context.y;

                switch ( type ) {
                    case 'center':

                        this.y -= thisHeight / 2;
                        break;
                    case 'outer':

                        this.y -= thisHeight;
                }
                break;

            case 'bottom':
                //position outer first
                this.y = context.y + thatHeight;

                switch ( type ) {
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
    },
    

    // Input Events

    handleMouseEvent: function( event, callback ) {

        if( callback ) {
            return this.on( event, callback );
        }

        return this.on( event, { eventName: event, context: this, mouse: this._input } );
    },

    mouseMove: function( callback ) {

        return this.handleMouseEvent( 'mouseMove', callback );
    },

    mouseOn: function( callback ) {

        return this.handleMouseEvent( 'mouseOn', callback );
    },

    mouseOff: function( callback ) {

        return this.handleMouseEvent( 'mouseOff', callback );
    },

    mouseHover: function( onCallback, offCallback ) {

        this.mouseOn( onCallback );
        this.mouseOff( offCallback );

        return this;
    },

    mouseDown: function( callback ) {

        return this.handleMouseEvent( 'mouseDown', callback );
    },

    mouseUp: function( callback ) {

        return this.handleMouseEvent( 'mouseUp', callback );
    },

    mouseClick: function( callback ) {

        return this.handleMouseEvent( 'mouseClick', callback );
    },

    mouseDrag: function( callback ) {

        return this.handleMouseEvent( 'mouseDrag', callback );
    },

    mouseDragMove: function( callback ) {

        return this.handleMouseEvent( 'mouseDragMove', callback );
    },

    mouseDrop: function( callback ) {

        return this.handleMouseEvent( 'mouseDrop', callback );
    },
            
    expand: function( shape ) {

        if( this.left > shape.left )
            this.left = shape.left;
        
        if( this.right < shape.right )
            this.right = shape.right;
        
        if( this.top > shape.top )
            this.top = shape.top;
        
        if( this.bottom < shape.bottom )
            this.bottom = shape.bottom;
        
        return this;
    },

    animate: function( props, duration, easing, callback ) {

        //@TODO: Also allow the following variable orders
//        Shape Shape.animate( properties, args );
//        Shape Shape.animate( properties );
//        Shape Shape.animate( properties, duration );
//        Shape Shape.animate( properties, complete );
//        Shape Shape.animate( properties, easing );
//        Shape Shape.animate( properties, easing, complete );
//        Shape Shape.animate( properties, duration, easing );
//        Shape Shape.animate( properties, duration, complete );
//        Shape Shape.animate( properties, duration, easing, complete );
//        Shape Shape.animate( keyFrames );
//        Shape Shape.animate( keyFrames, duration );
//        Shape Shape.animate( keyFrames, complete );

        return new Animation( this, props, {
            duration: duration || Animation.defaults.duration,
            completed: callback || function() {},
            easing: easing || Animation.defaults.easing,
            start: true
        } );
    },

            
    toString: function() {
        
        // @TODO: Output everything, but only if set
        return '{color:' + this.color + ', x:' + this.x + ', y:' + this.y + ', width:' + this.width + ', height:' + this.height + '}';
    }

} );
