var Utils = {
    _currentId: 0,

    
    merge: function( target, source ) {
        
        for( var i in source ) {
            // @FIXME: Dirty fix - dont copy 'clone' getter because this will trigger a new clone .. and so on
            // @TODO: We should skip the 'name' property too to prevent named dupes
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


    makeEnum: function( object, defaultmember ) {
        var enumeration = Utils.merge( {}, object );
        if( defaultmember ) {
            enumeration.default = enumeration[ defaultmember ];
        }

        return enumeration;
    },


    resolveClass: function ( classPath, scope ) {
        // Default to grafix-js as scope
        if ( !scope ) {
            scope = Grafix;
        }

        var scopes = classPath.split('.');
        for ( var i = 0; i < scopes.length; i++ ) {
            scope = scope[scopes[i]];
        }

        return scope;
    },


    getUid: function() {
        return ++Utils._currentId;
    },


    isType: function( val, type ) {

        return typeof val === type;
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
};
