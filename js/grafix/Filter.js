
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

/**
 * Object of static filters
 *
 * @type {{}}
 */
Filter._static = {};

Filter.prototype = {

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Filter'; },
    
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

        var mesureLabel;

        // Process the full data block
        if( this._type == 'raw' ) {

            mesureLabel = 'Mesure raw-filter ' + this.name + ' on ' + (imageData.data.length / 4) + ' RGBA pixel';
            console.time(mesureLabel);

            this._callback.apply( this, [ imageData ].concat( this._customArgs || [] ) );

            console.timeEnd(mesureLabel);

            return this;
        }

        // Default to pixels
        var length = imageData.data.length;

        mesureLabel = 'Mesure pixel-filter ' + this.name + ' on ' + (length / 4) + ' RGBA pixel';
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
 * @returns {Function}
 */
Filter.create = function( name, type, callback ) {

    // We create a simple closure to handle custom args per call
    return Filter[ name ] = function() {

        // Create a static version of the filter, used on normal call's without custom arguments
        var _static = new Filter( name, type, callback );

        if( arguments.length === 0 ) {
            // No custom args - use the static instance
            return _static;
        }

        // Create a new instance using the provided args
        return _static.args( [].slice.apply( arguments ) );
    };

};


Filter.create( 'sepia', 'raw', function( imagedata, adjust ) {

    adjust = adjust || 1;

    var length = imagedata.data.length;
    for( var i = 0; i < length; i += 4 ) {

        // @TODO: It wont work if we dont save the value in memory.. why?
        var r = imagedata.data[ i ],
            g = imagedata.data[ i + 1 ],
            b = imagedata.data[ i + 2 ];

        imagedata.data[ i ] = Math.min(255, (r * (1 - (0.607 * adjust))) + (g * (0.769 * adjust)) + (b * (0.189 * adjust)));
        imagedata.data[ i + 1 ] = Math.min(255, (r * (0.349 * adjust)) + (g * (1 - (0.314 * adjust))) + (b * (0.168 * adjust)));
        imagedata.data[ i + 2 ] = Math.min(255, (r * (0.272 * adjust)) + (g * (0.534 * adjust)) + (b * (1 - (0.869 * adjust))));
    }
} );

Filter.create( 'noRed', 'raw', function( imagedata ) {

    var length = imagedata.data.length;
    for( var i = 0; i < length; i += 4 ) {

        imagedata.data[ i ] = 0;
    }
} );

Filter.create( 'noGreen', 'raw', function( imagedata ) {

    var length = imagedata.data.length;
    for( var i = 0; i < length; i += 4 ) {

        imagedata.data[ i + 1 ] = 0;
    }
} );

Filter.create( 'noBlue', 'raw', function( imagedata ) {

    var length = imagedata.data.length;
    for( var i = 0; i < length; i += 4 ) {

        imagedata.data[ i + 2 ] = 0;
    }
} );

Filter.create( 'onlyRed', 'raw', function( imagedata ) {

    var length = imagedata.data.length;
    for( var i = 0; i < length; i += 4 ) {

        imagedata.data[ i + 1 ] = 0;
        imagedata.data[ i + 2 ] = 0;
    }
} );

Filter.create( 'onlyGreen', 'raw', function( imagedata ) {

    var length = imagedata.data.length;
    for( var i = 0; i < length; i += 4 ) {

        imagedata.data[ i ] = 0;
        imagedata.data[ i + 2 ] = 0;
    }
} );

Filter.create( 'onlyBlue', 'raw', function( imagedata ) {

    var length = imagedata.data.length;
    for( var i = 0; i < length; i += 4 ) {

        imagedata.data[ i ] = 0;
        imagedata.data[ i + 1 ] = 0;
    }
} );

Filter.create( 'grayScale', 'raw', function( imagedata ) {

    var length = imagedata.data.length;
    for( var i = 0; i < length; i += 4 ) {

        var max = Math.max( imagedata.data[ i ], imagedata.data[ i + 1 ], imagedata.data[ i + 2 ] );
        imagedata.data[ i ] = max;
        imagedata.data[ i + 1 ] = max;
        imagedata.data[ i + 2 ] = max;
    }
} );

Filter.create( 'contrast', 'raw', function( imagedata ) {

    var length = imagedata.data.length;
    for( var i = 0; i < length; i += 4 ) {

        var max = Math.max( imagedata.data[ i ], imagedata.data[ i + 1 ], imagedata.data[ i + 2 ]),
            value = max > 127 ? 255 : 0;
        imagedata.data[ i ] = value;
        imagedata.data[ i + 1 ] = value;
        imagedata.data[ i + 2 ] = value;
    }
} );

Filter.create( 'inverse', 'raw', function( imagedata, perc ) {

    // Allow to set the amount of inverse in percentage
    var inverseFac = 255 * Math.min(1, Math.max(0, perc || 1)),
        length = imagedata.data.length;
    for( var i = 0; i < length; i += 4 ) {

        imagedata.data[ i ] = inverseFac - imagedata.data[ i ];
        imagedata.data[ i + 1 ] = inverseFac - imagedata.data[ i + 1 ];
        imagedata.data[ i + 2 ] = inverseFac - imagedata.data[ i + 2 ];
    }
} );

if( typeof ShortCuts !== 'undefined' )
    ShortCuts.filter = function( name, type, callback ) {
        
        return Filter.create( name, type, callback );
    };
    
    
