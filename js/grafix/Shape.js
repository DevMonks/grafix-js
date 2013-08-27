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


    // Shape position and size
    this._x = 0;
    this._y = 0;
    this._width = 0;
    this._height = 0;

    // Style properties
    this._offsetX = 0;
    this._offsetY = 0;
    this._scaleWidth = 1;
    this._scaleHeight = 1;
    this._angle = 0;
    this._skewX = 0;
    this._skewY = 0;
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

        return Utils.clone( Shape, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return ShapeBase.prototype.cloneableProperties.concat([
            'x',
            'y',
            'width',
            'height',
            'angle',
            'skewX',
            'skewY',
            'offsetX',
            'offsetY',
            'scaleWidth',
            'scaleHeight',
            'color',
            'drawStyle',
            'lineWidth',
            'lineCap',
            'miterLimit',
            'lineJoin',
            'closePath',
            'align',
            'alignContext'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Shape'; },

    get x() { return this.prop( 'x' ); },
    set x( value ) { this.prop( 'x', value ); },

    get y() { return this.prop( 'y' ); },
    set y( value ) { this.prop( 'y', value ); },

    get width() { return this.prop( 'width' ); },
    set width( value ) { this.prop( 'width', value ); },

    get height() { return this.prop( 'height' ); },
    set height( value ) { this.prop( 'height', value ); },

    get angle() { return this.prop( 'angle' ); },
    set angle( value ) { this.prop( 'angle', value ); },

    get skewX() { return this.prop( 'skewX' ); },
    set skewX( value ) { this.prop( 'skewX', value ); },

    get skewY() { return this.prop( 'skewY' ); },
    set skewY( value ) { this.prop( 'skewY', value ); },

    get offsetX() { return this.prop( 'offsetX' ); },
    set offsetX( value ) { this.prop( 'offsetX', value ); },

    get offsetY() { return this.prop( 'offsetY' ); },
    set offsetY( value ) { this.prop( 'offsetY', value ); },

    get scaleWidth() { return this.prop( 'scaleWidth' ); },
    set scaleWidth( value ) { this.prop( 'scaleWidth', value ); },

    get scaleHeight() { return this.prop( 'scaleHeight' ); },
    set scaleHeight( value ) { this.prop( 'scaleHeight', value ); },

    get color() { return this.prop( 'color' ); },
    set color( value ) { return this.prop( 'color', value ); },

    get drawStyle() { return this.prop( 'drawStyle' ); },
    set drawStyle( value ) { return this.prop( 'drawStyle', value ); },

    get lineWidth() { return this.prop( 'lineWidth' ); },
    set lineWidth( value ) { return this.prop( 'lineWidth', value ); },

    get lineCap() { return this.prop( 'lineCap' ); },
    set lineCap( value ) { return this.prop( 'lineCap', value ); },

    get miterLimit() { return this.prop( 'miterLimit' ); },
    set miterLimit( value ) { return this.prop( 'miterLimit', value ); },

    get lineJoin() { return this.prop( 'lineJoin' ); },
    set lineJoin( value ) { return this.prop( 'lineJoin', value ); },

    get closePath() { return this.prop( 'closePath' ); },
    set closePath( value ) { return this.prop( 'closePath', value ); },

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
        }
    },

    get alignContext() { return this.prop( 'alignContext' ); },
    set alignContext( value ) {

        this.alignBy( value, this.align );
        if( this.prop( 'alignContext', value ) !== false ) {
            this.alignBy();
        }
    },

    get position() { return new Point( this.x, this.y ); },
    set position( value ) {

        if( Utils.isObject( value ) ) {
            if( 'x' in value ) { this.x = value.x; }
            if( 'y' in value ) { this.y = value.y; }
        } else if( Utils.isNumeric( value ) ) {
            this.x = this.y = value;
        } else {
            throw "Invalid type of value for property Shape.position: " + value;
        }
    },

    get size() { return new Size( this.width, this.height ); },
    set size( value ) {

        if( Utils.isObject( value ) ) {
            if( 'width' in value ) { this.width = value.width; }
            if( 'height' in value ) { this.height = value.height; }
        } else if( Utils.isNumeric( value ) ) {
            this.width = this.height = value;
        } else {
            throw "Invalid type of value for property Shape.size: " + value;
        }
    },

    get offset() { return new Point( this.offsetX, this.offsetY ); },
    set offset( value ) {

        if( Utils.isObject( value ) ) {
            if( 'offsetX' in value ) { this.offsetX = value.offsetX; }
            else if( 'x' in value )  { this.offsetX = value.x; }
            if( 'offsetY' in value ) { this.offsetY = value.offsetY; }
            else if( 'y' in value )  { this.offsetY = value.y; }
        } else if( Utils.isNumeric( value ) ) {
            this.offsetX = this.offsetY = value;
        } else {
            throw "Invalid type of value for property Shape.offset: " + value;
        }
    },

    get scale() { return new Point( this.scaleWidth, this.scaleHeight ); },
    set scale( value ) {

        if( Utils.isObject( value ) ) {
            if( 'scaleWidth' in value ) { this.scaleWidth = value.scaleWidth; }
            else if( 'width' in value ) { this.scaleWidth = value.width; }
            if( 'scaleHeight' in value ) { this.scaleHeight = value.scaleHeight; }
            else if( 'height' in value ) { this.scaleHeight = value.height; }
        } else if( Utils.isNumeric( value ) ) {
            this.scaleWidth = this.scaleHeight = value;
        } else {
            throw "Invalid type of value for property Shape.scale: " + value;
        }
    },

    get skew() { return new Point( this.skewX, this.skewY ); },
    set skew( value ) {

        if( Utils.isObject( value ) ) {
            if( 'skewX' in value )  { this.skewX = value.skewX; }
            else if( 'x' in value ) { this.skewX = value.x; }
            if( 'skewY' in value )  { this.skewY = value.skewY; }
            else if( 'y' in value ) { this.skewY = value.y; }
        } else if( Utils.isNumeric( value ) ) {
            this.skewX = this.skewY = value;
        } else {
            throw "Invalid type of value for property Shape.skew: " + value;
        }
    },

    get rect() { return new Rectangle( this.x, this.y, this.width, this.height ); },
    set rect( value ) {

        if( Utils.isObject( value ) ) {
            if( 'x' in value ) { this.x = value.x; }
            if( 'y' in value ) { this.y = value.y; }
            if( 'width' in value ) { this.width = value.width; }
            if( 'height' in value ) { this.height = value.height; }
        } else {
            throw "Invalid type of value for property Shape.rect: " + value;
        }
    },

    get rectScaled() { return new Rectangle( this.x, this.y, this.width * this.scaleWidth, this.height * this.scaleHeight ); },

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

        this.width = value - this.x;
    },

    get top() { return this.y; },
    set top( value ) {

        this.height -= this.y - value;
        this.y = value;
    },

    get bottom() { return this.y + this.height; },
    set bottom( value ) {

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


    set: function( x, y, deep ) {
        deep = deep || true;

        ShapeBase.prototype.set.call(this, x, y);

        if( Utils.isObject( x ) ) {

            if( 'position' in x ) {
                this.position = x.position;
            }
            if( 'size' in x ) {
                this.size = x.size;
            }
            if( 'rect' in x ) {
                this.rect = x.rect;
            }
            if( 'x' in x ) {
                this.x = x.x;
            }
            if( 'y' in x ) {
                this.y = x.y;
            }
            if( 'width' in x ) {
                this.width = x.width;
            }
            if( 'height' in x ) {
                this.height = x.height;
            }
            if( 'offset' in x ) {
                this.offset = x.offset;
            }
            if( 'scale' in x ) {
                this.scale = x.scale;
            }
            if( 'angle' in x ) {
                this.angle = x.angle;
            }
            if( 'skew' in x ) {
                this.skew = x.skew;
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

                // We allow those, too! they just dont make sense in a copy
                // this extends our possibilities in animating later on
                // They are not needed, because each of those properties
                // just modify x and y and we already set these in a plain copy
                // for a copy of an object, use either (new Shape).set( source ) or Shape.clone( source )
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

        } else if( Utils.isUndefined( x ) === false ) {
            this.x = x;
        }

        if( Utils.isUndefined( y ) === false ) {
            this.y = y;
        }

        return this;
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

    alignBy: function( context, position ) {

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

        // Read the alignment steps:
        // - xType: (left|right|center)
        // - yType: (top|bottom|center)
        // - type:  (inner|outer|center)
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

        // Apply new position based on the detected alignment
        switch ( xType ) {

            case 'left':
                // Default to type = inner
                this.x = context.x;

                switch ( type ) {
                    case 'center':

                        this.x -= thisWidth / 2;
                        break;
                    case 'outer':

                        this.x -= thisWidth;
                        break;
                }
                break;

            case 'right':
                // Default to type = outer
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

                this.x = context.x + ( thatWidth / 2 ) - thisWidth / 2;
                break;
        }

        switch ( yType ) {

            case 'top':
                // Default to type = inner
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
                // Default to type = outer
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

                this.y = context.y + ( thatHeight / 2 ) - thisHeight / 2;
                break;
        }

        return this;
    },

    animate: function( props, duration, easing, callback ) {

        //@ TODO: Also allow the following variable orders
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


    // Styling

    applyStyles: function( context ) {

        context = context || this.canvasContext;

        // Apply styles if needed (If no style selected, properties won't change for performance reasons)
        if( this.offsetX !== 0 || this.offsetY !== 0 ) {
            context.translate( this.offsetX, this.offsetY );
        }

        // @TODO: This scales also x and y.. wtfh?
        //        We currently using scale only in Bitmap, so this is disabled until further testing
        //        Bitmap now uses Shape.rectScaled for the drawn destination
        //if( this.scaleWidth !== 1 || this.scaleHeight !== 1 ) {
        //    context.scale( this.scaleWidth, this.scaleHeight );
        //}

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

        if( this.skewX !== 0 || this.skewY !== 0 ) {
            context.transform( 1, this.skewX, this.skewY, 1, 0, 0 );
        }

        // Resolves to canvas' "fillStyle", "strokeStyle" and "clearStyle" (does not exist)
        var colorProp = this.drawStyle + 'Style';
        // The color will only be re-set, if it has been changed
        if( this.color !== context[ colorProp ] ) {
            context[ colorProp ] = this.color;
        }

        return this;
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
            if( style.offset ) this.offset = style.offset;
            if( style.scale ) this.scale = style.scale;
            if( style.angle ) this.angle = style.angle;
            if( style.skew ) this.skew = style.skew;
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

    _draw: function( context, config ) {

        var applyStyles = ( Utils.isObject( config ) ? config.styles !== false : true ),
            applyFilter = ( Utils.isObject( config ) ? config.filter !== false : true );

        // Apply styles
        if( applyStyles ) {
            this.applyStyles( context );
        }

        // Draw it using the current {drawStyle} (stroke, fill or clear)
        this[this.drawStyle].call( this, context, applyFilter );

        // Draw dirty children
        if( this.children.length ) {
            var shape = this;
            this.eachChild( function( childIndex ) {
                // Redraw shapes that are directly connected to this parent only
                // @TODO: This causes an overlay problem..
                //        We have to check if any child needs a redraw and, if so, we have to redraw everything
                //        Only redrawing dirty childs will make them overlapping ther other not-yet-dirty childs
                //if( shape.collidesWith( this )/* && child.isDirty */) {
                    //console.log('Shape.draw() poke child for draw (dirty=', child.isDirty, '):', child);
                    //this.draw( context, forceChildDraw );
                //}
                // @FIX: This is not always the case, just draw the child
                this.draw( context, true, { styles: applyStyles, filter: applyFilter } );
            } );
        }

        return this;
    },

    fill: function( context, applyFilter ) {

        context = context || this.canvasContext;
        // Handle filtered data as image data
        if( applyFilter && this.hasFilter() ) {

            var tmpCanvas = Utils.getTempCanvas( this ),
                tmpCtx = tmpCanvas.getContext('2d');
            tmpCtx.putImageData( this.filteredData, 0, 0 );
            context.drawImage( tmpCanvas, this.x, this.y );
            return this;
        }

        //console.log(this.className + '::fill @ ', this.color, this.x, this.y, this.width, this.height );
        context.fillRect( this.x, this.y, this.width, this.height );

        return this;
    },

    stroke: function( context, applyFilter ) {

        context = context || this.canvasContext;
        // Handle filtered data as image data
        if( applyFilter && this.hasFilter() ) {

            var tmpCanvas = Utils.getTempCanvas( this ),
                tmpCtx = tmpCanvas.getContext('2d');
            tmpCtx.putImageData( this.filteredData, 0, 0 );
            context.drawImage( tmpCanvas, this.x, this.y );
            return this;
        }

        //console.log(this.className + '::stroke @ ', this.color, this.x, this.y, this.width, this.height );
        context.strokeRect( this.x, this.y, this.width, this.height );

        return this;
    },

    clear: function( context, applyFilter ) {

        // @TODO: No use-case for filtered draw here?
        context = context || this.canvasContext;
        //console.log(this.className + '::clear @ ', this.color, this.x, this.y, this.width, this.height );
        context.clearRect( this.x, this.y, this.width, this.height );
    },


    // Collision stuff

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

            
    toString: function(fullDebug) {

        if( !fullDebug ) {
            // @TODO: Output everything, but only if set
            return '{color:' + this.color + ', x:' + this.x + ', y:' + this.y + ', width:' + this.width + ', height:' + this.height + '}';
        }

        var properties = this._debugProperties();
        return properties;
    }

} );
