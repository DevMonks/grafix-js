<!doctype html>
<html lang="en">
    <head>
        <title>Grafix.js - Issue-19 testcase</title>
        <link rel="stylesheet" href="../css/bootstrap.min.css">
    </head>
    <body style="padding: 40px">

        <div>

            <div class="well well-small">
                <canvas id="stage" width="700px" height="400px"></canvas>
            </div>

        </div>

        <script src="../js/grafix.nocache.js"></script>
        <script>

            Grafix.import();

            var stage, grid;

            stage = Grafix.stage( '#stage').set( { color: Grafix.colors.black } );

            grid = Grafix.grid( {
                virtual: false,
                align: 'center center',
                drawStyle: 'stroke',
                color: Grafix.colors.blue
            } ).set( { size: stage.size } );

            stage = Grafix.stage( '#stage' ).set( { color: Grafix.colors.limegreen } );

            grid = Grafix.grid( {
                virtual: false,
                align: 'center center',
                drawStyle: 'stroke',
                color: Grafix.colors.blue
            } ).set( stage.size );

            stage
                .addChild( grid )
                .start( true );

        </script>

    </body>
</html>
