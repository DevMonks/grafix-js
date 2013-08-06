var Point3D = function ( x, y, z ) {
    Point.call( this );

    this.set( x, y, z );
};

Point3D.prototype = Utils.extend( Point, {

    get clone() {
        return new Point3D( this );
    },

    get z() { return this.prop( 'z' ); },
    set z( value ) { return this.prop( 'z', value ); },


    set: function ( x, y, z ) {

        Point.prototype.set.call( this, x, y, z );

        if ( Utils.isObject( x ) ) {

            if ( x.z ) {
                this.z = x.z;
            }
        }

        if ( Utils.isNumeric( z ) ) {
            this.z = parseInt( z );
        }

        return this;
    },

    isZero: function () {
        return Point.prototype.isZero.call( this ) && !this.z;
    },

    equals: function ( point ) {
        return Point.prototype.equals.call( this, point ) && point.z === this.z;
    },

    /* Calculation operations */
    add:        function ( point ) {
        Point.prototype.add.call( this, point );

        this.z += (point.z ? point.z : point) || 0;

        return this;
    },

    sub: function ( point ) {
        Point.prototype.sub.call( this, point );

        this.z -= (point.z ? point.z : point) || 0;

        return this;
    },

    mul: function ( point ) {
        Point.prototype.mul.call( this, point );

        this.z *= (point.z ? point.z : point) || 0;

        return this;
    },

    div: function ( point ) {
        Point.prototype.div.call( this, point );

        this.z /= (point.z ? point.z : point) || 0;

        return this;
    },


    toString: function() {
        return '{x:' + this.x + ',y:' + this.y + ',z:' + this.z + '}';
    }
} );


/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.point3D = function( x, y, z ) {
        
        return new Point3D( x, y, z );
    };
