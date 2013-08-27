var Color = function ( color ) {

    this._r = 0;
    this._g = 0;
    this._b = 0;
    this._rgbChanged = false;
    
    this._h = 0;
    this._s = 0;
    this._l = 0;
    this._hslChanged = false;
    
    this._c = 0;
    this._y = 0;
    this._m = 0;
    this._k = 0;
    this._cmykChanged = false;
    
    // Used for rgbA and hslA
    this._a = 0;
    
    this.set( color );
};

Color.prototype = {

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Color'; },

    get r() { this._refresh(); return this._r; },
    set r( r ) { this._r = r; this._rgbChanged = true; },

    get g() { this._refresh(); return this._g; },
    set g( g ) { this._g = g; this._rgbChanged = true; },

    get b() { this._refresh(); return this._b; },
    set b( b ) { this._b = b; this._rgbChanged = true; },

    
    get h() { this._refresh(); return this._h; },
    set h( h ) { this._h = h; this._hslChanged = true; },

    get s() { this._refresh(); return this._s; },
    set s( s ) { this._s = s; this._hslChanged = true; },

    get l() { this._refresh(); return this._l; },
    set l( l ) { this._l = l; this._hslChanged = true; },
    
    
    get c() { this._refresh(); return this._c; },
    set c( c ) { this._c = c; this._cmykChanged = true; },

    get y() { this._refresh(); return this._y; },
    set y( y ) { this._y = y; this._cmykChanged = true; },

    get m() { this._refresh(); return this._m; },
    set m( l ) { this._m = l; this._cmykChanged = true; },
    
    get k() { this._refresh(); return this._k; },
    set k( k ) { this._k = l; this._cmykChanged = true; },
    
    
    get a() { return this._a; },
    set a( a ) { this._a = a; },

    
    get rgb() { return { r: this.r, g: this.g, b: this.b }; },
    set rgb( value ) { this.rgba = value; },

    get rgba() { return { r: this.r, g: this.g, b: this.b, a: this.a }; },
    set rgba( value ) { this.set( value ); },
    
    get hsl() {  return { h: this.h, s: this.s, l: this.l }; },
    set hsl( value ) { this.hsla = value; },
        
    get hsla() {  return { h: this.h, s: this.s, l: this.l, a: this.a }; },
    set hsla( value ) { this.set( value ); },
        
    get cmyk() {  return { c: this.c, y: this.y, m: this.m, k: this.k }; },
    set cmyk( value ) { this.set( value ); },

    get hex() { return Color.rgbToHex( this.r, this.g, this.b ); },
    set hex( value ) { this.set( value ); },


    set: function( color, deep ) {

        deep = deep !== false;

        if( Utils.isString( color ) ) {

            if( Color.isHex( color ) ) { this.set( Color.hexToRgb( color ) ); }
            else if( Color.isHsla( color ) ) { this.set( Color.extractHslaString( color ) ); }
            else if( Color.isRgba( color ) ) { this.set( Color.extractRgbaString( color ) ); }
            else if( Color.isCmyk( color ) ) { this.set( Color.extractCmykString( color ) ); }
            else if( color in Color ) { this.set( Color.hexToRgb( Color[ color ] ) ); }
            
            return this;
        }

        else if( Utils.isArray( color ) ) {

            switch( color.length ) {
                case 4:
                    this.a = color[ 3 ];
                case 3:
                    this.b = color[ 2 ];
                case 2:
                    this.g = color[ 1 ];
                case 1:
                    this.r = color[ 0 ];
            }
            
            return this;
        }
        
        else if( Utils.isObject( color ) ) {

            if( 'r' in color ) { this.r = color.r; }
            if( 'g' in color ) { this.g = color.g; }
            if( 'b' in color ) { this.b = color.b; }
            
            if( 'a' in color ) { this.a = color.a; }

            if( deep ) {

                if( 'h' in color ) this.h = color.h;
                if( 's' in color ) this.s = color.s;
                if( 'l' in color ) this.l = color.l;

                if( 'c' in color ) this.c = color.c;
                if( 'y' in color ) this.y = color.y;
                if( 'm' in color ) this.m = color.m;
                if( 'k' in color ) this.k = color.k;

                if( 'rgba' in color ) this.rgba = color.rgba;
                if( 'rgb' in color ) this.rgb = color.rgb;
                if( 'hsl' in color ) this.hsl = color.hsl;
                if( 'hsla' in color ) this.hsla = color.hsla;
                if( 'cmyk' in color ) this.cmyk = color.cmyk;
            }
        }

        return this;
    },


    _refresh: function() {

        var rgb, hsl, cmyk;

        // Update HSL and CMYK
        if( this._rgbChanged ) {

            hsl = this.rgbToHsl( this.r, this.g, this.b );
            cmyk = this.rgbToCmyk( this.r, this.g, this.b );

            this._h = hsl.h;
            this._s = hsl.s;
            this._l = hsl.l;

            this._c = cmyk.c;
            this._m = cmyk.m;
            this._y = cmyk.y;
            this._k = cmyk.k;

            this._rgbChanged = false;
        }

        // Update RGB and CMYK
        if( this._hslChanged ) {

            rgb = this.hslToRgb( this.h, this.s, this.l );
            cmyk = this.rgbToCmyk( rgb );

            this._r = hsl.r;
            this._g = hsl.g;
            this._b = hsl.b;

            this._c = cmyk.c;
            this._m = cmyk.m;
            this._y = cmyk.y;
            this._k = cmyk.k;

            this._hslChanged = false;
        }

        // Update RGB and HSL
        if( this._cmykChanged ) {

            rgb = this.cmykToRgb( this.c, this.m, this.y, this.k );
            hsl = this.rgbToHsl( rgb );

            this._r = hsl.r;
            this._g = hsl.g;
            this._b = hsl.b;

            this._h = hsl.h;
            this._s = hsl.s;
            this._l = hsl.l;

            this._cmykChanged = false;
        }

        return this;
    },


    // HSL operations
    hue: function( deg ) {

        this.h = deg / 360;
        return this;
    },

    saturate: function( factor ) {

        this.s *= factor;
        return this;
    },

    desaturate: function( factor ) {

        this.s /= factor;
        return this;
    },

    darken: function( factor ) {

        this.l *= factor;
        return this;
    },

    lighten: function( factor ) {

        this.l /= factor;
        return this;
    },

    inverse: function() {

        var rI = Math.min( 0, 255 - this.r ),
            gI = Math.min( 0, 255 - this.g ),
            bI = Math.min( 0, 255 - this.b );

        this.rgb = { r: rI, g: gI, b: bI };
        return this;
    },

    complement: function() {

        this.h = this._shiftValue( this.h, 360 );
        return this;
    },

    grayscale: function() {

        this.s = 0;
        return this;
    },

    mix: function() {

        // Complex problem, see: http://stackoverflow.com/a/15244944
        // We just mix the CMYK for now

        var length = arguments.length,
            cmyk = this.cmyk,
            a = this.a;

        // Allow to mix more than 2 colors
        for( var i = 0; i < length; i++ ) {

            // @TODO: Ensure {col} is instance of Color
            var col = arguments[ i ];

            cmyk.c += col.c;
            cmyk.m += col.m;
            cmyk.y += col.y;
            cmyk.k += col.k;
            a += col.a;
        }

        cmyk.c /= length;
        cmyk.m /= length;
        cmyk.y /= length;
        cmyk.k /= length;
        a /= length;

        this.cmyk = cmyk;
        this._a = a;
        return this;
    },

    gradientTo: function( type, color, stops ) {

        return Color.gradient( type, this, color, stops );
    },

    gradientFrom: function( type, color, stops ) {

        return Color.gradient( type, color, this, stops );
    },

    linearGradientTo: function( color, stops ) {

        return this.gradientTo( 'linear', color, stops );
    },

    radialGradientTo: function( color, stops ) {

        return this.gradientTo( 'radial', color, stops );
    },

    linearGradientFrom: function( color, stops ) {

        return this.gradientFrom( 'linear', color, stops );
    },

    radialGradientFrom: function( color, stops ) {

        return this.gradientFrom( 'radial', color, stops );
    },

    toString: function() {

        return JSON.stringify( {
            r: this.r,
            g: this.g,
            b: this.b,
            a: this.a
        } );
    }
};

