<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>


<div style="width: 100%; padding: 20px; font-family: monospace; border: 1px dashed #fcc" id="frames"></div><br>
<br>
<button onclick="group1.virtual=true; group2.virtual=true;">Virtual</button>
<button onclick="group1.virtual=false; group2.virtual=false;">Not virtual</button>
<br>

<canvas id="stage" width="400" height="400"></canvas><br>


<script src="js/grafix.nocache.js"></script>
<script>

    Grafix.import();

    var stage = Grafix.stage( '#stage' );
    stage.color = Color.gray;
    
    
    var rect1 = Grafix.rect( { x: 20, y: 20, width: 20, height: 20, color: 'darkred' } ),
        rect2 = rect1.clone.set( { x: 50, y: 30, width: 20, height: 20, color: 'blue' } ),
        rect3 = rect1.clone.set( { x: 10, y: 60, width: 20, height: 20, color: 'yellow' } ),
        rect4 = rect1.clone.set( { x: 40, y: 90, width: 20, height: 20, color: 'green' } ),
        rect5 = rect1.clone.set( { x: 200, y: 200, width: 20, height: 20, color: 'purple' } ),
        rect6 = rect1.clone.set( { x: 250, y: 210, width: 20, height: 20, color: 'orange' } ),
        rect7 = rect1.clone.set( { x: 210, y: 260, width: 20, height: 20, color: 'teal' } ),
        group1 = Grafix.group().addChild( [
            rect1, rect2, rect3, rect4
        ] ),
        group2 = Grafix.group().addChild( [
            rect5, rect6, rect7
        ] );
    
    stage.addChild( [ group1, group2 ]);

    var frameCount = 0;
    stage.update( function( e ) {

        
        document.getElementById( 'frames' ).innerHTML = ++frameCount;
    } ).start( true );

</script>
<?php include 'includes/foot.php'; ?>
