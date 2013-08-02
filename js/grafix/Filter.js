
var Filter = function( name, type, callback ) {
    
    if( Utils.isFunction( type ) ) {
        
        callback = type;
        type = name;
        name = null;
    }
    
    this._name = name || null;
    this._type = type;
    this._callback = callback || function() {};
    
    if( name ) {
        
        Filter[ name ] = this;
    }
};
Filter.defaults = {
    types: [ 'pixel', 'pixels' ]
};

Filter.prototype = {
    process: function( imageData ) {
        
        switch( this._type ) {
            case 'raw':
                
                this._callback( imageData.data );
                break;
            case 'pixel':
                
                for( var i = 0; i < imageData.data.length; i += 4 ) {
                    
                    var pixel = this._callback( 
                        imageData.data[ i ], 
                        imageData.data[ i + 1 ], 
                        imageData.data[ i + 2 ], 
                        imageData.data[ i + 3 ]
                    );
                    
                    imageData.data[ i ] = pixel.r;
                    imageData.data[ i + 1 ] = pixel.g;
                    imageData.data[ i + 2 ] = pixel.b;
                    imageData.data[ i + 3 ] = pixel.a;
                }
                
        }
        
        return this;
    }
};

Filter.create = function( name, type, callback ) {
    
    return new Filter( name, type, callback );
};


Filter.create( 'sepia', 'pixel', function( r, g, b, a ) {
    
    //@TODO: Make this a real sepia
    return { a: a, r: r * 0.9, g: g * 0.9, b: b * 0.2 };
} );

Filter.create( 'noRed', 'pixel', function( r, g, b, a ) {
    
    return { a: a, r: 0, g: g, b: b };
} );

Filter.create( 'noGreen', 'pixel', function( r, g, b, a ) {
    
    return { a: a, r: r, g: 0, b: b };
} );

Filter.create( 'noBlue', 'pixel', function( r, g, b, a ) {
    
    return { a: a, r: r, g: g, b: 0 };
} );

Filter.create( 'inverse', 'pixel', function( r, g, b, a ) {
    
    return { a: a, r: 255 - r, g: 255 - g, b: 255 - b };
} );

if( typeof ShortCuts !== 'undefined' )
    ShortCuts.filter = function( name, type, callback ) {
        
        return Filter.create( name, type, callback );
    };
    
    
