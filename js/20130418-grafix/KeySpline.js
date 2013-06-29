/*
References for interested ones: 

http://13thparallel.com/archive/bezier-curves/
https://github.com/arian/cubic-bezier/blob/master/index.js

*/

var KeySpline = function( x1, y1, x2, y2, epsilon ) {

	var epsilon = epsilon || 0.002; //default precision

	var b1 = function( t ) {

		return t * t * t;
	};

	var b2 = function( t ) {

		return 3 * t * t * ( 1 - t );
	};

	var b3 = function( t ) {

		return 3 * t * ( 1 - t ) * ( 1 - t );
	};

	var b4 = function( t ) {

		return ( 1 - t ) * ( 1 - t ) * ( 1 - t );
	};

	var bX = function( t ) {

		return b3( t ) * x1 + b2( t ) * x2 + b1( t );
	};

	var bY = function( t ) {

		return b3( t ) * y1 + b2( t ) * y2 + b1( t );
	};

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