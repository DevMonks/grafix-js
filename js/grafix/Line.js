var Line = function ( fromX, fromY, toX, toY ) {
    Path.call( this );

    this.set( fromX, fromY, toX, toY );
};

Line.prototype = Utils.extend( Path, {

    get clone() {
        return Utils.clone( Line, this );
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Line'; },

    get from() { return this.start; },
    set from( value ) { this.start = value;  },

    get to() { return this.end; },
    set to( value ) { this.end = value;  },

    get center() { return new Point( (this.from.x + this.to.x) / 2, (this.from.y + this.to.y) / 2 ); },


    set: function( fromX, fromY, toX, toY ) {

        Path.prototype.set.call( this, fromX, fromY, toX, toY );

        if( Utils.isNumeric( fromX ) && Utils.isNumeric( fromX ) ) {
            this.from = new Point( fromX, fromY );
        }

        else if( Utils.isObject( fromX ) && ( ( 'from' in fromX ) || ( 'to' in fromX ) ) ) {
            if( 'from' in fromX ) {
                this.from = fromX.from;
            }
            if( 'to' in fromX ) {
                this.to = fromX.to;
            }
        }

        if( Utils.isNumeric( toX ) && Utils.isNumeric( toX ) ) {
            this.to = new Point( toX, toY );
        }

        return this;
    },


    toString: function() {
        return '{from:' + this.from.x + '/' + this.from.y + ',to:' + this.to.x + '/' + this.to.y + '}';
    }
} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' ) {
    ShortCuts.line = function( fromX, fromY, toX, toY ) {

        return new Line( fromX, fromY, toX, toY );
    };
}
