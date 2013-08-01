
var Bitmap = function( path, x, y, width, height ) {

    // Apply parent methods (arguments are skipped, we call Rectangle.set() in our set() anyways)
    Rectangle.call(this);

    this._path = null;
    this._image = null;

    this._crop = new Rectangle;
    if( this._delegateChanged ) {
        this._crop.changed( this.changed, this );
    }

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
        
        if( this._image )
            return this._image;
        
        var bmp = this;
        var fixSize = function() {
                
                console.log( 'Fixing width of', bmp );
            if( bmp.width === 0 )
                bmp.width = bmp._image.width;

            if( bmp.height === 0 )
                bmp.height = bmp._image.height;

            bmp.invalid = true;
        };

        // Try get image from cache, based on the given path
        if( value in Bitmap.cache && Bitmap.cache[ value ].complete ) {
            
            this._image = Bitmap.cache[ value ];
            fixSize();
        } else if( value in Bitmap.cache ) {
            
            this._image = Bitmap.cache[ value ];
            Bitmap.cache[ value ]._loadedCallbacks.push( fixSize );
        } else {
            
            console.log( 'Attempt to load image', value );
            
            var img = new Image;
            img._loadedCallbacks = [ fixSize ];
            this._image = img;
            img.onload = function( e ) {
                
                console.log( 'Running callbacks' );
                for( var i in img._loadedCallbacks )
                    img._loadedCallbacks[ i ]();
            };
            img.src = value;
            Bitmap.cache[ value ] = img;
        }
    },
            
    get image() { return this._image; },

    get cropped() { return ( this.crop.x !== 0 || this.crop.y !== 0 || this.crop.width !== 0 || this.crop.height !== 0 ); },

    set: function( path, x, y, width, height ) {

        if( Utils.isObject( path ) ) {
            
            Rectangle.prototype.set.call( this, path );
            
            if( 'path' in path ) this.path = path.path;
            if( 'crop' in path ) this.crop.set( path.crop );

        } else if( typeof path !== 'undefined' ) 
            this.path = path;
        
        if( typeof x !== 'undefined' )
            this.x = x;
        
        if( typeof y !== 'undefined' )
            this.y = y;
        
        if( typeof width !== 'undefined' )
            this.width = width;
        
        if( typeof height !== 'undefined' )
            this.height = height;

        return this;
    },

    _draw: function( canvasContext ) {
        
        console.log( 'drawing', this );
        
        if( !this.image.complete )
            return;
        
        console.log( 'And it really gets drawn...' );
        
        // Get source and destination bounds
        var sourceRect = this.cropped ? this.crop : new Rectangle( {
                width: this.image.width,
                height: this.image.height
            } ),
            destinationRect = this;

        // Draw it
        canvasContext.drawImage(
            this._image,
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

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.bmp = function( path, x, y, width, height ) {

        return new Bitmap( path, x, y, width, height );
    };

