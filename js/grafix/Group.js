

var Group = function( shapes, virtual ) {
    
    this._virtual = typeof virtual !== 'undefined' ? virtual : Group.defaults.virtual;
    
    ShapeBase.call( this );
    
    if( shapes )
        this.addChild( shapes );
};

Group.defaults = {
    virtual: true
};

Group.prototype = Utils.extend( Shape, {
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
            
    get clone() {

        return new Group( this );
    },

    addChild: function( shape ) {
        
        if( Utils.isArray( shape ) )
            for( var i in shape ) {
                
                this.addChild( shape[ i ] );
                return this;
            }
        
        if( this.children.length < 1 )
            this.set( { size: shape.size, position: shape.position } );
        else
            this.expand( shape );
        
        Shape.prototype.addChild.call( this, shape );
        
        return this;
    }
});

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.group = function( shapes, virtual ) {
        
        return new Group( shapes, virtual );
    };
