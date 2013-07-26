@@prioritize
Polyfill.requestAnimationFrame
Utils
Color
Easing
EventArgs
EventHandler
EventObject
Point
Point3D
Size
Shape
Rectangle
Circle
Grid
Stage
@@
@@before

var Grafix = (function( undefined ) {

	"use strict";
    
@@
@@after

	var Export = {
        Color: Color,
        Circle: Circle,
        Easing: Easing,
        EventObject: EventObject,
        EventArgs: EventArgs,
        EventHandler: EventHandler,
        Mouse: Mouse,
        Grid: Grid,
        Point: Point,
        Point3D: Point3D,
        Random: Random,
        Rectangle: Rectangle,
        Stage: Stage,
        Shape: Shape,
        Size: Size,
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
		}
	};

	/* Export classes to namespace via mapping */
	return Export;
} )();

if( typeof exports === 'object' && exports ) 
    exports = Grafix.import( false );

@@
