var Grid = function ( x, y, width, height, columns, rows ) {

    Rectangle.call( this );
    
    this._columns = Grid.defaults.columns;
    this._rows = Grid.defaults.rows;
    this._virtual = Grid.defaults.virtual;
    this._rectangles = [];
    this._allowIndividualStyles = Grid.defaults.allowIndividualStyles;
    
    this.set( x, y, width, height, columns, rows );
};
Grid.defaults = {
    columns: 12,
    rows: 12,
    virtual: true,
    allowIndividualStyles: false
};

Grid.prototype = Utils.extend( Rectangle, {

    get clone() {

        return Utils.clone( Grid, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return Rectangle.prototype.cloneableProperties.concat([
            'columns',
            'rows',
            'virtual',
            'allowIndividualStyles'
        ]);
    },

    get columns() { return this.prop( 'columns' ); },
    set columns( value ) { return this.prop( 'columns', value ); },

    get rows() { return this.prop( 'rows' ); },
    set rows( value ) { return this.prop( 'rows', value ); },

    get virtual() { return this.prop( 'virtual' ); },
    set virtual( value ) { return this.prop( 'virtual', value ); },

    get allowIndividualStyles() { return this.prop( 'allowIndividualStyles' ); },
    set allowIndividualStyles( value ) { return this.prop( 'allowIndividualStyles', value ); },

    set: function( x, y, width, height, columns, rows ) {
        
        Rectangle.prototype.set.call( this, x, y, width, height );

        if( Utils.isObject( x ) ) {
            
            if( 'columns' in x ) this.columns = x.columns;
            if( 'rows' in x ) this.rows = x.rows;
            if( 'virtual' in x ) this.virtual = x.virtual;
            if( 'allowIndividualStyles' in x ) this.allowIndividualStyles = x.allowIndividualStyles;
        }

        if( Utils.isUndefined( columns ) === false )
            this.columns = columns;

        if( Utils.isUndefined( rows ) === false )
            this.rows = rows;
        
        return this;
    },
            
    _rectAt: function( x, y ) {
        
        if( !this._rectangles[ y ] ) {
            this._rectangles[ y ] = [];
        }


        var rectWidth, rectHeight;
        
        if( !this._rectangles[ y ][ x ] ) {
            
            rectWidth = this.width / this.columns;
            rectHeight = this.height / this.rows;
            
            this._rectangles[ y ][ x ] = new Rectangle( {
                x: this.x + x * rectWidth,
                y: this.y + y * rectHeight,
                width: rectWidth,
                height: rectHeight
            } );
        } else if( this.invalid !== false ) {
            
            rectWidth = this.width / this.columns;
            rectHeight = this.height / this.rows;

            this._rectangles[ y ][ x ].set( {
                x: this.x + x * rectWidth,
                y: this.y + y * rectHeight,
                width: rectWidth,
                height: rectHeight
            } );
        }
        
        return this._rectangles[ y ][ x ];
    },
    
    rectAt: function( x, y ) {

        if( Utils.isObject( x ) ) {
            
            if( x.y ) y = x.y;
            
            if( x.index ) x = x.index;
            else if( x.x ) x = x.x;
        }
        
        if( typeof y === 'undefined' ) {
            
            y = parseInt( x / this.rows );
            x = x % this.columns;
        }
        
        return this._rectAt( x, y );
    },
            
    column: function( col ) {

        var colRect = null;
        this.eachColumnRect( col, function( x, y ) {
           
            if( !colRect )
                colRect = new Rectangle( { size: this.size, position: this.position } );
            else
                colRect.expand( this );
        } );
        
        return colRect;
    },
            
    row: function( row ) {
        
        var rowRect = null;
        this.eachRowRect( row, function( x, y ) {
            
            if( !rowRect )
                rowRect =  new Rectangle( { size: this.size, position: this.position } );
            else
                rowRect.expand( this );
        } );
        
        return rowRect;
    },
            
    // allows any kind of points (IN THE GRID) and combines the rectangles that it finds
    // Signature: combine( x1, y1, x2, y2, { x: x3, y: y3 }, x4, y4, etc. )
    combine: function() {
        
        var points = [],
            currentPoint = {};
        for( var i in arguments ) {
            if( Utils.isObject( arguments[ i ] ) ) {
                points.push( {
                    x: arguments[ i ].x || 0,
                    y: arguments[ i ].y || 0
                } );
            } else if( currentPoint.x ) {
                
                currentPoint.y = arguments[ i ];
                points.push( currentPoint );
                currentPoint = {};
            } else {
                
                currentPoint.x = arguments[ i ];
            }
        }
       
        var rect = null;
        for( var i in points ) {
           
            var currentRect = this.rectAt( points[ i ] );
            if( !rect )
                rect = new Rectangle( { size: currentRect.size, position: currentRect.position } );
            else
                rect.expand( currentRect );
        }
       
        return rect;
    },
    
    // callback signature: function( x, y, index )(Context: Rectangle)
    eachRect: function( callback ) {
        
        for( var y = 0; y < this.rows; y++ )
            for( var x = 0; x < this.columns; x++ )
                callback.call( this.rectAt( x, y ), x, y, y * this.rows + x );
        
        return this;
    },
            
    eachRowRect: function( row, callback ) {

        if( row >= this.rows )
            throw 'Row' + row + ' doesnt exist in a grid with ' + this.rows + ' rows';
        
        for( var x = 0; x < this.columns; x++ )
            callback.call( this.rectAt( x, row ), x, row, row * this.rows + x );
        
        return this;
    },
            
    eachColumnRect: function( column, callback ) {

        if( column >= this.column )
            throw 'Column' + column + ' doesnt exist in a grid with ' + this.column + ' column';
        
        for( var y = 0; y < this.rows; y++ )
            callback.call( this.rectAt( column, y ), column, y, y * this.rows + column );
        
        return this;
    },

    /**
     * Draw all {Rectangle}'s using {this.drawStyle} or, if {allowIndividualStyles} is true, using {Rectangle]'s
     * {drawStyle}.
     *
     * @param canvasContext
     * @private
     */
    _drawGrid: function( canvasContext ) {
        
        if( this.virtual ) //virtual grids dont get drawn
            return;
        
        // We don't need to draw this (The Grid), since
        // the rectangles at the sides will already define its borders
        // it would just overwrite the borders of the side rects
        var grid = this;
        this.eachRect( function( x, y, i ) {

            // Note: {this} is an instance of {Rectangle}

            // @TODO: Apply styles in _rectAt()
            if( !grid.allowIndividualStyles ) {
                this.style( grid );
            }

            // Just call normal draw on the rectangle
            this._draw( canvasContext );
        } );
    },
            
    fill: function( canvasContext ) {

        this._drawGrid( canvasContext );
    },
            
    stroke: function( canvasContext ) {

        this._drawGrid( canvasContext );
    },
    
    clear: function( canvasContext ) {

        this._drawGrid( canvasContext );
    },
            
    _draw: function( context, config ) {

        // Let the base class do its magic
        Shape.prototype._draw.call( this, context, config );
    },
   
            
    toString: function() {
        return '{x:' + this.x + ',y:' + this.y + ',width:' + this.width + ',height:' + this.height + '}';
    }

} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.grid = function( x, y, width, height, columns, rows ) {
        
        return new Grid( x, y, width, height, columns, rows );
    };
