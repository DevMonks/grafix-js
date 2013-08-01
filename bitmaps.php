<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>


<div style="width: 100%; padding: 20px; font-family: monospace; border: 1px dashed #fcc" id="frames"></div><br>
<br>

<canvas id="stage" width="900" height="500"></canvas><br>
<select onchange="muffinFilter.filter=Filter[this.value]">
    <option value="sepia">sepia</option>
    <option value="inverse">inverse</option>
    <option value="noRed">noRed</option>
    <option value="noGreen">noGreen</option>
    <option value="noBlue">noBlue</option>
</select>


<script src="js/grafix.nocache.js"></script>
<script>

    Grafix.import();

    var stage = new Stage( '#stage' );
    stage.color = Color.black;
    
    var muffin = new Bitmap( { path: 'img/muffin.jpg', width: 100 } ),
        muffinCrop = new Bitmap( { path: 'img/muffin.jpg', x: 110, width: 100, height: 100, crop: { x: 130, y: 130, width: 100, height: 100 } }),
        muffinScaled = new Bitmap( { path: 'img/muffin.jpg', x: 220 } ),
        muffinFilter = new Bitmap( { path: 'img/muffin.jpg', x: 400, filter: Filter.sepia } );

    muffinScaled.loaded( function( e ) {
        
        e.bitmap.size.mul( 0.2 );
    } );
    
    stage.addChild( [ muffin, muffinCrop, muffinScaled, muffinFilter ] );

    var frameCount = 0;
    stage.update( function( e ) {
        
        document.getElementById( 'frames' ).innerHTML = ++frameCount;
    } ).start( true );

</script>
<?php include 'includes/foot.php'; ?>
