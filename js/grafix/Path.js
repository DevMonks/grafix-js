var Path = function( args ) {

    Shape.call( this );

    this._points = [];

    this.set( args );
};

Path.prototype = Utils.extend( Shape, {

    get clone() {
        return Utils.clone( Path, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return ShapeBase.prototype.cloneableProperties.concat([
            'points'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Path'; },

    get points() { return this.prop( 'points' ); },

    get length() { return this.points.length; },

    get start() { return this._points[ 0 ]; },
    set start( value ) { this.replace( value, 0 ); },

    get end() { return this._points[ this._points.length - 1 ]; },
    set end( value ) { this.replace( value, this._points.length - 1 ); },


    set: function( args ) {

        var i;

        if( Utils.isObject( args ) ) {

            Shape.prototype.set.call( this, args );

            // Assume instances of Point or arrays of [x, y]
            if( ('points' in args) && Utils.isArray( args.points ) ) {

                for ( i = 0; i < args.points.length; i++ ) {
                    this.add( args.points[ i ] );
                }
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


    add: function( x, y, i ) {
        // Could be:
        //  x, y
        //  {x: x.x, y: x.y}
        //  x: [x, y]
        //  x: Point(x, y)

        if( Utils.isUndefined( i ) === false ) {

            return this.replace( x, y, i );
        }

        var newP = null;

        if( Utils.isType( x, 'Point' ) ) {

            newP = x;
        } else if( Utils.isArray( x ) ) {

            newP = new Point( x[ 0 ], y[ 1 ] );
        } else if( Utils.isObject( x ) && ( 'x' in x ) && ( 'y' in x ) ) {

            newP = new Point( x.x, x.y );
        } else {

            newP = new Point( x, y );
        }

        if( newP !== null ) {

            this._points.push( newP );
            this.invalid = true;
        }

        return this;
    },

    replace: function( x, y, i ) {
        // Could be:
        //  x, y
        //  {x: x.x, y: x.y}
        //  x: [x, y]
        //  x: Point(x, y)

        if( Utils.isUndefined( i ) || (this._points.length - 1) < i ) {

            return this.add( x, y );
        }

        var newP = null;

        if( Utils.isType( x, 'Point' ) ) {

            newP = x;
        } else if( Utils.isArray( x ) ) {

            newP = new Point( x[ 0 ], y[ 1 ] );
        } else if( Utils.isObject( x ) && ( 'x' in x ) && ( 'y' in x ) ) {

            newP = new Point( x.x, x.y );
        } else {

            newP = new Point( x, y );
        }

        if( newP !== null ) {

            this._points[ i ] = newP;
            this.invalid = true;
        }

        return this;
    },


    isEmpty: function() {

        return this._points.length === 0;
    },

    fill: function( context ) {

        return this._drawPath( context );
    },

    stroke: function( context ) {

        return this._drawPath( context );
    },

    clear: function( context ) {

        return this._drawPath( context );
    },

    _drawPath: function( context ) {

        if( this.length < 2 ) {
            return this;
        }

        context = context || this.canvasContext;

        context.beginPath();
        context.moveTo( this.start.x, this.start.y );

        for( var i = 0; i < this.length; i++ ) {

            var p = this.points[ i ];
            context.lineTo( p.x, p.y );
        }

        context.stroke();

        return this;
    }


} );


/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' ) {
    ShortCuts.path = function( args ) {

        return new Path( args );
    };
}
