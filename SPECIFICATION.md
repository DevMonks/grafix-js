General
=======

## Coding Guideline

### Variable, Namespace and Function Naming

Inner Caps.

    var myVariableName = 'value';
    function myFunctionName( arg1, arg2 ) {

    }
    vendor.myNs.MyStaticClass.myConst = 'value';


### Class Naming

First character uppercase.

    var MyClass = function() {

    }

### Variable Declaration

    var varName = 'value';
    var myArray = [ 1, 2, 3, 4, 5 ]
    var myCallback = function( anything ) {
        
        return anything;
    };

### Class Declaration

Define as variable, set basic properties in constructor and
append prototype

    var MyClass = function( options ) {
        
        this.options = options;
        this.property1 = null;
        this.property2 = null;

    }


    MyClass.prototype = {

        method1: function() {

        },
        method2: function() {

        }
    };

### Initialization

    ( function( $, g, _, ns, undefined ) {

        //Your module code!

    } )( jQuery, Grafix, underscore, someOtherDependency );



Grafix.js
=========


## Product Name: Grafix.js
## Project Name: grafix-js


### Expected Class Structure


- **EventBase** _Provides event methods_
    - **Size** _Provides with, height and calculation methods_
    - **Point** _Provides 2D position and calculation methods_
        - **Shape** _Provides basic drawing capabilities of simple shapes and calculation stuff_
            - **Rectangle** _Basically a shape with some more "Rectangle-ish" features_
                - **Image** _Handles asnync loading of image resources_
                    - **Tileset** _Can split Images like a tileset based on a Size tileSize_
                - ***Text*** _Handles text getting rendered on the scene_
                - ***Grid*** _Splits a rectangle into smaller ones and allows easy access to them_
                    - ***Table*** _Allows column/row spans in grids_
                - **Scene** _Handles frame looping, shape management and FPS_
                - **Layer** _Provides a z-index and sorting on a scene_
                    - TileLayer _Uses a tileset to render the layer_
                    - ImageLayer _Uses an image to render the layer_
                    - HtmlLayer _Uses HTML to render the layer_
            - **Circle** _It's a circle!_
            - **Path/Line** _Simple path/line based on 2 or more points_
            - **Polygon** _A shape based on 3 or more points_
    - **InputBase** _Provides combined events and manages input events_
        - **Mouse** _Handles mouse input and delegates to shapes_
        - **Keyboard** _Handles keyboard input and delegates to shapes_
        - **Touchpad** _Handles touch input and delegates to shapes_
        - **Gamepad** _Handles gamepad input and delegates to shapes_
- **EventArgs**
- **EventHandler**
- **Easing** _A collection of animation easings_
- **Animation** _Handles the animation of shapes based on their style properties_
- **Color** _A collection of colors and allows manipulation of colors_
- **Random** _A random number generator_
- **Utils** _Some basic utilities (Class extending, merging etc.)_


### Object initialization

Most objects should utilize a `set( args )` method, that accepts an object to set
specific properties of the class

e.g.

    var Point = function( x, y ) {
        
        this.set( x, y );
    }
    
    Point.prototype = {
        set: function( x, y ) {
            
            if( typeof x === 'object' ) {
                if( x.x ) this.x = x.x;
                if( x.y ) this.y = x.y;
            } else if( x ) {
                
                this.x = x;
                if( y )
                    this.y = y;
            }
        }
    }

As you can see, you can either pass an object `{ x: x, y: y}` or just `x, y`

Probably all classes that derive from `Point` and `Size` or any of their
descendants should include a `set( args )` method and use it in their constructor as well


### Cloning

Often you have the need to get a completely new, untouchable instance of your object.
The `set( args )` method of these objects should accept all properties, that are clonable.

Cloning should work via a getter in order to keep it simple.

Copying a Rectangle should work like this:
    
    var rect = new Rectangle( 0, 0, 3, 4 );
    
    layer.addChild( rect.style( 'red' ) )
         .addChild( rect.clone.style( 'blue' ).add( { x: 3 } ) );
    
This should draw two rectangles, a blue and a red one, with a width of 3 and a height of 4 pixels right next to each other at the top left corner of the layer

Cloning then should be handled like this:

    var Point = function( args ) {
        
        this.set( args );
    }

    Point.prototype = {
        set: function( args ) { /*....*/ },
        get clone() {
            
            return new Point( this );
        }
    }

This will in essence call .set( this ) on the newly created object and `set( obj )` should
be able to copy all essential properties.

For a reference visit the `Shape` class and take a look at the `set` and `clone` properties.