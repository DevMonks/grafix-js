<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>


<div style="width: 100%; padding: 20px; font-family: monospace; border: 1px dashed #fcc" id="frames"></div><br>
<br>

<canvas id="stage" width="800" height="400"></canvas><br>


<script src="js/grafix.nocache.js"></script>
<script>
    
    var stage = Grafix.stage( '#stage' );
    stage.color = Grafix.colors.black;

    var grid = Grafix.grid( {
            width: stage.width,
            height: stage.height,
            virtual: false,
            align: 'center center',
            drawStyle: 'stroke',
            color: 'blue',
            columns: 10,
            rows: 10,
            allowIndividualStyles: true
        } )
        .eachRect( function( x, y, i ) {

            // We are able to use our own style!
            this.drawStyle = 'fill';
            // Test a random color
            this.color = Grafix.Color.rgbToHex(Grafix.Random.int(0, 255), Grafix.Random.int(0, 255), Grafix.Random.int(0, 255));

            /*
            if( y === 0 ) {

                var c = Grafix.color( { h: x, s: .5, l: .5 } );
                console.log( String( c ), c.hex, x, { h: x, s: .5, l: .5 } );
             this.color = c.hex;
            }
            */
        } );
    
    stage.addChild( [ grid ] );

    var frameCount = 0;
    stage.update( function( e ) {

        
        document.getElementById( 'frames' ).innerHTML = ++frameCount;
    } ).start( true );

</script>
<?php include 'includes/foot.php'; ?>
