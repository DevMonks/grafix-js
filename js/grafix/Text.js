var Text = function( string, x, y, width, height ) {
	Rectangle.call( this );

	this._string = '';
    this._textAlign = Text.defaults.textAlign;
    this._textBaseLine = Text.defaults.textBaseLine;
    this._lineHeight = Text.defaults.lineHeight;
    this._fontFamily = Text.defaults.fontFamily;
    this._fontWeight = Text.defaults.fontWeight;
    this._fontVariant = Text.defaults.fontVariant;
    this._fontStyle = Text.defaults.fontStyle;
    this._fontSize = Text.defaults.fontSize;
    
    this.set( string, x, y, width, height );
};
Text.defaults = {
    textAligns: [ 'left', 'center', 'right' ],
    textAlign: 'left',
    textBaseLines: [ 'top', 'middle', 'bottom', 'alphabetic', 'hanging' ],
    textBaseLine: 'top',
    lineHeight: 14,
    fontFamilies: [ 'arial', 'helvetica' ],
    fontFamily: 'helvetica',
    fontWeights: [ 'bold', 'bolder', 'normal', 'light', 'lighter' ],
    fontWeight: 'normal',
    fontVariants: [ 'normal', 'small-caps' ],
    fontVariant: 'normal',
    fontStyles: [ 'normal', 'italic', 'oblique' ],
    fontStyle: 'normal',
    fontSize: '12px'
};

Text.prototype = Utils.extend( Rectangle, {
    
    get clone() {
        return Utils.clone( Text, this );
    },
    
    get string() { return this.prop( 'string' ); },
    set string( value ) { return this.prop( 'string', value ); },

    get textAlign() { return this.prop( 'textAlign' ); },
    set textAlign( value ) { return this.prop( 'textAlign', value ); },

    get textBaseLine() { return this.prop( 'textBaseLine' ); },
    set textBaseLine( value ) { return this.prop( 'textBaseLine', value ); },

    get lineHeight() { return this.prop( 'lineHeight' ); },
    set lineHeight( value ) { return this.prop( 'lineHeight', value ); },

    get fontFamily() { return this.prop( 'fontFamily' ); },
    set fontFamily( value ) { return this.prop( 'fontFamily', value ); },

    get fontWeight() { return this.prop( 'fontWeight' ); },
    set fontWeight( value ) { return this.prop( 'fontWeight', value ); },

    get fontVariant() { return this.prop( 'fontVariant' ); },
    set fontVariant( value ) { return this.prop( 'fontVariant', value ); },

    get fontStyle() { return this.prop( 'fontStyle' ); },
    set fontStyle( value ) { return this.prop( 'fontStyle', value ); },

    get fontSize() { return this.prop( 'fontSize' ); },
    set fontSize( value ) { return this.prop( 'fontSize', value ); },
    
    set: function( string, x, y, width, height ) {
        
        if( Utils.isObject( string ) ) {
            
            Rectangle.prototype.set.call( this, string );
            
            if( 'string' in string )
                this.string = string.string;
            
            if( 'textAlign' in string )
                this.textAlign = string.textAlign;
            
            if( 'textBaseLine' in string )
                this.textBaseLine = string.textBaseLine;
            
            if( 'lineHeight' in string )
                this.lineHeight = string.lineHeight;
            
            if( 'fontFamily' in string )
                this.fontFamily = string.fontFamily;
            
            if( 'fontWeight' in string )
                this.fontWeight = string.fontWeight;
            
            if( 'fontVariant' in string )
                this.fontVariant = string.fontVariant;
            
            if( 'fontStyle' in string )
                this.fontStyle = string.fontStyle;
            
            if( 'fontSize' in string )
                this.fontSize = string.fontSize;
            
        } else if( typeof string !== 'undefined' )
            this.string = string;
        
        if( typeof x !== 'undefined' )
            this.x = x;
        
        if( typeof y !== 'undefined' )
            this.y = y;
        
        if( typeof width !== 'undefined' )
            this.width = width;
        
        if( typeof height !== 'undefined' )
            this.height = height;
        
        return this;
    },

	measure: function( canvasContext, string, applyStyles ) {

        canvasContext = canvasContext || this.context;

		if( applyStyles ) {
            
            canvasContext.save();
            this.applyStyles( canvasContext );
        }
        
        var s = new Size( { height: this.fontSize } ),
            bounds = canvasContext.measureText( string || this.string );
        
        if( 'width' in bounds )
            s.width = bounds.width;
        
        if( 'height' in bounds )
            s.height = bounds.height;
        
        if( applyStyles )
            canvasContext.restore();
		

		return bounds;
	},

    applyStyles: function( canvasContext ) {
        
        if( !canvasContext )
            canvasContext = this.canvasContext;
        
        var fontProps = [];
        
        if( this.fontStyle !== 'normal' )
            fontProps.push( this.fontStyle );
        
        if( this.fontWeight !== 'normal' )
            fontProps.push( this.fontWeight );
        
        fontProps.push( this.fontSize );
        fontProps.push( this.fontFamily );
        
        var font = fontProps.join( ' ' );
        
        if( canvasContext.font !== font )
            canvasContext.font = font;
        
        //This fucks up our custom alignment (which listens to the same values)
        //if( canvasContext.textAlign !== this.textAlign )
            //canvasContext.textAlign = this.textAlign;
        
        if( canvasContext.textBaseline !== this.textBaseLine )
            canvasContext.textBaseline = this.textBaseLine;
        
        return Rectangle.prototype.applyStyles.call( this, canvasContext );
    },

    _drawText: function( canvasContext, string, style ) {
        
        string = string || this.string;
        
        canvasContext.save();
        this.applyStyles( canvasContext );
        
		// Draw each line
        var lines = ( string + '' ).split( '\n' );
        for( var i in lines ) {
            
            var line = lines[ i ],
                textRect = new Rectangle( this.measure( canvasContext, line, false ) ),
                lineRect = new Rectangle( 
                    this.x, 
                    this.y + ( i * this.lineHeight ), 
                    this.width, 
                    this.lineHeight 
                );
                    
            textRect.alignBy( lineRect, [ this.textAlign, this.textBaseLine, 'inner' ].join( ' ' )  );
                        
            canvasContext[ style + 'Text' ]( line, textRect.x, textRect.y );

            console.log('drawText(', i, ') textRect:', textRect.toString(), ', lineRect:', lineRect.toString());
        }
        
        canvasContext.restore();

		return this;
    },

    fill: function( canvasContext, string ) {
        
        return this._drawText( canvasContext, string, 'fill' );
    },

    stroke: function( canvasContext, string ) {
        
        return this._drawText( canvasContext, string, 'stroke' );
    },

    clear: function( canvasContext, string ) {

        if( this.parent ) {
            this.color = this.parent.color;
        }
        
        return this._drawText( canvasContext, string, 'fill' );
    }
} );
