var ShapeBase = function( args ) {
    EventBase.call( this );

    // This object may be invalid which is done after property changes
    this._invalid = true;
    // Support a parent
    this._parent = null;
    // Array of ShapeBase children
    this._children = [];
    // Object of children references, stored by name, for fast look-up
    this._childrenNameCache = {};

    // Support for named components
    this._name = null;
    // Canvas
    this._canvas = null;
    this._canvasContext = null;

    /** @var Input */
    this._input = null;
};

ShapeBase.defaults = {

};

ShapeBase.prototype = Utils.extend( EventBase, {
    
    get clone() { 
        throw 'Cannot clone ShapeBase, please use any of the derived classes instead'; 
    },

    get invalid() { return this.prop( 'invalid' ); },
    set invalid( value ) {

        // No usage of .prop() here, this shouln't be canceled
        if( this._invalid !== value ) {
            this._invalid = value;

            this.changed( 'invalid' );
        }

        // Inform parent
        var parent = this.parent;
        if( parent ) {
            parent.invalid = value;
        }
    },

    get parent() { return this.prop( 'parent' ); },
    set parent( value ) {

        if( this._parent === value ) {
            return;
        }

        if( value !== null && !( value instanceof ShapeBase ) ) {

            throw 'Only an instance of Shape are allowed to be set as a parent';
        }

        // Add us as a child to our (new)parent
        if( value !== null && value.hasChild( this ) === false ) {
            value.addChild( this );
        }

        // If we got a parent already, remove it
        if( this._parent ) {
            this.parent.removeChild( this );
        }

        // Store it
        this._parent = value;

        this.changed( 'parent' );
    },

    get name() { 
        
        if( !this._name )
            this._name = Utils.getUid();
        
        return this._name; 
    },
    set name( value ) {

        // DONT use .prop() here which enables events to cancel the update; we WANT (and need) a name/uid
        this._name = value;
        this.invalid = true;
    },

    get children() { return this.prop( 'children' ); },
    set children( value ) { throw 'Cannot set children manually, use addChild instead'; },

    get input() {
        
        if( this._input )
            return this._input;

        if( this.parent )
            this._input = this.parent.input;

        // Nothing found in parent tree? Then create our own
        if( !this._input )
            this._input = new Input( this.canvas );

        return this._input;
    },
    set input( value ) { return this.prop('input', value); },

    get canvas() {
        
        if( this._canvas )
            return this._canvas;
        
        if( this.parent )
            this._canvas = this.parent.canvas;
        
        if( !this._canvas ) {
            
            this._canvas = document.createElement( 'canvas' );
            this._canvas.setAttribute( 'width', 'width' in this ? this.width : 0 );
            this._canvas.setAttribute( 'height', 'height' in this ? this.height : 0 );
        }

        return this._canvas;
    },
    set canvas( value ) { 

        // This allows to set a selector too
        if( Utils.isString( value ) )
            value = Utils.getDomElementById( value );

        if( this.prop( 'canvas', value ) !== false ) {
            // Lazy getter will fetch the context (even from a cache) so no worry
            this._canvasContext = null;
        }
    },

    get canvasContext() {
        
        if( this._canvasContext )
            return this._canvasContext;
        
        if( this.context )
            this._canvasContext = this.context.getContext( '2d' );
        
        return this._canvasContext;
    },
    set canvasContext( value ) { return this.prop( 'canvasContext', value ); },

    /**
     * Returns true, if we have the given shape (or name) as a children component.
     *
     * @param {ShapeBase|string} shape
     * @returns {boolean}
     */
    hasChild: function( shape ) {

        // Support to search for name
        if( Utils.isString( shape ) ) {
            return !!( shape in this._childrenNameCache );
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
     * @param {ShapeBase|ShapeBase[]} shape
     * @returns {self}
     */
    addChild: function( shape ) {

        if( Utils.isArray( shape ) ) {
            for( var i = 0; i < shape.length; i++ ) {
                this.addChild( shape[i] );
            }

            return this;
        }

        if( !( shape instanceof ShapeBase ) ) {
            throw 'Can only add arrays or instances of ShapeBase as a children';
        }

        // Add as a children component
        this.children.push( shape );
        // Store the index of the component by its name
        this._childrenNameCache[ shape.name ] = (this.children.length - 1);

        shape.parent = this;

        // Take care of invalid flag of the new child which would be normaly bubble to us
        if( shape.invalid ) {
            this.invalid = true;
        }

        return this;
    },

    /**
     * Removes the given shape from our children components.
     *
     * @param {ShapeBase|string|ShapeBase[]|string[]} shape
     * @returns {self}
     */
    removeChild: function( shape ) {

        var i;
        // This will allow to remove an array of childs
        if( Utils.isArray( shape ) ) {
            for( i = 0; i < shape.length; i++ ) {
                this.removeChild( shape[i] );
            }

            return this;
        }

        // Allow to remove a children by name too
        var searchByName = !!Utils.isString( shape );
        // In case of the remove-by-name call, we dont have to search the index - its stored in our cache
        if( searchByName ) {
            if( !(shape in this._childrenNameCache) ) {
                // No child with this name
                return this;
            }

            i = this._childrenNameCache[ shape ];
            this.children.splice( i, 1 );
        } else {
            // Search for the reference
            for( i = 0; i < this.children.length; i++ ) {
                // @TODO: Would be faster to just compare the .name property
                //        But this would be unique even for cloned shapes
                //        Which would also lead to fail in the following compare
                //        Maybe we need a .equals( shape ) method which wont compare the unique properties?
                if( this.children[i] === shape ) {
                    this.children.splice( i, 1 );
                }
            }
        }

        // Remove from search index
        if( (shape.name in this._childrenNameCache) ) {
            delete this._childrenNameCache[ shape.name ];
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
            
    
    eachChild: function( callback ) {
        
        for( var i in this._children ) {
            // Support to break out of the loop
            if( callback.call( this._children[ i ], i ) === false ) {
                break;
            }
        }
        
        return this;
    },


    /**
     * Gets or sets the value of a private property, named _{name}.
     * If this object reports changes, the change event will be called before update.
     * If the event returns {false} no update will be done.
     *
     * @param {string} name
     * @param {*} value
     * @returns {self|boolean|*}
     */
    prop: function( name, value ) {

        var baseReturn = EventBase.prototype.prop.call( this, name, value );
        // Called as getter?
        if( Utils.isUndefined( value ) ) {
            return baseReturn;
        }

        // Acting as setter, mark as invalid on successfull change
        if( baseReturn === false ) {
            return false;
        }

        this.invalid = true;
        return baseReturn;
    },


    set: function( args ) {

        if( Utils.isObject( args ) ) {

            // 3 ways to set the name
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
                // @TODO: Shouldn't we clone all children?
                //        They will get removed in the original object on-clone right now - I guess
                this.addChild( args.children );
            }
            if( 'canvas' in args ) {
                this.canvas = args.canvas;
            }
            if( ('parent' in args) ) {
                this.parent = args.parent;
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

        // Update also children, if the shape is valid (not invalid)
        // Reason: draw() wont be called if the shape is not invalid, so no child would be update'd or drawn
        if( this.invalid === false ) {
            this.eachChild( function( childIndex ) {
                this.update();
            } );
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
        context = context || this.canvasContext;

        context.save();

        // Draw this shape
        if( this.invalid || forceDraw ) {
            //console.log( 'Shape.draw() re-draw dirty shape:', this );
            // If parent is dirty, childs will need a re-draw too
            
            this._draw( context, /*forceDraw on child*/true );
        }

        context.restore();

        // Note: We dont want to set our parent too, so set the property directly
        this._invalid = false;

        return this;
    },

    _draw: function( context, forceChildDraw ) {

        // Should draw the shape on the given context

    }

} );
