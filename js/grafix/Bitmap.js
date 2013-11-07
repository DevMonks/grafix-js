
var Bitmap = function( path, x, y, width, height ) {

    // Apply parent methods (arguments are skipped, we call Rectangle.set() in our set() anyways)
    Rectangle.call(this);

    this._path = null;
    this._image = null;

    this._cropX = 0;
    this._cropY = 0;
    this._cropWidth = 0;
    this._cropHeight = 0;
    
    this.loaded( function( e ) {
        
        if( e.bitmap.width === 0 )
            e.bitmap.width = e.image.width;
        
        if( e.bitmap.height === 0 )
            e.bitmap.height = e.image.height;
    } );

    this.set( path, x, y, width, height );
};
Bitmap.cache = {};

Bitmap.prototype = Utils.extend( Rectangle, {

    get clone() {

        return Utils.clone( Bitmap, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return Rectangle.prototype.cloneableProperties.concat([
            'cropX',
            'cropY',
            'cropWidth',
            'cropHeight',
            'path',
            'image',
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Bitmap'; },


    get cropX() { return this.prop( 'cropX' ); },
    set cropX( value ) { return this.prop( 'cropX', value ); },
    
    get cropY() { return this.prop( 'cropY' ); },
    set cropY( value ) { return this.prop( 'cropY', value ); },

    get cropWidth() { return this.prop( 'cropWidth' ); },
    set cropWidth( value ) { return this.prop( 'cropWidth', value ); },
    
    get cropHeight() { return this.prop( 'cropHeight' ); },
    set cropHeight( value ) { return this.prop( 'cropHeight', value ); },

    get crop() { return new Rectangle( this.cropX, this.cropY, this.cropWidth, this.cropHeight ); },
    set crop( value ) {

        if( Utils.isObject( value ) ) {
            if( 'x' in value ) { this.cropX = value.x; }
            else if( 'cropX' in value ) { this.cropX = value.cropX; }
            if( 'y' in value ) { this.cropY = value.y; }
            else if( 'cropY' in value ) { this.cropY = value.cropY; }
            if( 'width' in value ) { this.cropWidth = value.width; }
            else if( 'cropWidth' in value ) { this.cropWidth = value.cropWidth; }
            if( 'height' in value ) { this.cropHeight = value.height; }
            else if( 'dropHeight' in value ) { this.cropHeight = value.cropHeight; }
        } else {
            throw "Invalid type of value for property Bitmap.crop: " + value;
        }
    },
    
    get path() { return this.prop( 'path' ); },
    set path( value ) {
        
        if( this.prop( 'path', value ) === false ) {
            return;
        }

        // Get from cache or create new object
        var img = value in Bitmap.cache ? Bitmap.cache[ value ] : new Image,
            bmp = this;

        // Trigger 'load' event on our object
        bmp.load( { bitmap: bmp, image: img } );
        // Add browser load event on element
        img.addEventListener( 'load', function( e ) {

            // Trigger our 'loaded' event
            bmp.loaded( { bitmap: bmp, image: img } );
        } );
        img.src = value;

        // @TODO: We changed path already, currently we ARE invalid
        if( this.prop( 'image', img ) !== false ) {
            this.invalid = true;
        }
    },
            
    get image() { return this.prop( 'image' ); },

    get cropped() { return ( this.cropX !== 0 || this.cropY !== 0 || this.cropWidth !== 0 || this.cropHeight !== 0 ); },

    /**
     * Overwrites default getter to use image's width and height.
     * @returns {ImageData}
     */
    get rawData() {
        if( this._rawData !== null && this.invalid === false ) {

            return this._rawData;
        }

        var width = this.image.width,
            height = this.image.height,
            ctx = Utils.getTempCanvasContext( width, height);

        // The object's raw data will be stored without filters
        ctx.drawImage( this.image, 0, 0, width, height );

        return this._rawData = ctx.getImageData( 0, 0, width, height );
    },


    set: function( path, x, y, width, height ) {

        if( Utils.isObject( path ) ) {
            
            Rectangle.prototype.set.call( this, path );
            
            if( 'path' in path ) this.path = path.path;
            if( 'crop' in path ) this.crop = path.crop;

        } else if( typeof path !== 'undefined' ) {

            this.path = path;
        }

        return this;
    },


    load: function( args ) {

        return this.on( 'load', args );
    },

    loaded: function( args ) {

        return this.on( 'loaded', args );
    },


    _draw: function( canvasContext, config ) {

        if( !this.image.complete ) { //come back when it is please!

            this.load( function drawOnce( e ) {

                e.bitmap.invalid = true;
                e.bitmap.unbind( 'load', drawOnce );
            } );
            return this;
        }

        var applyStyles = ( Utils.isObject( config ) ? config.styles !== false : true ),
            applyFilter = ( Utils.isObject( config ) ? config.filter !== false : true );

        // Get source and destination bounds
        var sourceRect = this.cropped ? this.crop : new Rectangle( {
                width: this.image.width,
                height: this.image.height
            } ),
            destinationRect = this.rectScaled,
            drawObject = this.image;

        // Draw filtered data?
        if( applyFilter ) {

            // {cavas.drawImage} is able to draw a image or canvas object, so just overwrite the object
            drawObject = Utils.getTempCanvas( this.image );
            drawObject.getContext('2d').putImageData( this.filteredData, 0, 0 );
        }

        canvasContext.save();

        // Apply styles on given context
        if( applyStyles ) {
            this.applyStyles( canvasContext );
        }

        // Draw it
        canvasContext.drawImage(
            drawObject,
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

        //console.log('[Bitmap] draw [', this.path, '] from[', sourceRect.toString(), '] to [', destinationRect.toString(), '] data:', drawObject);

        canvasContext.restore();

        return this;
    }
    
} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.bmp = function( path, x, y, width, height ) {

        return new Bitmap( path, x, y, width, height );
    };

