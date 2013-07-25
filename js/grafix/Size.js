var Size = function ( width, height ) {
    EventObject.call( this );

    // Will changes to own properties delegated to the changed() event?
    this._delegateChanged = (Utils.isObject(width) && width.delegateChanged ? true : false);

    this._width = 0;
    this._height = 0;

    this.set( width, height );
};

Size.prototype = Utils.extend( EventObject, {
    get width() { return this._width; },
    set width( value ) {
        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'width', this._width, value ) );
        }
        this._width = value;
        // Informs also parent
        this.invalid = true;
    },

    get height() { return this._height; },
    set height( value ) {
        if (this._delegateChanged && this.has('changed')) {
            this.changed( this.prepareChanged( 'height', this.height, value ) );
        }
        this._height = value;
        // Informs also parent
        this.invalid = true;
    },

    get clone() {
        return new Size( this );
    },


    set: function ( width, height ) {

        if ( Utils.isObject( width ) ) {

            if ( width.width ) {
                this.width = width.width;
            }
            if ( width.height ) {
                this.height = width.height;
            }
            if ( width.parent ) {
                this.parent = width.parent;
            }
        } else if ( Utils.isNumeric( width ) ) {

            this.width = parseInt( width );
        }

        if ( Utils.isNumeric( height ) ) {
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
