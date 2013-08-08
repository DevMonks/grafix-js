var Size = function ( width, height ) {
    ShapeBase.call( this );

    this._width = 0;
    this._height = 0;

    this.set( width, height );
};

Size.prototype = Utils.extend( ShapeBase, {
    get width() { return this.prop( 'width' ); },
    set width( value ) { return this.prop( 'width', value ); },

    get height() { return this.prop( 'height' ); },
    set height( value ) { return this.prop( 'height', value ); },

    get clone() {
        return new Size( this );
    },


    set: function( width, height ) {

        if ( Utils.isObject( width ) ) {

            if ( 'width' in width ) {
                this.width = width.width;
            }
            if ( 'height' in width ) {
                this.height = width.height;
            }
        } else if ( Utils.isNumeric( width ) && typeof height === 'undefined' ) {

            var fac = parseFloat( width );
            this.width = this.height = fac;
        } else if ( typeof width !== 'undefined' ) {

            this.width = parseInt( width );
        }

        if ( typeof height !== 'undefined' ) {
            
            this.height = parseInt( height );
        }

        return this;
    },

    isZero: function () {

        return !( this.width || this.height );
    },

    equals: function ( size ) {

        return this.width === size.width && this.height === size.height;
    },

    /* Calculation operations */
    add:    function ( size ) {

        if ( Utils.isNumeric( size ) ) {
            size = { width: size, height: size };
        }

        if ( size.width ) {
            this.width += size.width;
        }
        if ( size.height ) {
            this.height += size.height;
        }

        return this;
    },

    sub: function ( size ) {

        if ( Utils.isNumeric( size ) ) {
            size = { width: size, height: size };
        }

        if ( size.width ) {
            this.width -= size.width;
        }
        if ( size.height ) {
            this.height -= size.height;
        }

        return this;
    },

    mul: function ( size ) {

        if ( Utils.isNumeric( size ) ) {
            size = { width: size, height: size };
        }

        if ( size.width ) {
            this.width *= size.width;
        }
        if ( size.height ) {
            this.height *= size.height;
        }

        return this;
    },

    div: function ( size ) {

        if ( Utils.isNumeric( size ) ) {
            size = { width: size, height: size };
        }

        if ( size.width ) {
            this.width /= size.width;
        }
        if ( size.height ) {
            this.height /= size.height;
        }

        return this;
    }

} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.size = function( width, height ) {
        
        return new Size( width, height );
    };
