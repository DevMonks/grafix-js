
var Mouse = function( context ) {

	this.context = context || window;
	this.position = new Point;
	this.moveEvent = new Event( 'mouse-move', this );
	this.downEvent = new Event( 'mouse-button-down', this );
	this.upEvent = new Event( 'mouse-button-up', this );
	this.clickEvent = new Event( 'mouse-button-click', this );
	this.buttonStates = [];

	var mouse = this;
	this.context.addEventListener( 'mousemove', function( e ) {

		var offsetX = mouse.context.offsetLeft;
        var offsetY = mouse.context.offsetTop;
        /*if( mouse.context.parentNode && ( mouse.context.parentNode.offsetLeft > 0 || mouse.context.parentNode.offsetTop > 0 ) ) {
            
            offsetX += mouse.context.parentNode.offsetLeft;
            offsetY += mouse.context.parentNode.offsetTop;
        }*/
        
        mouse.position.set( { 
        	x: e.pageX - offsetX, 
        	y: e.pageY - offsetY 
        } );

        mouse.move();
	} );

	this.context.addEventListener( 'mouseout', function( e ) {

		mouse.move();
	} );

	this.context.addEventListener( 'mousedown', function( e ) {

		mouse.buttonStates[ e.which ] = true;

		mouse.down( e.which );
	} );

	this.context.addEventListener( 'mouseup', function( e ) {

		mouse.buttonStates[ e.which ] = false;

		mouse.up( e.which );
	} );

	this.context.addEventListener( 'click', function( e ) {

		mouse.click( e.which );
	} );
};

Mouse.prototype = {
	move: function( callback ) {

		if( Utils.isFunction( callback ) )
			this.moveEvent.bind( callback );
		else
			this.moveEvent.trigger( { 
            	mouse: this, 
            	context: this.context,
            	position: this.position
            } );

		return this;
	},
	down: function( callback ) {

		if( Utils.isFunction( callback ) )
			this.downEvent.bind( callback );
		else
			this.downEvent.trigger( { 
            	mouse: this, 
            	context: this.context,
            	position: this.position,
            	buttonStates: this.buttonStates,
            	button: callback
            } );

		return this;
	},
	up: function( callback ) {

		if( Utils.isFunction( callback ) )
			this.upEvent.bind( callback );
		else
			this.upEvent.trigger( { 
            	mouse: this, 
            	context: this.context,
            	position: this.position,
            	buttonStates: this.buttonStates,
            	button: callback
            } );

		return this;
	},
	click: function( callback ) {

		if( Utils.isFunction( callback ) )
			this.clickEvent.bind( callback );
		else
			this.clickEvent.trigger( {
				mouse: this, 
            	context: this.context,
            	position: this.position,
            	buttonStates: this.buttonStates,
            	button: callback
			} );
        
		return this;
	}
};
