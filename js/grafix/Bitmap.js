
var Bitmap = function( path, x, y, width, height ) {

    // Apply parent methods (arguments are skipped, we call Rectangle.set() in our set() anyways)
    Rectangle.call(this);

    this._path = null;
    this._image = null;
    this._filters = [];

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
    
    get crop() { return this.prop( 'crop' ); },
    set crop( value ) { throw 'Cannot redeclare crop, use Bitmap.crop.set( object ) instead'; },
    
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

            // Trigger out 'loaded' event
            bmp.loaded( { bitmap: bmp, image: img } );
        } );
        img.src = value;
        
        if( this.prop( 'image', img ) !== false ) {
            this.invalid = true;
        }
    },
            
    get filters() { return this.prop( 'filters' ); },
    set filters( value ) {

        if( this.prop( 'filters', value ) !== false ) {
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
            
    get image() { return this.prop( 'image' ); },

    get cropped() { return ( this.crop.x !== 0 || this.crop.y !== 0 || this.crop.width !== 0 || this.crop.height !== 0 ); },

    set: function( path, x, y, width, height ) {

        if( Utils.isObject( path ) ) {
            
            Rectangle.prototype.set.call( this, path );
            
            if( 'path' in path ) this.path = path.path;
            if( 'crop' in path ) this.crop.set( path.crop );
            if( 'filters' in path ) this.filters = path.filters;
            if( 'filter' in path ) this.filter = path.filter;

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
            destinationRect = this,
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
            
        canvasContext.restore();

        return this;
    }
    
} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.bmp = function( path, x, y, width, height ) {

        return new Bitmap( path, x, y, width, height );
    };

