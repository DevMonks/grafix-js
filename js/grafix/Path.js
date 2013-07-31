var Path = function( args ) {
    ShapeBase.call( this );

    this._points = [];

    this.set( args );
};

Path.prototype = Utils.extend( ShapeBase, {
    get points() { return this._points; },

    get length() { return this.points.length; },

    get clone() {
        return new Path( this );
    },


    set: function( args ) {

        ShapeBase.prototype.set.call(this, args);

        var i;

        if( Utils.isObject( args ) && ('points' in args) && Utils.isArray( args.points ) ) {

            // Assume instances of Point or arrays of [x, y]
            for ( i = 0; i < args.points.length; i++ ) {
                this.add( args.points[ i ] );
            }

        }
        // Maybe only a single Point instance
        else if( Utils.isType( args, 'Point') ) {
            this.add( args );
        }
        // Maybe an array of [x, y]
        else if( Utils.isArray( args ) ) {
            // Could be an array of Points, too
            for ( i = 0; i < args.length; i++ ) {
                // If we got a anumeric value, args is a spot defined as array [x, y]
                if( Utils.isNumeric( args[ i ] ) ) {
                    this.add( args );
                    break;
                }

                // Seems like an array of spots
                this.add( args[ i ] );
            }
        }

        return this;
    },

    add: function( x, y ) {
        // Could be:
        //  x, y
        //  {x: x.x, y: x.y}
        //  x: [x, y]
        //  x: Point(x, y)

        if( Utils.isType(x, 'Point') ) {

            this.points.push( x );

        } else if( Utils.isArray( x ) ) {

            this.points.push( new Point( x[0], y[1] ) );

        } else if( Utils.isObject( x ) && ('x' in x) && ('y' in x) ) {

            this.points.push( new Point(x.x, y.y) );

        } else {

            this.points.push( new Point( x, y ) );

        }

        if( this._delegateChanged ) {
            this.changed( this.prepareChanged('points', null, this.points[ this.length - 1] ) );
        }

        return this;
    },


    isEmpty: function() {

        return this.length == 0;
    }

} );
