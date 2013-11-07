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
