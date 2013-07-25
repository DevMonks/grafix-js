
var Shape = function() {

	this.x = 0;
	this.y = 0;
	this.style = Style.parse( 'black stroke' );

	//Each shape checks the mouse for itself
	this.mouseInstance = false;
	this.mouseButtonStates = [];
	this.mouseOnState = false;
	this.mouseOnEvent = new Event( 'shape-mouse-on', this );
	this.mouseOffEvent = new Event( 'shape-mouse-off', this );
	this.mouseMoveEvent = new Event( 'shape-mouse-move', this );
	this.mouseClickEvent = new Event( 'shape-mouse-click', this );
	this.mouseDownEvent = new Event( 'shape-mouse-down', this );
	this.mouseUpEvent = new Event( 'shape-mouse-up', this );
	this.lastMouseDownPosition = false;
	this.lastMouseUpPosition = false;
	this.mouseDragEvent = new Event( 'shape-mouse-drag', this );
	this.mouseDragMoveEvent = new Event( 'shape-mouse-drag-move', this );
	this.mouseDropEvent = new Event( 'shape-mouse-drop', this );
	this.isMouseDragging = false,
	this.mouseDragLazyness = 5;
	this.id = Shape.idCounter++;
	this.pointInstance = false;
	this.sizeInstance = false;
	this.isAnimating = false;

	Utils.init( '!x y', arguments, this );
};

