var ShapeBase = function ( args ) {
    EventObject.call( this );

    // Support a parent and invalidate flag
    this._parent = null;
    this._invalid = true;

    this._canvas = null;
    this._canvasContext = null;
    this._children = [];
    // Will changes to own and children properties delegated to the changed() event?
    this._delegateChanged = (args && args.delegateChanged ? true : false);

    /** @var Input */
    this._input = null;
};

ShapeBase.prototype = Utils.extend( EventObject, {
    get clone() { throw 'Cannot clone ShapeBase, please use any of the derived classes instead'; },

    get invalid() { return this._invalid; },
    set invalid(value) {
        if (this._invalid !== value) {
            this._invalid = value;
        }

        // Inform parent
        var parent = this.parent;
        if (parent) {
            parent.invalid = value;
        }
    },

    get children() { return this._children; },
    set children( value ) { throw 'Cannot set children manually, use addChild instead'; },

    get parent() { return this._parent; },
    set parent( value ) {
        if ( value === this._parent ) {
            return;
        }

        if ( !(value instanceof ShapeBase) ) {
            throw 'Only and instance of Shape are allowed to be set as a parent';
        }

        // Add us as a child to our (new)parent
        if ( !value.hasChild( this ) ) {
            value.children.push( this );
        }

        // If we got a parent already, remove it
        if ( this._parent ) {
            this.parent.removeChild( this );
        }

        // Delegate changed() events from our parent to us
        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'parent', this._parent, value ) );
        }
        // Store it
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

        // Nothing found in parent tree? Then create our own
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
        if (!this._canvasContext && this.canvas) {
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

        if ( !( shape instanceof ShapeBase ) ) {
            throw 'Can only add arrays or instances of ShapeBase to children';
        }

        shape.parent = this;
        // Delegate children changed() to our changed() handler
        if (this._delegateChanged) {
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

    set: function ( args ) {

        if ( args && args.canvas ) {
            this.canvas = args.canvas;
            this._canvasContext = this.canvas.getContext( '2d' );
        }

        return this;
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

        this._update();

        // Trigger callbacks for update
        this.on( 'update', {
            canvas:        this.canvas,
            canvasContext: this.canvasContext
        } );

        // Update also children, if this shape is not invalid
        // This is because no draw() of this shape or any children will be called
        if (this.invalid == false) {
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                child.update();
            }
        }

        return this;
    },

    _update: function () {

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
            // If parent is dirty, childs will need a re-draw too
            var forceChildDraw = true;

            this._draw( context, forceChildDraw );
        }

        context.restore();

        this._invalid = false;

        return this;
    },

    _draw: function ( context, forceChildDraw ) {

        // Should draw the shape on the given context

    }

} );
