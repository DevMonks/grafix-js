General
=======


# Coding Guideline

## Variable, Namespace and Function Naming

Inner Caps.

    var myVariableName = 'value';
    function myFunctionName( arg1, arg2 ) {

    }
    vendor.myNs.MyStaticClass.myConst = 'value';


## Class Naming

First character uppercase.

    var MyClass = function() {

    }

## Variable Declaration

    var varName = 'value';
    var myArray = [ 1, 2, 3, 4, 5 ]
    var myCallback = function( anything ) {
        
        return anything;
    };

## Class Declaration

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

## Initialization

    ( function( $, g, _, ns, undefined ) {

        //Your module code!

    } )( jQuery, Grafix, underscore, someOtherDependency );


Grafix.js
=========


Product Name: Grafix.js
Project Name: grafix-js


Expected Class Structure


- *EventObject* _Provides event methods_
    - *Size* _Provides with, height and calculation methods_
    - *Point* _Provides 2D position and calculation methods_
        - *Shape* _Provides basic drawing capabilities of simple shapes and calculation stuff_
            - *Rectangle* _Basically a shape with some more "Rectangle-ish" features_
                - *Image* _Handles asnync loading of image resources_
                    - *Tileset* _Can split Images like a tileset based on a Size tileSize_
                - *Text* _Handles text getting rendered on the scene_
                - *Grid* _Splits a rectangle into smaller ones and allows easy access to them_
                    - *Table* _Allows column/row spans in grids_
                - *Scene* _Handles frame looping, shape management and FPS_
                - *Layer* _Provides a z-index and sorting on a scene_
                    - TileLayer _Uses a tileset to render the layer_
                    - ImageLayer _Uses an image to render the layer_
                    - HtmlLayer _Uses HTML to render the layer_
            - *Circle* _It's a circle!_
            - *Path/Line* _Simple path/line based on 2 or more points_
            - *Polygon* _A shape based on 3 or more points_
    - *Mouse* _Handles mouse input and delegates to shapes_
    - *Keyboard* _Handles keyboard input and delegates to shapes_
    - *Touchscreen* _Handles touch input and delegates to shapes_
- *KeySpline/BezierCurve* _Calculates easings based on 2 points_
- *Easing* _A collection of animation easings_
- *Animation* _Handles the animation of shapes based on their style properties_
- *Color* _A collection of colors and allows manipulation of colors_
- *Random* _A random number generator_
- *Utils* _Some basic utilities (Class extending, merging etc.)_