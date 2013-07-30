
var Bitmap = function( path, x, y, width, height ) {

    // Apply parent methods (arguments are skipped, we call Rectangle.set() in our set() anyways)
    Rectangle.call(this);

    this._path = null;
    this._loaded = false;
    this._image = null;

    // Allow to scale every single value - x, y, width, height
    this._scale = new Rectangle(1., 1., 1., 1.);
    if( this._delegateChanged ) {
        this._scale.changed( this.changed, this );
    }

    this._crop = new Rectangle;
    if( this._delegateChanged ) {
        this._crop.changed( this.changed, this );
    }

    // A simple rectangle used to store/cache the image's source bounds (untouched)
    this._imageBounds = null;

    this.set( path, x, y, width, height );
};
Bitmap.cache = {};

Bitmap.prototype = Utils.extend( Rectangle, {

    get clone() {
        return new Bitmap( this );
    },
    
    get crop() { return this._crop; },
    set crop( value ) { throw 'Cannot redeclare crop, use Bitmap.crop.set( object ) instead'; },
    
    get path() { return this._path; },
    set path( value ) {
        
        if( this._delegateChanged && this.has( 'changed' ) ) {
            this.changed( this.prepareChanged( 'path', this._path, value ) );
        }
        this._path = value;

        // Try get image from cache, based on the given path
        if( value in Bitmap.cache ) {
            
            this._image = Bitmap.cache[ value ];
            
            if( this.width === 0 )
                this.width = this._image.width;
            
            if( this.height === 0 )
                this.height = this._image.height;
            
            this._loaded = true;
            this.invalid = true;

            return;
        }
            
        var p = this;
        this._image = new Image;
        this._loaded = false;
        this._image.onload = function( e ) {

            if( p.width === 0 )
                p.width = p._image.width;

            if( p.height === 0 )
                p.height = p._image.height;

            p._loaded = true;
            p.invalid = true;

            // We got it - now cache it
            Bitmap.cache[ value ] = this;

            p.trigger('loaded');
        };
        this._image.onerror = function(e) {
            console.error('Failed to load image', p._image, ':', e);
            throw e;
        };
        this._image.src = value;

        this.trigger('load');
    },
            
    get loaded() { return this._loaded; },
            
    get image() { return this._image; },

    get originWidth() { return this.image.width; },
    get originHeight() { return this.image.height; },

    get isCroped() { return ( this.crop.x !== 0 || this.crop.y !== 0 || this.crop.width !== 0 || this.crop.height !== 0 ); },

    /**
     * Gets the image source bounds (crop'ed or origin)
     * @returns {Rectangle}
     */
    get rectSource() {
        // Return crop'ed area, if needed
        if( this.isCroped ) {
            return this.crop;
        }

        // Create and return origin bounds
        if( !this._imageBounds ) {
            this._imageBounds = new Rectangle(0, 0, this.originWidth, this.originHeight);
        }
        return this._imageBounds;
    },

    /**
     * Gets the image destination bounds (scaled)
     * @returns {Rectangle}
     */
    get rectDestination() {
            return new Rectangle(
                this.x * this.scale.x,
                this.y * this.scale.y,
                this.width * this.scale.width,
                this.height * this.scale.height
            );
    },

    get scale() { return this._scale; },
    set scale(value) { throw 'Cannot redeclare scale, use Bitmap.scale.set( object ) instead'; },
    
    set: function( path, x, y, width, height ) {

        Rectangle.prototype.set.call( this, x, y, width, height );

        if( Utils.isObject( path ) ) {
            
            if( 'path' in path ) this.path = path.path;
            if( 'crop' in path ) this.crop.set( path.crop );
            if( 'scale' in path ) this.scale.set( path.scale );

            Rectangle.prototype.set.call( this, path );
        } else if( typeof path !== 'undefined' ) {

            this.path = path;
        }

        return this;
    },


    // Image manipulation methods

    /**
     * Set the destination scale factor for any of x, y, width or height.
     *
     * @param {int|Rectangle} x
     * @param {int|undefined} y
     * @param {int|undefined} width
     * @param {int|undefined} height
     * @returns {self}
     */
    scaled: function( x, y, width, height ) {
        // Allow to scale all with 1
        if( Utils.isNumeric(x) && y === undefined && width === undefined && height === undefined ) {

            this.scale.x *= x;
            this.scale.y *= x;
            this.scale.width *= x;
            this.scale.height *= x;

            return this;
        }

        this.scale.set(x, y, width, height);
        return this;
    },

            
    _draw: function( canvasContext ) {

        if( !this.loaded )
            return this;

        // Get source and destination bounds
        var rectSource = this.rectSource,
            rectDestination = this.rectDestination,
            drawData = this._image;

        // Lil debug
        if( this.isCroped ) {
            console.log( 'Drawing cropped', this.crop.toString() );
        } else {
            console.log( 'Drawing uncropped', this.toString() );
        }

        // Draw it
        canvasContext.drawImage(
            drawData,
            // The source rectangle
            rectSource.x,
            rectSource.y,
            rectSource.width,
            rectSource.height,
            // The destination rectangle
            rectDestination.x,
            rectDestination.y,
            rectDestination.width,
            rectDestination.height
        );

        return this;
    }
    
} );
