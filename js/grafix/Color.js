var Color = function ( color ) {
    // Something WILL be done with this!
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    
    this.set( color );
};

Color.prototype = {
    
    
  set: function( color ) {
    
    //TODO: Set color dynamically. color can have the following forms
    //- #rgb
    //- #rrggbb
    //- rgb(r,g,b) (White-spaces allowed)
    //- hsl(h,s,l) (White-spaces allowed)
    //- cymk(c,y,m,k) (White-spaces allowed)
    //- colorName in Color
    //- [r,g,b,a]
    //- [r,g,b]
    //- {r:, g:, b:, a:} (all optional)
    //- {h:, s:, l:} (all optional)
    
  },
  
  //HSL Getters/Setters
  get h() {
      
      return calculatedH;
  },
  set h( h ) {
      
      //TODO: calculate this.r/g/b/a based on hue
  },
  get s() {
      
      return calculatedS;
  },
  set s( s ) {
      
      //TODO: calculate this.r/g/b/a based on saturation
  },
  get l() {
      
      return calculatedL;
  },
  set l( l ) {
      
      //TODO: calculate this.r/g/b/a based on lightness
  },
    
  get hsl() { 
      //RETURNS: array [ h, s, l ]
      //TODO: calculate HSL
      return calculatedHsl; 
  },
  set hsl( hsl ) {
      
      //ALLOWS: array [ h, s, l ], object { h:, s:, l: } or string hsl(h,s,l)
      //TODO: set this.r/g/b/a based on hsl
  },
  get cymk() { 
      //RETURNS: array [ c, y, m, k ]
      //TODO: calculate CYMK
      return calculatedCymk; 
  },
  set cymk( cymk ) {
      
      //ALLOWS: array [ c, y, m, k], object { c:, y:, m:, k: } or string cymk(c,y,m,k)
      //TODO: set this.r/g/b/a based on cymk 
  },
  get rgb() {
      //RETURNS: array [ r, g, b ]
      return [ this.r, this.g, this.b ];
  },
  set rgb( rgb ) {
      this.rgba = rgb;
  },
  get rgba() {
      
      //RETURNS: array [ r, g, b, a ]
      return [ this.r, this.g, this.b, this.a ];
  },
  set rgba( rgba ) {
      
      //ALLOWS: array [ r, g, b, a ], object { r:, g:, b:, a: }, string rgb( r, g, b ) or string rgba(c, y, m, k)
      //TODO: set this.r/g/b/a based on args
  },
  get hex() {
      
      return Color.rgbToHex( this.r, this.g, this.b );
  },
  set hex( hex ) {
      
      var c = Color.hexToRgb( hex );
      if( c.r ) this.r = c.r;
      if( c.g ) this.g = c.g;
      if( c.b ) this.b = c.b;
  },
  
  //HSL operations
  darken: function( factor ) {
      
      //Darken (L)
  },
  lighten: function( factor ) {
      
      //Darken (L)
  },
  saturate: function( factor ) {
      
      //Saturate (S)
  },
  desaturate: function( factor ) {
      
      //Desaturate (S)
  },
  hue: function( deg ) {
      
      //Specify hue (H)
  },
  
  
  inverse: function() {
      
      //TODO: inverse the color
  },
  
  complement: function() {
      
      //TODO: get the complementary color
  },
  
  grayscale: function() {
    
      //TODO: get the gray scale of this color
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
  }
};

Utils.merge( Color, {
    hexToRgb: function ( hex ) {
        // Expand shorthand (#03F) to full (#0033FF)
        var reShorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace( reShorthand, function ( m, r, g, b ) {
            return r + r + g + g + b + b;
        } );

        // Extract single components
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
        return result ? {
            r: parseInt( result[1], 16 ),
            g: parseInt( result[2], 16 ),
            b: parseInt( result[3], 16 )
        } : null;
    },

    rgbToHex: function ( r, g, b ) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString( 16 ).slice( 1 );
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

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' ) {
    ShortCuts.color = function( color ) {
        
        return new Color( color );
    };
    
    ShortCuts.colors = Color;
}