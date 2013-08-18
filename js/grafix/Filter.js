
var Filter = function( name, type, callback, args ) {
    
    if( Utils.isFunction( type ) ) {
        
        callback = type;
        type = name;
        name = null;
    }
    
    this._name = null;
    this._type = Filter.defaults.type;
    this._callback = null;
    this._customArgs = [];

    this.set( name, type, callback, args );
};
Filter.defaults = {
    types: [ 'pixel', 'raw' ],
    type: 'pixel'
};

Filter.prototype = {
    
    get name() { return this._name; },
    set name( value ) { this._name = value; },
            
    get type() { return this._type; },
    set type( value ) { this._type = value; },
    
    get callback() { return this._callback; },
    set callback( value ) { this._callback = value; },
      
    set: function( name, type, callback, customArgs ) {

        if( Utils.isObject( name ) ) {
            
            if( 'name' in name ) { this.name = name.name; }
            if( 'type' in name ) { this.type = name.type; }
            if( 'callback' in name ) { this.callback = name.callback; }
            
        } else if( Utils.isUndefined( name ) === false ) {

            this.name = name;
        }

        if( Utils.isUndefined( customArgs ) === false ) { this._customArgs = customArgs; }
        
        var args = { type: type, callback: callback };
        for( var i in args ) {
            if( Utils.isFunction( args[ i ] ) ) { this.callback = args[ i ]; }
            else if( Utils.isString( args[ i ] ) ) { this.type = args[ i ]; }
            // Allows a direct modification of this instance
            else if( Utils.isUndefined( args[ i ] ) ) { this[ i ] = args[ i ]; }
        }
        
        return this;
    },

    args: function() {

        var args = [].slice.apply( arguments );
        return new Filter( this.name, this.type, this.callback, args );
    },

    /**
     *
     * @param {ImageData} imageData
     * @returns {*}
     */
    process: function( imageData ) {

        // Process the full data block
        if( this._type == 'raw' ) {

            this._callback.apply( this, [ imageData.data ].concat( this._customArgs || [] ) );
            return this;
        }

        // Default to pixels
        var length = imageData.data.length,
            mesureLabel = 'Mesure filter ' + this.name + ' on ' + (length / 4) + ' RGBA pixel';
        console.time(mesureLabel);
        for( var i = 0; i < length; i += 4 ) {

            var args = [
                    imageData.data[ i ],
                    imageData.data[ i + 1 ],
                    imageData.data[ i + 2 ],
                    imageData.data[ i + 3 ]
                ].concat( this._customArgs || []),
                pixel = this._callback.apply( this, args );

            imageData.data[ i ] = pixel.r;
            imageData.data[ i + 1 ] = pixel.g;
            imageData.data[ i + 2 ] = pixel.b;
            imageData.data[ i + 3 ] = pixel.a;
        }

        console.timeEnd(mesureLabel);
        
        return this;
    }
};

/**
 * Creates a new permanent filter and returns the instance.
 *
 * @param {String} name
 * @param {"pixel"|"raw"} type
 * @param {Function} callback
 * @returns {Filter}
 */
Filter.create = function( name, type, callback ) {

    return Filter[ name ] = new Filter( name, type, callback );
};


Filter.create( 'sepia', 'pixel', function( r, g, b, a, adjust ) {

    adjust = adjust || 1.0;

    var sA = a,
        sR = Math.min(255, (r * (1 - (0.607 * adjust))) + (g * (0.769 * adjust)) + (b * (0.189 * adjust))),
        sG = Math.min(255, (r * (0.349 * adjust)) + (g * (1 - (0.314 * adjust))) + (b * (0.168 * adjust))),
        sB = Math.min(255, (r * (0.272 * adjust)) + (g * (0.534 * adjust)) + (b * (1 - (0.869 * adjust))));
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

Filter.create( 'inverse', 'pixel', function( r, g, b, a, perc ) {

    // Allow to set the amount of inverse in percentage
    var inverseFac = 255 * Math.min(1, Math.max(0, perc || 1));
    return { a: a, r: inverseFac - r, g: inverseFac - g, b: inverseFac - b };
} );

if( typeof ShortCuts !== 'undefined' )
    ShortCuts.filter = function( name, type, callback ) {
        
        return Filter.create( name, type, callback );
    };
    
    
