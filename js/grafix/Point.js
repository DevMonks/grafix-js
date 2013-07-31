var Point = function ( x, y ) {
    ShapeBase.call( this );

    // Will changes to own properties delegated to the changed() event?
    this._delegateChanged = (Utils.isObject(x) && x.delegateChanged ? true : false);

    this._x = 0;
    this._y = 0;

    this.set( x, y );
};

Point.prototype = Utils.extend( ShapeBase, {
    get x() { return this._x; },
    set x( value ) {
        if ( Utils.isNumeric( value ) === false || this._x === value ) {
            return;
        }

        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'x', this._x, value ) );
        }
        this._x = value;
        // Informs also parent
        this.invalid = true;
    },

    get y() { return this._y; },
    set y( value ) {
        if ( Utils.isNumeric( value ) === false || this._y === value ) {
            return;
        }

        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'y', this._y, value ) );
        }
        this._y = value;
        // Informs also parent
        this.invalid = true;
    },

    get clone() {
        return new Point( this );
    },

    set: function( x, y ) {

        ShapeBase.prototype.set.call( this, x );

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
