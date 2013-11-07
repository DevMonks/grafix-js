

var Group = function( shapes, virtual ) {
    
    this._virtual = typeof virtual !== 'undefined' ? virtual : Group.defaults.virtual;
    
    Shape.call( this );
    
    if( shapes )
        this.addChild( shapes );
};

Group.defaults = {
    virtual: true
};

Group.prototype = Utils.extend( Shape, {

    get clone() {

        return Utils.clone( Group, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return Shape.prototype.cloneableProperties.concat([
            'virtual'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Group'; },

    get virtual() { return this._virtual; },
    set virtual( value ) {
        
        if( this._delegateChanged && this.has( 'changed' ) ) {
            this.changed( this.prepareChanged( 'virtual', this._virtual, value ) );
        }
        this._virtual = value;
        
        this.invalid = true;
    },

    set: function( virtual ) {

        Shape.prototype.set.call( this, virtual );

        if( Utils.isObject( virtual ) ) {
            
            if( 'virtual' in virtual ) this.virtual = virtual.virtual;
            
        } else if( typeof virtual !== 'undefined' ) {
            
            this.virtual = virtual;
        }        
        
        return this;
    },

    _drawGroup: function( canvasContext, style ) {
        
        if( this.virtual ) // Virtual groups dont get drawn
            return;
        
        Shape.prototype[ style ].call( this, canvasContext );
    },

    fill: function( canvasContext ) {

        this._drawGroup( canvasContext, 'fill' );
    },

    stroke: function( canvasContext ) {

        this._drawGroup( canvasContext, 'stroke' );
    },
    
    clear: function( canvasContext ) {

        this._drawGroup( canvasContext, 'clear' );
    }
});

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.group = function( shapes, virtual ) {
        
        return new Group( shapes, virtual );
    };
