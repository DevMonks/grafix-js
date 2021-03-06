<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>


<div style="width: 100%; padding: 20px; font-family: monospace; border: 1px dashed #fcc" id="frames"></div><br>
<br>
<button onclick="grid.rows++">More Rows</button>
<button onclick="grid.rows--">Less rows</button>
<button onclick="grid.columns++">More Columns</button>
<button onclick="grid.columns--">Less Columns</button>
<br>

<canvas id="stage" width="400" height="400"></canvas><br>


<script src="js/grafix.nocache.js"></script>
<script>
    
    var stage = Grafix.stage( '#stage' );
    stage.color = Grafix.colors.black;
    
    var grid = Grafix.grid( { 
        width: 200, 
        height: 200,
        virtual: false,
        align: 'center center',
        drawStyle: 'stroke',
        color: 'blue'
    } );
    
    var thirdColumn = grid.column( 2 ).style( 'red'),
        ninthRow = grid.row( 8 ).style( 'yellow'),
        area = grid.combine( 5, 2, { x: 10, y: 5 } ).style( 'green' );
    
    
    stage.addChild( [ grid, thirdColumn, ninthRow, area ] );

    var frameCount = 0;
    stage.update( function( e ) {

        
        document.getElementById( 'frames' ).innerHTML = ++frameCount;
    } ).start( true );

</script>
<?php include 'includes/foot.php'; ?>
