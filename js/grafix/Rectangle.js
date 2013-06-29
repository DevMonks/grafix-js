
var Rectangle = function( x, y, width, height ) {

	Shape.call( this, { x: x || 0, y: y || 0, width: width || 0, height: height || 0 } );
};

Rectangle.prototype = Utils.extend( Shape, {
    get clone() {
        
        return new Rectangle( this );
    }
} );

