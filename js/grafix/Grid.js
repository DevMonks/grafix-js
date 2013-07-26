var Grid = function ( x, y, width, height, columns, rows ) {
    
    
    this._columns = Grid.defaults.columns;
    this._rows = Grid.defaults.rows;
    this._virtual = Grid.defaults.virtual;
    this._rectangles = [];
    
    this.set( x, y, width, height, columns, rows );
};
Grid.defaults = {
    columns: 12,
    rows: 12,
    virtual: true
};

Grid.prototype = Utils.extend( Rectangle, {

    get columns() { return this._columns; },
    set columns( value ) {
        //TODO: invalidate
        this._columns = value;
    },
    
    get rows() { return this._rows; },
    set rows( value ) {
        //TODO: invalidate
        this._rows = value;
    },
    
    get virtual() { return this._virtual; },
    set virtual( value ) {
        //TODO: invalidate
        this._virtual = value;
    },

    set: function( x, y, width, height, columns, rows ) {
        
    
        if( Utils.isObject( x ) ) {
            
            Shape.prototype.set.call( this, x );
            
            if( x.y ) this.y = x.y;
            if( x.width ) this.width = x.width;
            if( x.height ) this.height = x.height;
            if( x.columns ) this.columns = x.columns;
            if( x.rows ) this.rows = x.rows;
            if( x.virtual ) this.virtual = x.virtual;
            
        } else if( x ) {
            
            this.x = x;
        }
        
        if( this.y ) this.y = y;
        if( this.width ) this.width = width;
        if( this.height ) this.height = height;
        if( this.columns ) this.columns = columns;
        if( this.rows ) this.rows = rows;
        
    },

    get clone() {
        return new Grid( this );
    },
            
    _rectAt: function( x, y ) {
        
        if( !this._rectangles[ y ] )
            this._rectangles[ y ] = [];
        
        
        if( !this._rectangles[ y ][ x ] ) {
            
            var rectWidth = ( this.height / this.rows ),
                rectHeight = ( this.height / this.rows );
            this._rectangles[ y ][ x ] = new Rectangle( {
                x: this.x + x * rectWidth,
                y: this.y + y * rectHeight,
                width: rectWidth,
                hegiht: rectHeight
            } );
        } else if( this.invalid !== false ) {
            
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
        
        if( typeof y !== 'undefined' ) {
            
            y = parseInt( x / this.rows );
            x = x % this.columns;
        }
        
        return this._rectAt( x, y );
    },
            
    column: function( col ) {

        var colRect = new Rectangle;
        this.eachColumnRect( col, function( rect ) {
            
            colRect.expand( rect );
        } );
        
        return colRect;
    },
            
    row: function( row ) {
        
        var rowRect = new Rectangle;
        this.eachColumnRect( row, function( rect ) {
            
            rowRect.expand( rect );
        } );
        
        return rowRect;
    },
            
    //allows any kind of points (IN THE GRID) and combines the rectangles
    //that it finds
    //Signature: combine( x1, y1, x2, y2, { x: x3, y: y3 }, x4, y4, etc. )
    combine: function() {
        
        var points = [],
            currentPoint = {};
        for( var i in arguments )
            if( Utils.isObject( arguments[ i ] ) )
                points.push( {
                    x: arguments[ i ].x || 0,
                    y: arguments[ i ].y || 0
                } );
            else if( currentPoint.x ) {
                
                currentPoint.y = arguments[ i ];
                points.push( currentPoint );
                currentPoint = {};
            } else {
                
                currentPoint.x = arguments[ i ];
            }
       
       var rect = new Rectangle;
       for( var i in points )
           rect.expand( this.rectAt( points[ i ] ) );
       
       return rect;
    },
    
    //callback signature: function( x, y, index )(Context: Rectangle)
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
            
    _draw: function( canvasContext, style ) {

        if( this.virtual ) //virtual grids dont get drawn
            return;
        
        //We don't need to draw this (The Grid), since
        //the rectangles at the sides will already define its borders
        //it would just overwrite the borders of the side rects
        var grid = this;
        this.eachRect( function( x, y, i ) {
            
            this.style( grid )[ style ]( canvasContext );
        } );
    },
            
    fill: function( canvasContext ) {

        this._draw( canvasContext, 'fill' );
    },
            
    stroke: function( canvasContext ) {

        this._draw( canvasContext, 'stroke' );
    },
    
    clear: function( canvasContext ) {

        this._draw( canvasContext, 'clear' );
    },
            
    draw: function( context, forceDraw) {
        
        //TODO: this is okay, but this will still apply the styles
        //unnessecarily. Maybe need a third "applyStyles" parameter
        //in Shape? This function exists to pass "FALSE" to it then later.
        Shape.prototype.draw.call( this, context, forceDraw );
    },
   
            
    toString: function() {
        return '{x:' + this.x + ',y:' + this.y + ',width:' + this.width + ',height:' + this.height + '}';
    }

} );

