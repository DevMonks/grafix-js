
var Bitmap = function( path, x, y, width, height ) {

    // Apply parent methods (arguments are skipped, we call Rectangle.set() in our set() anyways)
    Rectangle.call(this);

    this._path = null;
    this._image = null;
    this._argbData = [];

    this._crop = new Rectangle;
    if( this._delegateChanged ) {
        this._crop.changed( this.changed, this );
    }
    
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
    
    get crop() { return this._crop; },
    set crop( value ) { throw 'Cannot redeclare crop, use Bitmap.crop.set( object ) instead'; },
    
    get path() { return this._path; },
    set path( value ) {
        
        if( this._path === value )
            return;

        if( this._delegateChanged && this.has( 'changed' ) ) {
            
            this.changed( this.prepareChanged( 'path', this._path, value ) );
        }
        this._path = value;
        
        var img = value in Bitmap.cache ? Bitmap.cache[ value ] : new Image,
            bmp = this;
        
        bmp.load( { bitmap: bmp, image: img } );
        img.addEventListener( 'load', function( e ) {
            
            bmp.loaded( { bitmap: bmp, image: img } );
        } );
        img.src = value;
        
        this._image = img;
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
            
    load: function( args ) {
        
        return this.on( 'load', args );
    },
            
    loaded: function( args ) {

        return this.on( 'loaded', args );
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
            destinationRect = this,
            drawnObject = this._image;

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

