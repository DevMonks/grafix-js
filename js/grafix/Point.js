var Point = function ( x, y ) {
    ShapeBase.call( this );

    this._x = 0;
    this._y = 0;

    this.set( x, y );
};

Point.prototype = Utils.extend( ShapeBase, {

    get clone() {
        return Utils.clone( Point, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return ShapeBase.prototype.cloneableProperties.concat([
            'x',
            'y'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Point'; },

    get x() { return this.prop( 'x' ); },
    set x( value ) { return this.prop( 'x', value ); },

    get y() { return this.prop( 'y' ); },
    set y( value ) { return this.prop( 'y', value ); },


    set: function( x, y ) {

        ShapeBase.prototype.set.call( this );

        if ( Utils.isObject( x ) ) {

            if ( 'x' in x ) {
                this.x = x.x;
            }
            if ( 'y' in x ) {
                this.y = x.y;
            }
        } else if( typeof x !== 'undefined' ) {
            
            this.x = parseInt( x );
        }

        if( typeof y !== 'undefined' ) {
            
            this.y = parseInt( y );
        }

        return this;
    },

    isZero: function () {
        return this.is( 0 );
    },

    is: function ( value ) {
        return ( this.x === value && this.y === value );
    },

    equals: function ( point ) {
        return this.x === point.x && this.y === point.y;
    },

    distanceTo: function ( point ) {
        return Math.sqrt(
            ( this.x - point.x ) * ( this.x - point.x ) + ( this.y - point.y ) * ( this.y - point.y )
        );
    },

    /* Calculation operations */
    add: function ( point ) {
        if ( Utils.isNumeric( point ) ) {
            point = { x: point, y: point };
        }

        if ( point.x ) {
            this.x += point.x;
        }
        if ( point.y ) {
            this.y += point.y;
        }

        return this;
    },

    sub: function ( point ) {
        if ( Utils.isNumeric( point ) ) {
            point = { x: point, y: point };
        }

        if ( point.x ) {
            this.x -= point.x;
        }
        if ( point.y ) {
            this.y -= point.y;
        }

        return this;
    },

    mul: function ( point ) {
        if ( Utils.isNumeric( point ) ) {
            point = { x: point, y: point };
        }

        if ( point.x ) {
            this.x *= point.x;
        }
        if ( point.y ) {
            this.y *= point.y;
        }

        return this;
    },

    div: function ( point ) {
        if ( Utils.isNumeric( point ) ) {
            point = { x: point, y: point };
        }

        if ( point.x ) {
            this.x /= point.x;
        }
        if ( point.y ) {
            this.y /= point.y;
        }

        return this;
    },


    toString: function() {
        return '{x:' + this.x + ',y:' + this.y + '}';
    }
} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.point = function( x, y ) {
        
        return new Point( x, y );
    };
