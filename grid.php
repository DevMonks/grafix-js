<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>


<div style="width: 100%; padding: 20px; font-family: monospace; border: 1px dashed #fcc" id="frames"></div><br>
<br>
<canvas id="stage" width="400" height="400"></canvas><br>
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
        width: 200, 
        height: 200,
        virtual: false,
        align: 'center center',
        drawStyle: 'stroke',
        color: 'blue'
    } );
    
    var thirdColumn = grid.column( 2 ).style( 'red' );
    var ninthRow = grid.row( 8 ).style( 'yellow' );
    var area = grid.combine( 5, 2, { x: 10, y: 5 } ).style( 'green' )
    
    
    stage.addChild( [ grid, thirdColumn, ninthRow, area ]);

    var frameCount = 0;
    stage.update( function( e ) {

        
        document.getElementById( 'frames' ).innerHTML = ++frameCount;
    } ).start( true );

</script>
<?php include 'includes/foot.php'; ?>