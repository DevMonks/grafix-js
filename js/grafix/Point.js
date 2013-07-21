var Point = function ( x, y ) {
    EventObject.call( this );

    this._x = 0;
    this._y = 0;

    this.set( x, y );
};

Point.prototype = Utils.extend( EventObject, {
    get x() { return this._x; },
    set x( value ) {
        if ( Utils.isNumeric( value ) == false ) {
            return;
        }

        this.changed( this.prepareChanged( 'x', this._x, value ) );
        this._x = value;
    },

    get y() { return this._y; },
    set y( value ) {
        if ( Utils.isNumeric( value ) == false ) {
            return;
        }

        this.changed( this.prepareChanged( 'y', this._y, value ) );
        this._y = value;
    },

    get clone() {
        return new Point( this );
    },

    set: function ( x, y ) {

        if ( Utils.isObject( x ) ) {

            if ( x.x ) {
                this.x = x.x;
            }
            if ( x.y ) {
                this.y = x.y;
            }
        } else if ( Utils.isNumeric( x ) ) {
            this.x = parseInt( x );
        }

        if ( Utils.isNumeric( y ) ) {
            this.y = parseInt( y );
        }

        return this;
    },

    isZero: function () {
        return !( this.x || this.y );
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
    }
} );
