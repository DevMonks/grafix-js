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
        virtual: false,
        align: 'center center',
        drawStyle: 'stroke',
        color: 'blue',
        columns: 360,
        rows: 10
    } ).set( { width: stage.width, height: stage.height } );
    
    grid.eachRect( function( x, y, i ) {
        
        if( y === 0 ) {
            
            var c = Grafix.color( { h: x, s: .5, l: .5 } );
            console.log( String( c ), c.hex, x, { h: x, s: .5, l: .5 } );
            this.color = c.hex;
        }
        
    } );
    
    stage.addChild( [ grid ] );

    var frameCount = 0;
    stage.update( function( e ) {

        
        document.getElementById( 'frames' ).innerHTML = ++frameCount;
    } ).start( true );

</script>
<?php include 'includes/foot.php'; ?>