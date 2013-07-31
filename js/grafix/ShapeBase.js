var ShapeBase = function( args ) {
    EventObject.call( this );

    // Support a parent and invalidate flag
    this._parent = null;
    this._invalid = true;
    // Array of ShapeBase children
    this._children = [];
    // Object of children references, stored by name, for fast look-up
    this._childrenNameCache = {};

    // Support for named components
    this._name = ( args && args.name ? args.name : Utils.getUid());
    // Canvas
    this._canvas = null;
    this._canvasContext = null;

    // Will changes to own and children properties delegated to the changed() event?
    this._delegateChanged = ( args && args.delegateChanged ? true : false );

    /** @var Input */
    this._input = null;
};

ShapeBase.prototype = Utils.extend( EventObject, {
    get clone() { throw 'Cannot clone ShapeBase, please use any of the derived classes instead'; },

    get name() { return this._name; },
    set name(value) {

        this._name = value;
        this.invalid = true;
    },

    get invalid() { return this._invalid; },
    set invalid(value) {
        if( this._invalid !== value ) {
            this._invalid = value;
        }

        // Inform parent
        var parent = this.parent;
        if( parent ) {
            parent.invalid = value;
        }
    },

    get children() { return this._children; },
    set children( value ) { throw 'Cannot set children manually, use addChild instead'; },

    get parent() { return this._parent; },
    set parent( value ) {
        if( value === this._parent ) {
            return;
        }

        if( !(value instanceof ShapeBase) ) {
            throw 'Only and instance of Shape are allowed to be set as a parent';
        }

        // Add us as a child to our (new)parent
        if( !value.hasChild( this ) ) {
            value.addChild( this );
        }

        // If we got a parent already, remove it
        if( this._parent ) {
            this.parent.removeChild( this );
        }

        // Delegate changed() events from our parent to us
        if( this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'parent', this._parent, value ) );
        }
        // Store it
        this._parent = value;
    },

    get input() {
        if( this._input ) {
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
        if( !this._input ) {
            this._input = new Input( this.canvas );
        }

        return this._input;
    },
    set input(value) { this._input = value; },

    get canvas() {
        if( this._canvas ) {
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
        if( !this._canvasContext && this.canvas ) {
            this._canvasContext = this.canvas.getContext('2d');
        }

        return this._canvasContext;
    },

    /**
     * Returns true, if we have the given shape (or name) as a children component.
     *
     * @param {ShapeBase|string} shape
     * @returns {boolean}
     */
    hasChild: function( shape ) {

        // Support search for name
        if( Utils.isString( shape ) ) {
            return (shape in this._childrenNameCache);
        }

        // Search for a ShapeBase object
        for ( var i = 0; i < this.children.length; i++ ) {
            if( shape === this.children[i] ) {
                return true;
            }
        }

        return false;
    },

    /**
     * Add's the given shape as out children component.
     * Also ensures the correct {shape.parent} value.
     *
     * @param {ShapeBase} shape
     * @returns {self}
     */
    addChild: function( shape ) {
        if( Utils.isArray( shape ) ) {
            for ( var i = 0; i < shape.length; i++ ) {
                this.addChild( shape[i] );
            }

            return this;
        }

        if( !( shape instanceof ShapeBase ) ) {
            throw 'Can only add arrays or instances of ShapeBase to children';
        }

        // Add as a children component
        this.children.push( shape );
        // Store the index of the component by its name
        this._childrenNameCache[ shape.name ] = (this.children.length - 1);

        shape.parent = this;
        // Delegate children changed() to our changed() handler
        if( this._delegateChanged ) {
            shape.changed( this.changed, this );
        }

        // Take care of invalid flag of the new child
        if( shape.invalid ) {
            this.invalid = true;
        }

        return this;
    },

    /**
     * Removes the given shape from our children components.
     *
     * @param {ShapeBase} shape
     * @returns {self}
     */
    removeChild: function( shape ) {
        var i;
        if( Utils.isArray( shape ) ) {
            for ( i = 0; i < shape.length; i++ ) {
                this.removeChild( shape[i] );
            }

            return this;
        }

        for( i = 0; i < this.children.length; i++ ) {
            if( this.children[i] === shape ) {
                this.children.splice( i, 1 );
            }
        }

        // Remove from search index
        if( (shape.name in this._childrenNameCache) ) {
            delete this._childrenNameCache[ shape.name ];
        }

        // Remove event from child
        if( this._delegateChanged ) {
            shape.unbind( 'changed', new EventHandler( this.changed, this ) );
        }

        return this;
    },

    /**
     * Returns the child component with the given name.
     * This does only a full name search (yet) and returns {null}, if no child with the given name was found.
     *
     * @param {string} childName
     * @returns {ShapeBase|null}
     */
    child: function( childName ) {
        if( (childName in this._childrenNameCache) ) {
            var childIndex = this._childrenNameCache[ childName ];
            return this.children[ childIndex ];
        }

        return null;
    },


    set: function( args ) {

        if( Utils.isObject( args ) ) {
            if( 'id' in args ) {
                this.name = args.id;
            }
            else if( 'uid' in args ) {
                this.name = args.uid;
            }
            else if( 'name' in args ) {
                this.name = args.name;
            }
            if( 'children' in args ) {
                //@TODO: Shouldn't we clone all children?
                //They will get removed in the original object on-clone right now
                //I guess
                this.addChild( args.children );
            }
            if( 'canvas' in args ) {
                this.canvas = args.canvas;
                
                if( this.canvas )
                    this._canvasContext = this.canvas.getContext( '2d' );
            }
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
        if( callback ) {
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
        if( this.invalid === false ) {
            for( var i = 0; i < this._children.length; i++ ) {
                var child = this._children[i];
                child.update();
            }
        }

        return this;
    },

    _update: function() {

    },

    draw: function( context, forceDraw ) {

        // Update my states, will also update childrens, if I'm not invalid
        this.update();

        // Assume first parameter to be "force draw"
        if( Utils.isType( context, 'boolean' ) ) {
            forceDraw = context;
            context = null;
        }

        // If we got no context to draw, get our own
        if( !context ) {
            context = this.canvasContext;
        }

        context.save();

        // Draw this shape
        if( this.invalid || forceDraw ) {
            //console.log( 'Shape.draw() re-draw dirty shape:', this );
            // If parent is dirty, childs will need a re-draw too
            var forceChildDraw = true;

            this._draw( context, forceChildDraw );
        }

        context.restore();

        this._invalid = false;

        return this;
    },

    _draw: function( context, forceChildDraw ) {

        // Should draw the shape on the given context

    }

} );
