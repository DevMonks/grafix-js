<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>


<div style="width: 100%; padding: 20px; font-family: monospace; border: 1px dashed #fcc" id="frames"></div><br>
<br>
<canvas id="stage" width="500" height="500"></canvas><br>
<button onclick="grid.rows++">More Rows</button>
<button onclick="grid.rows--">Less rows</button>
<button onclick="grid.columns++">More Columns</button>
<button onclick="grid.columns--">Less Columns</button><br>
<br>

<script src="js/grafix.nocache.js"></script>
<script>

    Grafix.import();

    var stage = new Stage( '#stage' );
    stage.color = Color.black;
    
    var grid = new Grid( { 
        width: 400, 
        height: 400,
        virtual: false,
        align: 'center center',
        drawStyle: 'stroke',
        color: 'blue'
    } );
    
    stage.addChild( grid );

    var frameCount = 0;
    stage.update( function( e ) {

        
        document.getElementById( 'frames' ).innerHTML = ++frameCount;
    } ).start( true );

</script>
<?php include 'includes/foot.php'; ?>