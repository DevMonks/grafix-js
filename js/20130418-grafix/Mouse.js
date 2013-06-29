

var Mouse = function() {

	this.context = window;
	this.position = new Point();
	this.moveEvent = new Event( 'mouse-move', this );
	this.buttonDownEvent = new Event( 'mouse-button-down', this );
	this.buttonUpEvent = new Event( 'mouse-button-up', this );
	this.buttonClickEvent = new Event( 'mouse-button-click', this );
	this.buttonStates = [];

	Utils.init( 'context', arguments, this );

	var mouse = this;
	this.context.addEventListener( 'mousemove', function( e ) {

		var offsetX = mouse.context.offsetLeft;
        var offsetY = mouse.context.offsetTop;
        if( mouse.context.parentNode && ( mouse.context.parentNode.offsetLeft > 0 || mouse.context.parentNode.offsetTop > 0 ) ) {
            
            offsetX += mouse.context.parentNode.offsetLeft;
            offsetY += mouse.context.parentNode.offsetTop;
        }
        
        mouse.position.set( { 
        	x: e.pageX - offsetX, 
        	y: e.pageY - offsetY 
        } );

        mouse.move();
	} );

	this.context.addEventListener( 'mouseout', function( e ) {

		/*mouse.position.set( {
			x: -1,
			y: -1
		} );*/

		mouse.move();
	})

	this.context.addEventListener( 'mousedown', function( e ) {

		mouse.buttonStates[ e.which ] = true;

		mouse.buttonDown( e.which );
	} );

	this.context.addEventListener( 'mouseup', function( e ) {

		mouse.buttonStates[ e.which ] = false;

		mouse.buttonUp( e.which );
	} );

	this.context.addEventListener( 'click', function( e ) {

		mouse.buttonClick( e.which );
	} );
};

Mouse.prototype = {
	move: function( callback ) {

		if( typeof callback === 'function' )
			this.moveEvent.bind( callback );
		else
			this.moveEvent.trigger( { 
            	mouse: this, 
            	context: this.context,
            	position: this.position
            } );

		return this;
	},
	buttonDown: function( callback ) {

		if( typeof callback === 'function' )
			this.buttonDownEvent.bind( callback )
		else
			this.buttonDownEvent.trigger( { 
            	mouse: this, 
            	context: this.context,
            	position: this.position,
            	buttonStates: this.buttonStates,
            	button: callback
            } );

		return this;
	},
	buttonUp: function( callback ) {

		if( typeof callback === 'function' )
			this.buttonUpEvent.bind( callback )
		else
			this.buttonUpEvent.trigger( { 
            	mouse: this, 
            	context: this.context,
            	position: this.position,
            	buttonStates: this.buttonStates,
            	button: callback
            } );

		return this;
	},
	buttonClick: function( callback ) {

		if( typeof callback === 'function' )
			this.buttonClick.bind( callback )
		else
			this.buttonClickEvent.trigger( {
				mouse: this, 
            	context: this.context,
            	position: this.position,
            	buttonStates: this.buttonStates,
            	button: callback
			} );
		return this;
	}
}
