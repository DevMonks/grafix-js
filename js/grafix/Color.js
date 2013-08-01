var Color = function ( color ) {
    // Something WILL be done with this!
    this._r = 0;
    this._g = 0;
    this._b = 0;
    this._a = 0;
    
    this.set( color );
};

Color.prototype = {
    
  set: function( color, deep ) {

    deep = deep !== false;

    //TODO: Set color dynamically. color can have the following forms
    //- #rgb - DONE
    //- #rrggbb - DONE
    //- rgb(r,g,b) (White-spaces allowed) - DONE
    //- hsl(h,s,l) (White-spaces allowed) - DONE
    //- cymk(c,y,m,k) (White-spaces allowed) - DONE
    //- colorName in Color
    //- [r,g,b,a]
    //- [r,g,b]
    //- {r:, g:, b:, a:} (all optional)
    //- {h:, s:, l:} (all optional)
    
    
    if( Utils.isString( color ) ) {
        
        //@TODO: Maybe we should make a function that extracts
        //all variables from the function name in a string
        //e.g. xyz( xVal, yVal, zVal ) would set x, y and z to the fitting args
        
        if( Color.isHex( color ) )
            color = Color.hexToRgb( color );
        else if( Color.isHsl( color ) )
            this.hsl = Color.extractHslString( color );
        else if( Color.isRgba( color ) )
            this.rgba = Color.extractRgbaString( color );
        else if( Color.isCymk( color ) )
            this.cymk = Color.extractCymkString( color );
        else if( color in Color )
            color = Color.hexToRgb( Color[ color ] );
    }
    
    if( Utils.isArray( color ) ) {
        
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
    } else if( Utils.isObject( color ) ) {
        
        if( 'r' in color ) this.r = color.r;
        if( 'g' in color ) this.g = color.g;
        if( 'b' in color ) this.b = color.b;
        if( 'a' in color ) this.a = color.a;
        
        if( deep ) {
            
            if( 'h' in color && 's' in color && 'l' in color ) {
                
                this.hsl = { h: color.h, s: color.s, l: color.l };
            } else {

                if( 'h' in color ) this.h = color.h;
                if( 's' in color ) this.s = color.s;
                if( 'l' in color ) this.l = color.l;
            }
            
            if( 'c' in color && 'y' in color && 'm' in color && 'k' in color ) {
                
                this.cymk = { c: color.c, y: color.y, m: color.m, k: color.k };
            } else {

                if( 'c' in color ) this.c = color.c;
                if( 'y' in color ) this.y = color.y;
                if( 'm' in color ) this.m = color.m;
                if( 'k' in color ) this.k = color.k;
            }
                    
            if( 'rgba' in color ) this.rgba = color.rgba;
            if( 'rgb' in color ) this.rgb = color.rgb;
            
            if( 'hsl' in color ) this.hsl = color.hsl;
            
            if( 'cymk' in color ) this.cymk = color.cymk;
            
        }
    }
    
    return this;
  },
          
  get r() {
      
      return this._r;
  },
          
  set r( r ) {
      
      this._r = r;
  },
          
  get g() {
      
      return this._g;
  },
          
  set g( g ) {
      
      this._g = g;
  },
          
  get b() {
      
      return this._g;
  },
          
  set b( b ) {
      
      this._b = b;
  },
          
  get a() {
      
      return this._a;
  },
          
  set a( a ) {
      
      this._a = a;
  },
          
         
  get rgb() {
  
      return { r: this.r, g: this.g, b: this.b };
  },
  set rgb( rgb ) {
      
      this.rgba = rgb;
  },
  get rgba() {
      
      return { r: this.r, g: this.g, b: this.b, a: this.a };
  },
  set rgba( rgba ) {
    
      this.set( rgba );
  },
  
  //HSL Getters/Setters
  get h() {
      
      return this.hsl.h;
  },
  set h( h ) {
      
      var hsl = this.hsl;
      hsl.h = h;
      this.hsl = hsl;
  },
  get s() {
      
      return this.hsl.s;
  },
  set s( s ) {
      
      var hsl = this.hsl;
      hsl.s = s;
      this.hsl = hsl;
  },
  get l() {
      
      return this.hsl.l;
  },
  set l( l ) {
      
      var hsl = this.hsl;
      hsl.l = l;
      this.hsl = hsl;
  },
    
  get hsl() { 
      
      return Color.rgbToHsl( this.r, this.g, this.b );
  },
  set hsl( hsl ) {
      
      this.set( Color.hslToRgb( hsl.h, hsl.s, hsl.l ) );
  },
          
  
  //CYMK Getters/Setters
  get c() {
      
      return this.cymk.c;
  },
  set c( c ) {
      
      var cymk = this.cymk;
      cymk.c = c;
      this.cymk = cymk;
  },
  get y() {
      
      return this.cymk.y;
  },
  set y( y ) {
      
      var cymk = this.cymk;
      cymk.y = y;
      this.cymk = cymk;
  },
  get m() {
      
      return this.cymk.m;
  },
  set m( m ) {
      
      var cymk = this.cymk;
      cymk.m = m;
      this.cymk = cymk;
  },
  get k() {
      
      return this.cymk.k;
  },
  set k( k ) {
      
      var cymk = this.cymk;
      cymk.k = k;
      this.cymk = cymk;
  },
    
  get cymk() {       
      
      return Color.rgbToCymk( this.r, this.g, this.b );
  },
  set cymk( cymk ) {
      
      this.set( Color.cymkToRgb( cymk.c, cymk.y, cymk.m, cymk.k ) );
  },
 
  get hex() {
      
      return Color.rgbToHex( this.r, this.g, this.b );
  },
  set hex( hex ) {
      
      this.set( Color.hexToRgb( hex ) );
  },
  
  //HSL operations
  hue: function( deg ) {
      
      this.h = deg;
      
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
      
      //TODO: inverse the color
  },
  
  complement: function() {
      
      //TODO: get the complementary color
  },
  
  grayscale: function() {
    
      this.s = 0;
      
      return this;
  },
  
  mix: function( color ) {
    
      //TODO: return the mixed color.
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

    hslPattern: /hsl\(\s*([0-9]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\)/i,

    cymkPattern: /cymk\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\)/i,
    
    isShortHex: function( val ) { return !!this.shortHexPattern.test( val ); },
    
    isHex: function( val ) { return !!this.hexPattern.test( val ) && !!this.shortHexPattern.test( val ); },
    
    isRgba: function( val ) { return !!this.rgbaPattern.test( val ); },
    
    isHsl: function( val ) { return !!this.hslPattern.test( val ); },
    
    isCymk: function( val ) { return !!this.cymkPattern.test( val ); },
    
    extractRgbaString: function( str ) {

        var result = this.rgbaPattern.exec( str );
        
        return { 
            r: parseInt( result[ 1 ] ), 
            g: parseInt( result[ 2 ] ), 
            b: parseInt( result[ 3 ] ), 
            a: typeof result[ 4 ] !== 'undefined' ? parseInt( result[ 4 ] ) : 0 
        };
    },
            
    extractHslString: function( str ) {
        
        var result = this.hslPattern.exec( str );
        
        return { 
            h: parseInt( result[ 1 ] ), 
            s: parseFloat( result[ 2 ] ), 
            l: parseFloat( result[ 3 ] )
        };
    },
            
    extractCymkString: function( str ) {

        var result = this.cymkPattern.exec( str );
        
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

    hslToRgb: function( h, s, l ){
        
        var hue = 6 - ( -h % 6 ) / 60,
            saturation = s,
            lightness = l,
            
            c = ( 1 - Math.abs( ( 2 * lightness ) - 1 ) ) * saturation,
            x = c * ( 1 - Math.abs( ( h % 2 ) - 1 ) ),
            m = l - c / 2,
            
            r = 0,
            g = 0,
            b = 0;
            
        if( hue < 0 ) 
            hue = 6 - ( -hue % 6 );
        
        hue %= 6;

        if( hue < 1 ) {
            r = c;
            g = x;
            b = 0;
        } else if( hue < 2 ) {
            r = x;
            g = c;
            b = 0;
        } else if( hue < 3 ) {
            r = 0;
            g = c;
            b = x;
        } else if( hue < 4 ) {
            r = 0;
            g = x;
            b = c;
        } else if( hue < 5 ) {
            r = x;
            g = 0;
            b = c;
        } else {
            r = c;
            g = 0;
            b = x;
        }

        r = Math.round( ( r + m ) * 255 );
        g = Math.round( ( g + m ) * 255 );
        b = Math.round( ( b + m ) * 255 );

        return { r: r, g: g, b: b };
    },
    
    rgbToHsl: function( r, g, b ) {
        
        var red = r / 255,
            green = g / 255,
            blue = b / 255,
            max = Math.max( r, g, b ),
            min = Math.min( r, g, b ),
            diff = max - min,
            h = 0,
            s = 0,
            l = ( max + min ) / 2;
            
        if( max !== min ) {
            
            s = l > 0.5 ? diff / ( 2 - max - min ) : diff / ( max + min );
            
            switch( max ) {
                case red:
                    
                    h = ( green - blue ) / diff + ( green < blue ? 6 : 0 );
                    break
                case green:
                    
                    h = ( blue - red ) / diff + 2;
                    break
                case blue:
                    
                    h = ( red - green ) / diff + 4;
                    break
            }
            
            h /= 6;
            h = Math.floor( h * 360 );
        }
        
        
        return { h: h, s: s, l: l };
    },
    

    cymkToRgb: function( c, m, y, k ) {

        var cyan = ( c * 255 * ( 1 - k ) ),
            magenta = ( m * 255 * ( 1 - k ) ),
            yellow = ( y * 255 * ( 1 - k ) ),
            
            black = 255 * ( 1 - k ),
            
            r = parseInt( black - cyan ),
            g = parseInt( black - magenta ),
            b = parseInt( black - yellow );
        
        return { r: r, g: g, b: b };
    },
    
    rgbToCymk: function( r, g, b ) {

        var c = 1 - ( r / 255 ),
            m = 1 - ( g / 255 ),
            y = 1 - ( b / 255 ),
            k = Math.min( c, m, y ),
            min = k;
            
        var cymk = { c: 0, y: 0, m: 0, k: k };
            
        if( c > 0 )
            c = ( c - k ) / ( 1 - min );
        if( m > 0 )
            m = ( m - k ) / ( 1 - min );
        if( y > 0 )
            y = ( y - k ) / ( 1 - min );
        
        return cymk;
    },
            
    gradient: function( type, start, end, stops ) {
      
      //stops are formatted like this: { 0: Color, 0.2: Color, 0.5: Color, 0.8: Color, 1: Color }
      //Type can be "linear", "radial"
      stops = stops || {};
      
      if( typeof end !== 'object' )
        stops[ 1 ] = end.hex ? end.hex : hex;
      else
        stops = end;
        
      if( typeof start !== 'object' )
        stops[ 0 ] = start.hex ? start.hex : start;
      else
        stops = start;
        
      
      //TODO: create a canvas gradient out of this
      
      return theGreatGradient;
    },
    
    linearGradient: function( start, end, stops ) { return Color.gradient( 'linear', start, end, stops ); },
    radialGradient: function( start, end, stops ) { return Color.gradient( 'radial', start, end, stops ); },

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