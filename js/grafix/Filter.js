
var Filter = function( name, type, callback ) {
    
    if( Utils.isFunction( type ) ) {
        
        callback = type;
        type = name;
        name = null;
    }
    
    this._name = null;
    this._type = Filter.defaults.type;
    this._callback = null;
    
    this.set( name, type, callback );
};
Filter.defaults = {
    types: [ 'pixel', 'raw' ],
    type: 'pixel'
};

Filter.prototype = {
    
    get name() { return this._name; },
    set name( value ) {

        if( this._name === value )
            return;

        Filter[ this._name ] = null;
        Filter[ value ] = this;
        
        this._name = value;
    },
            
    get type() { return this._type; },
    set type( value ) { this._type = value; },
    
    get callback() { return this._callback; },
    set callback( value ) { this._callback = value; },
      
    set: function( name, type, callback ) {

        if( Utils.isObject( name ) ) {
            
            if( 'name' in name )
                this.name = name.name;
            
            if( 'type' in name )
                this.type = name.type;
            
            if( 'callback' in name )
                this.callback = name.callback;
            
        } else if( typeof name !== 'undefined' )
            this.name = name;
        
        var args = { type: type, callback: callback };
        for( var i in args )
            if( Utils.isFunction( args[ i ] ) )
                this.callback = args[ i ];
            else if( Utils.isString( args[ i ] ) )
                this.type = args[ i ]
            else if( typeof args[ i ] !== 'undefined' )
                this[ i ] = args[ i ];
        
        
        return this;
    },
    
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

    var sA = a,
        sR = Math.min((r * .393) + (g *.769) + (b * .189), 255),
        sG = Math.min((r * .349) + (g *.686) + (b * .168), 255),
        sB = Math.min((r * .272) + (g *.534) + (b * .131), 255);
    return { a: sA, r: sR, g: sG, b: sB };
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

Filter.create( 'onlyRed', 'pixel', function( r, g, b, a ) {
    
    return { a: a, r: r, g: 0, b: 0 };
} );

Filter.create( 'onlyGreen', 'pixel', function( r, g, b, a ) {
    
    return { a: a, r: 0, g: g, b: 0 };
} );

Filter.create( 'onlyBlue', 'pixel', function( r, g, b, a ) {
    
    return { a: a, r: 0, g: 0, b: b };
} );

Filter.create( 'grayScale', 'pixel', function( r, g, b, a ) {
    
    var max = Math.max( r, g, b );
    
    return { a: a, r: max, g: max, b: max };
} );

Filter.create( 'contrast', 'pixel', function( r, g, b, a ) {
    
    var max = Math.max( r, g, b ),
        value = max > 127 ? 255 : 0;
    
    return { a: a, r: value, g: value, b: value };
} );

Filter.create( 'inverse', 'pixel', function( r, g, b, a ) {
    
    return { a: a, r: 255 - r, g: 255 - g, b: 255 - b };
} );

if( typeof ShortCuts !== 'undefined' )
    ShortCuts.filter = function( name, type, callback ) {
        
        return Filter.create( name, type, callback );
    };
    
    
