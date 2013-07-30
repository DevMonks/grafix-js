
var Bitmap = function( path, x, y, width, height ) {

    // Apply parent methods (arguments are skipped, we call Rectangle.set() in our set() anyways)
    Rectangle.call(this);

    this._path = null;
    this._loaded = false;
    this._image = null;

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

    get isCropped() { return ( this.crop.x !== 0 || this.crop.y !== 0 || this.crop.width !== 0 || this.crop.height !== 0 ); },

    /**
     * Gets the image source bounds (crop'ed or origin)
     * @returns {Rectangle}
     */
    get sourceRect() {
        // Return crop'ed area, if needed
        if( this.isCropped ) {
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
    get destinationRect() {
        return this.bounds;
    },

    set: function( path, x, y, width, height ) {

        Rectangle.prototype.set.call( this, x, y, width, height );

        if( Utils.isObject( path ) ) {
            
            if( 'path' in path ) this.path = path.path;
            if( 'crop' in path ) this.crop.set( path.crop );

            Rectangle.prototype.set.call( this, path );
        } else if( typeof path !== 'undefined' ) {

            this.path = path;
        }

        return this;
    },


    // Image manipulation methods

    /**
     * Set the destination scale factor for any of x or y.
     *
     * @param {int|Point} x
     * @param {int|undefined} y
     * @returns {self}
     */
    scaled: function( x, y ) {
        // Allow to scale all with 1
        if( Utils.isNumeric(x) && y === undefined ) {

            this.scale.mul( x );

            return this;
        }

        this.scale.set(x, y);
        return this;
    },

            
    _draw: function( canvasContext ) {

        if( !this.loaded )
            return this;

        // Get source and destination bounds
        var sourceRect = this.sourceRect,
            destinationRect = this.destinationRect,
            drawData = this._image;

        // Lil debug
        if( this.isCropped ) {
            console.log( 'Drawing cropped', this.crop.toString() );
        } else {
            console.log( 'Drawing uncropped', this.toString() );
        }

        // Draw it
        canvasContext.drawImage(
            drawData,
            // The source rectangle
            sourceRect.x,
            sourceRect.y,
            sourceRect.width,
            sourceRect.height,
            // The destination rectangle
            destinationRect.x,
            destinationRect.y,
            destinationRect.width,
            destinationRect.height
        );

        return this;
    }
    
} );
