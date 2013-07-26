

var Group = function() {
    
    this._virtual = Group.defaults.virtual;
    
    Shape.call( this );
}
Group.defaults = {
    virtual: true
};

Group.prototype = {
    get virtual() { return this._virtual; },
    set virtual( value ) {
        
        if( this._delegateChanged && this.has( 'changed' ) ) {
            this.changed( this.prepareChanged( 'virtual', this._virtual, value ) );
        }
        this._virtual = value;
        
        this.invalid = true;
    },
            
    set: function( virtual ) {
        
        if( Utils.isObject( virtual ) ) {
            
            Shape.prototype.set.call( this, virtual );
            
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
};