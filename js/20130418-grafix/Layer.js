
var Layer = function() {

	this.canvas = null;
	this.canvasContext = null;
	this.autoStart = true;
	this.isUpdating = false;
	this.lastFrame = null;
	this.lastTime = new Date;
	this.maxFps = 60;
	this.lastFps = 0;
	this.currentFps = 0;
	this.lastSecond = new Date().getSeconds();
	this.updateEvent = new Event( 'layer-update', this );
	this.clearColor = false;
	this.mouseInstance = false;
	this.rectInstance = false;

	Utils.init( '!canvas maxFps clearColor autoStart', arguments, this );

	if( typeof this.canvas === 'string' )
		this.canvas = document.querySelector 
					? document.querySelector( this.canvas ) 
					: document.getElementById( this.canvas );

	if( !this.canvas.getContext )
		throw 'Unsupported browser or specified element was not a canvas';

	this.canvasContext = this.canvas.getContext( '2d' );


	//high pixel-density display optimization (e.g. Retina)
	var size = this.size();
	if ( window.devicePixelRatio && window.devicePixelRatio != 1 ) {
		this.size( size );
		this.canvasSize( size.mul( window.devicePixelRatio, window.devicePixelRatio ) );
		this.canvasContext.scale( window.devicePixelRatio, window.devicePixelRatio );
	}

	if( this.autoStart )
		this.start();
};

Layer.prototype = {
	canvasSize: function() {

		var s = Utils.init( '!width height', arguments, {} );

		if( s.width ) this.canvas.setAttribute( 'width', s.width );
		if( s.height ) this.canvas.setAttribute( 'height', s.height );

		return new Size( 
			parseInt( this.canvas.getAttribute( 'width' ) ), 
			parseInt( this.canvas.getAttribute( 'height' ) ) 
		);
	},
	size: function() {

		var s = Utils.init( '!width height', arguments, {} );

		if( s.width ) this.canvas.style.width = s.width + 'px';
		if( s.height ) this.canvas.style.height = s.height + 'px';

		return new Size(
			this.canvas.style.width !== '' ? parseInt( this.canvas.style.width ) : this.canvasSize().width,
			this.canvas.style.height !== '' ? parseInt( this.canvas.style.height ) : this.canvasSize().height
		);
	},
	rect: function() {

		if( !this.rectInstance )
			this.rectInstance = new Rectangle( this.size() );
		else
			this.rectInstance.set( this.size() );

		return this.rectInstance;
	},
	start: function( force ) {

		if( this.isUpdating && !force )
			return;

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
			this.updateEvent.bind( callback );
		else
			this.updateEvent.trigger( { 
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

			/* Drawing Logic */
			this.clear( this.clearStyle )
				.update();  //<- This should be the performance eater (If you actually do something)


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
	draw: function( shape, style ) {

		if( !shape.draw ) {
			for( var i in shape )
				if( shape[ i ].draw )
					this.draw( shape[ i ], style );
			return this;
		}

		if( typeof style === 'string' )
			shape.style = Style.parse( style, shape.style );

		shape.mouse( this.mouse() );
		shape.draw( this.canvasContext );

		return this;
	},
	clear: function( style ) {

		style = style || this.clearColor;
		var rect = this.rect();

		if( style )
			rect.draw( this.canvasContext, style + ' fill' );
		else
			this.rect().clear( this.canvasContext );

		return this;
	},
	mouse: function() {

		if( !this.mouseInstance ) {
			//activate mouse (lazy we are...)
			this.mouseInstance = new Mouse( this.canvas );
		}

		return this.mouseInstance;
	},
	fps: function( maxFps ) {

		if( maxFps )
			this.maxFps = maxFps;

		return this.lastFps;
	}
};