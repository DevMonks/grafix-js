<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>

<canvas id="stage" width="800" height="500"></canvas>

<script src="js/grafix.nocache.js"></script>
<script>
    
    Grafix.import();

    var stage = new Stage( '#stage' );
    stage.color = Color.black;

    var redRect = new Rectangle( { width: 400, height: 400, color: 'red' } ),
        blueRect = new Rectangle( { width: 250, height: 250, color: 'blue' } ),
        greenRect = new Rectangle( { width: 100, height: 100, color: 'green' } );


    stage.addChild( redRect.addChild( blueRect.addChild( greenRect ) ) );

    redRect.align = 'center center center';
    blueRect.align = 'inner top right';
    greenRect.align = 'top left outer';
    console.log( greenRect.toString(), greenRect );

    var frameCount = 0;
    stage.start( true );

</script>
<?php include 'includes/foot.php'; ?>
