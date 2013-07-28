
var Picture = function( path, x, y, width, height ) {
    
    this._path = null;
    this._loaded = false;
    this._image = null;
    
    this._crop = new Rectangle;
    if( this._delegateChanged )
        this._crop.changed( this.changed, this );
    
    this.set( path, x, y, width, height );
};
Picture.cache = {};

Picture.prototype = Utils.extend( Rectangle, {
    
    get crop() { return this._crop; },
    set crop( value ) { throw 'Cannot redeclare crop, use Picture.crop.set( object ) instead'; },
    
    get path() { return this._path; },
    set path( value ) {
        
        if( this._delegateChanged && this.has( 'changed' ) ) {
            this.changed( this.prepareChanged( 'path', this._path, value ) );
        }
        this._path = value;
        
        if( value in Picture.cache ) {
            
            this._image = Picture.cache[ value ];
            
            if( this.width === 0 )
                this.width = this._image.width;
            
            if( this.height === 0 )
                this.height = this._image.height;
            
            this._loaded = true;
            this.invalid = true;
        } else {
            
            var p = this;
            this._image = new Image;
            //TODO: Trigger 'load' event?
            this._loaded = false;
            this._image.onload = function( e ) {
                
                //TODO: Trigger 'loaded' event?
                if( p.width === 0 )
                    p.width = p._image.width;
                
                if( p.height === 0 )
                    p.height = p._image.height;
                
                p._loaded = true;
                p.invalid = true;
            };
            this._image.src = value;
            Picture.cache[ value ] = this._image.src;
        }
    },
            
    get loaded() {

        return this._loaded;
    },
            
    get image() {

        return this._image;
    },
    
    set: function( path, x, y, width, height ) {
        
        if( Utils.isObject( path ) ) {
            
            if( 'path' in path ) this.path = path.path;
            if( 'crop' in path ) this.crop.set( path.crop );
            
            Rectangle.prototype.set.call( this, path );
        } else if( typeof path !== 'undefined' )
            this.path = path;
        
        Rectangle.prototype.set.call( this, x, y, width, height );
        
        return this;
    },
            
    draw: function( canvasContext ) {

        if( !this.loaded )
            return this;
        
        if( this.crop.x !== 0 || this.crop.y !== 0 
         || this.crop.width !== 0 || this.crop.height !== 0 ) {
            
            console.log( 'Drawing cropped', this.crop.toString() );
            canvasContext.drawImage( 
                this._image, 
                //The source rectangle
                this.crop.x, 
                this.crop.y, 
                this.crop.width, 
                this.crop.height,
                //The destination rectangle
                this.x, 
                this.y, 
                this.width,
                this.height
            );
        } else {
            
            console.log( 'Drawing uncropped', this.toString() );
            canvasContext.drawImage( 
                this._image,
                //The destination rectangle
                this.x, 
                this.y, 
                this.width,
                this.height
            );
        }
            
        return this;
    }
    
} );