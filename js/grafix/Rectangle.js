var Rectangle = function ( x, y, width, height ) {
    // Build default parameters
    var args = {
        x:      x || 0,
        y:      y || 0,
        width:  width || 0,
        height: height || 0
    };

    // Enable object as configuration parameter
    if ( Utils.isObject( x ) ) {
        // This will also overwrite args.x, which is currently an object
        args = Utils.merge( args, x );
    }

    Shape.call( this, args );
};

Rectangle.prototype = Utils.extend( Shape, {

    get clone() {
        return new Rectangle( this );
    },


    toString: function() {
        return '{x:' + this.x + ',y:' + this.y + ',width:' + this.width + ',height:' + this.height + '}';
    }

} );

