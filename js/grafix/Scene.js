
var Scene = function( canvas, clearStyle, maxFps ) {

	this.canvas = canvas;
	this.canvasContext = null;
	this.autoStart = true;
	this.isUpdating = false;
	this.lastFrame = null;
	this.lastTime = new Date;
	this.maxFps = maxFps || 60;
	this.lastFps = 0;
	this.currentFps = 0;
	this.lastSecond = new Date().getSeconds();

	if( typeof this.canvas === 'string' )
		this.canvas = document.querySelector 
					? document.querySelector( this.canvas ) 
					: document.getElementById( this.canvas );

	if( !this.canvas.getContext )
		throw 'Unsupported browser or specified element was not a canvas';

	this.canvasContext = this.canvas.getContext( '2d' );

    //set css size
    this.size.set( this.attributeSize );
    
	//high pixel-density display optimization (e.g. Retina)
	if( ('devicePixelRatio' in window) && window.devicePixelRatio !== 1 ) {
		this.attributeSize = this.attributeSize.mul( new Size( window.devicePixelRatio, window.devicePixelRatio ) );
		this.canvasContext.scale( window.devicePixelRatio, window.devicePixelRatio );
	}
    
    Shape.call( this );

	if( this.autoStart )
		this.start();
};

Scene.prototype = Utils.extend( Shape, {
    get attributeSize() {

		return new Size( 
			parseInt( this.canvas.getAttribute( 'width' ) ), 
			parseInt( this.canvas.getAttribute( 'height' ) ) 
		);
	},
    set attributeSize( value ) {
        
        if( value.width ) this.canvas.setAttribute( 'width', value.width );
        if( value.height ) this.canvas.setAttribute( 'height', value.height );
    },
	get size() {

		return new Size(
			this.canvas.style.width !== '' ? parseInt( this.canvas.style.width ) : this.attributeSize.width,
			this.canvas.style.height !== '' ? parseInt( this.canvas.style.height ) : this.attributeSize.height
		);
	},
    set size( value ) {

        if( value.width ) { this.canvas.style.width = value.width + 'px' };
        if( value.height ) { this.canvas.style.height = value.height + 'px' };
    },
	start: function( force ) {

		if( this.isUpdating && !force )
			return this;

		if( this.isUpdating )
			this.stop();

		this.isUpdating = true;
		this.loopFrame();

		return this;
	},
	stop: function() {

		if( this.lastFrame )
			window.cancelAnimationFrame( this.lastFrame );

		this.lastFrame = 0;
		this.lastTime = 0;
		this.isUpdating = false;

		return this;
	},
	update: function( callback ) {

		if( callback )
			this.bind( 'update', callback );
		else
            //TRIGGER: scene-update
			this.trigger( 'update', { 
				canvas: this.canvas,
				canvasContext: this.canvasContext
			} );

		return this;
	},
	loopFrame: function( timeElapsed ) {

		var layer = this;
		timeElapsed = timeElapsed || 0;

		var now = new Date;
		var delta = now - this.lastTime;
		var iv = 1000 / this.maxFps;

		if( this.maxFps >= 60 || delta > iv ) {
            
            if( !this.valid ) {
                
                this.draw(this.canvasContext);
            }

            this.update();
			var s = now.getSeconds(); //we only count FINISHED frames

			if( s !== this.lastSecond ) {

				this.lastFps = this.currentFps;
				this.currentFps = 0;
				this.lastSecond = s;
			}

			this.currentFps++;

			this.lastTime = now - ( delta % iv );
		}

		if( !this.isUpdating )
			this.stop(); //make sure this is STOPPED
		else { 

			window.requestAnimationFrame( function( timeElapsed ) {
				layer.loopFrame( timeElapsed );
			} );
		}

		return this;
	},
	fps: function( maxFps ) {

		if( maxFps )
			this.maxFps = maxFps;

		return this.lastFps;
	}
} );
