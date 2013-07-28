var Rectangle = function( x, y, width, height ) {

    this.set( x, y, width, height );
};

Rectangle.prototype = Utils.extend( Shape, {

    get clone() {
        
        return new Rectangle( this );
    },

    set: function( x, y, width, height ) {
        
        Shape.prototype.set.call( this, x, y );
        
        if( typeof width !== 'undefined' )
            this.width = width;
        
        if( typeof height !== 'undefined' )
            this.height = height;
        
        return this;
    }
} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' ) {
    ShortCuts.rect = function( x, y, width, height ) {
        
        return new Rectangle( x, y, width, height );
    };
    //Avoid confusion
    ShortCuts.rectangle = ShortCuts.rect;
}