var Line = function ( fromX, fromY, toX, toY ) {
    ShapeBase.call( this );

    this._fromX = 0;
    this._fromY = 0;
    this._toX = 0;
    this._toY = 0;

    this.set( fromX, fromY, toX, toY );
};

Line.prototype = Utils.extend( ShapeBase, {
    get fromX() { return this.prop( 'fromX' ); },
    set fromX(value) { return this.prop( 'fromX', value ); },

    get fromY() { return this.prop( 'fromY' ); },
    set fromY(value) { return this.prop( 'fromY', value ); },

    get toX() { return this.prop( 'toX' ); },
    set toX(value) { return this.prop( 'toX', value ); },

    get toY() { return this.prop( 'toY' ); },
    set toY(value) { return this.prop( 'toY', value ); },

    get from() { return new Point( this.fromX, this.fromY ); },
    set from(value) {
        if( Utils.isObject( value ) ) {
            this.fromX = value.x;
            this.fromY = value.y;
        } else if( Utils.isNumeric( value )) {
            this.fromX = value;
            this.fromY = value;
        } else {
            throw "Invalid type of data for virtual property Line.from: " + value;
        }
    },

    get to() { return new Point( this.toX, this.toY ); },
    set to(value) {
        if( Utils.isObject( value ) ) {
            this.toX = value.x;
            this.toY = value.y;
        } else if( Utils.isNumeric( value )) {
            this.toX = value;
            this.toY = value;
        } else {
            throw "Invalid type of data for virtual property Line.to: " + value;
        }
    },

    get clone() {
        return new Line( this );
    },

    set: function( fromX, fromY, toX, toY ) {

        ShapeBase.prototype.set.call( this, fromX, fromY, toX, toY );

        // All args are handled the same way, so..
        var args = {
            fromX: (Utils.isObject(fromX) ? fromX.x : fromX) || 0,
            fromY: (Utils.isObject(fromX) ? fromX.y : fromY) || 0,
            toX: (Utils.isObject(fromY) ? fromY.x : Utils.isObject(toX) ? toX.x : toX) || 0,
            toY: (Utils.isObject(fromY) ? fromY.y : Utils.isObject(toX) ? toX.y : toY) || 0
        };
        for( var propName in args ) {

            var value = args[ propName ];

            if( Utils.isNumeric( value )) {

                this[ propName ] = value;
            } else {

                throw "Invalid type of data in set() for property " + propName + ": " + value;
            }

        }


        return this;
    },


    toString: function() {
        return '{x:' + this.x + ',y:' + this.y + '}';
    }
} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.line = function( fromX, fromY, toX, toY ) {

        return new Line( fromX, fromY, toX, toY );
    };
