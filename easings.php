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

    var system = new Grid( layer.rect().div( { width: 2, height: 2 } ) );
    console.log( layer.rect(), layer.rect().div( { width: 2 } ) );
    system.position( layer.rect() );
    system.rows = 12;
    system.columns = 12;

    // @TODO: Line, may be derived from Path

    var xAxis = new Line( system.rectAt( 0, 11 ).topLeft() );
    xAxis.to = system.rectAt( 11, 11 ).topRight();
    xAxis.style.lineWidth = 2;

    var yAxis = new Line( system.rectAt( 0, 0 ).topRight() );
    yAxis.to = system.rectAt( 0, 11 ).bottomRight();
    yAxis.style.lineWidth = 2;

    var curve = new Line( system.rectAt( 0, 10 ).bottomRight() );
    curve.to = system.rectAt( 10, 1 ).topRight();
    curve.style.lineWidth = 2;

    var cp1Circle = new Circle( system.rectAt( 1, 3 ).point(), undefined, system.rectAt( 0, 0 ).width / 2 );
    var cp2Circle = new Circle( system.rectAt( 3, 1 ).point(), undefined, system.rectAt( 0, 0 ).width / 2 );

    var cp1Line = new Line( cp1Circle.center() );
    cp1Line.to = curve.point();

    var cp2Line = new Line( cp2Circle.center() );
    cp2Line.to = curve.to;

    var animRect = new Rectangle( system.rectAt( 1, 10 ).bottomLeft () );
    animRect.anim = animRect.animate( {
        width: system.rectAt( 0, 0 ).width * 10,
        height: system.rectAt( 0, 0 ).height * 10,
        y: animRect.y - system.rectAt( 0, 0 ).height * 10,
        start: true
    } );

    cp1Circle.style( 'green fill' ).mouseHover( function() {
        this.style( 'lime fill' )
    }, function() {
        this.style( 'green fill' );
    } );

    cp1Circle.mouseDown( function( e ) {

        this.animate( {
            x: this.x - 4,
            y: this.y - 4,
            radius: this.radius + 4
        }, 300, Easing.easeOutElastic );
    } ).mouseDrag( function( e ) {

        this.dragOffset = e.position.point().sub( this.point() );
    } ).mouseDragMove( function( e ) {

        this.point( e.position.point().sub( this.dragOffset ) );
    } ).mouseDrop( function( e ) {

        this.animate( {
            x: this.x + 4,
            y: this.y + 4,
            radius: this.radius - 4
        }, 300, Easing.easeOutElastic );
    } );

    cp2Circle.style( 'navy fill' ).mouseHover( function() {
        this.style( 'blue fill' )
    }, function() {
        this.style( 'navy fill' );
    } );

    cp2Circle.mouseDown( function( e ) {

        this.animate( {
            x: this.x - 4,
            y: this.y - 4,
            radius: this.radius + 4
        }, 300, Easing.easeOutElastic );
    } ).mouseDrag( function( e ) {

        this.dragOffset = e.position.point().sub( this.point() );
    } ).mouseDragMove( function( e ) {

        this.point( e.position.point().sub( this.dragOffset ) );
    } ).mouseDrop( function( e ) {

        this.animate( {
            x: this.x + 4,
            y: this.y + 4,
            radius: this.radius - 4
        }, 300, Easing.easeOutElastic );
    } );

    var texts = {
        t0: Text.create( "0 (t)", '10 orange fill helvetica' ).position( system.rectAt( 0, 10 ) ),
        t1: Text.create( "1 (t)", '10 orange fill helvetica' ).position( system.rectAt( 10, 10 ) ),
        per0: Text.create( "0 (%)", '10 red fill helvetica' ).position( system.rectAt( 1, 11 ) ),
        per1: Text.create( "1 (%)", '10 red fill helvetica' ).position( system.rectAt( 1, 0 ) ),
        cp1: Text.create( "C1", '10 white fill helvetica' ).position( cp1Circle ),
        cp2: Text.create( "C2", '10 white fill helvetica' ).position( cp2Circle )
    };

    var tScale = system.rectAt( 0, 0 ).width * 10;
    var perScale = system.rectAt( 0, 0 ).height * 10;

    var frameCount = 0;
    var cp1x = cp1Circle.center().distanceTo( system.rectAt( 1, 0 ).bottomLeft().set( { y: cp1Circle.center().y } ) ) / ( system.rectAt( 0, 0 ).width * 10 );
    var cp2x = cp2Circle.center().distanceTo( system.rectAt( 1, 0 ).bottomLeft().set( { y: cp2Circle.center().y } ) ) / ( system.rectAt( 0, 0 ).width * 10 );
    var cp1y = cp1Circle.center().distanceTo( system.rectAt( 1, 10 ).bottomLeft().set( { x: cp1Circle.center().x } ) ) / ( system.rectAt( 0, 0 ).height * 10 );
    var cp2y = cp2Circle.center().distanceTo( system.rectAt( 1, 10 ).bottomLeft().set( { x: cp2Circle.center().x } ) ) / ( system.rectAt( 0, 0 ).height * 10 );
    animRect.anim.easing = Easing.create( cp1x, cp1y, cp2x, cp2y );
    layer.update( function( e ) {

        system.rects( function() {

            if( this.contains( layer.mouse().position ) ) {

                if( this.hoverRect )
                    layer.draw( this.hoverRect, '#efefef fill' )
                else
                    layer.draw( this.hoverRect = this.rect(), '#efefef fill' );
            }
        } );

        curve.checkpoints[ 0 ] = new Point( cp1Circle.center().x, cp1Circle.center().y );
        curve.checkpoints[ 1 ] = new Point( cp2Circle.center().x, cp2Circle.center().y );

        cp1Line.point( cp1Circle.center() );
        cp2Line.point( cp2Circle.center() );
        texts.cp1.position( cp1Circle );
        texts.cp2.position( cp2Circle );

        cp1x = cp1Circle.center().distanceTo( system.rectAt( 1, 0 ).bottomLeft().set( { y: cp1Circle.center().y } ) ) / ( system.rectAt( 0, 0 ).width * 10 );
        cp2x = cp2Circle.center().distanceTo( system.rectAt( 1, 0 ).bottomLeft().set( { y: cp2Circle.center().y } ) ) / ( system.rectAt( 0, 0 ).width * 10 );
        cp1y = cp1Circle.center().distanceTo( system.rectAt( 1, 10 ).bottomLeft().set( { x: cp1Circle.center().x } ) ) / ( system.rectAt( 0, 0 ).height * 10 );
        cp2y = cp2Circle.center().distanceTo( system.rectAt( 1, 10 ).bottomLeft().set( { x: cp2Circle.center().x } ) ) / ( system.rectAt( 0, 0 ).height * 10 );

        animRect.anim.easing = Easing.create( cp1x, cp1y, cp2x, cp2y );


        this.draw( system, '#c0c0c0' )
            .draw( xAxis, 'orange' )
            .draw( yAxis, 'red' )
            .draw( curve, 'black' )
            .draw( animRect, 'blue stroke' )
            .draw( cp1Line, 'gray' )
            .draw( cp2Line, 'gray' )
            .draw( cp1Circle )
            .draw( cp2Circle );

        for( var i in texts )
            this.draw( texts[ i ] );


        document.getElementById( 'frames' )
                .innerHTML = 'Frame Count: ' + ( ++frameCount ) + ', FPS: ' + this.fps() + '/' + this.maxFps + '<br>' +
                             'Mouse: (X: ' + this.mouse().position.x + ') (Y: ' + this.mouse().position.y + ')<br>' +
                             'MB0: ' + this.mouse().buttonStates[ 0 ] + ', MB1: ' + this.mouse().buttonStates[ 1 ] + ', MB2: ' + this.mouse().buttonStates[ 2 ] + '<br>' +
                             'CP1.X: ' + cp1x + ', CP2.X: ' + cp2x + ', CP1.Y: ' + cp1y + ', CP2.Y: ' + cp2y;
        document.getElementById( 'easing-code' ).innerHTML = 'Easing.create( ' + cp1x + ', ' + cp1y + ', ' + cp2x + ', ' + cp2y + ', "yourEasingName" );';
    } );

</script>
<?php include 'includes/foot.php'; ?>
