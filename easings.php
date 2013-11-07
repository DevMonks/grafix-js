<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>


<div style="width: 100%; padding: 20px; font-family: monospace; border: 1px dashed #fcc" id="frames"></div><br>
<br>
<canvas id="layer" width="500" height="500"></canvas><br>

<script src="js/grafix.nocache.js"></script>
<script>

    var log = function( string ) {

        document.getElementById( 'log' ).innerHTML = string;
    };

    Grafix.import();

    var layer = new Stage( '#layer' );
    layer.color = Color.white;

    var system = new Grid({ color: '#c0c0c0', drawStyle: 'stroke', virtual: false, rect: layer.rect.div( { width: 2, height: 2 } ), rows: 12, columns: 12 });

    var xAxis = new Line({ color: Color.orange, from: system.rectAt( 0, 11 ).leftTop, to: system.rectAt( 11, 11 ).rightTop }),
        yAxis = new Line({ color: Color.red, from: system.rectAt( 0, 0 ).rightTop, to: system.rectAt( 0, 11 ).rightBottom }),
        curve = new Line({ from: system.rectAt( 0, 10 ).rightBottom, to: system.rectAt( 10, 1 ).rightTop }),
        cp1Circle = new Circle({ color: Color.green, drawStyle: 'stroke', position: system.rectAt( 1, 3 ).position, radius: system.rectAt( 0, 0 ).width / 2 }),
        cp2Circle = new Circle({ color: Color.navy, drawStyle: 'fill', position: system.rectAt( 3, 1 ).position, radius: system.rectAt( 0, 0 ).width / 2 }),
        cp1Line = new Line({ color: Color.gray, from: cp1Circle.center(), to: curve.center }),
        cp2Line = new Line({ color: Color.gray, from: cp2Circle.center(), to: curve.center });

    var animRect = new Rectangle({ color: Color.blue, drawStyle: 'stroke', position: system.rectAt( 1, 10 ).leftBottom });
    animRect.anim = animRect.animate( {
        width: system.rectAt( 0, 0 ).width * 10,
        height: system.rectAt( 0, 0 ).height * 10,
        y: animRect.y - system.rectAt( 0, 0 ).height * 10,
        start: true
    } );

    cp1Circle.mouseHover( function() {
        this.color = Color.lime;
    }, function() {
        this.color = Color.green;
    } );

    cp1Circle.mouseDown( function( e ) {

        this.animate( {
            x: this.x - 4,
            y: this.y - 4,
            radius: this.radius + 4
        }, 300, Easing.easeOutElastic );
    } ).mouseDrag( function( e ) {

        this.dragOffset = e.mouse.position.sub( this.position );
    } ).mouseDragMove( function( e ) {

        this.point(e.mouse.position.sub( this.dragOffset ) );
    } ).mouseDrop( function( e ) {

        this.animate( {
            x: this.x + 4,
            y: this.y + 4,
            radius: this.radius - 4
        }, 300, Easing.easeOutElastic );
    } );

    cp2Circle.mouseHover( function() {
        this.color = Color.blue;
    }, function() {
        this.color = Color.navy;
    } );

    cp2Circle.mouseDown( function( e ) {

        this.animate( {
            x: this.x - 4,
            y: this.y - 4,
            radius: this.radius + 4
        }, 300, Easing.easeOutElastic );
    } ).mouseDrag( function( e ) {

        this.dragOffset = e.mouse.position.sub( this.position );
    } ).mouseDragMove( function( e ) {

        this.point(e.mouse.position.sub( this.dragOffset ) );
    } ).mouseDrop( function( e ) {

        this.animate( {
            x: this.x + 4,
            y: this.y + 4,
            radius: this.radius - 4
        }, 300, Easing.easeOutElastic );
    } );

    var texts = [
        new Text({ string: "0 (t)", fontSize: 10, color: 'orange', fontFamily: 'helvetica', position: system.rectAt( 0, 10 ) }),
        new Text({ string: "1 (t)", fontSize: 10, color: 'orange', fontFamily: 'helvetica', position: system.rectAt( 10, 10 ) }),
        new Text({ string: "0 (%)", fontSize: 10, color: 'red', fontFamily: 'helvetica', position: system.rectAt( 1, 11 ) }),
        new Text({ string: "1 (%)", fontSize: 10, color: 'red', fontFamily: 'helvetica', position: system.rectAt( 1, 0 ) }),
        new Text({ string: "C1", fontSize: 10, color: 'white', fontFamily: 'helvetica', position: cp1Circle }),
        new Text({ string: "C2", fontSize: 10, color: 'white', fontFamily: 'helvetica', position: cp2Circle })
    ];

    var tScale = system.rectAt( 0, 0 ).width * 10,
        perScale = system.rectAt( 0, 0 ).height * 10;

    var frameCount = 0;
    var cp1x = cp1Circle.center().distanceTo( system.rectAt( 1, 0 ).leftBottom.set( { y: cp1Circle.center().y } ) ) / ( system.rectAt( 0, 0 ).width * 10 );
    var cp2x = cp2Circle.center().distanceTo( system.rectAt( 1, 0 ).leftBottom.set( { y: cp2Circle.center().y } ) ) / ( system.rectAt( 0, 0 ).width * 10 );
    var cp1y = cp1Circle.center().distanceTo( system.rectAt( 1, 10 ).leftBottom.set( { x: cp1Circle.center().x } ) ) / ( system.rectAt( 0, 0 ).height * 10 );
    var cp2y = cp2Circle.center().distanceTo( system.rectAt( 1, 10 ).leftBottom.set( { x: cp2Circle.center().x } ) ) / ( system.rectAt( 0, 0 ).height * 10 );
    animRect.anim.easing = Easing.create( cp1x, cp1y, cp2x, cp2y );

    layer
        .addChild([ system, xAxis, yAxis, curve, animRect, cp1Line, cp2Line, cp1Circle, cp2Circle ])
        .addChild( texts );

    layer.update( function( e ) {

        // @TODO: Mouse hover on each rect
        /*
        system.rects( function() {

            if( this.contains( layer.mouse.position ) ) {

                if( this.hoverRect )
                    layer.draw( this.hoverRect, '#efefef fill' );
                else
                    layer.draw( this.hoverRect = this.rect, '#efefef fill' );
            }
        } );
        */
        /*
        curve.from = new Point( cp1Circle.center().x, cp1Circle.center().y );
        curve.to = new Point( cp2Circle.center().x, cp2Circle.center().y );

        cp1Line.position = cp1Circle.center();
        cp2Line.position = cp2Circle.center();
        // @TODO: Fetch from stage using name
        //texts.cp1.position = cp1Circle;
        //texts.cp2.position = cp2Circle;

        cp1x = cp1Circle.center().distanceTo( system.rectAt( 1, 0 ).leftBottom.set( { y: cp1Circle.center().y } ) ) / ( system.rectAt( 0, 0 ).width * 10 );
        cp2x = cp2Circle.center().distanceTo( system.rectAt( 1, 0 ).leftBottom.set( { y: cp2Circle.center().y } ) ) / ( system.rectAt( 0, 0 ).width * 10 );
        cp1y = cp1Circle.center().distanceTo( system.rectAt( 1, 10 ).leftBottom.set( { x: cp1Circle.center().x } ) ) / ( system.rectAt( 0, 0 ).height * 10 );
        cp2y = cp2Circle.center().distanceTo( system.rectAt( 1, 10 ).leftBottom.set( { x: cp2Circle.center().x } ) ) / ( system.rectAt( 0, 0 ).height * 10 );

        animRect.anim.easing = Easing.create( cp1x, cp1y, cp2x, cp2y );
        */

        document.getElementById( 'frames' )
                .innerHTML = 'Frame Count: ' + ( ++frameCount ) + ', FPS: ' + this.fps() + '<br>' +
                             'Mouse: (X: ' + this.input.mouse.position.x + ') (Y: ' + this.input.mouse.position.y + ')<br>' +
                             //'MB0: ' + this.mouse.buttonStates[ 0 ] + ', MB1: ' + this.mouse.buttonStates[ 1 ] + ', MB2: ' + this.mouse.buttonStates[ 2 ] + '<br>' +
                             'CP1.X: ' + cp1x + ', CP2.X: ' + cp2x + ', CP1.Y: ' + cp1y + ', CP2.Y: ' + cp2y;
        //document.getElementById( 'easing-code' ).innerHTML = 'Easing.create( ' + cp1x + ', ' + cp1y + ', ' + cp2x + ', ' + cp2y + ', "yourEasingName" );';
    } )
    .start();

</script>
<?php include 'includes/foot.php'; ?>
