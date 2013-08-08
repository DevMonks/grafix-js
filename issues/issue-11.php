<!doctype html>
<html lang="en">
    <head>
        <title>Grafix.js - Issue-11 testcase</title>
        <link rel="stylesheet" href="../css/bootstrap.min.css">
    </head>
    <body style="padding: 40px">

        <div>

            <div class="well well-small">
                <canvas id="layer" width="700px" height="400px"></canvas>
            </div>

        </div>

        <script src="../js/grafix.nocache.js"></script>
        <script>

            Grafix.import();

            var stage = new Stage( '#layer' );
            stage.color = Color.grey;

            var rect = new Rectangle( { width: 100, height: 100, color: Color.yellow } );
            var rect2 = new Rectangle( { width: 40, height: 40, color: Color.red } );
            // Nest a child without adding the parent (rect) to a Stage object
            rect
                .addChild( rect2 )
                .alignBy( stage );
            rect2.alignBy( rect );

            // Now add rect to a valid Stage
            stage
                .addChild( rect )
                .start( true );

        </script>

    </body>
</html>
