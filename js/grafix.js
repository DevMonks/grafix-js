@@prioritize
Polyfill.requestAnimationFrame
Polyfill.addEventListener
Utils
Color
Easing
EventArgs
EventHandler
EventBase
ShapeBase
Shape
Point
Point3D
Size
Rectangle
Circle
Grid
InputBase
Mouse
Keyboard
Input
Stage
Group
Path
Line
Bitmap
Text
Animation
@@
@@before

var Grafix = (function( undefined ) {

    "use strict";
    
    var ShortCuts = {};
    
@@
@@after

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

@@