Utils.merge( Color, {

    shortHexPattern: /^#?([a-f\d])([a-f\d])([a-f\d])$/i,

    hexPattern: /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,

    rgbaPattern: /rgb[a]?\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)(?:\s*,\s*([0-9]+))?\s*\)/i,

    hslaPattern: /hsl[a]\(\s*([0-9]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9]+))?\s*\)/i,

    cmykPattern: /cmyk\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\)/i,
    
    isShortHex: function( val ) { return !!this.shortHexPattern.test( val ); },
    
    isHex: function( val ) { return !!this.hexPattern.test( val ) || this.isShortHex( val ); },
    
    isRgba: function( val ) { return !!this.rgbaPattern.test( val ); },
    
    isHsla: function( val ) { return !!this.hslaPattern.test( val ); },
    
    isCmyk: function( val ) { return !!this.cmykPattern.test( val ); },
    
    extractRgbaString: function( str ) {

        var result = this.rgbaPattern.exec( str );
        
        return { 
            r: parseInt( result[ 1 ] ), 
            g: parseInt( result[ 2 ] ), 
            b: parseInt( result[ 3 ] ), 
            a: typeof result[ 4 ] !== 'undefined' ? parseInt( result[ 4 ] ) : 0 
        };
    },
            
    extractHslaString: function( str ) {
        
        var result = this.hslaPattern.exec( str );
        
        return { 
            h: parseInt( result[ 1 ] ), 
            s: parseFloat( result[ 2 ] ), 
            l: parseFloat( result[ 3 ] ),
            a: typeof result[ 4 ] !== 'undefined' ? parseInt( result[ 4 ] ) : 0 
        };
    },
            
    extractCmykString: function( str ) {

        var result = this.cmykPattern.exec( str );
        
        return { 
            c: parseFloat( result[ 1 ] ), 
            y: parseFloat( result[ 2 ] ), 
            m: parseFloat( result[ 3 ] ), 
            k: parseFloat( result[ 4 ] ) 
        };
    },
    
    expandHex: function( val ) {

        return val.replace( this.shortHexPattern, function( m, r, g, b ) {
            
            return r * 2 + g * 2 + b * 2;
        } );
    },

    hexToRgb: function( hex ) {
    
        hex = this.expandHex( hex );
        
        // Extract single components
        var result = this.hexPattern.exec( hex );
        return result ? {
            r: parseInt( result[ 1 ], 16 ),
            g: parseInt( result[ 2 ], 16 ),
            b: parseInt( result[ 3 ], 16 )
        } : null;
    },

    rgbToHex: function( r, g, b ) {

        return '#' + ( ( 1 << 24 ) + ( r << 16 ) + ( g << 8 ) + b ).toString( 16 ).slice( 1 );
    },
    
    _shiftValue: function( value, max ) {
        
        max = max || 1;
        
        if( value < 0 )
            value += max;
        else if( value > max )
            value -= max;
        
        return value;
    },
    
    _hueToRgb: function( v1, v2, vH ) {

        if ( ( 6 * vH ) < 1 )
            return v1 + ( v2 - v1 ) * 6 * vH;

        if ( ( 2 * vH ) < 1 )
            return v2;

        if ( ( 3 * vH ) < 2 )
            return v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6;

        return v1;
    },

    hslToRgb: function( h, s, l ) {

        // Asumme an single object as parameter
        if( Utils.isObject( h ) ) {
            s = h.s;
            l = h.l;
            h = h.h;
        }

        var r = 0,
            g = 0,
            b = 0,
            
            v1 = 0,
            v2 = 0;
            
        if( s === 0 ) {
            
           r = l * 255;
           g = l * 255;
           b = l * 255;
        } else {
            
           if ( l < 0.5 ) 
               v1 = l * ( 1 + s );
           else
               v2 = ( l + s ) - ( s * l );
        
           v1 = 2 * l - v2;
        
           r = 255 * this._hueToRgb( v1, v2, h + ( 1 / 3 ) );
           g = 255 * this._hueToRgb( v1, v2, h );
           b = 255 * this._hueToRgb( v1, v2, h - ( 1 / 3 ) );
        }
        
        return { r: r, g: g, b: b };
    },
        
    rgbToHsl: function( r, g, b ) {

        // Asumme an single object as parameter
        if( Utils.isObject( r ) ) {
            g = r.g;
            b = r.b;
            r = r.r;
        }
        
        var red = r / 255,
            green = g / 255,
            blue = b / 255,
            max = Math.max( r, g, b ),
            min = Math.min( r, g, b ),
            diff = max - min,
            halfDiff = ( diff / 2 ),
            h = 0,
            s = 0,
            l = ( max + min ) / 2;
            
        if( max !== min ) {
            
            s = l > 0.5 ? diff / ( 2 - max - min ) : diff / ( max + min );
            
            var diffRed = ( ( ( max - red ) / 6 ) + halfDiff ) / diff,
                diffGreen = ( ( ( max - green ) / 6 ) + halfDiff ) / diff,
                diffBlue = ( ( ( max - blue ) / 6 ) + halfDiff ) / diff;
            
            switch( max ) {
                case red:
                    
                    h = diffBlue - diffGreen;
                    break
                case green:
                    
                    h = ( 1 / 3 ) + diffRed - diffBlue;
                    break
                case blue:
                    
                    h = ( 2 / 3 ) + diffGreen - diffRed;
                    break
            }
            
            h = this._shiftValue( h );
        }
        
        
        return { h: h, s: s, l: l };
    },
    

    cmykToRgb: function( c, m, y, k ) {

        // Asumme an single object as parameter
        if( Utils.isObject( c ) ) {
            m = c.m;
            y = c.y;
            k = c.k;
            c = c.c;
        }

        var cyan = ( c * 255 * ( 1 - k ) ),
            magenta = ( m * 255 * ( 1 - k ) ),
            yellow = ( y * 255 * ( 1 - k ) ),
            
            black = 255 * ( 1 - k ),
            
            r = parseInt( black - cyan ),
            g = parseInt( black - magenta ),
            b = parseInt( black - yellow );
        
        return { r: r, g: g, b: b };
    },
    
    rgbToCmyk: function( r, g, b ) {

        // Asumme an single object as parameter
        if( Utils.isObject( r ) ) {
            g = r.g;
            b = r.b;
            r = r.r;
        }

        var cmyk = { c: 1 - ( r / 255 ), m: 1 - ( g / 255 ), y: 1 - ( b / 255 ), k: 0 };
        cmyk.k = Math.min( cmyk.c, cmyk.m, cmyk.y );
            
        if( cmyk.c > 0 )
            cmyk.c = ( cmyk.c - cmyk.k ) / ( 1 - cmyk.k );
        if( cmyk.m > 0 )
            cmyk.m = ( cmyk.m - cmyk.k ) / ( 1 - cmyk.k );
        if( cmyk.y > 0 )
            cmyk.y = ( cmyk.y - cmyk.k ) / ( 1 - cmyk.k );
        
        return cmyk;
    },
            
    gradient: function( type, start, end, stops ) {

        // Stops are formatted like this: { 0: Color, 0.2: Color, 0.5: Color, 0.8: Color, 1: Color }
        // Type can be "linear", "radial"
        stops = stops || {};

        if( Utils.isObject( end ) === false ) { stops[ 1 ] = end.hex ? end.hex : end; }
        else { stops = end; }

        if( Utils.isObject( start ) === false ) { stops[ 0 ] = start.hex ? start.hex : start; }
        else { stops = start; }


        // @TODO: create a canvas gradient out of this


        return theGreatGradient;
    },
    
    linearGradient: function( start, end, stops ) {
        return Color.gradient( 'linear', start, end, stops );
    },

    radialGradient: function( start, end, stops ) {
        return Color.gradient( 'radial', start, end, stops );
    },

    aqua:                 '#00ffff',
    black:                '#000000',
    blue:                 '#0000ff',
    fuchsia:              '#ff00ff',
    gray:                 '#808080',
    green:                '#008000',
    lime:                 '#00ff00',
    maroon:               '#800000',
    navy:                 '#000080',
    olive:                '#808000',
    purple:               '#800080',
    red:                  '#ff0000',
    silver:               '#c0c0c0',
    teal:                 '#008080',
    white:                '#ffffff',
    yellow:               '#ffff00',
    aliceblue:            '#f0f8ff',
    antiquewhite:         '#faebd7',
    aquamarine:           '#7fffd4',
    azure:                '#f0ffff',
    beige:                '#f5f5dc',
    bisque:               '#ffe4c4',
    blanchedalmond:       '#ffebcd',
    blueviolet:           '#8a2be2',
    brown:                '#a52a2a',
    burlywood:            '#deb887',
    cadetblue:            '#5f9ea0',
    chartreuse:           '#7fff00',
    chocolate:            '#d2691e',
    coral:                '#ff7f50',
    cornflowerblue:       '#6495ed',
    cornsilk:             '#fff8dc',
    crimson:              '#dc143c',
    cyan:                 '#00ffff',
    darkblue:             '#00008b',
    darkcyan:             '#008b8b',
    darkgoldenrod:        '#b8860b',
    darkgray:             '#a9a9a9',
    darkgreen:            '#006400',
    darkgrey:             '#a9a9a9',
    darkkhaki:            '#bdb76b',
    darkmagenta:          '#8b008b',
    darkolivegreen:       '#556b2f',
    darkorange:           '#ff8c00',
    darkorchid:           '#9932cc',
    darkred:              '#8b0000',
    darksalmon:           '#e9967a',
    darkseagreen:         '#8fbc8f',
    darkslateblue:        '#483d8b',
    darkslategray:        '#2f4f4f',
    darkslategrey:        '#2f4f4f',
    darkturquoise:        '#00ced1',
    darkviolet:           '#9400d3',
    deeppink:             '#ff1493',
    deepskyblue:          '#00bfff',
    dimgray:              '#696969',
    dimgrey:              '#696969',
    dodgerblue:           '#1e90ff',
    firebrick:            '#b22222',
    floralwhite:          '#fffaf0',
    forestgreen:          '#228b22',
    gainsboro:            '#dcdcdc',
    ghostwhite:           '#f8f8ff',
    gold:                 '#ffd700',
    goldenrod:            '#daa520',
    greenyellow:          '#adff2f',
    grey:                 '#808080',
    honeydew:             '#f0fff0',
    hotpink:              '#ff69b4',
    indianred:            '#cd5c5c',
    indigo:               '#4b0082',
    ivory:                '#fffff0',
    khaki:                '#f0e68c',
    lavender:             '#e6e6fa',
    lavenderblush:        '#fff0f5',
    lawngreen:            '#7cfc00',
    lemonchiffon:         '#fffacd',
    lightblue:            '#add8e6',
    lightcoral:           '#f08080',
    lightcyan:            '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray:            '#d3d3d3',
    lightgreen:           '#90ee90',
    lightgrey:            '#d3d3d3',
    lightpink:            '#ffb6c1',
    lightsalmon:          '#ffa07a',
    lightseagreen:        '#20b2aa',
    lightskyblue:         '#87cefa',
    lightslategray:       '#778899',
    lightslategrey:       '#778899',
    lightsteelblue:       '#b0c4de',
    lightyellow:          '#ffffe0',
    limegreen:            '#32cd32',
    linen:                '#faf0e6',
    mediumaquamarine:     '#66cdaa',
    mediumblue:           '#0000cd',
    mediumorchid:         '#ba55d3',
    mediumpurple:         '#9370db',
    mediumseagreen:       '#3cb371',
    mediumslateblue:      '#7b68ee',
    mediumspringgreen:    '#00fa9a',
    mediumturquoise:      '#48d1cc',
    mediumvioletred:      '#c71585',
    midnightblue:         '#191970',
    mintcream:            '#f5fffa',
    mistyrose:            '#ffe4e1',
    moccasin:             '#ffe4b5',
    navajowhite:          '#ffdead',
    oldlace:              '#fdf5e6',
    olivedrab:            '#6b8e23',
    orange:               '#ffa500',
    orangered:            '#ff4500',
    orchid:               '#da70d6',
    palegoldenrod:        '#eee8aa',
    palegreen:            '#98fb98',
    paleturquoise:        '#afeeee',
    palevioletred:        '#db7093',
    papayawhip:           '#ffefd5',
    peachpuff:            '#ffdab9',
    peru:                 '#cd853f',
    pink:                 '#ffc0cb',
    plum:                 '#dda0dd',
    powderblue:           '#b0e0e6',
    rosybrown:            '#bc8f8f',
    royalblue:            '#4169e1',
    saddlebrown:          '#8b4513',
    salmon:               '#fa8072',
    sandybrown:           '#f4a460',
    seagreen:             '#2e8b57',
    seashell:             '#fff5ee',
    sienna:               '#a0522d',
    skyblue:              '#87ceeb',
    slateblue:            '#6a5acd',
    slategray:            '#708090',
    slategrey:            '#708090',
    snow:                 '#fffafa',
    springgreen:          '#00ff7f',
    steelblue:            '#4682b4',
    tan:                  '#d2b48c',
    thistle:              '#d8bfd8',
    tomato:               '#ff6347',
    turquoise:            '#40e0d0',
    violet:               '#ee82ee',
    wheat:                '#f5deb3',
    whitesmoke:           '#f5f5f5',
    yellowgreen:          '#9acd32'
} );

if( typeof ShortCuts !== 'undefined' ) {
    ShortCuts.color = function( color ) {
        
        return new Color( color );
    };
    ShortCuts.colors = Color;
}
