
var Filter = function( name, type, callback ) {
    
    if( Utils.isFunction( type ) ) {
        
        callback = type;
        type = name;
        name = null;
    }
    
    this._name = name || null;
    this._type = type;
    this._callback = null;
    
    if( name ) {
        
        Filter[ name ] = this;
    }
};
Filter.defaults = {
    types: [ 'pixel', 'pixels' ]
};

Filter.prototype = {
    process: function( pixels ) {
        
        switch( this._type ) {
            case 'pixels':
                
                pixels = callback( pixels );
                break;
            case 'pixel':
                
                for( var i in pixels )
                    pixels[ i ] = callback( pixels[ i ].a, pixels[ i ].r, pixels[ i ].g, pixels[ i ].b );
                
        }
        
        return pixels;
    }
};

Filter.create = function( name, type, callback ) {
    
    return new Filter( name, type, callback );
};


Filter.create( 'rToG', 'pixel', function( a, r, g, b ) {
    
    return { a: a, r: g, g: r, b: b };
} );

Filter.create( 'gToB', 'pixel', function( a, r, g, b ) {
    
    return { a: a, r: r, g: b, b: g };
} );

if( typeof ShortCuts !== 'undefined' )
    ShortCuts.filter = function( name, type, callback ) {
        
        return Filter.create( name, type, callback );
    };
    
    
