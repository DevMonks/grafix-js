<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>


<div style="width: 100%; padding: 20px; font-family: monospace; border: 1px dashed #fcc" id="frames"></div><br>
<br>
<canvas id="layer" width="500" height="500"></canvas><br>
<button onclick="grid.rows++">More Rows</button>
<button onclick="grid.rows--">Less rows</button>
<button onclick="grid.columns++">More Columns</button>
<button onclick="grid.columns--">Less Columns</button><br>
<br>

<script src="js/grafix.nocache.js"></script>
<script>

    Grafix.import();

    var layer = new Layer( '#layer', 60 );
    var rect = new Rectangle( 5, 5, 100, 100 );
    var grid = new Grid( { 
        width: 400, 
        height: 400 
    } );

    var frameCount = 0;
    layer.update( function( e ) {

        var rects = grid.rects( function( pos ) {

            if( !this.childRect ) {

                this.childRect = this.clone().mouseHover( function() {
                    this.style.color = 'red';
                }, function() {
                    this.style.color = 'green';
                } );
            }

            layer.draw( this.childRect, false, false );

            var t = Text.create( pos.x + " - " + pos.y, "green 14 fill bold helvetica" );
            t.position( this, 'center center center' );
            layer.draw( t, false, false );
        } );

        layer.draw( grid, 'red stroke' );

        document.getElementById( 'frames' ).innerHTML = ++frameCount;
    } );

</script>
<?php include 'includes/foot.php'; ?>