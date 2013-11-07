

var Grafix = (function( undefined ) {

    "use strict";
    
    var ShortCuts = {};
    


/* 
 requestAnimationFrame Polyfill
 http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 */
(function () {
    var e = 0;
    var t = ["ms", "moz", "webkit", "o"];
    for ( var n = 0; n < t.length && !window.requestAnimationFrame; ++n ) {
        window.requestAnimationFrame = window[t[n] + "RequestAnimationFrame"];
        window.cancelRequestAnimationFrame = window[t[n] + "CancelRequestAnimationFrame"]
    }
    if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = function ( t, n ) {
            var r = (new Date).getTime();
            var i = Math.max( 0, 16 - (r - e) );
            var s = window.setTimeout( function () {t( r + i )}, i );
            e = r + i;
            return s
        };
    }
    if ( !window.cancelAnimationFrame ) {
        window.cancelAnimationFrame = function ( e ) {clearTimeout( e )}
    }
})();
//addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
(function(win, doc){
	if(win.addEventListener)return;		//No need to polyfill

	function docHijack(p){var old = doc[p];doc[p] = function(v){return addListen(old(v))}}
	function addEvent(on, fn, self){
		return (self = this).attachEvent('on' + on, function(e){
			var e = e || win.event;
			e.preventDefault  = e.preventDefault  || function(){e.returnValue = false}
			e.stopPropagation = e.stopPropagation || function(){e.cancelBubble = true}
			fn.call(self, e);
		});
	}
	function addListen(obj, i){
		if(i = obj.length)while(i--)obj[i].addEventListener = addEvent;
		else obj.addEventListener = addEvent;
		return obj;
	}

	addListen([doc, win]);
	if('Element' in win)win.Element.prototype.addEventListener = addEvent;			//IE8
	else{		//IE < 8
		doc.attachEvent('onreadystatechange', function(){addListen(doc.all)});		//Make sure we also init at domReady
		docHijack('getElementsByTagName');
		docHijack('getElementById');
		docHijack('createElement');
		addListen(doc.all);	
	}
})(window, document);/**
 * Common utilities widley used in all {Grafix} classes.
 */
var Utils = {
    /**
     * Holds the last used id, used for naming {Shape} objects
     *
     * @var int
     */
    _currentId: 0,

    _tempCanvas: null,


    merge: function( target, source ) {
        
        for( var i in source ) {
            // @FIXME: Dirty fix - dont copy 'clone' getter because this will trigger a new clone .. and so on
            if (i === 'clone') {
                continue;
            }

            target[ i ] = source[ i ];
        }

        return target;
    },

    extend: function( parent, childMethods ) {

        var instance = new parent();
        for( var i in childMethods ) {
            
            var desc = Object.getOwnPropertyDescriptor( childMethods, i );
            Object.defineProperty( instance, i, desc );
        }
        
        return instance;
    },


    clone: function( cloneableObject, cloneSource ) {
        // ShapeBase objects have a method for getting all cloneable properties
        if( Utils.isObject( cloneSource ) && ( 'cloneableProperties' in cloneSource ) ) {

            var propNames = cloneSource.cloneableProperties,
                values = {};
            for( var propName in propNames ) {
                values[ propName ] = cloneSource[ propName ];
            }
            cloneSource = values;
        }

        var clonedObject = new cloneableObject( cloneSource );
        console.log( 'created clone:', clonedObject );

        return clonedObject;
    },


    getUid: function() {
        return ++Utils._currentId;
    },

    getTempCanvas: function( width, height ) {
        height = ( Utils.isObject( width ) ? width.height : height );
        width = ( Utils.isObject( width ) ? width.width : width );

        /*
        if( Utils._tempCanvas === null ) {
            Utils._tempCanvas = document.createElement( 'canvas' );
            Utils._tempCanvas.width = width;
            Utils._tempCanvas.height = height;
        }

        Utils._tempCanvas.width = width;
        Utils._tempCanvas.height = height;
        */
        // @TODO: IMO we need a unique canvas for each request or have to clear the canvas on each request
        //        Also width/height modifies the cache so a 100/100 canvas is unique and 200/100 too
        Utils._tempCanvas = document.createElement( 'canvas' );
        Utils._tempCanvas.width = width;
        Utils._tempCanvas.height = height;

        return Utils._tempCanvas;
    },

    getTempCanvasContext: function( width, height ) {
        var canvas = Utils.getTempCanvas( width, height );
        // Browser uses his own cache strategy for this
        return canvas.getContext( '2d' );
    },


    isType: function( val, type ) {

        var typeName = typeof val;
        if( typeName === type ) {
            return true;
        }
        else if( typeName === 'function' ) {
            return val instanceof type;
        }
        else if( typeName === 'object' && val !== null && ( 'className' in val ) ) {
            return val.className === type;
        }
        return false;
    },

    isUndefined: function( val, type ) {

        return Utils.isType( val, 'undefined' );
    },

    isString: function( val ) {

        return this.isType( val, 'string' );
    },

    isArray: function( val ) {

        return Array.isArray( val );
    },

    isObject: function( val ) {

        return this.isType( val, 'object' );
    },

    isNumber: function( val ) {

        return this.isType( val, 'number' );
    },

    isNumeric: function( val ) {

        return !isNaN( parseFloat( val ) ) && isFinite( val );
    },

    isFunction: function( val ) {
        
        return this.isType( val, 'function' );
    },

    inArray: function( array, value ) {

        if( array.indexOf )
            return array.indexOf( value ) !== -1;

        for( var i in array )
            if( array[ i ] === value )
                return true;

        return false;
    },

    isDomNode: function ( o ) {
        return o && (
            Utils.isObject( Node ) ?
                (o instanceof Node) :
                Utils.isObject( o ) && Utils.isNumber( o.nodeType ) && Utils.isString( o.nodeName )
            );
    },

    isDomElement: function ( o ) {
        return o && (
            Utils.isObject( HTMLElement ) ?
                (o instanceof HTMLElement) :
                Utils.isObject( o ) && o.nodeType === 1 && Utils.isString( o.nodeName )
            );
    },

    isBindable: function( o ) {
        return ( (o instanceof EventHandler) || Utils.isFunction( o ) || Utils.isType( o, 'EventHandler') );
    },

    isTriggerable: function ( o ) {
        return ( (o instanceof EventArgs) || Utils.isType( o, 'EventArgs') || Utils.isObject(o) );
    },


    getDomElementById: function( selector ) {
        return document.querySelector ? document.querySelector( selector ) : document.getElementById( selector );
    },


    decToRad: function( dec ) {

        return dec * Math.PI / 180;
    },
            
    radToDec: function( rad ) {

        return ( rad * 180 ) / Math.PI;
    },

    keySpline: function( x1, y1, x2, y2, epsilon ) {

        var epsilon = epsilon || 0.002; //default precision

        var b1 = function( t ) { return t * t * t; };
        var b2 = function( t ) { return 3 * t * t * ( 1 - t ); };
        var b3 = function( t ) { return 3 * t * ( 1 - t ) * ( 1 - t ); };
        var b4 = function( t ) { return ( 1 - t ) * ( 1 - t ) * ( 1 - t ); };
        var bX = function( t ) { return b3( t ) * x1 + b2( t ) * x2 + b1( t ); };
        var bY = function( t ) { return b3( t ) * y1 + b2( t ) * y2 + b1( t ); };
        var dbX = function( t ) {

            var v = 1 - t;
            return 3 * ( 2 * ( t - 1 ) * t + v * v ) * x1 + 3 * ( -t * t * t + 2 * v * t ) * x2;
        };

        return function( t ) {

            //Newton's method of finding x for current t (Doesn't always apply, so we need a fallback, but it's fast)
            var x = t, t0, t1, x3, d2;
            for( var t2 = x, i = 0; i < 8; i++ ) {

                x3 = bX( t2 ) - x;
                if( Math.abs( x3 ) < epsilon ) 
                    return bY( t2 );

                d2 = dbX( t2 );
                if( Math.abs( d2 ) < 1e-6 ) 
                    break;

                t2 = t2 - x3 / d2;
            }

            //this is the fallback (bisection)
            var t0 = 0, t1 = 1, t2 = x;
            while( t0 < t1 ) {

                x3 = bX( t2 );
                if( Math.abs( x3 - x ) < epsilon ) 
                    return bY( t2 );
                if( x > x3 )
                    t0 = t2;
                else 
                    t1 = t2;
                t2 = ( t1 - t0 ) * .5 + t0;
            } 

            //couldn't find x for t
            return bY( t );
        };
    }
};var Color = function ( color ) {

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
/*

 The Easings are based on the following resources:

 Easing functions adapted from Robert Penner's easing equations (This text is actually copied from Chart.js)
 http://www.robertpenner.com/easing/

 */
var Easing = {
    linear: function ( t ) {
        return t;
    },
    easeInQuad: function ( t ) {
        return t * t;
    },
    easeOutQuad: function ( t ) {
        return -1 * t * ( t - 2 );
    },
    easeInOutQuad: function ( t ) {
        if ( (t /= 1 / 2) < 1 ) {
            return 1 / 2 * t * t;
        }
        return -1 / 2 * ((--t) * (t - 2) - 1);
    },
    easeInCubic: function ( t ) {
        return t * t * t;
    },
    easeOutCubic: function ( t ) {
        return ((t = t - 1) * t * t + 1);
    },
    easeInOutCubic: function ( t ) {
        if ( (t /= 1 / 2) < 1 ) {
            return 1 / 2 * t * t * t;
        }
        return 1 / 2 * ((t -= 2) * t * t + 2);
    },
    easeInQuart: function ( t ) {
        return t * t * t * t;
    },
    easeOutQuart: function ( t ) {
        return -1 * ((t = t - 1) * t * t * t - 1);
    },
    easeInOutQuart: function ( t ) {
        if ( (t /= 1 / 2) < 1 ) {
            return 1 / 2 * t * t * t * t;
        }
        return -1 / 2 * ((t -= 2) * t * t * t - 2);
    },
    easeInQuint: function ( t ) {
        return (t /= 1) * t * t * t * t;
    },
    easeOutQuint: function ( t ) {
        return ((t = t - 1) * t * t * t * t + 1);
    },
    easeInOutQuint:   function ( t ) {
        if ( (t /= 1 / 2) < 1 ) {
            return 1 / 2 * t * t * t * t * t;
        }
        return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
    },
    easeInSine: function ( t ) {
        return -1 * Math.cos( t * (Math.PI / 2) ) + 1;
    },
    easeOutSine: function ( t ) {
        return Math.sin( t * (Math.PI / 2) );
    },
    easeInOutSine: function ( t ) {
        return -1 / 2 * (Math.cos( Math.PI * t ) - 1);
    },
    easeInExpo: function ( t ) {
        return (t == 0) ? 1 : Math.pow( 2, 10 * (t - 1) );
    },
    easeOutExpo: function ( t ) {
        return (t == 1) ? 1 : (-Math.pow( 2, -10 * t ) + 1);
    },
    easeInOutExpo: function ( t ) {
        if ( t == 0 ) {
            return 0;
        }
        if ( t == 1 ) {
            return 1;
        }
        if ( (t /= 1 / 2) < 1 ) {
            return 1 / 2 * Math.pow( 2, 10 * (t - 1) );
        }
        return 1 / 2 * (-Math.pow( 2, -10 * --t ) + 2);
    },
    easeInCirc: function ( t ) {
        if ( t >= 1 ) {
            return t;
        }
        return -1 * (Math.sqrt( 1 - (t /= 1) * t ) - 1);
    },
    easeOutCirc: function ( t ) {
        return Math.sqrt( 1 - (t = t - 1) * t );
    },
    easeInOutCirc: function ( t ) {
        if ( (t /= 1 / 2) < 1 ) {
            return -1 / 2 * (Math.sqrt( 1 - t * t ) - 1);
        }
        return 1 / 2 * (Math.sqrt( 1 - (t -= 2) * t ) + 1);
    },
    easeInElastic: function ( t ) {
        var s = 1.70158;
        var p = 0;
        var a = 1;
        if ( t == 0 ) {
            return 0;
        }
        if ( (t /= 1) == 1 ) {
            return 1;
        }
        if ( !p ) {
            p = .3;
        }
        if ( a < Math.abs( 1 ) ) {
            a = 1;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin( 1 / a );
        }
        return -(a * Math.pow( 2, 10 * (t -= 1) ) * Math.sin( (t - s) * (2 * Math.PI) / p ));
    },
    easeOutElastic: function ( t ) {
        var s = 1.70158;
        var p = 0;
        var a = 1;
        if ( t == 0 ) {
            return 0;
        }
        if ( (t /= 1) == 1 ) {
            return 1;
        }
        if ( !p ) {
            p = .3;
        }
        if ( a < Math.abs( 1 ) ) {
            a = 1;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin( 1 / a );
        }
        return a * Math.pow( 2, -10 * t ) * Math.sin( (t - s) * (2 * Math.PI) / p ) + 1;
    },
    easeInOutElastic: function ( t ) {
        var s = 1.70158;
        var p = 0;
        var a = 1;
        if ( t == 0 ) {
            return 0;
        }
        if ( (t /= 1 / 2) == 2 ) {
            return 1;
        }
        if ( !p ) {
            p = (.3 * 1.5);
        }
        if ( a < Math.abs( 1 ) ) {
            a = 1;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin( 1 / a );
        }
        if ( t < 1 ) {
            return -.5 * (a * Math.pow( 2, 10 * (t -= 1) ) * Math.sin( (t - s) * (2 * Math.PI) / p ));
        }
        return a * Math.pow( 2, -10 * (t -= 1) ) * Math.sin( (t - s) * (2 * Math.PI) / p ) * .5 + 1;
    },
    easeInBack: function ( t ) {
        var s = 1.70158;
        return (t /= 1) * t * ((s + 1) * t - s);
    },
    easeOutBack: function ( t ) {
        var s = 1.70158;
        return ((t = t - 1) * t * ((s + 1) * t + s) + 1);
    },
    easeInOutBack: function ( t ) {
        var s = 1.70158;
        if ( (t /= 1 / 2) < 1 ) {
            return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
        }
        return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
    },
    easeInBounce: function ( t ) {
        return 1 - Easing.easeOutBounce( 1 - t );
    },
    easeOutBounce: function ( t ) {
        if ( (t /= 1) < (1 / 2.75) ) {
            return (7.5625 * t * t);
        } else if ( t < (2 / 2.75) ) {
            return (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
        } else if ( t < (2.5 / 2.75) ) {
            return (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
        } else {
            return (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
        }
    },
    easeInOutBounce: function ( t ) {
        if ( t < 1 / 2 ) {
            return Easing.easeInBounce( t * 2 ) * .5;
        }
        return Easing.easeOutBounce( t * 2 - 1 ) * .5 + .5;
    },
    create: function ( x1, y1, x2, y2, name ) {

        var keySpline = Utils.keySpline( x1, y1, x2, y2 );
        if ( name ) {
            this[ name ] = keySpline;
        }

        return keySpline;
    }
};


var EventArgs = function ( args ) {

    // Copy all properties to this instance
    Utils.merge(this, args || {});

    if (!this._time) {
        this._time = new Date().getTime();
    }
};

EventArgs.prototype = {

    get time() { return this._time; }

};
var EventHandler = function(callback, context) {
    if (Utils.isFunction(callback) == false) {
        throw 'Callback needs to be a callable function';
    }

    this._callback = callback;
    this._context = context;
};

EventHandler.prototype = {
    get callback() { return this._callback; },
    set callback(value) { throw 'Dont change the EventHandler but create a new one instead'; },

    get context() { return this._context; },
    set context(value) { throw 'Dont change the EventHandler but create a new one instead'; },


    trigger: function(args) {
        //console.log('EventHandler.trigger() context (', this.context, ') calls: ', this.callback);
        return this.callback.call(this.context, args);
    }

};
var EventBase = function () {

    // Allow to report changes if we got a 'change' and/or 'changed' callback
    this._reportsChanges = false;
    // Array of callbacks, sorted by event name
    this._eventCallbacks = [];
};

EventBase.prototype = {

    get eventCallbacks() { return this.prop( 'eventCallbacks' ); },

    get reportsChanges() { return this.prop( 'reportsChanges' ); },

    /**
     * Returns the name of this class, usefull for type checks.
     *
     * @TODO: This is more a hack because either typeof or instanceof works on our object-classes
     * @returns {string}
     */
    get className() { return 'EventBase'; },

    /**
     *
     * @param {string} event
     * @returns {boolean}
     */
    has: function ( event ) {
        return ( event in this._eventCallbacks ) && this._eventCallbacks[ event ].length > 0;
    },

    /**
     * Binds a new event to trigger the given callback.
     *
     * @param {string} event
     * @param {EventHandler|Function|function} handler
     * @returns {self}
     */
    bind: function ( event, handler ) {

        if ( !(handler instanceof EventHandler) ) {
            if ( Utils.isFunction( handler ) === false ) {
                throw 'Provided callback is not a EventHandler';
            }

            handler = new EventHandler(handler, this);
        }

        // Create some space
        if ( this.has(event) === false ) {
            this._eventCallbacks[event] = [];
        }

        this._eventCallbacks[event].push( handler );

        // If we bind a 'change' or 'changed' event, we will report changes
        if( event === 'change' || event == 'changed' ) {
            this._reportsChanges = true;
        }

        return this;
    },

    /**
     * Unbinds an existing callback.
     *
     * @param {string} event
     * @param {EventHandler} handler
     * @returns {self}
     */
    unbind: function ( event, handler ) {

        if ( this.has(event) === false ) {
            return this;
        }

        // Just remove them all
        if ( !handler ) {
            delete this._eventCallbacks[event];

            // If we unbind a 'change' and didnt have 'changed' event anymore (or vise versa),
            // we wont report changes
            if( this._reportsChanges && this.has( 'change' ) === false && this.has( 'changes' ) === false ) {
                this._reportsChanges = false;
            }
            return this;
        }

        // Find the callback
        var k = -1,
            events = this._eventCallbacks[event],
            callback = handler.callback || handler,
            context = handler.context || null;

        for ( var i = 0; i < events.length; i++ ) {
            var evt = events[i];
            if ( evt.callback === callback && evt.context === context ) {
                k = i;
                break;
            }
        }

        // Remove the callback, if found
        if ( k != -1 ) {
            this._eventCallbacks[event].splice( k, 1 );

            // If we unbind a 'change' and didnt have 'changed' event anymore (or vise versa),
            // we wont report changes
            if( this._reportsChanges && this.has( 'change' ) === false && this.has( 'changes' ) === false ) {
                this._reportsChanges = false;
            }
        }

        return this;
    },

    /**
     * Triggers an event callback which was priviously registred.
     *
     * @param {string} event
     * @param {object|EventArgs} args
     *
     * @returns {self|boolean|*[]}
     */
    trigger: function ( event, args, returnResults ) {

        if ( this.has(event) === false ) {

            // @TODO: If we have to return the results back, but event has not been triggered..
            //        Should we return null or undefined or anything to indicate this situation?
            return this;
        }

        var events = this._eventCallbacks[event],
            eventArgs = args || {},
            results = [];

        // Create EventArgs
        if ( !(eventArgs instanceof EventArgs) ) {
            eventArgs.eventName = event;
            eventArgs = new EventArgs( eventArgs );
        }

        for ( var i = 0; i < events.length; i++ ) {
            /** @var callback EventHandler*/
            var callback = events[i];
            results[ i ] = callback.trigger( eventArgs );
        }

        if ( returnResults ) {
            // If we got just one result, we dont have to return an array
            if( results.length === 1 ) {
                return results[ 0 ];
            }

            // If every result is the samee, we also dont have to return an array
            var firstResult = results[ 0 ];
            for( var r = 1; r < results.length; r++ ) {
                if( results[ r ] !== firstResult ) {
                    return results;
                }
            }
            return firstResult;
        }

        return this;
    },

    /**
     * Either binds a given {EventHandler} or object to an event or triggers the event using given arguments, if any.
     *
     * @param {string} event
     * @param {EventHandler|EventArgs|object} args
     *
     * @returns {self|boolean|*[]}
     */
    on: function ( event, args ) {

        // Register a new callback function for the event
        if ( Utils.isBindable( args ) ) {
            return this.bind( event, args );
        }

        // Trigger event using the given parameters, if any
        return this.trigger( event, args || {} );
    },


    change: function( name, value ) {

        // Register a new handler for change-event
        if ( Utils.isBindable( value ) ) {
            return this.bind( 'change', value );
        }

        // Do we report changes?
        if( this._reportsChanges === false ) {
            return this;
        }

        // Trigger all change callbacks and return the result
        return this.trigger( 'change', {
            property: name,
            valueOld: this[ '_' + name ],
            valueNew: value
        }, true );
    },

    changed: function( name ) {

        // Register a new handler for changed-event
        if ( Utils.isBindable( name ) ) {
            return this.bind( 'changed', name );
        }

        // Do we report changes?
        if( this._reportsChanges === false ) {
            return this;
        }

        // Trigger all changed callbacks for the given property name
        return this.trigger( 'changed', {
            property: name,
            value: (name && (name in this) ? this[ '_' + name ] : null)
        } );
    },

    /**
     * Gets or sets the value of a private property, named _{name}.
     * If this object reports changes, the change event will be called before update.
     * If the event returns {false} no update will be done.
     *
     * @param {string} name
     * @param {*} [value]
     * @returns {self|boolean|*}
     */
    prop: function( name, value ) {

        // Acting as getter for private property
        if( value === undefined ) {
            return this[ '_' + name ];
        }

        // Only set if changed
        if( this[ '_' + name ] === value ) {
            return false;
        }

        // Acting as evented setter
        if( this.change( name, value ) === false ) {
            // A callback returned {false}, cancel value update
            return false;
        }

        // Update values
        this[ '_' + name ] = value;

        // Trigger changed event and report it back
        return this.changed( name );
    }

};
/**
 * Creates a new instance of a shape-base class.
 * Current features (or lazy loaded):
 *  - parent property
 *  - array of children
 *  - canvas and context per instance (fetched from parent)
 *  - input controler per instance (fetched from parent)
 *  - filter processing
 *
 * @param {*} [args]
 * @constructor
 */
var ShapeBase = function( args ) {
    EventBase.call( this );

    // This object may be invalid which is done after property changes
    this._invalid = true;
    // Support a parent
    this._parent = null;
    // Array of ShapeBase children
    this._children = [];
    // Object of children references, stored by name, for fast look-up
    this._childrenNameCache = {};

    // Support for named components
    this._name = null;
    // Canvas
    this._canvas = null;
    this._canvasContext = null;

    /** @var Input */
    this._input = null;

    // ARGB array, lazy loaded
    this._rawData = null;

    // Enables to store and apply some filter on our {rawData}
    this._filters = [];
};

ShapeBase.defaults = {

};

ShapeBase.prototype = Utils.extend( EventBase, {
    
    get clone() { 
        throw 'Cannot clone ShapeBase, please use any of the derived classes instead'; 
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return [
            'invalid',
            'parent',
            'children',
            'input',
            'canvas',
            'canvasContext',
            'filters'
        ];
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'ShapeBase'; },

    get invalid() { return this.prop( 'invalid' ); },
    set invalid( value ) {

        // No usage of .prop() here, this shouln't be canceled
        if( this._invalid !== value ) {
            this._invalid = value;

            this.changed( 'invalid' );
        }

        // Inform parent
        var parent = this.parent;
        if( parent ) {
            parent.invalid = value;
        }
    },

    get parent() { return this.prop( 'parent' ); },
    set parent( value ) {

        if( this._parent === value ) {
            return;
        }

        if( value !== null && !( value instanceof ShapeBase ) ) {

            throw 'Only an instance of Shape are allowed to be set as a parent';
        }

        // Add us as a child to our (new)parent
        if( value !== null && value.hasChild( this ) === false ) {
            value.addChild( this );
        }

        // If we got a parent already, remove it
        if( this._parent ) {
            this.parent.removeChild( this );
        }

        // Store it
        this._parent = value;

        this.changed( 'parent' );
    },

    get name() { 
        
        if( !this._name )
            this._name = Utils.getUid();
        
        return this._name; 
    },
    set name( value ) {

        // DONT use .prop() here which enables events to cancel the update; we WANT (and need) a name/uid
        this._name = value;
        this.invalid = true;
    },

    get children() { return this.prop( 'children' ); },
    set children( value ) { throw 'Cannot set children manually, use addChild instead'; },

    get input() {
        
        if( this._input )
            return this._input;

        if( this.parent )
            this._input = this.parent.input;

        // Nothing found in parent tree? Then create our own
        if( !this._input )
            this._input = new Input( this.canvas );

        return this._input;
    },
    set input( value ) { return this.prop('input', value); },

    get canvas() {
        
        if( this._canvas )
            return this._canvas;
        
        if( this.parent )
            this._canvas = this.parent.canvas;
        
        if( !this._canvas ) {

            // Will create a new canvas and apply attributes
            this._initializeCanvas();
        }

        return this._canvas;
    },
    set canvas( value ) { 

        // This allows to set a selector too
        if( Utils.isString( value ) )
            value = Utils.getDomElementById( value );

        if( this.prop( 'canvas', value ) !== false ) {
            // Lazy getter will fetch the context (even from a cache) so no worry
            this._canvasContext = null;
        }
    },

    get canvasContext() {
        
        if( this._canvasContext )
            return this._canvasContext;
        
        if( this.context )
            this._canvasContext = this.context.getContext( '2d' );
        
        return this._canvasContext;
    },
    set canvasContext( value ) { return this.prop( 'canvasContext', value ); },

    /**
     * Returns the first stored filter, if any.
     * @returns {null|Filter}
     */
    get filter() {

        var filters = this.filters;
        return filters.length < 1 ? null : filters[ 0 ];
    },
    /**
     * Overwrites the currently stored filters with the given one
     * @param {Filter} value
     */
    set filter( value ) { if( value ) { this.filters = [ value ]; } },

    /**
     * Gets the stored arry of filters.
     * @returns {null|Filter[]}
     */
    get filters() { return this.prop( 'filters' ); },
    /**
     * Sets the stored array of filters
     * @param {Filter} value
     * @returns {self|boolean}
     */
    set filters( value ) { return this.prop( 'filters', value ); },

    /**
     * Returns the raw un-filtered {ImageData}, pulled from a canvas, of this object.
     * @returns {ImageData}
     */
    get rawData() {
        if( this._rawData !== null && this.invalid === false ) {

            return this._rawData;
        }

        var width = this.width,
            height = this.height;

        if( width <= 0 || height <= 0 ) {
            return [];
        }

        var ctx = Utils.getTempCanvasContext( width, height),
            // The object's raw data will be stored without filters
            drawConfig = { filter: false };

        this._draw( ctx, drawConfig );

        return this._rawData = ctx.getImageData( 0, 0, width, height );
    },

    /**
     * Returns the raw filtered {ImageData} of this object.
     * @returns {ImageData}
     */
    get filteredData() {

        var data = this.rawData;

        if( this.filters.length > 0 ) {

            for( var i = 0; i < this.filters.length; i++ ) {

                var filter = this.filters[ i ];
                // Function or {Filter} object
                if( Utils.isFunction( filter ) ) {
                    // The function will return the {Filter} object
                    filter = filter();
                }
                if( !filter || !( 'process' in filter ) ) {
                    continue;
                }


                // Instance of {Filter}
                filter.process( data );
            }
        }

        return data;
    },

    get attributeSize() {
        return new Size( parseInt( this.canvas.getAttribute( 'width' ) ), parseInt( this.canvas.getAttribute( 'height' ) ) );
    },
    set attributeSize( value ) {
        if ( ( 'width' in value ) && this.prop( 'width', value.width ) !== false ) {
            this.canvas.setAttribute( 'width', value.width );
        }
        if ( ( 'height' in value ) && this.prop( 'height', value.height ) !== false ) {
            this.canvas.setAttribute( 'height', value.height );
        }
    },

    get cssSize() {

        // @TODO: Fallback to attribute size, good idea?
        var width = this.canvas.style.width !== '' ? parseInt( this.canvas.style.width ) : this.attributeSize.width,
            height = this.canvas.style.height !== '' ? parseInt( this.canvas.style.height ) : this.attributeSize.height;
        return new Size( width, height );
    },
    set cssSize( value ) {

        if ( value.width && this.prop( 'width', value.width ) !== false ) {
            this.canvas.style.width = value.width + 'px';
        }
        if ( value.height && this.prop( 'height', value.height ) !== false ) {
            this.canvas.style.height = value.height + 'px'
        }
    },


    /**
     * Returns true, if we have the given shape (or name) as a children component.
     *
     * @param {ShapeBase|string} shape
     * @returns {boolean}
     */
    hasChild: function( shape ) {

        // Support to search for name
        if( Utils.isString( shape ) ) {
            return !!( shape in this._childrenNameCache );
        }

        // Search for a ShapeBase object
        for ( var i = 0; i < this.children.length; i++ ) {
            if( shape === this.children[i] ) {
                return true;
            }
        }

        return false;
    },

    /**
     * Add's the given shape as out children component.
     * Also ensures the correct {shape.parent} value.
     *
     * @param {ShapeBase|ShapeBase[]} shape
     * @returns {ShapeBase}
     */
    addChild: function( shape ) {

        if( Utils.isArray( shape ) ) {
            for( var i = 0; i < shape.length; i++ ) {
                this.addChild( shape[i] );
            }

            return this;
        }

        if( !( shape instanceof ShapeBase ) ) {
            throw 'Can only add arrays or instances of ShapeBase as a children';
        }
        if( shape.name in this._childrenNameCache ) {
            throw 'The name of a component needs to unique. This shape already have a child with his name.';
        }

        // Add as a children component
        this.children.push( shape );
        // Store the index of the component by its name
        this._childrenNameCache[ shape.name ] = (this.children.length - 1);

        shape.parent = this;

        // Take care of invalid flag of the new child which would be normaly bubble to us
        if( shape.invalid ) {
            this.invalid = true;
        }

        return this;
    },

    /**
     * Removes the given shape from our children components.
     *
     * @param {ShapeBase|string|ShapeBase[]|string[]} shape
     * @returns {self}
     */
    removeChild: function( shape ) {

        var i;
        // This will allow to remove an array of childs
        if( Utils.isArray( shape ) ) {
            for( i = 0; i < shape.length; i++ ) {
                this.removeChild( shape[i] );
            }

            return this;
        }

        // Allow to remove a children by name too
        var searchByName = !!Utils.isString( shape );
        // In case of the remove-by-name call, we dont have to search the index - its stored in our cache
        if( searchByName ) {
            if( !(shape in this._childrenNameCache) ) {
                // No child with this name
                return this;
            }

            i = this._childrenNameCache[ shape ];
            this.children.splice( i, 1 );
        } else {
            // Search for the reference
            for( i = 0; i < this.children.length; i++ ) {
                // @TODO: Would be faster to just compare the .name property
                //        But this would be unique even for cloned shapes
                //        Which would also lead to fail in the following compare
                //        Maybe we need a .equals( shape ) method which wont compare the unique properties?
                if( this.children[i] === shape ) {
                    this.children.splice( i, 1 );
                }
            }
        }

        // Remove from search index
        if( (shape.name in this._childrenNameCache) ) {
            delete this._childrenNameCache[ shape.name ];
        }

        return this;
    },

    /**
     * Returns the child component with the given name.
     * This does only a full name search (yet) and returns {null}, if no child with the given name was found.
     *
     * @param {string} childName
     * @returns {ShapeBase|null}
     */
    child: function( childName ) {
        
        if( (childName in this._childrenNameCache) ) {
            var childIndex = this._childrenNameCache[ childName ];
            return this.children[ childIndex ];
        }

        return null;
    },
            
    
    eachChild: function( callback ) {
        
        for( var i in this._children ) {
            // Support to break out of the loop
            if( callback.call( this._children[ i ], i ) === false ) {
                break;
            }
        }
        
        return this;
    },


    addFilter: function( filter ) {

        // Ensure to have an array
        if( !this._filters ) {
            this._filters = [];
        }
        if( filter != null ) {
            this.filters.push( filter );
        }

        return this;
    },

    hasFilter: function() {
        return this._filters && this._filters.length > 0;
    },


    /**
     * Gets or sets the value of a private property, named _{name}.
     * If this object reports changes, the change event will be called before update.
     * If the event returns {false} no update will be done.
     *
     * @param {string} name
     * @param {*} [value]
     * @returns {self|boolean|*}
     */
    prop: function( name, value ) {

        var baseReturn = EventBase.prototype.prop.call( this, name, value );
        // Called as getter?
        if( Utils.isUndefined( value ) ) {
            return baseReturn;
        }

        // Acting as setter, mark as invalid on successfull change
        if( baseReturn === false ) {
            return false;
        }

        this.invalid = true;
        return baseReturn;
    },


    set: function( args ) {

        if( Utils.isObject( args ) ) {

            // 3 ways to set the name
            if( 'id' in args ) { this.name = args.id; }
            else if( 'uid' in args ) { this.name = args.uid; }
            else if( 'name' in args ) { this.name = args.name; }
            if( 'children' in args ) {
                // @TODO: Shouldn't we clone all children?
                //        They will get removed in the original object on-clone right now - I guess
                this.addChild( args.children );
            }
            // @TODO/@FIX: This is strange - shape.set( new Rectangle() )
            //             The temp rectangle HAS a 'canvas' property
            //             The access to the property leads to create a new canvas
            //             (due our auto-create-canvas-if-not-present _initializeCanvas)
            //if( 'canvas' in args ) { this.canvas = args.canvas; }
            if( 'parent' in args ) { this.parent = args.parent; }
            if( 'filters' in args ) { this.filters = args.filters; }
            if( 'filter' in args ) { this.filter = args.filter; }
        }

        return this;
    },


    _initializeCanvas: function() {

        // Create a new canvas
        // Note: We access the lazy-load getter which will also take the canvas from its parent, if present
        if( !this._canvas ) {
            this._canvas = document.createElement( 'canvas' );
            this.attributeSize = new Size( 'width' in this ? this.width : 0, 'height' in this ? this.height : 0 );
        }

        // High pixel-density display optimization (e.g. Retina)
        // @See: http://www.html5rocks.com/en/tutorials/canvas/hidpi/
        // @TODO: Fallback for window, rework in node-js structure step
        var context = this.canvasContext,
            devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio =
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1,
            scaleRatio = devicePixelRatio / backingStoreRatio;

        console.log( 'devicePixelRatio:', devicePixelRatio, 'backingStoreRatio:', backingStoreRatio );

        if ( devicePixelRatio !== backingStoreRatio ) {
            var oldAttributeSize = this.attributeSize;

            // Note: Since attributeSize is a virtual property, we have to set it that way
            this.attributeSize = this.attributeSize.mul( scaleRatio );
            this.cssSize = oldAttributeSize;

            this.canvasContext.scale( scaleRatio, scaleRatio );
        }

    },


    /**
     * Executed before a draw() happens, should update inner properties and handle input states
     *
     * @param callback
     * @returns {*}
     */
    update: function( callback ) {

        // Got a callback? Assume a additional call to update() just to bind or trigger this callback
        if( callback ) {
            return this.on( 'update', callback );
        }

        this._update();

        // Trigger callbacks for update
        this.on( 'update', {
            canvas:        this.canvas,
            canvasContext: this.canvasContext
        } );

        // Update also children, if the shape is valid (not invalid)
        // Reason: draw() wont be called if the shape is not invalid, so no child would be update'd or drawn
        if( this.invalid === false ) {
            this.eachChild( function( childIndex ) {
                this.update();
            } );
        }

        return this;
    },

    _update: function() {

    },

    draw: function( context, forceDraw, config ) {

        // Update my states, will also update childrens, if this shape is still valid
        this.update();

        // Not visible = no draw
        if( this.visible ) {

            // If we got no context to draw, get our own
            context = context || this.canvasContext;

            context.save();

            // Draw this shape
            if( this.invalid || forceDraw ) {

                // If parent is dirty, childs will need a re-draw too
                this._draw( context, config );
            }

            context.restore();
        }

        // Note: We dont want to set our parent too, so set the property directly
        this._invalid = false;

        return this;
    },

    _draw: function( context, config ) {

        // Should draw the shape on the given context

    },

    /**
     * Returns an object containing all "simple" (no objects or functions ) and puplic properties of the given object.
     *
     * @returns {{}}
     * @private
     */
    _debugProperties: function() {
        var props = {};
        for( var propName in this ) {

            if( this.hasOwnProperty( propName ) === true ) {
                continue;
            }

            // Skip private ones..
            if( propName[0] === '_' ) {
                continue;
            }

            // Only simple properties
            var propValue = this[ propName ];
            if( Utils.isFunction( propValue ) || Utils.isObject( propValue ) ) {
                continue;
            }

            props[ propName ] = this[ propName ];
        }

        return props;
    }

} );
var Shape = function( x, y ) {
    ShapeBase.call( this, x, y );

    // Some positions for click and drag & drop support
    this._lastPositions = {
        mouse: new Point,
        mouseDown: new Point,
        mouseUp: new Point
    };
    this._mouseDragLazyness = 1;
    this._mouseOnState = false;
    this._isMouseDragging = false;


    // Shape position and size
    this._x = 0;
    this._y = 0;
    this._width = 0;
    this._height = 0;

    this._visible = true;

    // Style properties
    this._offsetX = 0;
    this._offsetY = 0;
    this._scaleWidth = 1;
    this._scaleHeight = 1;
    this._angle = 0;
    this._skewX = 0;
    this._skewY = 0;
    this._color = Color.black;
    this._drawStyle = Shape.defaults.drawStyle;
    this._lineWidth = 1;
    this._lineCap = Shape.defaults.lineCap;
    this._miterLimit = null;
    this._lineJoin = Shape.defaults.lineJoin;
    this._closePath = null;
    this._alignContext = Shape.defaults.alignContext;
    this._align = Shape.defaults.align;

    this.set( x, y );
};

Shape.defaults = {
    drawStyles: [ 'fill', 'stroke', 'clear' ],
    drawStyle: 'fill',
    lineCaps: [ 'butt', 'round', 'square' ],
    lineCap: 'butt',
    lineJoins: [ 'miter', 'bevel', 'round' ],
    lineJoin: 'miter',
    alignContexts: [ 'parent', 'root' ],
    alignContext: 'parent',
    aligns: [ 'top', 'bottom', 'left', 'ritght', 'inner', 'outer' ],
    align: 'top left'
};

Shape.prototype = Utils.extend( ShapeBase, {

    get clone() {

        return Utils.clone( Shape, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return ShapeBase.prototype.cloneableProperties.concat([
            'x',
            'y',
            'width',
            'height',
            'visible',
            'angle',
            'skewX',
            'skewY',
            'offsetX',
            'offsetY',
            'scaleWidth',
            'scaleHeight',
            'color',
            'drawStyle',
            'lineWidth',
            'lineCap',
            'miterLimit',
            'lineJoin',
            'closePath',
            'align',
            'alignContext'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Shape'; },

    get x() { return this.prop( 'x' ); },
    set x( value ) { this.prop( 'x', value ); },

    get y() { return this.prop( 'y' ); },
    set y( value ) { this.prop( 'y', value ); },

    get width() { return this.prop( 'width' ); },
    set width( value ) { this.prop( 'width', value ); },

    get height() { return this.prop( 'height' ); },
    set height( value ) { this.prop( 'height', value ); },

    get visible() { return this.prop( 'visible' ); },
    set visible( value ) { this.prop( 'visible', value ); },

    get angle() { return this.prop( 'angle' ); },
    set angle( value ) { this.prop( 'angle', value ); },

    get skewX() { return this.prop( 'skewX' ); },
    set skewX( value ) { this.prop( 'skewX', value ); },

    get skewY() { return this.prop( 'skewY' ); },
    set skewY( value ) { this.prop( 'skewY', value ); },

    get offsetX() { return this.prop( 'offsetX' ); },
    set offsetX( value ) { this.prop( 'offsetX', value ); },

    get offsetY() { return this.prop( 'offsetY' ); },
    set offsetY( value ) { this.prop( 'offsetY', value ); },

    get scaleWidth() { return this.prop( 'scaleWidth' ); },
    set scaleWidth( value ) { this.prop( 'scaleWidth', value ); },

    get scaleHeight() { return this.prop( 'scaleHeight' ); },
    set scaleHeight( value ) { this.prop( 'scaleHeight', value ); },

    get color() { return this.prop( 'color' ); },
    set color( value ) { return this.prop( 'color', value ); },

    get drawStyle() { return this.prop( 'drawStyle' ); },
    set drawStyle( value ) { return this.prop( 'drawStyle', value ); },

    get lineWidth() { return this.prop( 'lineWidth' ); },
    set lineWidth( value ) { return this.prop( 'lineWidth', value ); },

    get lineCap() { return this.prop( 'lineCap' ); },
    set lineCap( value ) { return this.prop( 'lineCap', value ); },

    get miterLimit() { return this.prop( 'miterLimit' ); },
    set miterLimit( value ) { return this.prop( 'miterLimit', value ); },

    get lineJoin() { return this.prop( 'lineJoin' ); },
    set lineJoin( value ) { return this.prop( 'lineJoin', value ); },

    get closePath() { return this.prop( 'closePath' ); },
    set closePath( value ) { return this.prop( 'closePath', value ); },

    get align() { return this.prop( 'align' ); },
    set align( value ) {
        var alignContext = null;
        // @TODO: Make this using Shape.defaults.alignContexts!
        switch ( this.alignContext ) {
            case 'parent':

                alignContext = this.parent;
                break;
            case 'root':

                alignContext = this.root;
                break;
            default:
                alignContext = this.alignContext;
                break;
        }

        if( alignContext ) {
            // @TODO: Shouln'd this use Shape.defaults.align?
            var align = Utils.isString( this.align ) ? this.align : 'center center center';
            this.alignBy( alignContext, align );
        }

        if( this.prop( 'align', value ) !== false ) {
            this.alignBy();
        }
    },

    get alignContext() { return this.prop( 'alignContext' ); },
    set alignContext( value ) {

        this.alignBy( value, this.align );
        if( this.prop( 'alignContext', value ) !== false ) {
            this.alignBy();
        }
    },

    get position() { return new Point( this.x, this.y ); },
    set position( value ) {

        if( Utils.isObject( value ) ) {
            if( 'x' in value ) { this.x = value.x; }
            if( 'y' in value ) { this.y = value.y; }
        } else if( Utils.isNumeric( value ) ) {
            this.x = this.y = value;
        } else {
            throw "Invalid type of value for property Shape.position: " + value;
        }
    },

    get size() { return new Size( this.width, this.height ); },
    set size( value ) {

        if( Utils.isObject( value ) ) {
            if( 'width' in value ) { this.width = value.width; }
            if( 'height' in value ) { this.height = value.height; }
        } else if( Utils.isNumeric( value ) ) {
            this.width = this.height = value;
        } else {
            throw "Invalid type of value for property Shape.size: " + value;
        }
    },

    get offset() { return new Point( this.offsetX, this.offsetY ); },
    set offset( value ) {

        if( Utils.isObject( value ) ) {
            if( 'offsetX' in value ) { this.offsetX = value.offsetX; }
            else if( 'x' in value )  { this.offsetX = value.x; }
            if( 'offsetY' in value ) { this.offsetY = value.offsetY; }
            else if( 'y' in value )  { this.offsetY = value.y; }
        } else if( Utils.isNumeric( value ) ) {
            this.offsetX = this.offsetY = value;
        } else {
            throw "Invalid type of value for property Shape.offset: " + value;
        }
    },

    get scale() { return new Point( this.scaleWidth, this.scaleHeight ); },
    set scale( value ) {

        if( Utils.isObject( value ) ) {
            if( 'scaleWidth' in value ) { this.scaleWidth = value.scaleWidth; }
            else if( 'width' in value ) { this.scaleWidth = value.width; }
            if( 'scaleHeight' in value ) { this.scaleHeight = value.scaleHeight; }
            else if( 'height' in value ) { this.scaleHeight = value.height; }
        } else if( Utils.isNumeric( value ) ) {
            this.scaleWidth = this.scaleHeight = value;
        } else {
            throw "Invalid type of value for property Shape.scale: " + value;
        }
    },

    get skew() { return new Point( this.skewX, this.skewY ); },
    set skew( value ) {

        if( Utils.isObject( value ) ) {
            if( 'skewX' in value )  { this.skewX = value.skewX; }
            else if( 'x' in value ) { this.skewX = value.x; }
            if( 'skewY' in value )  { this.skewY = value.skewY; }
            else if( 'y' in value ) { this.skewY = value.y; }
        } else if( Utils.isNumeric( value ) ) {
            this.skewX = this.skewY = value;
        } else {
            throw "Invalid type of value for property Shape.skew: " + value;
        }
    },

    get rect() { return new Rectangle( this.x, this.y, this.width, this.height ); },
    set rect( value ) {

        if( Utils.isObject( value ) ) {
            if( 'x' in value ) { this.x = value.x; }
            if( 'y' in value ) { this.y = value.y; }
            if( 'width' in value ) { this.width = value.width; }
            if( 'height' in value ) { this.height = value.height; }
        } else {
            throw "Invalid type of value for property Shape.rect: " + value;
        }
    },

    get rectScaled() { return new Rectangle( this.x, this.y, this.width * this.scaleWidth, this.height * this.scaleHeight ); },

    get center() {
        return new Point( this.x + this.width / 2, this.y + this.height / 2 );
    },
    set center( value ) {
        if( value.x ) {
            this.x = value.x - this.width / 2;
        }

        if( value.y ) {
            this.y = value.y - this.height / 2;
        }
    },

    get left() { return this.x; },
    set left( value ) {
        this.width -= this.x - value;
        this.x = value;
    },

    get right() { return this.width + this.x; },
    set right( value ) {

        this.width = value - this.x;
    },

    get top() { return this.y; },
    set top( value ) {

        this.height -= this.y - value;
        this.y = value;
    },

    get bottom() { return this.y + this.height; },
    set bottom( value ) {

        this.height = value - this.y;
    },

    get leftTop() { return new Point( this.left, this.top ); },
    set leftTop( value ) {
        this.left = value.x;
        this.top = value.y;
    },

    get rightTop() { return new Point( this.right, this.top ); },
    set rightTop( value ) {
        this.right = value.x;
        this.top = value.y;
    },

    get leftBottom() { return new Point( this.left, this.bottom ); },
    set leftBottom( value ) {
        this.left = value.x;
        this.bottom = value.y;
    },

    get rightBottom() { return new Point( this.right, this.bottom ); },
    set rightBottom( value ) {
        this.right = value.x;
        this.bottom = value.y;
    },


    set: function( x, y, deep ) {
        deep = deep || true;

        ShapeBase.prototype.set.call(this, x, y);

        if( Utils.isObject( x ) ) {

            if( 'position' in x ) {
                this.position = x.position;
            }
            if( 'size' in x ) {
                this.size = x.size;
            }
            if( 'rect' in x ) {
                this.rect = x.rect;
            }
            if( 'x' in x ) {
                this.x = x.x;
            }
            if( 'y' in x ) {
                this.y = x.y;
            }
            if( 'width' in x ) {
                this.width = x.width;
            }
            if( 'height' in x ) {
                this.height = x.height;
            }
            if( 'visible' in x ) {
                this.visible = x.visible;
            }
            if( 'offset' in x ) {
                this.offset = x.offset;
            }
            if( 'scale' in x ) {
                this.scale = x.scale;
            }
            if( 'angle' in x ) {
                this.angle = x.angle;
            }
            if( 'skew' in x ) {
                this.skew = x.skew;
            }
            if( 'color' in x ) {
                this.color = x.color;
            }
            if( 'drawStyle' in x ) {
                this.drawStyle = x.drawStyle;
            }
            if( 'lineWidth' in x ) {
                this.lineWidth = x.lineWidth;
            }
            if( 'lineCap' in x ) {
                this.lineCap = x.lineCap;
            }
            if( 'miterLimit' in x ) {
                this.miterLimit = x.miterLimit;
            }
            if( 'lineJoin' in x ) {
                this.lineJoin = x.lineJoin;
            }
            if( 'closePath' in x ) {
                this.closePath = x.closePath;
            }
            if( 'alignContext' in x ) {
                this._alignContext = x.alignContext;
            }
            if( 'align' in x ) {
                this.align = x.align;
            }
            
            // Also clone child shapes!
            // @TODO: ShapeBase.set have to take care of childrens
            //        Also clone wont work as expected because we have to store a reference to the exact child
            //        Clone would create a new instance instead
            /*
            if( 'children' in x && x.children.length > 0 ) {
                for( var i in x.children ) {
                    
                    var child = x.children[ i ];
                    
                    if( 'clone' in child )
                        this.addChild( child.clone );
                }
            }
            */

            if( deep ) {

                // We allow those, too! they just dont make sense in a copy
                // this extends our possibilities in animating later on
                // They are not needed, because each of those properties
                // just modify x and y and we already set these in a plain copy
                // for a copy of an object, use either (new Shape).set( source ) or Shape.clone( source )
                if( 'center' in x ) {
                    this.center = x.center;
                }
                if( 'left' in x ) {
                    this.left = x.left;
                }
                if( 'right' in x ) {
                    this.right = x.right;
                }
                if( 'top' in x ) {
                    this.top = x.top;
                }
                if( 'bottom' in x ) {
                    this.bottom = x.bottom;
                }
                if( 'leftTop' in x ) {
                    this.leftTop = x.leftTop;
                }
                if( 'rightTop' in x ) {
                    this.rightTop = x.rightTop;
                }
                if( 'leftBottom' in x ) {
                    this.leftBottom = x.leftBottom;
                }
                if( 'rightBottom' in x ) {
                    this.rightBottom = x.rightBottom;
                }
            }

        } else if( Utils.isUndefined( x ) === false ) {
            this.x = x;
        }

        if( Utils.isUndefined( y ) === false ) {
            this.y = y;
        }

        return this;
    },


    expand: function( shape ) {

        if( this.left > shape.left )
            this.left = shape.left;

        if( this.right < shape.right )
            this.right = shape.right;

        if( this.top > shape.top )
            this.top = shape.top;

        if( this.bottom < shape.bottom )
            this.bottom = shape.bottom;

        return this;
    },

    alignBy: function( context, position ) {

        context = context || this.alignContext;

        switch ( context ) {
            case 'parent':

                context = this.parent;
                break;
            case 'root':

                context = this.root;
                break;
        }

        if( !context )
            return this;

        position = ( position || this.align ).split( ' ' );
        var type = 'center';
        var xType = null;
        var yType = null;

        var thisWidth = this.width || (this.radius ? this.radius * 2 : 0);
        var thatWidth = context.width || (context.radius ? context.radius * 2 : 0);
        var thisHeight = this.height || (this.radius ? this.radius * 2 : 0);
        var thatHeight = context.height || (context.radius ? context.radius * 2 : 0);

        // Read the alignment steps:
        // - xType: (left|right|center)
        // - yType: (top|bottom|center)
        // - type:  (inner|outer|center)
        for ( var i = 0; i < position.length; i++ ) {
            switch ( position[i] ) {

                case 'center':

                    if( xType !== null && yType !== null ) {

                        type = 'center';
                    } else if( xType !== null ) {

                        yType = 'center';
                    } else {

                        xType = 'center';
                    }

                    break;

                case 'left':
                case 'right':
                    xType = position[i];
                    break;

                case 'top':
                case 'bottom':
                    yType = position[i];
                    break;

                case 'inner':
                case 'outer':
                    type = position[i];
                    break;
            }
        }

        if( !xType ) {
            xType = 'center';
        }
        if( !yType ) {
            yType = 'center';
        }

        // Apply new position based on the detected alignment
        switch ( xType ) {

            case 'left':
                // Default to type = inner
                this.x = context.x;

                switch ( type ) {
                    case 'center':

                        this.x -= thisWidth / 2;
                        break;
                    case 'outer':

                        this.x -= thisWidth;
                        break;
                }
                break;

            case 'right':
                // Default to type = outer
                this.x = context.x + thatWidth;

                switch ( type ) {
                    case 'center':

                        this.x -= thisWidth / 2;
                        break;
                    case 'inner':

                        this.x -= thisWidth;
                }
                break;

            case 'center':

                this.x = context.x + ( thatWidth / 2 ) - thisWidth / 2;
                break;
        }

        switch ( yType ) {

            case 'top':
                // Default to type = inner
                this.y = context.y;

                switch ( type ) {
                    case 'center':

                        this.y -= thisHeight / 2;
                        break;
                    case 'outer':

                        this.y -= thisHeight;
                }
                break;

            case 'bottom':
                // Default to type = outer
                this.y = context.y + thatHeight;

                switch ( type ) {
                    case 'center':

                        this.y -= thisHeight / 2;
                        break;
                    case 'inner':

                        this.y -= thisHeight;
                }
                break;

            case 'center':

                this.y = context.y + ( thatHeight / 2 ) - thisHeight / 2;
                break;
        }

        return this;
    },

    animate: function( props, duration, easing, callback ) {

        //@ TODO: Also allow the following variable orders
//        Shape Shape.animate( properties, args );
//        Shape Shape.animate( properties );
//        Shape Shape.animate( properties, duration );
//        Shape Shape.animate( properties, complete );
//        Shape Shape.animate( properties, easing );
//        Shape Shape.animate( properties, easing, complete );
//        Shape Shape.animate( properties, duration, easing );
//        Shape Shape.animate( properties, duration, complete );
//        Shape Shape.animate( properties, duration, easing, complete );
//        Shape Shape.animate( keyFrames );
//        Shape Shape.animate( keyFrames, duration );
//        Shape Shape.animate( keyFrames, complete );

        return new Animation( this, props, {
            duration: duration || Animation.defaults.duration,
            completed: callback || function() {},
            easing: easing || Animation.defaults.easing
        }).start();
    },


    // Styling

    applyStyles: function( context ) {

        context = context || this.canvasContext;

        // Apply styles if needed (If no style selected, properties won't change for performance reasons)
        if( this.offsetX !== 0 || this.offsetY !== 0 ) {
            context.translate( this.offsetX, this.offsetY );
        }

        // @TODO: This scales also x and y.. wtfh?
        //        We currently using scale only in Bitmap, so this is disabled until further testing
        //        Bitmap now uses Shape.rectScaled for the drawn destination
        //if( this.scaleWidth !== 1 || this.scaleHeight !== 1 ) {
        //    context.scale( this.scaleWidth, this.scaleHeight );
        //}

        if( this.angle !== 0 ) {
            context.rotate( this.angle );
        }

        if( context.lineWidth !== this.lineWidth ) {
            context.lineWidth = this.lineWidth;
        }

        if( context.lineCap !== this.lineCap ) {
            context.lineCap = this.lineCap;
        }

        if( context.miterLimit !== this.miterLimit ) {
            context.miterLimit = this.miterLimit;
        }

        if( context.lineJoin !== this.lineJoin ) {
            context.lineJoin = this.lineJoin;
        }

        if( this.skewX !== 0 || this.skewY !== 0 ) {
            context.transform( 1, this.skewX, this.skewY, 1, 0, 0 );
        }

        // Resolves to canvas' "fillStyle", "strokeStyle" and "clearStyle" (does not exist)
        var colorProp = this.drawStyle + 'Style';
        // The color will only be re-set, if it has been changed
        if( this.color !== context[ colorProp ] ) {
            context[ colorProp ] = this.color;
        }

        return this;
    },

    // style is like set(), but only for style properties
    style: function( style ) {

        if( Utils.isString( style ) ) {

            var tokens = style.split( ' ' );
            for( var i in tokens ) {

                var token = tokens[ i ];
                if( (token in Shape.defaults.drawStyles) ) {

                    this.drawStyle = token;
                }
                else if( (token in Shape.defaults.lineCaps) ) {

                    this.lineCap = token;
                }
                else if( (token in Shape.defaults.lineJoins) ) {

                    this.lineJoin = token;
                }
                else if( (token in Shape.defaults.alignContexts) ) {

                    this.alignContext = token;
                }
                else if( (token in Shape.defaults.aligns) ) {

                    // @TODO: These would need to be collected and passed as one string to this.align
                }
                else {
                    // @FIXME: Bad default suggestion..
                    if( Utils.isNumeric( token ) )
                    //lets take it as the lineWidth
                        this.lineWidth = parseInt( token );
                    else
                    //it's probably the color, heh
                        this.color = token;
                }

            }
        } else if( Utils.isObject( style ) ) {

            //You can just pass a shape and copy its styles
            if( style.offset ) this.offset = style.offset;
            if( style.scale ) this.scale = style.scale;
            if( style.angle ) this.angle = style.angle;
            if( style.skew ) this.skew = style.skew;
            if( style.color ) this.color = style.color;
            if( style.drawStyle ) this.drawStyle = style.drawStyle;
            if( style.lineWidth ) this.lineWidth = style.lineWidth;
            if( style.lineCap ) this.lineCap = style.lineCap;
            if( style.miterLimit ) this.miterLimit = style.miterLimit;
            if( style.lineJoin ) this.lineJoin = style.lineJoin;
            if( style.closePath ) this.closePath = style.closePath;
            //maybe a bad idea
            //if( style.alignContext ) this._alignContext = style.alignContext;
            if( style.align ) this.align = style.align;
        }

        return this;
    },


    show: function() {

        //console.log( this.className + '::show() on #', this.name );
        this.visible = true;
        return this;
    },

    hide: function() {

        //console.log( this.className + '::hide() on #', this.name );
        this.visible = false;
        return this;
    },


    /**
     * Executed before a draw() happens, should update inner properties and handle input states
     *
     * @returns {self}
     */
    _update: function() {

        // Set some hover and drag states based on input
        var input = this.input;

        if( input ) {
            // Only trigger new mouseMove() if the user moved
            if( this._lastPositions.mouse.equals( input.mouse.position ) === false ) {
                // Store last used/seen position
                this._lastPositions.mouse.set( input.mouse.position );

                if( this.contains( input.mouse.position ) ) {

                    this.mouseMove();

                    if( !this._mouseOnState ) {

                        this._mouseOnState = true;
                        this.mouseOn();
                    }
                }

                else if( this._mouseOnState ) {

                    this._mouseOnState = false;
                    this.mouseOff();
                }
            }

            if( input.keyboard.isDown( Keyboard.KEY.MOUSE1 ) && this._isMouseDragging === false ) {
                var dragLazyness = this._mouseDragLazyness || 1;

                if( this._lastPositions.mouseDown.distanceTo( input.mouse.position ) > dragLazyness ) {
                    this._isMouseDragging = true;
                    this.mouseDrag();
                }
            }

            else if( this._isMouseDragging ) {

                this.mouseDragMove();
            }


            if( input.keyboard.isDown( Keyboard.KEY.MOUSE1 ) || input.keyboard.isDown( Keyboard.KEY.MOUSE2 ) ) {

                if( this.contains( input.mouse.position ) ) {

                    // @TODO: Whats about other mouse buttons? This would handle everything as right button
                    var btn = input.keyboard.isDown(Keyboard.KEY.MOUSE1) ? Keyboard.KEY.MOUSE1 : Keyboard.KEY.MOUSE2;

                    this.mouseDown( btn );
                    this._lastPositions.mouseDown.set( input.mouse.position );
                }
            }

            else if( input.keyboard.isUp( Keyboard.KEY.MOUSE1 ) || input.keyboard.isUp( Keyboard.KEY.MOUSE2 ) ) {

                // @TODO: Whats about other mouse buttons? This would handle everything as right button
                var btn = input.keyboard.isUp(Keyboard.KEY.MOUSE1) ? Keyboard.KEY.MOUSE1 : Keyboard.KEY.MOUSE2;

                this.mouseUp( btn );
                this._lastPositions.mouseUp.set( input.mouse.position );

                if( this._isMouseDragging !== false ) {
                    this.mouseDrop( this._isMouseDragging );
                    this._isMouseDragging = false;
                }

                if( this.contains( input.mouse.position ) ) {

                    this.mouseClick( btn );
                }
            }

        }

        return this;
    },

    _draw: function( context, config ) {

        var applyStyles = ( Utils.isObject( config ) ? config.styles !== false : true ),
            applyFilter = ( Utils.isObject( config ) ? config.filter !== false : true );

        // Apply styles
        if( applyStyles ) {
            this.applyStyles( context );
        }

        // Draw it using the current {drawStyle} (stroke, fill or clear)
        this[this.drawStyle].call( this, context, applyFilter );

        // Draw dirty children
        if( this.children.length ) {
            var shape = this;
            this.eachChild( function( childIndex ) {
                // Redraw shapes that are directly connected to this parent only
                // @TODO: This causes an overlay problem..
                //        We have to check if any child needs a redraw and, if so, we have to redraw everything
                //        Only redrawing dirty childs will make them overlapping ther other not-yet-dirty childs
                //if( shape.collidesWith( this )/* && child.isDirty */) {
                    //console.log('Shape.draw() poke child for draw (dirty=', child.isDirty, '):', child);
                    //this.draw( context, forceChildDraw );
                //}
                // @FIX: This is not always the case, just draw the child
                this.draw( context, true, { styles: applyStyles, filter: applyFilter } );
            } );
        }

        return this;
    },

    fill: function( context, applyFilter ) {

        context = context || this.canvasContext;
        // Handle filtered data as image data
        if( applyFilter && this.hasFilter() ) {

            var tmpCanvas = Utils.getTempCanvas( this ),
                tmpCtx = tmpCanvas.getContext('2d');
            tmpCtx.putImageData( this.filteredData, 0, 0 );
            context.drawImage( tmpCanvas, this.x, this.y );
            return this;
        }

        //console.log(this.className + '::fill @ ', this.color, this.x, this.y, this.width, this.height );
        context.fillRect( this.x, this.y, this.width, this.height );

        return this;
    },

    stroke: function( context, applyFilter ) {

        context = context || this.canvasContext;
        // Handle filtered data as image data
        if( applyFilter && this.hasFilter() ) {

            var tmpCanvas = Utils.getTempCanvas( this ),
                tmpCtx = tmpCanvas.getContext('2d');
            tmpCtx.putImageData( this.filteredData, 0, 0 );
            context.drawImage( tmpCanvas, this.x, this.y );
            return this;
        }

        //console.log(this.className + '::stroke @ ', this.color, this.x, this.y, this.width, this.height );
        context.strokeRect( this.x, this.y, this.width, this.height );

        return this;
    },

    clear: function( context, applyFilter ) {

        // @TODO: No use-case for filtered draw here?
        context = context || this.canvasContext;
        //console.log(this.className + '::clear @ ', this.color, this.x, this.y, this.width, this.height );
        context.clearRect( this.x, this.y, this.width, this.height );
    },


    // Collision stuff

    collidesWith: function( rect ) {
        var left = rect.left ? rect.left : rect.x;
        var right = rect.right ? rect.right : rect.x + ( rect.width ? rect.width : 0 );
        var top = rect.top ? rect.top : rect.y;
        var bottom = rect.bottom ? rect.bottom : rect.y + ( rect.height ? rect.height : 0 );

        return !( left > this.right || right < this.left || top > this.bottom || bottom < this.top );
    },

    contains: function( rect ) {
        //the difference between collidesWith and contains is just that contains
        //checks if the WHOLE object is inside the shape while collidesWith checks,
        //if only a part of the shape touches the target shape
        var left = rect.left ? rect.left : rect.x;
        var right = rect.right ? rect.right : rect.x + ( rect.width ? rect.width : 0 );
        var top = rect.top ? rect.top : rect.y;
        var bottom = rect.bottom ? rect.bottom : rect.y + ( rect.height ? rect.height : 0 );

        return ( left > this.left && right < this.right && top > this.top && bottom < this.bottom );
    },
    

    // Input Events

    handleMouseEvent: function( event, callback ) {

        if( callback ) {
            return this.on( event, callback );
        }

        //console.log( this.className + ': triggermouse event ', event );
        return this.on( event, { eventName: event, context: this, input: this._input, mouse: this._input.mouse } );
    },

    mouseMove: function( callback ) {

        return this.handleMouseEvent( 'mouseMove', callback );
    },

    mouseOn: function( callback ) {

        return this.handleMouseEvent( 'mouseOn', callback );
    },

    mouseOff: function( callback ) {

        return this.handleMouseEvent( 'mouseOff', callback );
    },

    mouseHover: function( onCallback, offCallback ) {

        this.mouseOn( onCallback );
        this.mouseOff( offCallback );

        return this;
    },

    mouseDown: function( callback ) {

        return this.handleMouseEvent( 'mouseDown', callback );
    },

    mouseUp: function( callback ) {

        return this.handleMouseEvent( 'mouseUp', callback );
    },

    mouseClick: function( callback ) {

        return this.handleMouseEvent( 'mouseClick', callback );
    },

    mouseDrag: function( callback ) {

        return this.handleMouseEvent( 'mouseDrag', callback );
    },

    mouseDragMove: function( callback ) {

        return this.handleMouseEvent( 'mouseDragMove', callback );
    },

    mouseDrop: function( callback ) {

        return this.handleMouseEvent( 'mouseDrop', callback );
    },

            
    toString: function(fullDebug) {

        if( !fullDebug ) {
            // @TODO: Output everything, but only if set
            return '{color:' + this.color + ', x:' + this.x + ', y:' + this.y + ', width:' + this.width + ', height:' + this.height + '}';
        }

        var properties = this._debugProperties();
        return properties;
    }

} );
var Point = function ( x, y ) {
    ShapeBase.call( this );

    this._x = 0;
    this._y = 0;

    this.set( x, y );
};

Point.prototype = Utils.extend( ShapeBase, {

    get clone() {
        return Utils.clone( Point, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return ShapeBase.prototype.cloneableProperties.concat([
            'x',
            'y'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Point'; },

    get x() { return this.prop( 'x' ); },
    set x( value ) { return this.prop( 'x', value ); },

    get y() { return this.prop( 'y' ); },
    set y( value ) { return this.prop( 'y', value ); },


    set: function( x, y ) {

        ShapeBase.prototype.set.call( this );

        if ( Utils.isObject( x ) ) {

            if ( 'x' in x ) {
                this.x = x.x;
            }
            if ( 'y' in x ) {
                this.y = x.y;
            }
        } else if( typeof x !== 'undefined' ) {
            
            this.x = parseInt( x );
        }

        if( typeof y !== 'undefined' ) {
            
            this.y = parseInt( y );
        }

        return this;
    },

    isZero: function () {
        return this.is( 0 );
    },

    is: function ( value ) {
        return ( this.x === value && this.y === value );
    },

    equals: function ( point ) {
        return this.x === point.x && this.y === point.y;
    },

    distanceTo: function ( point ) {
        return Math.sqrt(
            ( this.x - point.x ) * ( this.x - point.x ) + ( this.y - point.y ) * ( this.y - point.y )
        );
    },

    /* Calculation operations */
    add: function ( point ) {
        if ( Utils.isNumeric( point ) ) {
            point = { x: point, y: point };
        }

        if ( point.x ) {
            this.x += point.x;
        }
        if ( point.y ) {
            this.y += point.y;
        }

        return this;
    },

    sub: function ( point ) {
        if ( Utils.isNumeric( point ) ) {
            point = { x: point, y: point };
        }

        if ( point.x ) {
            this.x -= point.x;
        }
        if ( point.y ) {
            this.y -= point.y;
        }

        return this;
    },

    mul: function ( point ) {
        if ( Utils.isNumeric( point ) ) {
            point = { x: point, y: point };
        }

        if ( point.x ) {
            this.x *= point.x;
        }
        if ( point.y ) {
            this.y *= point.y;
        }

        return this;
    },

    div: function ( point ) {
        if ( Utils.isNumeric( point ) ) {
            point = { x: point, y: point };
        }

        if ( point.x ) {
            this.x /= point.x;
        }
        if ( point.y ) {
            this.y /= point.y;
        }

        return this;
    },


    toString: function() {
        return '{x:' + this.x + ',y:' + this.y + '}';
    }
} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.point = function( x, y ) {
        
        return new Point( x, y );
    };
var Point3D = function ( x, y, z ) {
    Point.call( this );

    this.set( x, y, z );
};

Point3D.prototype = Utils.extend( Point, {

    get clone() {
        return Utils.clone( Point3D, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return Point.prototype.cloneableProperties.concat([
            'z'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Point3D'; },

    get z() { return this.prop( 'z' ); },
    set z( value ) { return this.prop( 'z', value ); },


    set: function ( x, y, z ) {

        Point.prototype.set.call( this, x, y, z );

        if ( Utils.isObject( x ) ) {

            if ( x.z ) {
                this.z = x.z;
            }
        }

        if ( Utils.isNumeric( z ) ) {
            this.z = parseInt( z );
        }

        return this;
    },

    isZero: function () {
        return Point.prototype.isZero.call( this ) && !this.z;
    },

    equals: function ( point ) {
        return Point.prototype.equals.call( this, point ) && point.z === this.z;
    },

    /* Calculation operations */
    add:        function ( point ) {
        Point.prototype.add.call( this, point );

        this.z += (point.z ? point.z : point) || 0;

        return this;
    },

    sub: function ( point ) {
        Point.prototype.sub.call( this, point );

        this.z -= (point.z ? point.z : point) || 0;

        return this;
    },

    mul: function ( point ) {
        Point.prototype.mul.call( this, point );

        this.z *= (point.z ? point.z : point) || 0;

        return this;
    },

    div: function ( point ) {
        Point.prototype.div.call( this, point );

        this.z /= (point.z ? point.z : point) || 0;

        return this;
    },


    toString: function() {
        return '{x:' + this.x + ',y:' + this.y + ',z:' + this.z + '}';
    }
} );


/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.point3D = function( x, y, z ) {
        
        return new Point3D( x, y, z );
    };
var Size = function ( width, height ) {
    ShapeBase.call( this );

    this._width = 0;
    this._height = 0;

    this.set( width, height );
};

Size.prototype = Utils.extend( ShapeBase, {

    get clone() {
        return Utils.clone( Size, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return ShapeBase.prototype.cloneableProperties.concat([
            'width',
            'height'
        ]);
    },

    get width() { return this.prop( 'width' ); },
    set width( value ) { return this.prop( 'width', value ); },

    get height() { return this.prop( 'height' ); },
    set height( value ) { return this.prop( 'height', value ); },


    set: function( width, height ) {

        if ( Utils.isObject( width ) ) {

            if ( 'width' in width ) {
                this.width = width.width;
            }
            if ( 'height' in width ) {
                this.height = width.height;
            }
        } else if ( Utils.isNumeric( width ) && Utils.isUndefined( height ) ) {

            var fac = parseFloat( width );
            this.width = this.height = fac;
        } else if ( Utils.isUndefined( width ) === false ) {

            this.width = parseInt( width );
        }

        if ( typeof height !== 'undefined' ) {
            
            this.height = parseInt( height );
        }

        return this;
    },

    isZero: function () {

        return !( this.width || this.height );
    },

    equals: function ( size ) {

        return this.width === size.width && this.height === size.height;
    },

    /* Calculation operations */
    add:    function ( size ) {

        if ( Utils.isNumeric( size ) ) {
            size = { width: size, height: size };
        }

        if ( size.width ) {
            this.width += size.width;
        }
        if ( size.height ) {
            this.height += size.height;
        }

        return this;
    },

    sub: function ( size ) {

        if ( Utils.isNumeric( size ) ) {
            size = { width: size, height: size };
        }

        if ( size.width ) {
            this.width -= size.width;
        }
        if ( size.height ) {
            this.height -= size.height;
        }

        return this;
    },

    mul: function ( size ) {

        if ( Utils.isNumeric( size ) ) {
            size = { width: size, height: size };
        }

        if ( size.width ) {
            this.width *= size.width;
        }
        if ( size.height ) {
            this.height *= size.height;
        }

        return this;
    },

    div: function ( size ) {

        if ( Utils.isNumeric( size ) ) {
            size = { width: size, height: size };
        }

        if ( size.width ) {
            this.width /= size.width;
        }
        if ( size.height ) {
            this.height /= size.height;
        }

        return this;
    }

} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.size = function( width, height ) {
        
        return new Size( width, height );
    };
var Rectangle = function( x, y, width, height ) {

    Shape.call( this );

    this.set( x, y, width, height );
};

Rectangle.prototype = Utils.extend( Shape, {

    get clone() {
        
        return Utils.clone( Rectangle, this );
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Rectangle'; },

    set: function( x, y, width, height, deep ) {
        
        Shape.prototype.set.call( this, x, y, deep );
        
        if( Utils.isUndefined( width ) === false ) {
            this.width = width;
        }

        if( Utils.isUndefined( height ) === false ) {
            this.height = height;
        }
        
        return this;
    },


    /* Calculation operations */
    add: function ( rect ) {
        if ( Utils.isNumeric( rect ) ) {
            rect = { x: rect, y: rect, width: rect, height: rect };
        }

        if ( rect.x ) {
            this.x += rect.x;
        }
        if ( rect.y ) {
            this.y += rect.y;
        }
        if ( rect.width ) {
            this.width += rect.width;
        }
        if ( rect.height ) {
            this.height += rect.height;
        }

        return this;
    },

    sub: function ( rect ) {
        if ( Utils.isNumeric( rect ) ) {
            rect = { x: rect, y: rect, width: rect, height: rect };
        }

        if ( rect.x ) {
            this.x -= rect.x;
        }
        if ( rect.y ) {
            this.y -= rect.y;
        }
        if ( rect.width ) {
            this.width -= rect.width;
        }
        if ( rect.height ) {
            this.height -= rect.height;
        }

        return this;
    },

    mul: function ( rect ) {
        if ( Utils.isNumeric( rect ) ) {
            rect = { x: rect, y: rect, width: rect, height: rect };
        }

        if ( rect.x ) {
            this.x *= rect.x;
        }
        if ( rect.y ) {
            this.y *= rect.y;
        }
        if ( rect.width ) {
            this.width *= rect.width;
        }
        if ( rect.height ) {
            this.height *= rect.height;
        }

        return this;
    },

    div: function ( rect ) {
        if ( Utils.isNumeric( rect ) ) {
            rect = { x: rect, y: rect, width: rect, height: rect };
        }

        if ( rect.x ) {
            this.x /= rect.x;
        }
        if ( rect.y ) {
            this.y /= rect.y;
        }
        if ( rect.width ) {
            this.width /= rect.width;
        }
        if ( rect.height ) {
            this.height /= rect.height;
        }

        return this;
    }

} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' ) {
    ShortCuts.rect = function( x, y, width, height ) {
        
        return new Rectangle( x, y, width, height );
    };
    //Avoid confusion
    ShortCuts.rectangle = ShortCuts.rect;
}
var Circle = function(x, y, radius, startAngle, endAngle, clockwise) {

    Shape.call( this );

    this._radius = 0;
    this._startAngle = 0;
    this._endAngle = 360;
    this._clockwise = true;

    this._rectInstance = false;

    this.set( x, y, radius, startAngle, endAngle, clockwise );
};

Circle.prototype = Utils.extend( Shape, {

    get clone() {
        return Utils.clone( Circle, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return Shape.prototype.cloneableProperties.concat([
            'radius',
            'startAngle',
            'endAngle',
            'clockwise'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Circle'; },

    get radius() { return this.prop( 'radius' ); },
    set radius( value ) { return this.prop( 'radius', value ); },

    get startAngle() { return this.prop( 'startAngle' ); },
    set startAngle( value ) { return this.prop( 'startAngle', value ); },

    get endAngle() { return this.prop( 'endAngle' ); },
    set endAngle( value ) { return this.prop( 'endAngle', value ); },

    get clockwise() { return this.prop( 'clockwise' ); },
    set clockwise( value ) { return this.prop( 'clockwise', value ); },


    set: function(x, y, radius, startAngle, endAngle, clockwise) {

        if ( Utils.isObject( x ) ) {

            Shape.prototype.set.call( this, x, y );

            if ( x.radius ) this.radius = x.radius;
            if ( x.startAngle ) this.startAngle = x.startAngle;
            if ( x.endAngle ) this.endAngle = x.endAngle;
            if ( x.clockwise ) this.clockwise = x.clockwise;

        } else if( Utils.isUndefined( x ) === false ) {

            this.x = x;
        }

        if ( y ) this.y = y;
        if ( radius ) { this.radius = radius; }
        if ( startAngle ) { this.startAngle = startAngle; }
        if ( endAngle ) { this.endAngle = endAngle; }
        if ( clockwise ) { this.clockwise = clockwise; }

        return this;
    },

    add: function(x, y, radius, startAngle, endAngle, clockwise) {

        if ( Utils.isObject( x ) ) {
            Shape.prototype.add.call( this, x );

            if( x.radius ) this.radius += x.radius;
            if( x.startAngle ) this.startAngle += x.startAngle;
            if( x.endAngle ) this.endAngle += x.endAngle;
            if( x.clockwise ) this.clockwise += x.clockwise;
        } else {

            this.x += x;
        }

        if ( y ) {
            this.y += y;
        }
        if ( radius ) { this.radius += radius; }
        if ( startAngle ) { this.startAngle += startAngle; }
        if ( endAngle ) { this.endAngle += endAngle; }
        if ( clockwise ) { this.clockwise += clockwise; }

        return this;
    },

    sub: function(x, y, radius, startAngle, endAngle, clockwise) {

        if ( Utils.isObject( x ) ) {
            Shape.prototype.sub.call( this, x );

            if( x.radius ) this.radius -= x.radius;
            if( x.startAngle ) this.startAngle -= x.startAngle;
            if( x.endAngle ) this.endAngle -= x.endAngle;
            if( x.clockwise ) this.clockwise -= x.clockwise;
        } else {

            this.x -= x;
        }

        if ( y ) {
            this.y -= y;
        }
        if ( radius ) { this.radius -= radius; }
        if ( startAngle ) { this.startAngle -= startAngle; }
        if ( endAngle ) { this.endAngle -= endAngle; }
        if ( clockwise ) { this.clockwise -= clockwise; }

        return this;
    },

    mul: function(x, y, radius, startAngle, endAngle, clockwise) {

        if ( Utils.isObject( x ) ) {
            Shape.prototype.mul.call( this, x );

            if( x.radius ) this.radius *= x.radius;
            if( x.startAngle ) this.startAngle *= x.startAngle;
            if( x.endAngle ) this.endAngle *= x.endAngle;
            if( x.clockwise ) this.clockwise *= x.clockwise;
        } else {

            this.x *= x;
        }

        if ( y ) {
            this.y *= y;
        }
        if ( radius ) { this.radius *= radius; }
        if ( startAngle ) { this.startAngle *= startAngle; }
        if ( endAngle ) { this.endAngle *= endAngle; }
        if ( clockwise ) { this.clockwise *= clockwise; }

        return this;
    },

    div: function(x, y, radius, startAngle, endAngle, clockwise) {

        if ( Utils.isObject( x ) ) {
            Shape.prototype.div.call( this, x );

            if( x.radius ) this.radius /= x.radius;
            if( x.startAngle ) this.startAngle /= x.startAngle;
            if( x.endAngle ) this.endAngle /= x.endAngle;
            if( x.clockwise ) this.clockwise /= x.clockwise;
        } else {

            this.x /= x;
        }

        if ( y ) {
            this.y /= y;
        }
        if ( radius ) { this.radius /= radius; }
        if ( startAngle ) { this.startAngle /= startAngle; }
        if ( endAngle ) { this.endAngle /= endAngle; }
        if ( clockwise ) { this.clockwise /= clockwise; }

        return this;
    },

    empty: function() {

        Shape.prototype.empty.call( this );

        this.radius = 0;
        this.startAngle = 0;
        this.endAngle = 360;
        this.clockwise = true;

        return this;
    },

    isEmpty: function() {

        return Shape.prototype.isEmpty.call( this ) && !this.radius && !this.startAngle && this.endAngle === 360 && this.clockwise;
    },

    bounds: function() {

        if( !this._rectInstance ) {
            this._rectInstance = new Rectangle( this.x, this.y, this.radius * 2, this.radius * 2 );
        } else {
            this._rectInstance.set( { x: this.x, y: this.y, width: this.radius * 2, height: this.radius * 2 } );
        }

        return this._rectInstance;
    },

    center: function( center ) {

        center = center || {};

        if( center.x )
            this.x = center.x - this.radius;

        if( center.y )
            this.y = center.y - this.radius;

        return new Point( this.x + this.radius, this.y + this.radius );
    },

    fill: function( canvasContext ) {

        canvasContext.beginPath();
        canvasContext.arc( this.x + this.radius, this.y + this.radius, this.radius, Utils.decToRad( this.startAngle ), Utils.decToRad( this.endAngle ), !this.clockwise );
        if( this.closePath ) canvasContext.closePath();
        canvasContext.fill();
    },

    stroke: function( canvasContext ) {

        canvasContext.beginPath();
        canvasContext.arc( this.x + this.radius, this.y + this.radius, this.radius, Utils.decToRad( this.startAngle ), Utils.decToRad( this.endAngle ), !this.clockwise );
        if( this.closePath ) canvasContext.closePath();
        canvasContext.stroke();
    },

    clear: function() {

        return this.fill.apply( this, arguments );
    },

    contains: function( rect ) {

        //TODO: only checks the WHOLE circle currently, startAngle, endAngle and clockwise need to be used as well
        var center = this.center(),
            distance = rect.distanceTo ? rect.distanceTo( center ) : rect.position.distanceTo( center );

        return distance <= this.radius;
    }

} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.circle = function( x, y, radius, startAngle, endAngle, clockwise ) {
        
        return new Circle( x, y, radius, startAngle, endAngle, clockwise );
    };
var Grid = function ( x, y, width, height, columns, rows ) {

    Rectangle.call( this );
    
    this._columns = Grid.defaults.columns;
    this._rows = Grid.defaults.rows;
    this._virtual = Grid.defaults.virtual;
    this._rectangles = [];
    this._allowIndividualStyles = Grid.defaults.allowIndividualStyles;
    
    this.set( x, y, width, height, columns, rows );
};
Grid.defaults = {
    columns: 12,
    rows: 12,
    virtual: true,
    allowIndividualStyles: false
};

Grid.prototype = Utils.extend( Rectangle, {

    get clone() {

        return Utils.clone( Grid, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return Rectangle.prototype.cloneableProperties.concat([
            'columns',
            'rows',
            'virtual',
            'allowIndividualStyles'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Grid'; },

    get columns() { return this.prop( 'columns' ); },
    set columns( value ) { return this.prop( 'columns', value ); },

    get rows() { return this.prop( 'rows' ); },
    set rows( value ) { return this.prop( 'rows', value ); },

    get virtual() { return this.prop( 'virtual' ); },
    set virtual( value ) { return this.prop( 'virtual', value ); },

    get allowIndividualStyles() { return this.prop( 'allowIndividualStyles' ); },
    set allowIndividualStyles( value ) { return this.prop( 'allowIndividualStyles', value ); },

    set: function( x, y, width, height, columns, rows ) {
        
        Rectangle.prototype.set.call( this, x, y, width, height );

        if( Utils.isObject( x ) ) {
            
            if( 'columns' in x ) this.columns = x.columns;
            if( 'rows' in x ) this.rows = x.rows;
            if( 'virtual' in x ) this.virtual = x.virtual;
            if( 'allowIndividualStyles' in x ) this.allowIndividualStyles = x.allowIndividualStyles;
        }

        if( Utils.isUndefined( columns ) === false )
            this.columns = columns;

        if( Utils.isUndefined( rows ) === false )
            this.rows = rows;
        
        return this;
    },
            
    _rectAt: function( x, y ) {
        
        if( !this._rectangles[ y ] ) {
            this._rectangles[ y ] = [];
        }


        var rectWidth, rectHeight;
        
        if( !this._rectangles[ y ][ x ] ) {
            
            rectWidth = this.width / this.columns;
            rectHeight = this.height / this.rows;
            
            this._rectangles[ y ][ x ] = new Rectangle( {
                x: this.x + x * rectWidth,
                y: this.y + y * rectHeight,
                width: rectWidth,
                height: rectHeight
            } );
        } else if( this.invalid !== false ) {
            
            rectWidth = this.width / this.columns;
            rectHeight = this.height / this.rows;

            this._rectangles[ y ][ x ].set( {
                x: this.x + x * rectWidth,
                y: this.y + y * rectHeight,
                width: rectWidth,
                height: rectHeight
            } );
        }
        
        return this._rectangles[ y ][ x ];
    },
    
    rectAt: function( x, y ) {

        if( Utils.isObject( x ) ) {
            
            if( x.y ) y = x.y;
            
            if( x.index ) x = x.index;
            else if( x.x ) x = x.x;
        }
        
        if( typeof y === 'undefined' ) {
            
            y = parseInt( x / this.rows );
            x = x % this.columns;
        }
        
        return this._rectAt( x, y );
    },
            
    column: function( col ) {

        var colRect = null;
        this.eachColumnRect( col, function( x, y ) {
           
            if( !colRect )
                colRect = new Rectangle( { size: this.size, position: this.position } );
            else
                colRect.expand( this );
        } );
        
        return colRect;
    },
            
    row: function( row ) {
        
        var rowRect = null;
        this.eachRowRect( row, function( x, y ) {
            
            if( !rowRect )
                rowRect =  new Rectangle( { size: this.size, position: this.position } );
            else
                rowRect.expand( this );
        } );
        
        return rowRect;
    },
            
    // allows any kind of points (IN THE GRID) and combines the rectangles that it finds
    // Signature: combine( x1, y1, x2, y2, { x: x3, y: y3 }, x4, y4, etc. )
    combine: function() {
        
        var points = [],
            currentPoint = {};
        for( var i in arguments ) {
            if( Utils.isObject( arguments[ i ] ) ) {
                points.push( {
                    x: arguments[ i ].x || 0,
                    y: arguments[ i ].y || 0
                } );
            } else if( currentPoint.x ) {
                
                currentPoint.y = arguments[ i ];
                points.push( currentPoint );
                currentPoint = {};
            } else {
                
                currentPoint.x = arguments[ i ];
            }
        }
       
        var rect = null;
        for( var i in points ) {
           
            var currentRect = this.rectAt( points[ i ] );
            if( !rect )
                rect = new Rectangle( { size: currentRect.size, position: currentRect.position } );
            else
                rect.expand( currentRect );
        }
       
        return rect;
    },
    
    // callback signature: function( x, y, index )(Context: Rectangle)
    eachRect: function( callback ) {
        
        for( var y = 0; y < this.rows; y++ )
            for( var x = 0; x < this.columns; x++ )
                callback.call( this.rectAt( x, y ), x, y, y * this.rows + x );
        
        return this;
    },
            
    eachRowRect: function( row, callback ) {

        if( row >= this.rows )
            throw 'Row' + row + ' doesnt exist in a grid with ' + this.rows + ' rows';
        
        for( var x = 0; x < this.columns; x++ )
            callback.call( this.rectAt( x, row ), x, row, row * this.rows + x );
        
        return this;
    },
            
    eachColumnRect: function( column, callback ) {

        if( column >= this.column )
            throw 'Column' + column + ' doesnt exist in a grid with ' + this.column + ' column';
        
        for( var y = 0; y < this.rows; y++ )
            callback.call( this.rectAt( column, y ), column, y, y * this.rows + column );
        
        return this;
    },

    /**
     * Draw all {Rectangle}'s using {this.drawStyle} or, if {allowIndividualStyles} is true, using {Rectangle]'s
     * {drawStyle}.
     *
     * @param canvasContext
     * @private
     */
    _drawGrid: function( canvasContext ) {
        
        if( this.virtual ) //virtual grids dont get drawn
            return;
        
        // We don't need to draw this (The Grid), since
        // the rectangles at the sides will already define its borders
        // it would just overwrite the borders of the side rects
        var grid = this;
        this.eachRect( function( x, y, i ) {

            // Note: {this} is an instance of {Rectangle}

            // @TODO: Apply styles in _rectAt()
            if( !grid.allowIndividualStyles ) {
                this.style( grid );
            }

            // Just call normal draw on the rectangle
            this._draw( canvasContext );
        } );
    },
            
    fill: function( canvasContext ) {

        this._drawGrid( canvasContext );
    },
            
    stroke: function( canvasContext ) {

        this._drawGrid( canvasContext );
    },
    
    clear: function( canvasContext ) {

        this._drawGrid( canvasContext );
    },
   
            
    toString: function() {
        return '{x:' + this.x + ',y:' + this.y + ',width:' + this.width + ',height:' + this.height + '}';
    }

} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.grid = function( x, y, width, height, columns, rows ) {
        
        return new Grid( x, y, width, height, columns, rows );
    };
/**
 * Provides informations about a specific input type (Mouse, Keyboard, Touch, Gamepad, ..).
 *
 * @param target
 * @constructor
 */
var InputBase = function ( target ) {
    EventBase.call(this);

    this._target = target;
    this._initialised = false;

    if ( this._target ) {
        this.init( target );
    }
};

InputBase.prototype = Utils.extend( EventBase, {

    get target() { return this._target; },
    get context() { return this.target; },


    /**
     * If implemented, should install any state listener.
     *
     * @param target
     */
    init: function ( target ) {
        this._initialised = true;
    },

    /**
     * If implemented, should clear all sources and states which may be stored during a update period.
     */
    clear: function () {

    },

    /**
     * If implemented, will return an array of method names which should be implemented in a controler class.
     *
     * @returns {Array}
     */
    export: function () {
        return [];
    }

} );

Utils.merge( InputBase, {
    moduleName: '_invalid_'
} );
var Mouse = function ( target ) {

    // Will store current mouse position
    this._position = new Point;
    // Will store currently pressed mouse buttons since last clear()
    this._buttonStates = [];
    this._lastButtonStates = [];
    // Will store clicked mouse buttons since last clear()
    this._clickStates = [];
    this._lastClickStates = [];
    this._locked = [];

    InputBase.call( this, target );
};

Utils.merge( Mouse, {
    KEY: {
        ANY:         -1,

        MOUSE1:      -2,
        MOUSE2:      -3,
        MOUSE3:      -4,
        MWHEEL_UP:   -5,
        MWHEEL_DOWN: -6
    },

    moduleName: 'Mouse'
});

Mouse.prototype = Utils.extend( InputBase, {

    get position() { return this._position; },
    get buttonStates() { return this._buttonStates; },
    get lastButtonStates() { return this._lastButtonStates; },
    get clickStates() { return this._clickStates; },
    get lastClickStates() { return this._lastClickStates; },
    get locked() { return this._locked; },


    init: function (target)  {
        if (this._initialised) {
            return this;
        }

        this._initialised = true;

        var mouse = this;
        this._target.addEventListener( 'mousemove', function ( e ) {
            e.stopPropagation();
            e.preventDefault();

            var offsetX = mouse.target.offsetLeft || 0,
                offsetY = mouse.target.offsetTop || 0;

            mouse.position.set( {
                x: e.pageX - offsetX,
                y: e.pageY - offsetY
            } );

            // Trigger callbacks
            mouse.trigger( 'move' );
        } );

        this._target.addEventListener( 'mouseout', function ( e ) {
            e.stopPropagation();
            e.preventDefault();

            // @TODO: Shouldnt this DOM event trigger 'mousemove' anyways? Test this!
            mouse.trigger( 'move' );
        } );

        // Experimental: Handled also in Keyboard
        /*
        this._target.addEventListener( 'mousedown', function ( e ) {
            e.stopPropagation();
            e.preventDefault();

            mouse.buttonStates[ e.which ] = true;
            mouse.locked[ e.which ] = true;

            // Trigger callbacks
            mouse.trigger( 'down', { button: e.which } );
        } );

        this._target.addEventListener( 'mouseup', function ( e ) {
            e.stopPropagation();
            e.preventDefault();

            mouse.buttonStates[ e.which ] = false;
            mouse.locked[ e.which ] = false;

            // Trigger callbacks
            mouse.trigger( 'up', { button: e.which } );
        } );
        */

        this._target.addEventListener( 'click', function ( e ) {
            e.stopPropagation();
            e.preventDefault();

            mouse.clickStates[ e.which ] = true;

            // Trigger callbacks
            mouse.trigger( 'click', { button: e.which } );
        } );

        this._target.addEventListener( 'mousewheel', function ( e ) {
            e.stopPropagation();

            var code = (e.wheel > 0 || e.wheelDelta > 0 ? Mouse.KEY.MWHEEL_UP : Mouse.KEY.MWHEEL_DOWN),
                codeName = (code == Mouse.KEY.MWHEEL_UP ? 'up' : 'down');

            mouse.buttonStates[ code ] = true;

            // Trigger callbacks
            mouse.trigger( 'wheel' + codeName, { wheel: e.wheel || e.wheelDelta } );
        });

        return this;
    },

    clear: function () {
        // Store last pressed
        this._lastButtonStates = this._buttonStates;
        this._lastClickStates = this._clickStates;
        // Free current pressed
        this._buttonStates = [];
        this._clickStates = [];

        return this;
    },

    export: function () {
        return [];
    },

    /**
     * Returns true, if the given button was released (mouseup) since last clear()
     *
     * @param btn
     * @returns {boolean}
     */
    isUp: function( btn ) {
        return (btn in this._buttonStates) && this._buttonStates[ btn ] === false;
    },

    /**
     * Returns true, if the given button was pressed (mousedown) since last clear()
     *
     * @param btn
     * @returns {boolean}
     */
    isDown: function( btn ) {
        return (
                ((btn in this._buttonStates) && this._buttonStates[ btn ] === true) ||
                ((btn in this._locked) && this._locked[ btn ] === true)
            );
    },

    /**
     * Returns true, if the given button was clicked (click) since last clear()
     *
     * @param btn
     * @returns {boolean}
     */
    isClicked: function( btn ) {
        return (btn in this._clickStates) && this._clickStates[ btn ] === true;
    },


    handleMouseEvent: function ( event, callback ) {
        if ( Utils.isBindable(callback) ) {
            return this.on( event, callback );
        }

        var args = Utils.merge( {
            eventName:    event,
            mouse:        this
        }, callback || {} );

        return this.on( event, args );
    },

    onMove: function ( callback ) {
        return this.handleMouseEvent( 'move', callback );
    },

    onDown: function ( callback ) {
        return this.handleMouseEvent( 'down', { button: callback } );
    },

    onUp: function ( callback ) {
        return this.handleMouseEvent( 'up', { button: callback } );
    },

    onClick: function ( callback ) {
        return this.handleMouseEvent( 'click', { button: callback } );
    }

} );

var Keyboard = function ( target ) {

    // Will store current pressed keys (key down)
    this._keyStates = [];
    // Will store current pressed keys (key down) and wont be released in clear()
    this._locked = [];
    // Will store last pressed keys (key down)
    this._lastKeyStates = [];

    InputBase.call( this, target );
};


Utils.merge( Keyboard, {
    KEY: {
        ANY:         -1,

        MOUSE1:      -2,
        MOUSE2:      -3,
        MOUSE3:      -4,

        BACKSPACE:   8,
        TAB:         9,
        ENTER:       13,
        PAUSE:       19,
        CAPS:        20,
        ESC:         27,
        SPACE:       32,
        PAGE_UP:     33,
        PAGE_DOWN:   34,
        END:         35,
        HOME:        36,
        LEFT_ARROW:  37,
        UP_ARROW:    38,
        RIGHT_ARROW: 39,
        DOWN_ARROW:  40,
        INSERT:      45,
        DELETE:      46,
        _0:          48,
        _1:          49,
        _2:          50,
        _3:          51,
        _4:          52,
        _5:          53,
        _6:          54,
        _7:          55,
        _8:          56,
        _9:          57,
        A:           65,
        B:           66,
        C:           67,
        D:           68,
        E:           69,
        F:           70,
        G:           71,
        H:           72,
        I:           73,
        J:           74,
        K:           75,
        L:           76,
        M:           77,
        N:           78,
        O:           79,
        P:           80,
        Q:           81,
        R:           82,
        S:           83,
        T:           84,
        U:           85,
        V:           86,
        W:           87,
        X:           88,
        Y:           89,
        Z:           90,
        NUMPAD_0:    96,
        NUMPAD_1:    97,
        NUMPAD_2:    98,
        NUMPAD_3:    99,
        NUMPAD_4:    100,
        NUMPAD_5:    101,
        NUMPAD_6:    102,
        NUMPAD_7:    103,
        NUMPAD_8:    104,
        NUMPAD_9:    105,
        MULTIPLY:    106,
        ADD:         107,
        SUBSTRACT:   109,
        DECIMAL:     110,
        DIVIDE:      111,
        F1:          112,
        F2:          113,
        F3:          114,
        F4:          115,
        F5:          116,
        F6:          117,
        F7:          118,
        F8:          119,
        F9:          120,
        F10:         121,
        F11:         122,
        F12:         123,
        SHIFT:       16,
        CTRL:        17,
        ALT:         18,
        PLUS:        187,
        COMMA:       188,
        MINUS:       189,
        PERIOD:      190
    },

    moduleName: 'Keyboard'
});

Keyboard.prototype = Utils.extend( InputBase, {

    get keyStates() { return this._keyStates; },
    get lastKeyStates() { return this._lastKeyStates; },
    get locked() { return this._locked; },


    init: function ( target ) {

        target.addEventListener( 'keydown', this._handleKeydown.bind( this ), false );
        target.addEventListener( 'keyup', this._handleKeyup.bind( this ), false );
        // Handle also clicks from mouse as a key press
        target.addEventListener( 'mousedown', this._handleKeydown.bind( this ), false );
        target.addEventListener( 'mouseup', this._handleKeyup.bind( this ), false );
    },


    _handleKeydown: function( e ) {
        e.stopPropagation();
        e.preventDefault();

        var code = this.getKeyFromEvent( e );
        this.keyStates[ code ] = true;
        this.locked[ code ] = true;

        // Trigger callbacks
        this.trigger( 'down', { key: code } );
    },

    _handleKeyup: function (e) {
        e.stopPropagation();
        e.preventDefault();

        var code = this.getKeyFromEvent( e );
        this.keyStates[ code ] = false;
        this.locked[ code ] = false;

        // Trigger callbacks
        this.trigger( 'up', { key: code } );
    },


    clear: function () {
        // Store last pressed
        this._lastKeyStates = this._keyStates;
        // Free current pressed
        this._keyStates = [];
    },


    /**
     * Returns true, is the given key is currently pressed.
     *
     * @param key
     * @returns {boolean}
     */
    isLocked: function(key) {
        return this._locked[key] === true;
    },

    /**
     * Returns true, if the given key is currently pressed.
     * Handles only keys which are pressed since the last clear().
     *
     * @param key
     * @returns {boolean}
     */
    isDown: function(key) {
        return this._keyStates[key] === true;
    },

    /**
     * Returns true, if the given key was released after the last clear().
     *
     * @param key
     * @returns {boolean}
     */
    isUp: function(key) {
        return !this._keyStates[key] === true && this._lastKeyStates[key] === true;
    },


    /**
     * Handles a direct bind to an event
     *
     * @param event
     * @param callback
     * @returns {*}
     */
    handleKeyEvent: function ( event, callback ) {
        if ( Utils.isFunction( callback ) ) {
            return this.bind( event, callback );
        }

        // Only trigger if we got a callback attached
        if (this.has(event) == false) {
            return this;
        }

        var args = Utils.merge( {
            eventName:    event,
            keyboard:     this
        }, callback || {} );

        return this.trigger( event, new EventArgs(args) );
    },

    /**
     * Binds to the key-down event
     *
     * @param callback
     * @returns {*}
     */
    onDown: function ( callback ) {
        return this.handleKeyEvent( 'down', { key: callback } );
    },

    /**
     * Binds to the key-up event
     *
     * @param callback
     * @returns {*}
     */
    onUp: function ( callback ) {
        return this.handleKeyEvent( 'up', { key: callback } );
    },


    getKeyFromEvent: function( e ) {

        // Non-mouse click event
        if( e.type == 'keydown' ) {
           return e.keyCode;
        }

        return (e.button == 2 ? Keyboard.KEY.MOUSE2 : Keyboard.KEY.MOUSE1);
    }

} );
/**
 * Collection of all supporter input methods ({InputBase] extensions).
 *
 * @param target
 * @constructor
 */
var Input = function ( target ) {
    EventBase.call( this );

    this._target = target || window;
    this._inputModules = [];

    // Add default modules
    // @TODO: Maybe create a global static register which contains all input interface names
    // The module system wont create any instance of the modules until some module is requested
    // So it would be okay to register all modules per defaut
    this.add( Mouse.moduleName );
    this.add( Keyboard.moduleName );
};

// @TODO: Dynamic registration using addModul, use modul's .export() array to merge into Input instance
Input.prototype = Utils.extend( EventBase, {

    /**
     * Returns the target of this class.
     *
     * @returns {EventBase}
     */
    get target() { return this._target; },
    /**
     * Returns the target of this class.
     * Just an alias to {this.target}.
     *
     * @returns {EventBase}
     */
    get context() { return this.target; },

    /**
     * Returns the instance of the {Mouse} module.
     *
     * @property mouse
     * @returns {Mouse}
     */


    /**
     * Returns the instance of the {Keyboard} module.
     *
     * @property keyboard
     * @returns {keyboard}
     */


    /**
     * Maps over the {InputBase} API and calls {InputBase.clear} on all stored modules.
     *
     * @returns {self}
     */
    clear: function () {
        for ( var moduleName in this._inputModules ) {
            var module = this._inputModules[ moduleName ];
            if ( module ) {
                module.clear();
            }
        }

        return this;
    },

    /**
     * Stores the {moduleName} as a reference and injects a lazyLoad getter into this class.
     *
     * @param moduleName
     * @returns {self}
     */
    add: function( moduleName ) {
        this._inputModules[ moduleName ] = null;
        // Inject a getter for this modul,
        var moduleGetterName = moduleName.toLowerCase();
        this.__defineGetter__( moduleGetterName, function () {
            return this._lazyLoad( moduleName );
        } );

        return this;
    },

    /**
     * Removes the reference of the instance of the given {moduleName} and delete's the lazyLoad getter from this class.
     *
     * @param moduleName
     * @returns {self}
     */
    remove: function( moduleName ) {
        // Remove the getter
        if ( ( moduleName in this ) ) {
            delete this [ moduleName ];
        }

        // Remove from array
        delete this._inputModules[ moduleName ];

        return this;
    },

    /**
     * Returns the instance of the {moduleName}
     *
     * @param moduleName
     * @returns {InputBase}
     * @private
     */
    _lazyLoad: function ( moduleName ) {
        if ( this._inputModules[ moduleName ] !== null ) {
            return this._inputModules[ moduleName ];
        }

        // @TODO: I think this uses eval() internally.. maybe fnd a better way
        // @FIXED: BUT, I don't think think this is nessecary anyways
        //         This will give problems in Node.js I guess
        
        var that = this;
        // Create the instance
        
        if( !( moduleName in Grafix ) )
            throw 'Invalid input module ' + moduleName;
        
        this._inputModules[ moduleName ] = new Grafix[ moduleName ]( this.target );

        // Return the instance
        return this._inputModules[ moduleName ];
    }

} );
var Stage = function( canvas, maxFps ) {

    Shape.call( this );

    this._canvas = canvas;
    this._canvasContext = null;
    this._autoStart = false;
    this._isUpdating = false;
    this._lastFrame = null;
    this._lastTime = new Date;
    this._maxFps = maxFps || 60;
    this._lastFps = 0;
    this._currentFps = 0;
    this._lastSecond = new Date().getSeconds();

    if( Utils.isString( this._canvas ) ) {
        this._canvas = Utils.getDomElementById( this._canvas );
    }

    if( !this._canvas ) {
        throw 'Specified element was not a selector of a canvas or a canvas dom element';
    }

    if( !( 'getContext' in this._canvas ) ) {
        throw 'Unsupported browser or specified element was not a canvas';
    }

    this._canvasContext = this._canvas.getContext( '2d' );

    // Create an input handler
    this._input = new Input( this._canvas );

    // Set css size
    this.cssSize = this.attributeSize;

    this._initializeCanvas();

    if ( this._autoStart ) {
        this.start();
    }
};

Stage.prototype = Utils.extend( Shape, {

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Stage'; },

    start: function ( force ) {
        if ( this._isUpdating && !force ) {
            return this;
        }

        if ( this._isUpdating ) {
            this.stop();
        }

        this._isUpdating = true;
        this.loopFrame();

        return this;
    },

    stop: function () {
        if ( this._lastFrame ) {
            window.cancelAnimationFrame( this._lastFrame );
        }

        this._lastFrame = 0;
        this._lastTime = 0;
        this._isUpdating = false;

        return this;
    },


    loopFrame: function ( timeElapsed ) {
        var that = this;
        timeElapsed = timeElapsed || 0;

        var now = new Date;
        var delta = now - this._lastTime;
        var iv = 1000 / this._maxFps;

        if ( this._maxFps >= 60 || delta > iv ) {

            this.draw();

            // Free informations
            if ( this.input ) {
                this.input.clear();
            }

            var s = now.getSeconds(); // we only count FINISHED frames

            if ( s !== this._lastSecond ) {
                this._lastFps = this._currentFps;
                this._currentFps = 0;
                this._lastSecond = s;
            }

            this._currentFps++;

            this._lastTime = now - ( delta % iv );
        }

        // make sure this is STOPPED
        if ( !this._isUpdating ) {
            return this.stop();
        }

        window.requestAnimationFrame( function( timeElapsed ) {
            that.loopFrame( timeElapsed );
        } );

        return this;
    },

    fps:       function ( maxFps ) {
        if ( maxFps ) {
            this._maxFps = maxFps;
        }

        return this._lastFps;
    }

} );


/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.stage = function( canvas, maxFps ) {
        
        return new Stage( canvas, maxFps );
    };


var Group = function( shapes, virtual ) {
    
    this._virtual = typeof virtual !== 'undefined' ? virtual : Group.defaults.virtual;
    
    Shape.call( this );
    
    if( shapes )
        this.addChild( shapes );
};

Group.defaults = {
    virtual: true
};

Group.prototype = Utils.extend( Shape, {

    get clone() {

        return Utils.clone( Group, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return Shape.prototype.cloneableProperties.concat([
            'virtual'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Group'; },

    get virtual() { return this._virtual; },
    set virtual( value ) {
        
        if( this._delegateChanged && this.has( 'changed' ) ) {
            this.changed( this.prepareChanged( 'virtual', this._virtual, value ) );
        }
        this._virtual = value;
        
        this.invalid = true;
    },

    set: function( virtual ) {

        Shape.prototype.set.call( this, virtual );

        if( Utils.isObject( virtual ) ) {
            
            if( 'virtual' in virtual ) this.virtual = virtual.virtual;
            
        } else if( typeof virtual !== 'undefined' ) {
            
            this.virtual = virtual;
        }        
        
        return this;
    },

    _drawGroup: function( canvasContext, style ) {
        
        if( this.virtual ) // Virtual groups dont get drawn
            return;
        
        Shape.prototype[ style ].call( this, canvasContext );
    },

    fill: function( canvasContext ) {

        this._drawGroup( canvasContext, 'fill' );
    },

    stroke: function( canvasContext ) {

        this._drawGroup( canvasContext, 'stroke' );
    },
    
    clear: function( canvasContext ) {

        this._drawGroup( canvasContext, 'clear' );
    }
});

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.group = function( shapes, virtual ) {
        
        return new Group( shapes, virtual );
    };
var Path = function( args ) {

    Shape.call( this );

    this._points = [];

    this.set( args );
};

Path.prototype = Utils.extend( Shape, {

    get clone() {
        return Utils.clone( Path, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return ShapeBase.prototype.cloneableProperties.concat([
            'points'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Path'; },

    get points() { return this.prop( 'points' ); },

    get length() { return this.points.length; },

    get start() { return this._points[ 0 ]; },
    set start( value ) { this.replace( value, 0 ); },

    get end() { return this._points[ this._points.length - 1 ]; },
    set end( value ) { this.replace( value, this._points.length - 1 ); },


    set: function( args ) {

        var i;

        if( Utils.isObject( args ) ) {

            Shape.prototype.set.call( this, args );

            // Assume instances of Point or arrays of [x, y]
            if( ('points' in args) && Utils.isArray( args.points ) ) {

                for ( i = 0; i < args.points.length; i++ ) {
                    this.add( args.points[ i ] );
                }
            }

        }
        // Maybe only a single Point instance
        else if( Utils.isType( args, 'Point') ) {
            this.add( args );
        }
        // Maybe an array of [x, y]
        else if( Utils.isArray( args ) ) {
            // Could be an array of Points, too
            for ( i = 0; i < args.length; i++ ) {
                // If we got a anumeric value, args is a spot defined as array [x, y]
                if( Utils.isNumeric( args[ i ] ) ) {
                    this.add( args );
                    break;
                }

                // Seems like an array of spots
                this.add( args[ i ] );
            }
        }

        return this;
    },


    add: function( x, y, i ) {
        // Could be:
        //  x, y
        //  {x: x.x, y: x.y}
        //  x: [x, y]
        //  x: Point(x, y)

        if( Utils.isUndefined( i ) === false ) {

            return this.replace( x, y, i );
        }

        var newP = null;

        if( Utils.isType( x, 'Point' ) ) {

            newP = x;
        } else if( Utils.isArray( x ) ) {

            newP = new Point( x[ 0 ], y[ 1 ] );
        } else if( Utils.isObject( x ) && ( 'x' in x ) && ( 'y' in x ) ) {

            newP = new Point( x.x, x.y );
        } else {

            newP = new Point( x, y );
        }

        if( newP !== null ) {

            this._points.push( newP );
            this.invalid = true;
        }

        return this;
    },

    replace: function( x, y, i ) {
        // Could be:
        //  x, y
        //  {x: x.x, y: x.y}
        //  x: [x, y]
        //  x: Point(x, y)

        if( Utils.isUndefined( i ) || (this._points.length - 1) < i ) {

            return this.add( x, y );
        }

        var newP = null;

        if( Utils.isType( x, 'Point' ) ) {

            newP = x;
        } else if( Utils.isArray( x ) ) {

            newP = new Point( x[ 0 ], y[ 1 ] );
        } else if( Utils.isObject( x ) && ( 'x' in x ) && ( 'y' in x ) ) {

            newP = new Point( x.x, x.y );
        } else {

            newP = new Point( x, y );
        }

        if( newP !== null ) {

            this._points[ i ] = newP;
            this.invalid = true;
        }

        return this;
    },


    isEmpty: function() {

        return this._points.length === 0;
    },

    fill: function( context ) {

        return this._drawPath( context );
    },

    stroke: function( context ) {

        return this._drawPath( context );
    },

    clear: function( context ) {

        return this._drawPath( context );
    },

    _drawPath: function( context ) {

        if( this.length < 2 ) {
            return this;
        }

        context = context || this.canvasContext;

        context.beginPath();
        context.moveTo( this.start.x, this.start.y );

        for( var i = 0; i < this.length; i++ ) {

            var p = this.points[ i ];
            context.lineTo( p.x, p.y );
        }

        context.stroke();

        return this;
    }


} );


/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' ) {
    ShortCuts.path = function( args ) {

        return new Path( args );
    };
}
var Line = function ( fromX, fromY, toX, toY ) {
    Path.call( this );

    this.set( fromX, fromY, toX, toY );
};

Line.prototype = Utils.extend( Path, {

    get clone() {
        return Utils.clone( Line, this );
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Line'; },

    get from() { return this.start; },
    set from( value ) { this.start = value;  },

    get to() { return this.end; },
    set to( value ) { this.end = value;  },

    get center() { return new Point( (this.from.x + this.to.x) / 2, (this.from.y + this.to.y) / 2 ); },


    set: function( fromX, fromY, toX, toY ) {

        Path.prototype.set.call( this, fromX, fromY, toX, toY );

        if( Utils.isNumeric( fromX ) && Utils.isNumeric( fromX ) ) {
            this.from = new Point( fromX, fromY );
        }

        else if( Utils.isObject( fromX ) && ( ( 'from' in fromX ) || ( 'to' in fromX ) ) ) {
            if( 'from' in fromX ) {
                this.from = fromX.from;
            }
            if( 'to' in fromX ) {
                this.to = fromX.to;
            }
        }

        if( Utils.isNumeric( toX ) && Utils.isNumeric( toX ) ) {
            this.to = new Point( toX, toY );
        }

        return this;
    },


    toString: function() {
        return '{from:' + this.from.x + '/' + this.from.y + ',to:' + this.to.x + '/' + this.to.y + '}';
    }
} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' ) {
    ShortCuts.line = function( fromX, fromY, toX, toY ) {

        return new Line( fromX, fromY, toX, toY );
    };
}

var Bitmap = function( path, x, y, width, height ) {

    // Apply parent methods (arguments are skipped, we call Rectangle.set() in our set() anyways)
    Rectangle.call(this);

    this._path = null;
    this._image = null;

    this._cropX = 0;
    this._cropY = 0;
    this._cropWidth = 0;
    this._cropHeight = 0;
    
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

        return Utils.clone( Bitmap, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return Rectangle.prototype.cloneableProperties.concat([
            'cropX',
            'cropY',
            'cropWidth',
            'cropHeight',
            'path',
            'image',
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Bitmap'; },


    get cropX() { return this.prop( 'cropX' ); },
    set cropX( value ) { return this.prop( 'cropX', value ); },
    
    get cropY() { return this.prop( 'cropY' ); },
    set cropY( value ) { return this.prop( 'cropY', value ); },

    get cropWidth() { return this.prop( 'cropWidth' ); },
    set cropWidth( value ) { return this.prop( 'cropWidth', value ); },
    
    get cropHeight() { return this.prop( 'cropHeight' ); },
    set cropHeight( value ) { return this.prop( 'cropHeight', value ); },

    get crop() { return new Rectangle( this.cropX, this.cropY, this.cropWidth, this.cropHeight ); },
    set crop( value ) {

        if( Utils.isObject( value ) ) {
            if( 'x' in value ) { this.cropX = value.x; }
            else if( 'cropX' in value ) { this.cropX = value.cropX; }
            if( 'y' in value ) { this.cropY = value.y; }
            else if( 'cropY' in value ) { this.cropY = value.cropY; }
            if( 'width' in value ) { this.cropWidth = value.width; }
            else if( 'cropWidth' in value ) { this.cropWidth = value.cropWidth; }
            if( 'height' in value ) { this.cropHeight = value.height; }
            else if( 'dropHeight' in value ) { this.cropHeight = value.cropHeight; }
        } else {
            throw "Invalid type of value for property Bitmap.crop: " + value;
        }
    },
    
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

            // Trigger our 'loaded' event
            bmp.loaded( { bitmap: bmp, image: img } );
        } );
        img.src = value;

        // @TODO: We changed path already, currently we ARE invalid
        if( this.prop( 'image', img ) !== false ) {
            this.invalid = true;
        }
    },
            
    get image() { return this.prop( 'image' ); },

    get cropped() { return ( this.cropX !== 0 || this.cropY !== 0 || this.cropWidth !== 0 || this.cropHeight !== 0 ); },

    /**
     * Overwrites default getter to use image's width and height.
     * @returns {ImageData}
     */
    get rawData() {
        if( this._rawData !== null && this.invalid === false ) {

            return this._rawData;
        }

        var width = this.image.width,
            height = this.image.height,
            ctx = Utils.getTempCanvasContext( width, height);

        // The object's raw data will be stored without filters
        ctx.drawImage( this.image, 0, 0, width, height );

        return this._rawData = ctx.getImageData( 0, 0, width, height );
    },


    set: function( path, x, y, width, height ) {

        if( Utils.isObject( path ) ) {
            
            Rectangle.prototype.set.call( this, path );
            
            if( 'path' in path ) this.path = path.path;
            if( 'crop' in path ) this.crop = path.crop;

        } else if( typeof path !== 'undefined' ) {

            this.path = path;
        }

        return this;
    },


    load: function( args ) {

        return this.on( 'load', args );
    },

    loaded: function( args ) {

        return this.on( 'loaded', args );
    },


    _draw: function( canvasContext, config ) {

        if( !this.image.complete ) { //come back when it is please!

            this.load( function drawOnce( e ) {

                e.bitmap.invalid = true;
                e.bitmap.unbind( 'load', drawOnce );
            } );
            return this;
        }

        var applyStyles = ( Utils.isObject( config ) ? config.styles !== false : true ),
            applyFilter = ( Utils.isObject( config ) ? config.filter !== false : true );

        // Get source and destination bounds
        var sourceRect = this.cropped ? this.crop : new Rectangle( {
                width: this.image.width,
                height: this.image.height
            } ),
            destinationRect = this.rectScaled,
            drawObject = this.image;

        // Draw filtered data?
        if( applyFilter ) {

            // {cavas.drawImage} is able to draw a image or canvas object, so just overwrite the object
            drawObject = Utils.getTempCanvas( this.image );
            drawObject.getContext('2d').putImageData( this.filteredData, 0, 0 );
        }

        canvasContext.save();

        // Apply styles on given context
        if( applyStyles ) {
            this.applyStyles( canvasContext );
        }

        // Draw it
        canvasContext.drawImage(
            drawObject,
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

        //console.log('[Bitmap] draw [', this.path, '] from[', sourceRect.toString(), '] to [', destinationRect.toString(), '] data:', drawObject);

        canvasContext.restore();

        return this;
    }
    
} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.bmp = function( path, x, y, width, height ) {

        return new Bitmap( path, x, y, width, height );
    };

var Text = function( string, x, y, width, height ) {
	Rectangle.call( this );

	this._string = '';
    this._textAlign = Text.defaults.textAlign;
    this._textBaseLine = Text.defaults.textBaseLine;
    this._lineHeight = Text.defaults.lineHeight;
    this._fontFamily = Text.defaults.fontFamily;
    this._fontWeight = Text.defaults.fontWeight;
    this._fontVariant = Text.defaults.fontVariant;
    this._fontStyle = Text.defaults.fontStyle;
    this._fontSize = Text.defaults.fontSize;
    
    this.set( string, x, y, width, height );
};
Text.defaults = {
    textAligns: [ 'left', 'center', 'right' ],
    textAlign: 'left',
    textBaseLines: [ 'top', 'middle', 'bottom', 'alphabetic', 'hanging' ],
    textBaseLine: 'top',
    lineHeight: 14,
    fontFamilies: [ 'arial', 'helvetica' ],
    fontFamily: 'helvetica',
    fontWeights: [ 'bold', 'bolder', 'normal', 'light', 'lighter' ],
    fontWeight: 'normal',
    fontVariants: [ 'normal', 'small-caps' ],
    fontVariant: 'normal',
    fontStyles: [ 'normal', 'italic', 'oblique' ],
    fontStyle: 'normal',
    fontSize: '12px'
};

Text.prototype = Utils.extend( Rectangle, {
    
    get clone() {
        return Utils.clone( Text, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return Rectangle.prototype.cloneableProperties.concat([
            'string',
            'textAlign',
            'textBaseLine',
            'lineHeight',
            'fontFamily',
            'fontWeight',
            'fontVariant',
            'fontStyle',
            'fontSize'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Stage'; },
    
    get string() { return this.prop( 'string' ); },
    set string( value ) { return this.prop( 'string', value ); },

    get textAlign() { return this.prop( 'textAlign' ); },
    set textAlign( value ) { return this.prop( 'textAlign', value ); },

    get textBaseLine() { return this.prop( 'textBaseLine' ); },
    set textBaseLine( value ) { return this.prop( 'textBaseLine', value ); },

    get lineHeight() { return this.prop( 'lineHeight' ); },
    set lineHeight( value ) { return this.prop( 'lineHeight', value ); },

    get fontFamily() { return this.prop( 'fontFamily' ); },
    set fontFamily( value ) { return this.prop( 'fontFamily', value ); },

    get fontWeight() { return this.prop( 'fontWeight' ); },
    set fontWeight( value ) { return this.prop( 'fontWeight', value ); },

    get fontVariant() { return this.prop( 'fontVariant' ); },
    set fontVariant( value ) { return this.prop( 'fontVariant', value ); },

    get fontStyle() { return this.prop( 'fontStyle' ); },
    set fontStyle( value ) { return this.prop( 'fontStyle', value ); },

    get fontSize() { return this.prop( 'fontSize' ); },
    set fontSize( value ) { return this.prop( 'fontSize', value ); },
    
    set: function( string, x, y, width, height ) {
        
        if( Utils.isObject( string ) ) {
            
            Rectangle.prototype.set.call( this, string );
            
            if( 'string' in string )
                this.string = string.string;
            
            if( 'textAlign' in string )
                this.textAlign = string.textAlign;
            
            if( 'textBaseLine' in string )
                this.textBaseLine = string.textBaseLine;
            
            if( 'lineHeight' in string )
                this.lineHeight = string.lineHeight;
            
            if( 'fontFamily' in string )
                this.fontFamily = string.fontFamily;
            
            if( 'fontWeight' in string )
                this.fontWeight = string.fontWeight;
            
            if( 'fontVariant' in string )
                this.fontVariant = string.fontVariant;
            
            if( 'fontStyle' in string )
                this.fontStyle = string.fontStyle;
            
            if( 'fontSize' in string )
                this.fontSize = string.fontSize;
            
        } else if( typeof string !== 'undefined' )
            this.string = string;
        
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

	measure: function( canvasContext, string, applyStyles ) {

        canvasContext = canvasContext || this.context;

		if( applyStyles ) {
            
            canvasContext.save();
            this.applyStyles( canvasContext );
        }
        
        var s = new Size( { height: this.fontSize } ),
            bounds = canvasContext.measureText( string || this.string );
        
        if( 'width' in bounds )
            s.width = bounds.width;
        
        if( 'height' in bounds )
            s.height = bounds.height;
        
        if( applyStyles )
            canvasContext.restore();
		

		return bounds;
	},

    applyStyles: function( canvasContext ) {
        
        if( !canvasContext )
            canvasContext = this.canvasContext;
        
        var fontProps = [];
        
        if( this.fontStyle !== 'normal' )
            fontProps.push( this.fontStyle );
        
        if( this.fontWeight !== 'normal' )
            fontProps.push( this.fontWeight );
        
        fontProps.push( this.fontSize );
        fontProps.push( this.fontFamily );
        
        var font = fontProps.join( ' ' );
        
        if( canvasContext.font !== font )
            canvasContext.font = font;
        
        //This fucks up our custom alignment (which listens to the same values)
        //if( canvasContext.textAlign !== this.textAlign )
            //canvasContext.textAlign = this.textAlign;
        
        if( canvasContext.textBaseline !== this.textBaseLine )
            canvasContext.textBaseline = this.textBaseLine;
        
        return Rectangle.prototype.applyStyles.call( this, canvasContext );
    },

    _drawText: function( canvasContext, string, style ) {
        
        string = string || this.string;
        
        canvasContext.save();
        this.applyStyles( canvasContext );
        
		// Draw each line
        var lines = ( string + '' ).split( '\n' );
        for( var i in lines ) {
            
            var line = lines[ i ],
                textRect = new Rectangle( this.measure( canvasContext, line, false ) ),
                lineRect = new Rectangle( 
                    this.x, 
                    this.y + ( i * this.lineHeight ), 
                    this.width, 
                    this.lineHeight 
                );
                    
            textRect.alignBy( lineRect, [ this.textAlign, this.textBaseLine, 'inner' ].join( ' ' )  );
                        
            canvasContext[ style + 'Text' ]( line, textRect.x, textRect.y );

            //console.log('drawText(', i, ') textRect:', textRect.toString(), ', lineRect:', lineRect.toString());
        }

        this._invalid = false;
        
        canvasContext.restore();

		return this;
    },

    fill: function( canvasContext, applyFilter, string ) {
        
        return this._drawText( canvasContext, string, 'fill' );
    },

    stroke: function( canvasContext, applyFilter, string ) {
        
        return this._drawText( canvasContext, string, 'stroke' );
    },

    clear: function( canvasContext, applyFilter, string ) {

        if( this.parent ) {
            this.color = this.parent.color;
        }
        
        return this._drawText( canvasContext, string, 'fill' );
    }
} );

var Animation = function( context, keyFrames, duration, easing ) {

    EventBase.call( this );
    
    this._keyFrames = [];
    this._context = null;
    this._duration = Animation.defaults.duration;
    this._easing = Animation.defaults.easing;
    this._iv = null;
    this._startTime = null;
    
    this.set( context, keyFrames, duration, easing );
};

Animation.defaults = {
    duration: 2000,
    easing: Easing.linear
};

Animation.prototype = Utils.extend( EventBase, {

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Animation'; },
    
    set: function( context, keyFrames, duration, easing ) {
        
        if( context )
            this._context = context;
        
        if( Utils.isObject( keyFrames ) ) {
            
            var wasKeyFrameCollection = false;
            for( var i in keyFrames ) {
                
                if( Utils.isNumeric( i ) ) {
                    this._keyFrames[ parseInt( i ) ] = new KeyFrame( keyFrames[ i ] );
                    wasKeyFrameCollection = true;
                } else if( Utils.inArray( i, [ 'from', 'start', 'first' ] ) ) {
                    this._keyFrames[ 0 ] = new KeyFrame( keyFrames[ i ] );
                    wasKeyFrameCollection = true;
                } else if( Utils.inArray( i, [ 'to', 'end', 'last' ] ) ) {
                    this._keyFrames[ 100 ] = new KeyFrame( keyFrames[ i ] );
                    wasKeyFrameCollection = true;
                }
            }
            
            if( !wasKeyFrameCollection ) {
                
                //assume this is the last keyframe with its properties
                this._keyFrames[ 100 ] = new KeyFrame( keyFrames );
                //calculate the first keyframe
                var first = {};
                for( var i in keyFrames )
                    first[ i ] = this._context[ i ];
                
                this._keyFrames[ 0 ] = new KeyFrame( first );
            }
        }
        
        if( Utils.isObject( duration ) ) {
            
            if( 'duration' in duration )
                this._duration = duration.duration;
            
            if( 'easing' in duration )
                this._easing = duration.easing;

            if( 'parent' in duration )
                this.parent = duration.parent;
            
            if( 'start' in duration )
                this.start( duration.start );
            
            if( 'started' in duration )
                this.started( duration.started );
            
            if( 'stop' in duration )
                this.stop( duration.stop );
            
            if( 'stopped' in duration )
                this.stopped( duration.stopped );
            
            if( 'pause' in duration )
                this.pause( duration.pause );
            
            if( 'paused' in duration )
                this.paused( duration.paused );
            
            if( 'resume' in duration )
                this.resume( duration.resume );
            
            if( 'resumed' in duration )
                this.resumed( duration.resumed );

            if( 'completed' in duration )
                this.completed( duration.completed );
            
        } else if( typeof duration !== 'undefined' )
            this._duration = duration;
        
        if( typeof easing !== 'undefined' )
            this._easing = easing;
        
        return this;
    },
            
    _loop: function( timeElapsed ) {
        
        if( !this._iv && typeof timeElapsed !== 'undefined' )
			return;
        
        var anim = this;
        this._iv = window.requestAnimationFrame( function( timeElapsed ) {
            
            anim._loop( timeElapsed );
        } );

		var completion = Math.max( 0, ( new Date().getTime() - this._startTime ) ) / this._duration;
        //var diff = this._properties[ i ] - this.originalProperties[ i ];
        //var newValue = this.originalProperties[ i ] + diff * ( this.easing( percentComplete ) );
        
        var previousStartFrame, startFrame, endFrame;
        for( var i in this._keyFrames ) {
            
            if( i > Math.floor( completion * 100 ) ) {
                
                endFrame = this._keyFrames[ i ];
                break;
            }
            
            previousStartFrame = startFrame;
            startFrame = this._keyFrames[ i ];
        }
        
        if( !endFrame ) {
            
            startFrame = previousStartFrame;
            endFrame = startFrame;
        }
        
        startFrame.diff( this._context, endFrame, completion, this._easing );
		
		if( completion >= 1 ) {
            
			this.stop();
			this.completed();
		}
    },
    
    start: function( args ) {
        
        if( Utils.isBindable( args ) )
            this.on( 'start', args );
        
        if( this._iv )
            return this;
        
        this.on( 'start', { animation: this, context: this._context } );
        this._startTime = new Date().getTime();
        this._loop();
        
        this.on( 'started', { animation: this, context: this._context } );
        
        return this;
    },
            
    started: function( args ) {
        
        return this.on( 'started', args );
    },
            
    stop: function( args ) {

        if( Utils.isBindable( args ) )
            this.on( 'stop', args );
        
        if( !this._iv )
            return this;
        
        this.on( 'stop', { animation: this, context: this._context } );
        window.cancelAnimationFrame( this._iv );
        this._startTime = null;
        this.on( 'stopped', { animation: this, context: this._context } );
        
        return this;
    },
    
    stopped: function( args ) {
        
        return this.on( 'stopped', args );
    },
            
    pause: function( args ) {

        if( Utils.isBindable( args ) )
            this.on( 'pause', args );
        
        if( !this._iv )
            return this;
        
        this.on( 'pause', { animation: this, context: this._context } );
        window.cancelAnimationFrame( this._iv );
        this.on( 'paused', { animation: this, context: this._context } );
        
        return this;
    },
            
    paused: function( args ) {

        return this.on( 'paused', args );
    },
            
    resume: function( args ) {
        
        if( Utils.isBindable( args ) )
            this.on( 'resume', args );
        
        if( this._iv )
            return this;
        
        this.trigger( 'resume', { animation: this, context: this._context } );
        this._loop();
        
        this.trigger( 'resumed', { animation: this, context: this._context } );
        
        return this;
    },
            
    resumed: function( args ) {
        
        return this.on( 'resumed', args );
    },
            
    completed: function( args ) {

        //console.log( 'Animation::completed: trigger callbacks:', this._eventCallbacks[ 'completed' ] );
        return this.on( 'completed', args );
    }

} );

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
    
    

var KeyFrame = function( properties ){
    
    this._properties = properties;
    this._easing = 'easing' in properties ? properties.easing : null;
};

KeyFrame.prototype = {
    
    set: function( properties ) {
        
        for( var i in '_properties' in properties ? properties._properties : properties )
            this._properties[ i ] = properties[ i ];
        
        return this;
    },
            
    get properties() {

        return this._properties;
    },
    
    diff: function( context, endFrame, completion, easing ) {
        
        easing = this._easing || ( easing || Easing.linear );
        
        for( var i in this._properties ) {
            //@TODO: What if not all properties set in previous/next frame?
            var diff = endFrame.properties[ i ] - this._properties[ i ],
                newValue = endFrame.properties[ i ] + diff * ( easing( completion ) );

            //console.log( 'KeyFrame.diff() changed ', i, ' to ', newValue);
            context[ i ] = newValue;
        }
        
        return this;
    }
};
var Random = {

    int: function ( min, max ) {
        return Math.floor( Math.random() * (max - min + 1) ) + min
    },

    float: function ( min, max ) {
        return Math.random() * (max - min) + min;
    }

};



    var Export = {
        Animation: Animation,
        Bitmap: Bitmap,
        Color: Color,
        Circle: Circle,
        Easing: Easing,
        EventBase: EventBase,
        EventArgs: EventArgs,
        EventHandler: EventHandler,
        Filter: Filter,
        Grid: Grid,
        Group: Group,
        Input: Input,
        InputBase: InputBase,
        Keyboard: Keyboard,
        Line: Line,
        Mouse: Mouse,
        Path: Path,
        Point: Point,
        Point3D: Point3D,
        Random: Random,
        Rectangle: Rectangle,
        Stage: Stage,
        ShapeBase: ShapeBase,
        Shape: Shape,
        Size: Size,
        Text: Text,
        Utils: Utils,
        /*
            You can call "import()" somewhere for a namespace (global namespace is default)
            in order to export it to that namespace

            Using "LibraryName.import()" at the start of your page JS right after importing
            the library, the exported classes will be globally available
            (e.g. "var mc = new MyClass()" instead of "var mc = new LibraryName.MyClass()")

            Notice that this can break existing scripts, if you don't use anything else,
            you're perfectly fine with importing everything into the global namespace
        */
        import: function( namespace ) {
            
            if( namespace === false )
                return Export;
            
            namespace = namespace || window;

            Utils.merge( namespace, Export );
            
            return Export;
        }
    };
    
    Utils.merge( Export, ShortCuts );

    /* Export classes to namespace via mapping */
    return Export;
} )();

if( typeof exports === 'object' && exports ) 
    exports = Grafix.import( false );

