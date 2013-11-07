
var Animation = function( context, keyFrames, duration, easing ) {

    EventBase.call( this );
    
    this._keyFrames = [];
    this._context = null;
    this._duration = Animation.defaults.duration;
    this._easing = Animation.defaults.easing;
    this._iv = null;
    this._startTime = null;
    
    this.set( context, keyFrames, duration, easing );
};

Animation.defaults = {
    duration: 2000,
    easing: Easing.linear
};

Animation.prototype = Utils.extend( EventBase, {

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Animation'; },
    
    set: function( context, keyFrames, duration, easing ) {
        
        if( context )
            this._context = context;
        
        if( Utils.isObject( keyFrames ) ) {
            
            var wasKeyFrameCollection = false;
            for( var i in keyFrames ) {
                
                if( Utils.isNumeric( i ) ) {
                    this._keyFrames[ parseInt( i ) ] = new KeyFrame( keyFrames[ i ] );
                    wasKeyFrameCollection = true;
                } else if( Utils.inArray( i, [ 'from', 'start', 'first' ] ) ) {
                    this._keyFrames[ 0 ] = new KeyFrame( keyFrames[ i ] );
                    wasKeyFrameCollection = true;
                } else if( Utils.inArray( i, [ 'to', 'end', 'last' ] ) ) {
                    this._keyFrames[ 100 ] = new KeyFrame( keyFrames[ i ] );
                    wasKeyFrameCollection = true;
                }
            }
            
            if( !wasKeyFrameCollection ) {
                
                //assume this is the last keyframe with its properties
                this._keyFrames[ 100 ] = new KeyFrame( keyFrames );
                //calculate the first keyframe
                var first = {};
                for( var i in keyFrames )
                    first[ i ] = this._context[ i ];
                
                this._keyFrames[ 0 ] = new KeyFrame( first );
            }
        }
        
        if( Utils.isObject( duration ) ) {
            
            if( 'duration' in duration )
                this._duration = duration.duration;
            
            if( 'easing' in duration )
                this._easing = duration.easing;

            if( 'parent' in duration )
                this.parent = duration.parent;
            
            if( 'start' in duration )
                this.start( duration.start );
            
            if( 'started' in duration )
                this.started( duration.started );
            
            if( 'stop' in duration )
                this.stop( duration.stop );
            
            if( 'stopped' in duration )
                this.stopped( duration.stopped );
            
            if( 'pause' in duration )
                this.pause( duration.pause );
            
            if( 'paused' in duration )
                this.paused( duration.paused );
            
            if( 'resume' in duration )
                this.resume( duration.resume );
            
            if( 'resumed' in duration )
                this.resumed( duration.resumed );

            if( 'completed' in duration )
                this.completed( duration.completed );
            
        } else if( typeof duration !== 'undefined' )
            this._duration = duration;
        
        if( typeof easing !== 'undefined' )
            this._easing = easing;
        
        return this;
    },
            
    _loop: function( timeElapsed ) {
        
        if( !this._iv && typeof timeElapsed !== 'undefined' )
			return;
        
        var anim = this;
        this._iv = window.requestAnimationFrame( function( timeElapsed ) {
            
            anim._loop( timeElapsed );
        } );

		var completion = Math.max( 0, ( new Date().getTime() - this._startTime ) ) / this._duration;
        //var diff = this._properties[ i ] - this.originalProperties[ i ];
        //var newValue = this.originalProperties[ i ] + diff * ( this.easing( percentComplete ) );
        
        var previousStartFrame, startFrame, endFrame;
        for( var i in this._keyFrames ) {
            
            if( i > Math.floor( completion * 100 ) ) {
                
                endFrame = this._keyFrames[ i ];
                break;
            }
            
            previousStartFrame = startFrame;
            startFrame = this._keyFrames[ i ];
        }
        
        if( !endFrame ) {
            
            startFrame = previousStartFrame;
            endFrame = startFrame;
        }
        
        startFrame.diff( this._context, endFrame, completion, this._easing );
		
		if( completion >= 1 ) {
            
			this.stop();
			this.completed();
		}
    },
    
    start: function( args ) {
        
        if( Utils.isBindable( args ) )
            this.on( 'start', args );
        
        if( this._iv )
            return this;
        
        this.on( 'start', { animation: this, context: this._context } );
        this._startTime = new Date().getTime();
        this._loop();
        
        this.on( 'started', { animation: this, context: this._context } );
        
        return this;
    },
            
    started: function( args ) {
        
        return this.on( 'started', args );
    },
            
    stop: function( args ) {

        if( Utils.isBindable( args ) )
            this.on( 'stop', args );
        
        if( !this._iv )
            return this;
        
        this.on( 'stop', { animation: this, context: this._context } );
        window.cancelAnimationFrame( this._iv );
        this._startTime = null;
        this.on( 'stopped', { animation: this, context: this._context } );
        
        return this;
    },
    
    stopped: function( args ) {
        
        return this.on( 'stopped', args );
    },
            
    pause: function( args ) {

        if( Utils.isBindable( args ) )
            this.on( 'pause', args );
        
        if( !this._iv )
            return this;
        
        this.on( 'pause', { animation: this, context: this._context } );
        window.cancelAnimationFrame( this._iv );
        this.on( 'paused', { animation: this, context: this._context } );
        
        return this;
    },
            
    paused: function( args ) {

        return this.on( 'paused', args );
    },
            
    resume: function( args ) {
        
        if( Utils.isBindable( args ) )
            this.on( 'resume', args );
        
        if( this._iv )
            return this;
        
        this.trigger( 'resume', { animation: this, context: this._context } );
        this._loop();
        
        this.trigger( 'resumed', { animation: this, context: this._context } );
        
        return this;
    },
            
    resumed: function( args ) {
        
        return this.on( 'resumed', args );
    },
            
    completed: function( args ) {

        //console.log( 'Animation::completed: trigger callbacks:', this._eventCallbacks[ 'completed' ] );
        return this.on( 'completed', args );
    }

} );
