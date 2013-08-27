var Stage = function( canvas, maxFps ) {

    Shape.call( this );

    this._canvas = canvas;
    this._canvasContext = null;
    this._autoStart = false;
    this._isUpdating = false;
    this._lastFrame = null;
    this._lastTime = new Date;
    this._maxFps = maxFps || 60;
    this._lastFps = 0;
    this._currentFps = 0;
    this._lastSecond = new Date().getSeconds();

    if( Utils.isString( this._canvas ) ) {
        this._canvas = Utils.getDomElementById( this._canvas );
    }

    if( !this._canvas ) {
        throw 'Specified element was not a selector of a canvas or a canvas dom element';
    }

    if( !( 'getContext' in this._canvas ) ) {
        throw 'Unsupported browser or specified element was not a canvas';
    }

    this._canvasContext = this._canvas.getContext( '2d' );

    // Create an input handler
    this._input = new Input( this._canvas );

    // Set css size
    this.cssSize = this.attributeSize;

    this._initializeCanvas();

    if ( this._autoStart ) {
        this.start();
    }
};

Stage.prototype = Utils.extend( Shape, {

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Stage'; },

    start: function ( force ) {
        if ( this._isUpdating && !force ) {
            return this;
        }

        if ( this._isUpdating ) {
            this.stop();
        }

        this._isUpdating = true;
        this.loopFrame();

        return this;
    },

    stop: function () {
        if ( this._lastFrame ) {
            window.cancelAnimationFrame( this._lastFrame );
        }

        this._lastFrame = 0;
        this._lastTime = 0;
        this._isUpdating = false;

        return this;
    },


    loopFrame: function ( timeElapsed ) {
        var that = this;
        timeElapsed = timeElapsed || 0;

        var now = new Date;
        var delta = now - this._lastTime;
        var iv = 1000 / this._maxFps;

        if ( this._maxFps >= 60 || delta > iv ) {

            this.draw();

            // Free informations
            if ( this.input ) {
                this.input.clear();
            }

            var s = now.getSeconds(); // we only count FINISHED frames

            if ( s !== this._lastSecond ) {
                this._lastFps = this._currentFps;
                this._currentFps = 0;
                this._lastSecond = s;
            }

            this._currentFps++;

            this._lastTime = now - ( delta % iv );
        }

        // make sure this is STOPPED
        if ( !this._isUpdating ) {
            return this.stop();
        }

        window.requestAnimationFrame( function( timeElapsed ) {
            that.loopFrame( timeElapsed );
        } );

        return this;
    },

    fps:       function ( maxFps ) {
        if ( maxFps ) {
            this._maxFps = maxFps;
        }

        return this._lastFps;
    }

} );


/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.stage = function( canvas, maxFps ) {
        
        return new Stage( canvas, maxFps );
    };
