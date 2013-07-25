
var Animation = function() {

	this.context = {};
	this.properties = {};
	this.duration = 2000;
	this.easing = Easing.linear;
	this.startTime = 0;
	this.isRunning = false;
	this.originalProperties = {};
	this.lastFrame = 0;
	this.completeEvent = new Event( 'animation-finished', this );

	Utils.init( '!context properties duration easing', arguments, this );

	//copy original properties
	for( var i in this.properties ) {
		switch( i ) {
			case 'angle':
			case 'lineWidth':
			case 'miterLimit':
				if( this.context.style )
					this.originalProperties[ i ] = this.context.style[ i ];

				break;
			case 'skewX':
			case 'scaleX':
			case 'offsetX':
				if( this.context.style )
					this.originalProperties[ i ] = this.context.style[ i.substring( 0, i.length - 2 ) ].x;

				break;
			case 'skewY':
			case 'scaleY':
			case 'offsetY':
				if( this.context.style )
					this.originalProperties[ i ] = this.context.style[ i.substring( 0, i.length - 2 ) ].y;

				break;
			default:

				if( i in this.context )
					this.originalProperties[ i ] = this.context[ i ];
		}
	}
		
};

Animation.prototype = {
	start: function( force ) {

		if( this.isRunning && !this.force )
			return this;

		if( this.isRunning )
			this.stop();

		this.isRunning = true;
		this.startTime = new Date().getTime();

		this.loopFrame();

		return this;
	},
	stop: function() {

		if( !this.isRunning )
			return this;


		if( this.lastFrame )
			window.cancelAnimationFrame( this.lastFrame );

		this.isRunning = false;
		this.lastFrame = 0;
		this.lastTime = 0;

		return this;
	},
	reset: function( animateBack ) {
		
		var p = this.originalProperties;
		this.originalProperties = this.properties;
		this.properties = p;

		//no recursion pls
		this.completeEvent.callbacks = [];

		return this.start();
	},
	complete: function( callback ) {

		if( callback )
			this.completeEvent.bind( callback );
		else
			this.completeEvent.trigger( { context: this.context, originalProperties: this.originalProperties, newProperties: this.properties } );
		
		return this;
	},
	loop: function( reset ) {

		this.complete( function loop() {

			if( reset )
				this.reset().complete( loop );
			else
				this.start();
		} );

		return this;
	},
	loopFrame: function() {

		var anim = this;

		if( !this.isRunning )
			this.stop(); //make sure this is STOPPED
		else { 

			window.requestAnimationFrame( function( timeElapsed ) {
				anim.loopFrame( timeElapsed );
			} );
		}

		var percentComplete = Math.max( 0, ( new Date().getTime() - this.startTime ) ) / this.duration;

		for( var i in this.properties ) {

			var diff = this.properties[ i ] - this.originalProperties[ i ];
			var newValue = this.originalProperties[ i ] + diff * ( this.easing( percentComplete ) );

			//handle specific properties
			switch( i ) {
				case 'angle':
				case 'lineWidth':
				case 'miterLimit':
					if( this.context.style )
						this.context.style[ i ] = newValue;

					break;
				case 'skewX':
				case 'scaleX':
				case 'offsetX':
					if( this.context.style )
						this.context.style[ i.substring( 0, i.length - 2 ) ].x = newValue;

					break;
				case 'skewY':
				case 'scaleY':
				case 'offsetY':
					if( this.context.style )
						this.context.style[ i.substring( 0, i.length - 2 ) ].y = newValue;

					break;
				default:

					//TODO: Probably this needs some involvement of the original values at some point
					this.context[ i ] = newValue;
			}
		}
		
		if( percentComplete >= 1 ) {
			this.stop();
			this.complete();
		}

		return this;
	}
};
