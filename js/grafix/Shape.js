var Shape = function ( x, y ) {
    EventObject.call( this );

    this._canvas = null;
    this._canvasContext = null;
    this._children = [];
    // Will changes to own and children properties delegated to the changed() event?
    this._delegateChanged = (Utils.isObject(x) && x.delegateChanged ? true : false);

    /** @var Input */
    this._input = null;
    this._lastPositions = {
        mouse: new Point,
        mouseDown: new Point,
        mouseUp: new Point
    };
    this._mouseDragLazyness = 1;
    this._mouseOnState = false;
    this._isMouseDragging = false;


    // Shape position and style properties
    this._position = new Point( { parent: this, delegateChanged: this._delegateChanged } );
    if (this._delegateChanged) {
        this._position.changed(this.changed, this);
    }
    this._size = new Size( { parent: this, delegateChanged: this._delegateChanged } );
    if (this._delegateChanged) {
        this._size.changed(this.changed, this);
    }

    /* Style Properties */
    this._offset = new Point( { parent: this, delegateChanged: this._delegateChanged } );
    if (this._delegateChanged) {
        this._offset.changed(this.changed, this);
    }
    this._scale = new Point( { x: 1, y: 1, parent: this, delegateChanged: this._delegateChanged } );
    if (this._delegateChanged) {
        this._scale.changed(this.changed, this);
    }
    this._angle = 0;
    this._skew = new Point( { parent: this, delegateChanged: this._delegateChanged } );
    if (this._delegateChanged) {
        this._skew.changed(this.changed, this);
    }
    this._color = Color.black;
    this._drawStyle = 'fill';  //stroke, fill...
    this._lineWidth = 1;
    this._lineCap = 'bull'; //bull, round, square...
    this._miterLimit = null;
    this._lineJoin = 'miter'; //miter, bevel, round...
    this._closePath = null;
    this._alignContext = 'parent'; //parent, root, [object Shape]
    this._align = 'top left'; //inner, outer, left, right, bottom, center, top, or all together...

    this.set( x, y );
};

