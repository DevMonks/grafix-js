<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>


<div style="width: 100%; padding: 20px; font-family: monospace; border: 1px dashed #fcc" id="frames"></div><br>
<br>
<canvas id="layer" width="500" height="500"></canvas><br>

<script src="js/grafix.nocache.js"></script>
<script>
            Grafix.import();

            var stage = new Stage( '#layer' );
            stage.color = Color.black;

            var redRect = new Rectangle( { width: 400, height: 400, color: 'red' } ),
                blueRect = new Rectangle( { width: 250, height: 250, color: 'blue' } ),
                greenRect = new Rectangle( { width: 100, height: 100, color: 'green' } );

            redRect.align = 'center center center';

            stage.addChild( [ redRect, blueRect, greenRect ] );

            var frameCount = 0;
            stage.update( function( e ) {

                //document.getElementById( 'frames' ).innerHTML = ++frameCount;
            } ).start( true );

</script>
<?php include 'includes/foot.php'; ?>
