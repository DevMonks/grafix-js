<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>


<div style="width: 100%; padding: 20px; font-family: monospace; border: 1px dashed #fcc" id="frames"></div><br>
<br>
<canvas id="stage" width="800" height="500"></canvas><br>

<script src="js/grafix.nocache.js"></script>
<script>

    Grafix.import();
    var layer = new Stage( '#stage').set({ color: Color.black }),
        GameState = {
            menu: 1,
            singlePlayer: 2,
            multiPlayer: 3
        },
        state = GameState.menu,
        lastState = null,
        menu = {
            title: new Text({ string: "U-u-u-ultrapong", fontSize: '40px', fontFamily: 'helvetica', drawStyle: 'fill', color: Color.white }),
            grid: new Grid( layer.rect ),
            singlePlayerButton: new Rectangle({ name: 'singlePlayerButton' }),
            multiPlayerButton: new Rectangle,
            singlePlayerButtonText: new Text({ string: "Play Singleplayer", fontSize: '20px', fontFamily: 'helvetica', drawStyle: 'fill', color: Color.white }),
            multiPlayerButtonText: new Text({ string: "Play Multiplayer", fontSize: '20px', fontFamily: 'helvetica', drawStyle: 'fill', color: Color.white }),
        },

        // Helper
        each = function( obj, callback ) {
            for( var name in obj ) {
                callback.apply( obj[ name ] );
            }
        },
        showCollection = function( col ) {
            each( col, function() { this.show(); } );
        },
        hideCollection = function( col ) {
            each( col, function() { this.hide(); } );
        };

    menu.grid.columns = 7;
    menu.grid.rows = 7;
    menu.title.position = menu.grid.rectAt( 3, 1 );
    menu.singlePlayerButton.set( menu.grid.rectAt( 1, 3).set({ width: menu.grid.rect.width * 5 }) ).style( 'fill navy' );
    menu.multiPlayerButton.set( menu.grid.rectAt( 1, 5).set({ width: menu.grid.rect.width * 5 }) ).style( 'fill navy' );
    menu.singlePlayerButtonText.position = menu.singlePlayerButton;
    menu.multiPlayerButtonText.position = menu.multiPlayerButton;

    menu.singlePlayerButton.mouseClick( function( e ) {

        console.log( 'clickidlick' );
        state = GameState.singlePlayer;
    } ).mouseHover( function( e ) {

        this.color = 'blue';
        this.hoverAnim = this.animate( {
            y: this.y - 10,
            x: this.x - 10,
            width: this.width + 20,
            height: this.height + 20
        }, 200, Easing.easeOutElastic );
    }, function( e ) {

        this.color = 'navy';
        this.hoverAnim.stop();
    } );

    menu.multiPlayerButton.mouseClick( function( e ) {

        state = GameState.multiPlayer;
    } ).mouseHover( function( e ) {

        this.color = 'blue';
        this.hoverAnim = this.animate( {
            y: this.y - 10,
            x: this.x - 10,
            width: this.width + 20,
            height: this.height + 20
        }, 200, Easing.easeOutElastic );
    }, function( e ) {

        this.color = 'navy';
        this.hoverAnim.stop();
    } );


    var hud = {
        menuButton: new Rectangle( { width: 100, height: 30, color: Color.green, drawStyle: 'fill' } ),
        menuButtonText: new Text({ string: "To Menu", fontSize: '13px', fontFamily: 'helvetica', color: Color.white, drawStyle: 'fill' }),
        leftField: layer
                        .rect
                        .div({ width: 3 })
                        .set({ color: Color.red, drawStyle: 'stroke' }),
        rightField: layer
                        .rect
                        .div({ width: 3 })
                        .set({ color: Color.blue, drawStyle: 'stroke' }),
        pong: new Circle({ radius: 50, color: Color.brown, position: layer.center.sub( 25 ) })
    };

    hud.menuButtonText.position = hud.menuButton;

    hud.menuButton.mouseClick( function( e ) {

        state = GameState.menu;
    } ).mouseHover( function(){
        this.color = Color.lime;
    }, function() {
        this.color = Color.green;
    } );

    hud.pong.directionSpeed = 1.5;
    hud.pong.directionX = hud.pong.directionSpeed;
    hud.pong.directionY = hud.pong.directionSpeed;


    var leftPlayer = {
        bar: new Rectangle( { width: 10, height: 100, align: 'left center', color: Color.gray, drawStyle: 'fill' } )
    };

    leftPlayer.bar.isFollowing = false;
    leftPlayer.bar.x = 20;


    each( menu, function() { layer.addChild( this ); } );
    each( hud, function() { layer.addChild( this ); } );
    each( leftPlayer, function() { layer.addChild( this ); } );

    hud.leftField.alignBy( 'parent', 'left' );
    hud.rightField.alignBy( 'parent', 'right' );

    var frameCount = 0;
    layer.mouseMove( function( e ) {

        leftPlayer.bar.y = e.mouse.position.y - leftPlayer.bar.height / 2;

        if( leftPlayer.bar.top < 0 )
            leftPlayer.bar.y = 0;

        if( leftPlayer.bar.bottom > layer.size.height )
            leftPlayer.bar.y = layer.size.height - leftPlayer.bar.height;

    } ).mouseDown( function( e ) {

        if( !leftPlayer.bar.visible || leftPlayer.bar.anim ) {

            return;
        }

        leftPlayer.bar.origX = leftPlayer.bar.x;
        leftPlayer.bar.anim = leftPlayer.bar.animate( {
            x: leftPlayer.bar.x + 40
        }, {
            duration: 200,
            easing: Easing.easeOutElastic,
            completed: function() {

                leftPlayer.bar.animate( {
                    x: leftPlayer.bar.origX
                }, {
                    completed: function() {
                        leftPlayer.bar.anim = false;
                    },
                    duration: 200,
                    easing: Easing.easeOutElastic
                } );
            }
        } );
    } )

    .update( function( e ) {

        if( state !== lastState ) {

            console.log( 'Stage:update() got state changed to', state );
            lastState = state;
            switch( state ) {
                case GameState.menu:

                    showCollection( menu );
                    hideCollection( hud );
                    hideCollection( leftPlayer );
                    break;
                case GameState.singlePlayer:

                    showCollection( hud );
                    showCollection( leftPlayer );
                    hideCollection( menu );
                    break;
                case GameState.multiPlayer:

                    showCollection( hud );
                    hideCollection( menu );
                    hideCollection( leftPlayer );
                    break;
            }
        }

        if( state == GameState.singlePlayer && hud.pong.visible ) {

            var bounds = hud.pong.bounds(),
                speed = hud.pong.directionSpeed;
            if( (bounds.right + 1) >= layer.right ) {
                hud.pong.directionX = speed * -1;
            }
            else if( (bounds.left - 1) <= layer.left ) {
                hud.pong.directionX = speed;
            }
            if( (bounds.bottom + 1) >= layer.bottom ) {
                hud.pong.directionY = speed * -1;
            }
            else if( (bounds.top - 1) <= layer.top ) {
                hud.pong.directionY = speed;
            }

            hud.pong.x += hud.pong.directionX;
            hud.pong.y += hud.pong.directionY;
        }

        document.getElementById( 'frames' )
            .innerHTML = 'Frame Count: ' + ( ++frameCount ) + ', FPS: ' + this.fps() + '<br>' +
            'Mouse: (X: ' + this.input.mouse.x + ') (Y: ' + this.input.mouse.y + ')<br>' +
            //'MB0: ' + this.mouse().buttonStates[ 0 ] + ', MB1: ' + this.mouse().buttonStates[ 1 ] + ', MB2: ' + this.mouse().buttonStates[ 2 ] + '<br>' +
            'GameState: ' + state;
    } )
        .start( true );

</script>
<?php include 'includes/foot.php'; ?>