Shape.prototype = Utils.extend( Point, {
	point: function( point ) {

		if( !this.pointInstance ) this.pointInstance = new Point( this.x, this.y );

        if( point && point.x ) this.x = point.x;
        if( point && point.y ) this.y = point.y;

        this.pointInstance.set( this );

        return this.pointInstance;
    },
    size: function( size ) {

    	if( !this.sizeInstance ) 
    		this.sizeInstance = new Size( 
	    		( this.width || ( this.radius ? this.radius * 2 : 0 ) ),
	    		( this.height || ( this.radius ? this.radius * 2 : 0 ) ) 
	    	);

    	if( size && size.width )
    		if( this.radius )
    			this.radius = size.width / 2;
    		else if( this.width )
    			this.width = size.width;

    	if( size && size.height )
    		if( this.radius )
    			this.radius = size.height / 2;
    		else if( this.height )
    			this.height = size.height;

    	if( size && size.radius )
    		if( this.radius )
    			this.radius = size.radius;
    		else if( this.height )
    			this.height = size.radius * 2;

    	this.sizeInstance.set( 
			( this.width || ( this.radius ? this.radius * 2 : 0 ) ),
    		( this.height || ( this.radius ? this.radius * 2 : 0 ) ) 
    	);

    	return this.sizeInstance;
    },
	draw: function( canvasContext, style ) {

		if( typeof style === 'string' )
			this.style = Style.parse( style, this.style );

		if( !this.style.fillStyle in this )
			throw 'The shape doesnt support this fill style';

		this.style.use( canvasContext, function() {

			this[ this.style.fillStyle ]( canvasContext );

		}, this );

		return this;
	},
	animate: function() {

		if( this.isAnimating !== false && this.isAnimating.stop ) {
			this.isAnimating.stop();
			this.isAnimating = false;
		}

		var a = Utils.init( 'properties !duration easing complete loop', arguments, {} );

		a.duration = a.duration || 2000;
		a.easing = a.easing || Easing.linear;

		var anim = new Animation( {
			context: this,
			properties: a.properties,
			duration: a.duration,
			easing: a.easing
		} );

		this.isAnimating = anim;

		if( a.complete ) {

			anim.complete( a.complete );
		}

		if( a.loop ) {

			anim.loop();
		}

		return anim.start();
	},
	position: function( context, position ) {
        
        position = ( position || '' ).split( ' ' );
        var type = 'center';
        var xType = null;
        var yType = null;
        
        context = Utils.merge( {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }, context );

        var thisWidth = this.width || ( this.radius ? this.radius * 2 : 0 );
        var thatWidth = context.width || ( context.radius ? context.radius * 2 : 0 );
        var thisHeight = this.height || ( this.radius ? this.radius * 2 : 0 );
        var thatHeight = context.height || ( context.radius ? context.radius * 2 : 0 );
        
        for( var i in position ) {
            switch( position[ i ] ) {
                case 'center':
                    
                    if( xType !== null && yType !== null ) {
                        
                        type = 'center';
                    } else if( xType !== null ) {
                        
                        yType = 'center';
                    } else {
                        
                        xType = 'center';
                    }
                    
                    break;
                case 'left':
                case 'right':
                    
                    xType = position[ i ];
                    break;
                case 'top':
                case 'bottom':
                    
                    yType = position[ i ];
                    break;
                case 'inner':
                case 'outer':

                    type = position[ i ];
            }
        }
        
        if( !xType ) xType = 'center';
        if( !yType ) yType = 'center';
        
        //position
        switch( xType ) {
            case 'left':
                
                //position inner first
                this.x = context.x;
                
                switch( type ) {
                    case 'center':
                        
                        this.x -= thisWidth / 2;
                        break;
                    case 'outer':
                        
                        this.x -= thisWidth;
                }
                break;
            case 'right':
                
                //position outer first
                this.x = context.x + thatWidth;
                
                switch( type ) {
                    case 'center':
                        
                        this.x -= thisWidth / 2;
                        break;
                    case 'inner':
                        
                        this.x -= thisWidth;
                }
                break;
           case 'center':
               
               //position center first
               this.x = context.x + ( thatWidth / 2 ) - thisWidth / 2;
               break;
        }
        
        switch( yType ) {
            case 'top':
                
                //position inner first
                this.y = context.y;
                
                switch( type ) {
                    case 'center':
                        
                        this.y -= thisHeight/ 2;
                        break;
                    case 'outer':
                        
                        this.y -= thisHeight;
                }
                break;
            case 'bottom':
                
                //position outer first
                this.y = context.y + thatHeight;
                
                switch( type ) {
                    case 'center':
                        
                        this.y -= thisHeight / 2;
                        break;
                    case 'inner':
                        
                        this.y -= thisHeight;
                }
                break;
           case 'center':
               
               //position center first
               this.y = context.y + ( thatHeight / 2 ) - thisHeight / 2;
               break;
        }
        
        return this;
    },
	parseStyle: function( style ) {

		this.style = Style.parse( style, this.style );

		return this;
	},
	mouse: function( mouseInstance ) {

		if( !this.mouseInstance && mouseInstance ) {
			
			this.mouseInstance = mouseInstance;

			var shape = this;
			this.mouseInstance.move( function( e ) {

				if( shape.contains && shape.contains( e.position ) ) {

					shape.mouseMove();

					if( !shape.mouseOnState ) {

						shape.mouseOnState = true,
						shape.mouseOn();
					}
				} else if( shape.contains && shape.mouseOnState ) {

					shape.mouseOnState = false;
					shape.mouseOff();
				}

				var down = false;
				for( var i in shape.mouseButtonStates )
					if( shape.mouseButtonStates[ i ] )
						down = i;

				if( down !== false && shape.isMouseDragging === false ) {


					if( shape.lastMouseDownPosition.distanceTo
				     && shape.lastMouseDownPosition.distanceTo( e.position ) > ( shape.mouseDragLazyness 
				     													   ? shape.mouseDragLazyness 
				     													   : 1 ) ) {
						shape.isMouseDragging = down;
						shape.mouseDrag( down );
					}
				} else if( shape.isMouseDragging !== false ) {

					shape.mouseDragMove( down );
				}
			} );

			this.mouseInstance.buttonDown( function( e ) {

				if( shape.contains && shape.contains( e.position ) ) {

					shape.mouseDown( e.button );

					shape.mouseButtonStates[ e.button ] = true;
					shape.lastMouseDownPosition = e.position.point();
				}
			} );

			this.mouseInstance.buttonUp( function( e ) {

				shape.mouseUp( e.button );

				shape.lastMouseUpPosition = e.position.point();

				if( shape.isMouseDragging !== false ) {
					shape.mouseDrop( shape.isMouseDragging );
					shape.isMouseDragging = false;
				}

				if( shape.contains && shape.contains( e.position ) ) {

					if( shape.mouseButtonStates[ e.button ] )
						shape.mouseClick( e.button );	
				}

				shape.mouseButtonStates[ e.button ] = false;
			} );
		}

		return this.mouseInstance;
	},
	mouseMove: function( callback ) {

		if( callback )
			this.mouseMoveEvent.bind( callback );
		else
			this.mouseMoveEvent.trigger( { 
				shape: this, 
				mouse: this.mouseInstance, 
				position: this.mouseInstance.position 
			} );

		return this;
	},
	mouseOn: function( callback ) {

		if( callback )
			this.mouseOnEvent.bind( callback );
		else
			this.mouseOnEvent.trigger( { 
				shape: this, 
				mouse: this.mouseInstance, 
				position: this.mouseInstance.position 
			} );

		return this;
	},
	mouseOff: function( callback ) {

		if( callback )
			this.mouseOffEvent.bind( callback );
		else
			this.mouseOffEvent.trigger( { 
				shape: this, 
				mouse: this.mouseInstance, 
				position: this.mouseInstance.position 
			} );

		return this;
	},
	mouseHover: function( onCallback, offCallback ) {

		this.mouseOn( onCallback );
		this.mouseOff( offCallback );

		return this;
	},
	mouseDown: function( callback ) {

		if( typeof callback === 'function' )
			this.mouseDownEvent.bind( callback );
		else
			this.mouseDownEvent.trigger( { 
				shape: this, 
				mouse: this.mouseInstance, 
				position: this.mouseInstance.position,
				buttonStates: this.mouseButtonStates,
				button: callback
			} );

		return this;
	},
	mouseUp: function( callback ) {

		if( typeof callback === 'function' )
			this.mouseUpEvent.bind( callback );
		else
			this.mouseUpEvent.trigger( { 
				shape: this, 
				mouse: this.mouseInstance, 
				position: this.mouseInstance.position,
				buttonStates: this.mouseButtonStates,
				button: callback
			} );

		return this;
	},
	mouseClick: function( callback ) {

		if( typeof callback === 'function' )
			this.mouseClickEvent.bind( callback );
		else
			this.mouseClickEvent.trigger( { 
				shape: this, 
				mouse: this.mouseInstance, 
				position: this.mouseInstance.position,
				buttonStates: this.mouseButtonStates,
				button: callback
			} );

		return this;
	},
	mouseDrag: function( callback ) {

		if( typeof callback === 'function' )
			this.mouseDragEvent.bind( callback );
		else
			this.mouseDragEvent.trigger( { 
				shape: this, 
				mouse: this.mouseInstance, 
				position: this.mouseInstance.position,
				buttonStates: this.mouseButtonStates,
				button: callback
			} );

		return this;
	},
	mouseDragMove: function( callback ) {

		if( typeof callback === 'function' )
			this.mouseDragMoveEvent.bind( callback );
		else
			this.mouseDragMoveEvent.trigger( { 
				shape: this, 
				mouse: this.mouseInstance, 
				position: this.mouseInstance.position,
				buttonStates: this.mouseButtonStates,
				button: callback
			} );

		return this;
	},
	mouseDrop: function( callback ) {

		if( typeof callback === 'function' )
			this.mouseDropEvent.bind( callback );
		else
			this.mouseDropEvent.trigger( { 
				shape: this, 
				mouse: this.mouseInstance, 
				position: this.mouseInstance.position,
				buttonStates: this.mouseButtonStates,
				button: callback
			} );

		return this;
	}
} );

Shape.idCounter = 0;

