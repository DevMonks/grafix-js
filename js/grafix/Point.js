var Point = function ( x, y ) {
    EventBase.call( this );

    this._x = 0;
    this._y = 0;

    this.set( x, y );
};

Point.prototype = Utils.extend( EventBase, {
    get x() { return this.prop( 'x' ); },
    set x( value ) {
        if( Utils.isNumeric( value ) === false ) {
            return;
        }

        if( this.prop( 'x', value ) !== false ) {
            // Informs also parent
            this.invalid = true;
        }
    },

    get y() { return this.prop( 'y' ); },
    set y( value ) {
        if( Utils.isNumeric( value ) === false ) {
            return;
        }

        if( this.prop( 'y', value ) !== false ) {
            // Informs also parent
            this.invalid = true;
        }
    },

    get clone() {
        return new Point( this );
    },

    set: function( x, y ) {

        if ( Utils.isObject( x ) ) {

            if ( 'x' in x ) {
                this.x = x.x;
            }
            if ( 'y' in x ) {
                this.y = x.y;
            }
            if ( 'parent' in x ) {
                this.parent = x.parent;
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
    add:        function ( point ) {
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
