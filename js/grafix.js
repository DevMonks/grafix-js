@@prioritize
Polyfill.requestAnimationFrame
Utils
Color
KeySpline
Easing
EventObject
Point
Size
Style
Shape
Rectangle
Circle
Grid
Scene
Layer
@@
@@before
	var Grafix = (function( undefined ) {

	"use strict";
@@
@@after
	var Export = {
        Color: Color,
        Easing: Easing,
        EventObject: EventObject,
        KeySpline: KeySpline,
        Mouse: Mouse,
        Point: Point,
        Random: Random,
        Rectangle: Rectangle,
        Scene: Scene,
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

			namespace = namespace || window;

			Utils.merge( namespace, Export );
		}
	};

	/* Export classes to namespace via mapping */
	return Export;
} )();
@@