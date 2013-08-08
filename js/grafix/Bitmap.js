
var Bitmap = function( path, x, y, width, height ) {

    // Apply parent methods (arguments are skipped, we call Rectangle.set() in our set() anyways)
    Rectangle.call(this);

    this._path = null;
    this._image = null;
    this._filters = [];

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
        return new Bitmap( this );
    },


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

    get filter() {

        var filters = this.prop( 'filters' );
        return filters.length < 1 ? null : filters[ 0 ];
    },
    set filter( value ) {

        this.filters = [ value ];
    },
            
    get filters() { return this.prop( 'filters' ); },
    set filters( value ) { return this.prop( 'filters', value ); },
            
    get image() { return this.prop( 'image' ); },

    get cropped() { return ( this.crop.x !== 0 || this.crop.y !== 0 || this.crop.width !== 0 || this.crop.height !== 0 ); },

    set: function( path, x, y, width, height ) {

        if( Utils.isObject( path ) ) {
            
            Rectangle.prototype.set.call( this, path );
            
            if( 'path' in path ) this.path = path.path;
            if( 'crop' in path ) this.crop = path.crop;
            if( 'filters' in path ) this.filters = path.filters;
            if( 'filter' in path ) this.filter = path.filter;

            // @FIXME: Why 2 times?
            Rectangle.prototype.set.call( this, path );
        } else if( typeof path !== 'undefined' ) {

            this.path = path;
        }

        return this;
    },


    addFilter: function( filter ) {

        this.filters.push( filter );

        return this;
    },

    load: function( args ) {

        return this.on( 'load', args );
    },

    loaded: function( args ) {

        return this.on( 'loaded', args );
    },


    _draw: function( canvasContext ) {

        if( !this.image.complete ) { //come back when it is please!

            this.load( function drawOnce( e ) {

                e.bitmap.invalid = true;
                e.bitmap.unbind( 'load', drawOnce );
            } );
            return this;
        }

        // Get source and destination bounds
        var sourceRect = this.cropped ? this.crop : new Rectangle( {
                width: this.image.width,
                height: this.image.height
            } ),
            destinationRect = this.rectScaled,
            img = this.image;


        //Apply filters
        if( this.filters.length > 0 ) {

            img = document.createElement( 'canvas' );
            img.width = this.image.width;
            img.height = this.image.height;
            var ctx = img.getContext( '2d' );
            ctx.drawImage( this.image, 0, 0, this.image.width, this.image.height );

            var imageData = ctx.getImageData( 0, 0, this.image.width, this.image.height );

            //apply filters
            for( var i in this.filters )
                this.filters[ i ].process( imageData );

            ctx.putImageData( imageData, 0, 0 );
        }

        canvasContext.save();
        this.applyStyles( canvasContext );

        // Draw it
        canvasContext.drawImage(
            img,
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

        console.log('draw bitmap from ', sourceRect.toString(), ' to ', destinationRect.toString(), ':', this.path);

        canvasContext.restore();

        return this;
    }
    
} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.bmp = function( path, x, y, width, height ) {

        return new Bitmap( path, x, y, width, height );
    };

