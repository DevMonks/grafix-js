<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>


<div style="width: 100%; padding: 20px; font-family: monospace; border: 1px dashed #fcc" id="frames"></div><br>
<br>
<canvas id="layer" width="500" height="500"></canvas><br>

<script src="js/grafix.nocache.js"></script>
<script>

    Grafix.import();

    var scene = new Stage( '#layer' );
    scene.color = Color.black;
    var rect = new Rectangle( {x: 100, y: 100, width: 100, height: 100, drawStyle: 'fill', color: Color.green} );
    var rect2 = new Rectangle( {x: 300, y: 300, width: 50, height: 50, drawStyle: 'stroke', color: Color.yellow} );
    var circle = new Circle( {x: 0, y: 0, radius: 50, startAngle: 0, endAngle: 0, drawStyle: 'fill', color: Color.blue} );

    window.setTimeout( function() { 

        rect.animate( {
            x: 400,
            width: 200,
            height: 180
        }, 2000, Easing.create( .8,.3,.5, 1.60), function() {
            
            console.log( 'Done animating rect' );
        } );
            
        rect2.animate( {
            width: 200,
            height: 200
        }, 3000, Easing.create( .8,.3,.5, 1.60), function() {

            console.log( 'Done animating rect2' );
        } );
        
        circle.animate( {
            y: 200,
            startAngle: 0,
            endAngle: 360 ,
            radius: 100,
            x: 50
        }, 4000, Easing.easeOutBounce, function() {
            
            console.log( 'Done animating circle' );
        } );

    }, 1000 );

    /*rect.mouseHover( function() {
            this.color = Color.lime;
        }, function() {
            this.color = Color.green;
        } );

    rect2.mouseHover( function() {
            this.color = Color.orange;
        }, function() {
            this.color = Color.yellow;
        } );

    circle.mouseHover( function() {
            this.color = Color.navy;
        }, function() {
            this.color = Color.blue;
        } );*/

    scene.addChild( [ rect, rect2, circle ] );

    var frameCount = 0,
        $frames = document.getElementById( 'frames' );
    scene
        .update( function( e ) {

            $frames.innerHTML =
                'Frame Count: ' + ( ++frameCount ) + '<br>' +
                'Mouse: (X: ' + scene.input.mouse.position.x + ') (Y: ' + scene.input.mouse.position.y + ')';
        } )
        .start(true);

</script>
<?php include 'includes/foot.php'; ?>