Shape.prototype = Utils.extend( EventObject, {
    get clone() {
        return new Shape( this );
    },

    get position() { return this._position; },
    set position( value ) { throw 'Cannot redeclare position, use Shape.position.set( x/Object, y ) instead';},

    get size() { return this._size; },
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
        if ( value.x ) {
            this.x = value.x - this.width / 2;
        }

        if ( value.y ) {
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
        if ( Utils.isNumeric( value ) === false ) {
            return;
        }

        this.width = value - this.x;
    },

    get top() { return this.y; },
    set top( value ) {
        if ( Utils.isNumeric( value ) === false ) {
            return;
        }

        this.height -= this.y - value;
        this.y = value;
    },

    get bottom() { return this.y + this.height; },
    set bottom( value ) {
        if ( Utils.isNumeric( value ) === false ) {
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

    get offset() { return this._offset; },
    set offset( value ) { throw 'Cannot redeclare offset, use Shape.offset.set( x/Object, y ) instead'; },

    get scale() { return this._scale; },
    set scale( value ) { throw 'Cannot redeclare scale, use Shape.scale.set( x/Object, y ) instead'; },

    get angle() { return this._angle; },
    set angle( value ) {
        if ( Utils.isNumeric( value ) === false ) {
            return;
        }

        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'angle', this._angle, value ) );
        }
        this._angle = value;
        // Informs also parent
        this.invalid = true;
    },

    get skew() { return this._skew; },
    set skew( value ) { throw 'Cannot redeclare skew, use Shape.skew.set( x/Object, y ) instead'; },

    get color() { return this._color; },
    set color( value ) {
        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'color', this._color, value ) );
        }
        this._color = value;
        // Informs also parent
        this.invalid = true;
    },

    get drawStyle() { return this._drawStyle; },
    set drawStyle( value ) {
        if ( !Utils.inArray( ['stroke', 'fill', 'clear'], value ) ) {
            value = 'fill';
        }

        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'drawStyle', this._drawStyle, value ) );
        }
        this._drawStyle = value;
        // Informs also parent
        this.invalid = true;
    },

    get lineWidth() { return this._lineWidth; },
    set lineWidth( value ) {
        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'lineWidth', this._lineWidth, value ) );
        }
        this._lineWidth = value;
        // Informs also parent
        this.invalid = true;
    },

    get lineCap() { return this._lineCap; },
    set lineCap( value ) {
        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'lineCap', this._lineCap, value ) );
        }
        this._lineCap = value;
        // Informs also parent
        this.invalid = true;
    },

    get miterLimit() { return this._miterLimit; },
    set miterLimit( value ) {
        if ( Utils.isNumeric( value ) == false ) {
            return;
        }

        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'miterLimit', this._miterLimit, value ) );
        }
        this._miterLimit = value;
        // Informs also parent
        this.invalid = true;
    },

    get lineJoin() { return this._lineJoin; },
    set lineJoin( value ) {
        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'lineJoin', this._lineJoin, value ) );
        }
        this._lineJoin = value;
        // Informs also parent
        this.invalid = true;
    },

    get closePath() { return this._closePath; },
    set closePath( value ) {
        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'closePath', this._closePath, value ) );
        }
        this._closePath = value;
        // Informs also parent
        this.invalid = true;
    },

    get align() { return this._align; },
    set align( value ) {
        var alignContext = null;
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

        if (alignContext) {
            var align = Utils.isString( this.align ) ? this.align : 'center center center';
            this.alignBy( alignContext, align );
        }
        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'align', this._align, value ) );
        }
        this._align = value;
        // Informs also parent
        this.invalid = true;
    },

    get alignContext() { return this._alignContext; },
    set alignContext( value ) {
        this.alignBy( value, this.align );
        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'alignContext', this._alignContext, value ) );
        }
        this._alignContext = value;
        // Informs also parent
        this.invalid = true;
    },

    get children() { return this._children; },
    set children( value ) { throw 'Cannot set children manually, use addChild instead'; },

    get parent() { return this._parent; },
    set parent( value ) {
        if ( value === this._parent ) {
            return;
        }

        if ( !(value instanceof Shape) ) {
            throw 'Only and instance of Shape are allowed to be set as a parent';
        }

        if ( !value.hasChild( this ) ) {
            value.children.push( this );
        }

        if ( this._parent ) {
            this.parent.removeChild( this );
        }

        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'parent', this._parent, value ) );
        }
        this._parent = value;
    },

    get input() {
        if (this._input) {
            return this._input;
        }

        // Lazy getting input handler from parent
        var shape = this;
        // @TODO: This will call the getter of a parent shape, which does the same..
        //        Maybe break until first input handler was found?
        //        Would be a good idea to use the nearst input handler which could be found
        while ( shape.parent && shape.parent.input ) {
            this._input = shape.parent.input;
            shape = shape.parent;
        }

        if ( !this._input ) {
            this._input = new Input( this.canvas );
        }

        return this._input;
    },
    set input(value) { this._input = value; },

    get canvas() {
        if (this._canvas) {
            return this._canvas;
        }

        // Lazy getting canvas from parent
        var shape = this;
        // @TODO: See lazy input getter
        while ( shape.parent && shape.parent.canvas ) {
            this._canvas = shape.parent.canvas;
            shape = shape.parent;
        }

        return this._canvas;
    },
    set canvas(value) { this._canvas = value; },

    get canvasContext() {
        if (!this._canvasContext) {
            this._canvasContext = this.canvas.getContext('2d');
        }

        return this._canvasContext;
    },


    hasChild: function ( shape ) {
        for ( var i = 0; i < this.children.length; i++ ) {
            if ( shape === this.children[i] ) {
                return true;
            }
        }

        return false;
    },

    addChild: function ( shape ) {
        if ( Utils.isArray( shape ) ) {
            for ( var i = 0; i < shape.length; i++ ) {
                this.addChild( shape[i] );
            }

            return this;
        }

        if ( !( shape instanceof Shape ) ) {
            throw 'Can only add arrays or instances of Shape to children';
        }

        shape.parent = this;
        // Delegate children changed() to our changed() handler
        if (this._delegateChanged && this.has('changed')) {
            shape.changed(this.changed, this);
        }

        return this;
    },

    removeChild: function ( shape ) {
        var i;
        if ( Utils.isArray( shape ) ) {
            for ( i = 0; i < shape.length; i++ ) {
                this.removeChild( shape[i] );
            }

            return this;
        }

        for ( i = 0; i < this.children.length; i++ ) {
            if ( this.children[i] === shape ) {
                this.children.splice( i, 1 );
            }
        }

        // Remove event from child
        if (this._delegateChanged) {
            shape.unbind('changed', new EventHandler(this.changed, this));
        }

        return this;
    },

    set: function ( x, y, deep ) {
        deep = deep || true;

        if ( Utils.isObject( x ) ) {
            if ( x.width ) {
                this.width = x.width;
            }
            if ( x.height ) {
                this.height = x.height;
            }
            if ( x.parent ) {
                this.parent = x.parent;
            }
            if ( x.offset ) {
                this.offset.set( x.offset );
            }
            if ( x.scale ) {
                this.scale.set( x.scale );
            }
            if ( x.angle ) {
                this.angle = x.angle;
            }
            if ( x.skew ) {
                this.skew.set( x.skew );
            }
            if ( x.color ) {
                this.color = x.color;
            }
            if ( x.drawStyle ) {
                this.drawStyle = x.drawStyle;
            }
            if ( x.lineWidth ) {
                this.lineWidth = x.lineWidth;
            }
            if ( x.lineCap ) {
                this.lineCap = x.lineCap;
            }
            if ( x.miterLimit ) {
                this.miterLimit = x.miterLimit;
            }
            if ( x.lineJoin ) {
                this.lineJoin = x.lineJoin;
            }
            if ( x.closePath ) {
                this.closePath = x.closePath;
            }
            if ( x.alignContext ) {
                this._alignContext = x.alignContext;
            }
            if ( x.align ) {
                this.align = x.align;
            }
            if ( x.x ) {
                this.x = x.x;
            }
            if ( x.y ) {
                this.y = x.y;
            }
            if ( x.canvas ) {
                this.canvas = x.canvas;
                this._canvasContext = this.canvas.getContext( '2d' );
            }

            if ( deep ) {

                //we allow those, too! they just dont make sense in a copy
                //this extends our possibilities in animating later on
                //They are not needed, because each of those properties
                //just modify x and y and we already set these in a plain copy
                //for a copy of an object, use either (new Shape).set( source ) or Shape.clone( source )
                if ( x.position ) {
                    this.position.set( x.position );
                }
                if ( x.size ) {
                    this.size.set( x.size );
                }
                if ( x.center ) {
                    this.center = x.center;
                }
                if ( x.left ) {
                    this.left = x.left;
                }
                if ( x.right ) {
                    this.right = x.right;
                }
                if ( x.top ) {
                    this.top = x.top;
                }
                if ( x.bottom ) {
                    this.bottom = x.bottom;
                }
                if ( x.leftTop ) {
                    this.leftTop = x.leftTop;
                }
                if ( x.rightTop ) {
                    this.rightTop = x.rightTop;
                }
                if ( x.leftBottom ) {
                    this.leftBottom = x.leftBottom;
                }
                if ( x.rightBottom ) {
                    this.rightBottom = x.rightBottom;
                }
            }

        } else {
            this.x = x;
        }

        if ( y ) {
            this.y = y;
        }

        return this;
    },

    applyStyles: function ( context ) {

        if (!context) {
            context = this.canvasContext;
        }

        //Apply styles if needed (If no style selected, properties won't change for performance reasons)
        if ( this.offset instanceof Point && !this.offset.isZero() ) {
            context.translate( this.offset.x, this.offset.y );
        }

        if ( this.scale instanceof Point && (this.scale.x !== 1 || this.scale.y !== 1) ) {
            context.scale( this.scale.x, this.scale.y );
        }

        if ( this.angle !== 0 ) {
            context.rotate( this.angle );
        }

        if ( context.lineWidth !== this.lineWidth ) {
            context.lineWidth = this.lineWidth;
        }

        if ( context.lineCap !== this.lineCap ) {
            context.lineCap = this.lineCap;
        }

        if ( context.miterLimit !== this.miterLimit ) {
            context.miterLimit = this.miterLimit;
        }

        if ( context.lineJoin !== this.lineJoin ) {
            context.lineJoin = this.lineJoin;
        }

        if ( this.skew instanceof Point && !this.skew.isZero() ) {
            context.transform( 1, this.skew.x, this.skew.y, 1, 0, 0 );
        }

        var colorProp = this.drawStyle + 'Style';
        // the color will only be re-set, if it changes
        if ( this.color !== context[colorProp] ) {
            context[colorProp] = this.color;
        }

        return this;
    },

    fill: function ( context ) {

        if (!context) {
            context = this.canvasContext;
        }

        context.fillRect( this.x, this.y, this.width, this.height );

        return this;
    },

    stroke: function ( context ) {

        if (!context) {
            context = this.canvasContext;
        }

        context.strokeRect( this.x, this.y, this.width, this.height );

        return this;
    },

    clear: function ( context ) {

        if (!context) {
            context = this.canvasContext;
        }

        context.clearRect( this.x, this.y, this.width, this.height );
    },

    /**
     * Executed before a draw() happens, should update inner properties and handle input states
     *
     * @param callback
     * @returns {*}
     */
    update: function( callback ) {

        // Got a callback? Assume a additional call to update() just to bind or trigger this callback
        if ( callback ) {
            return this.on( 'update', callback );
        }

        // Set some hover and drag states based on input
        var input = this.input;

        if ( input ) {
            // Only trigger new mouseMove() if the user moved
            if ( this._lastPositions.mouse.equals(input.mouse.position) === false ) {
                // Store last used/seen position
                this._lastPositions.mouse.set(input.mouse.position);

                if ( this.contains( input.mouse.position ) ) {

                    this.mouseMove();

                    if ( !this._mouseOnState ) {

                        this._mouseOnState = true;
                        this.mouseOn();
                    }
                }

                else if ( this._mouseOnState ) {

                    this._mouseOnState = false;
                    this.mouseOff();
                }
            }

            if ( input.keyboard.isDown(Keyboard.KEY.MOUSE1) && this._isMouseDragging === false ) {
                var dragLazyness = this._mouseDragLazyness || 1;

                if ( this._lastPositions.mouseDown.distanceTo( input.mouse.position ) > dragLazyness ) {
                    this._isMouseDragging = true;
                    this.mouseDrag();
                }
            }

            else if ( this._isMouseDragging ) {

                this.mouseDragMove();
            }


            if ( input.mouse.isDown(Keyboard.KEY.MOUSE1) || input.mouse.isDown(Keyboard.KEY.MOUSE2) ) {

                if( this.contains( input.mouse.position ) ) {
                    // @TODO: Whats about other mouse buttons? This would handle everything as right button
                    var btn = input.mouse.isDown(Keyboard.KEY.MOUSE1) ? Keyboard.KEY.MOUSE1 : Keyboard.KEY.MOUSE2;

                    this.mouseDown( btn );
                    this._lastPositions.mouseDown.set(input.mouse.position);

                }
            }

            else if ( input.mouse.isUp(Keyboard.KEY.MOUSE1) || input.mouse.isUp(Keyboard.KEY.MOUSE2) ) {
                // @TODO: Whats about other mouse buttons? This would handle everything as right button
                var btn = input.mouse.isUp(Keyboard.KEY.MOUSE1) ? Keyboard.KEY.MOUSE1 : Keyboard.KEY.MOUSE2;

                this.mouseUp( btn );
                this._lastPositions.mouseUp.set(input.mouse.position);

                if ( this._isMouseDragging !== false ) {
                    this.mouseDrop( this._isMouseDragging );
                    this._isMouseDragging = false;
                }

                if ( this.contains( input.mouse.position ) ) {

                    this.mouseClick( btn );

                }
            }

        }


        // Trigger callbacks for update
        this.on( 'update', {
            canvas:        this.canvas,
            canvasContext: this.canvasContext
        } );

        // Update also children, if this shape is not invalid
        // This is because no draw() of this shape or any children will be called
        if (this.invalid === false) {
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                child.update();
            }
        }

        return this;
    },

    draw: function ( context, forceDraw ) {

        // Update my states, will also update childrens, if I'm not invalid
        this.update();

        // Assume first parameter to be "force draw"
        if ( Utils.isType(context, 'boolean') ) {
            forceDraw = context;
            context = null;
        }

        // If we got no context to draw, get our own
        if (!context) {
            context = this.canvasContext;
        }

        context.save();

        // Draw this shape
        if ( this.invalid || forceDraw ) {
            //console.log('Shape.draw() re-draw dirty shape:', this);
            // If parent is dirty, childs needs a re-draw too
            var childForceRedraw = true;

            // Apply styles
            this.applyStyles( context );
            // Draw it using the current style (stroke, fill or clear)
            this[this.drawStyle].call( this, context );

            // Draw dirty children
            if ( this.children.length ) {
                for ( var i = 0; i < this.children.length; i++ ) {
                    var child = this.children[i];
                    // Redraw shapes that are directly connected to this parent only
                    // @TODO: This causes an overlay problem..
                    //        We have to check if any child needs a redraw and, if so, we have to redraw everything
                    //        Only redrawing dirty childs will make them overlapping ther other not-yet-dirty childs
                    if ( this.collidesWith( child )/* && child.isDirty */) {
                        //console.log('Shape.draw() poke child for draw (dirty=', child.isDirty, '):', child);
                        child.draw( context, childForceRedraw );
                    }
                }
            }

        }

        context.restore();

        this._invalid = false;

        return this;
    },

    alignBy:      function ( context, position ) {

        if (!context) {
            context = this.canvasContext;
        } else if ( Utils.isString(context) ) {
            position = context;
            context = this.canvasContext;
        }

        position = (position || '').split( ' ' );
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

                    if ( xType !== null && yType !== null ) {

                        type = 'center';
                    } else if ( xType !== null ) {

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

        if ( !xType ) {
            xType = 'center';
        }
        if ( !yType ) {
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
    collidesWith: function ( rect ) {
        var left = rect.left ? rect.left : rect.x;
        var right = rect.right ? rect.right : rect.x + ( rect.width ? rect.width : 0 );
        var top = rect.top ? rect.top : rect.y;
        var bottom = rect.bottom ? rect.bottom : rect.y + ( rect.height ? rect.height : 0 );

        return !( left > this.right || right < this.left || top > this.bottom || bottom < this.top );
    },

    contains: function ( rect ) {
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

        if ( callback ) {
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


    toString: function() {
        // @TODO: Output everything, but only if set
        return '{x:' + this.x + ',y:' + this.y + ',width:' + this.width + ',height:' + this.height + '}';
    },
            
    //style is like set(), but only for style properties
    style: function( style ) {
        
        this._color = Color.black;
        this._drawStyle = 'fill';  //stroke, fill...
        this._lineWidth = 1;
        this._lineCap = 'bull'; //bull, round, square...
        this._miterLimit = null;
        this._lineJoin = 'miter'; //miter, bevel, round...
        this._closePath = null;
        this._alignContext = 'parent'; //parent, root, [object Shape]
        this._align = 'top left'; //inner, outer, left, right, bottom, center, top, or all together...

        
        if( Utils.isString( style ) ) {
            
            for( var token in style.split( ' ' ) )
                switch( token ) {
                    case 'fill':
                    case 'clear':
                    case 'stroke':
                        
                        this.drawStyle = token;
                        break;
                    case 'bull':
                    case 'round':
                    case 'square':
                        
                        this.lineCap = token;
                        break;
                    case 'miter':
                    case 'bevel':
                    case 'round':
                        
                        this.miterLimit = token;
                        break;
                    case 'parent':
                    case 'root':
                        
                        this.alignContext = token;
                    case 'inner':
                    case 'outer':
                    case 'left':
                    case 'right':
                    case 'bottom':
                        /*TODO: These would need to be collected
                        * and passed as one string to this.align
                        **/
                        break;
                    default:
                        
                        if( Utils.isNumeric( token ) )
                            //lets take it as the lineWidth
                            this.lineWidth = parseInt( token );
                        else
                            //it's probably the color, heh
                            this.color = token;
                }
        } else if( Utils.isObject( style ) ) {
            
            //You can just pass a shape and copy its styles
            
            if( x.offset ) this.offset.set( x.offset );
            if( x.scale ) this.scale.set( x.scale );
            if( x.angle ) this.angle = x.angle;
            if( x.skew ) this.skew.set( x.skew );
            if( x.color ) this.color = x.color;
            if( x.drawStyle ) this.drawStyle = x.drawStyle;
            if( x.lineWidth ) this.lineWidth = x.lineWidth;
            if ( x.lineCap ) this.lineCap = x.lineCap;
            if ( x.miterLimit ) this.miterLimit = x.miterLimit;
            if ( x.lineJoin ) this.lineJoin = x.lineJoin;
            if ( x.closePath ) this.closePath = x.closePath;
            if ( x.alignContext ) this._alignContext = x.alignContext;
            if ( x.align ) this.align = x.align;
        }
        
        //make it chainable
        return this;
    },
            
    expand: function( shape ) {
        
        if( this.left > shape.left )
            this.left( shape.left );
        
        if( this.right < shape.right )
            this.right( shape.right );
        
        if( this.top > shape.top )
            this.top( shape.top );
        
        if( this.bottom < shape.bottom )
            this.bottom( shape.bottom );
        
        return this;
    }

} );
