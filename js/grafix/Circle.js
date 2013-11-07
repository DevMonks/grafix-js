var Circle = function(x, y, radius, startAngle, endAngle, clockwise) {

    Shape.call( this );

    this._radius = 0;
    this._startAngle = 0;
    this._endAngle = 360;
    this._clockwise = true;

    this._rectInstance = false;

    this.set( x, y, radius, startAngle, endAngle, clockwise );
};

Circle.prototype = Utils.extend( Shape, {

    get clone() {
        return Utils.clone( Circle, this );
    },

    /**
     * Returns an array of clone-able property names, used in the {clone} and {equals} method.
     * @return {Array}
     */
    get cloneableProperties() {
        return Shape.prototype.cloneableProperties.concat([
            'radius',
            'startAngle',
            'endAngle',
            'clockwise'
        ]);
    },

    /**
     * Returns the name of this class, usefull for type checks.
     * @returns {string}
     */
    get className() { return 'Circle'; },

    get radius() { return this.prop( 'radius' ); },
    set radius( value ) { return this.prop( 'radius', value ); },

    get startAngle() { return this.prop( 'startAngle' ); },
    set startAngle( value ) { return this.prop( 'startAngle', value ); },

    get endAngle() { return this.prop( 'endAngle' ); },
    set endAngle( value ) { return this.prop( 'endAngle', value ); },

    get clockwise() { return this.prop( 'clockwise' ); },
    set clockwise( value ) { return this.prop( 'clockwise', value ); },


    set: function(x, y, radius, startAngle, endAngle, clockwise) {

        if ( Utils.isObject( x ) ) {

            Shape.prototype.set.call( this, x, y );

            if ( x.radius ) this.radius = x.radius;
            if ( x.startAngle ) this.startAngle = x.startAngle;
            if ( x.endAngle ) this.endAngle = x.endAngle;
            if ( x.clockwise ) this.clockwise = x.clockwise;

        } else if( Utils.isUndefined( x ) === false ) {

            this.x = x;
        }

        if ( y ) this.y = y;
        if ( radius ) { this.radius = radius; }
        if ( startAngle ) { this.startAngle = startAngle; }
        if ( endAngle ) { this.endAngle = endAngle; }
        if ( clockwise ) { this.clockwise = clockwise; }

        return this;
    },

    add: function(x, y, radius, startAngle, endAngle, clockwise) {

        if ( Utils.isObject( x ) ) {
            Shape.prototype.add.call( this, x );

            if( x.radius ) this.radius += x.radius;
            if( x.startAngle ) this.startAngle += x.startAngle;
            if( x.endAngle ) this.endAngle += x.endAngle;
            if( x.clockwise ) this.clockwise += x.clockwise;
        } else {

            this.x += x;
        }

        if ( y ) {
            this.y += y;
        }
        if ( radius ) { this.radius += radius; }
        if ( startAngle ) { this.startAngle += startAngle; }
        if ( endAngle ) { this.endAngle += endAngle; }
        if ( clockwise ) { this.clockwise += clockwise; }

        return this;
    },

    sub: function(x, y, radius, startAngle, endAngle, clockwise) {

        if ( Utils.isObject( x ) ) {
            Shape.prototype.sub.call( this, x );

            if( x.radius ) this.radius -= x.radius;
            if( x.startAngle ) this.startAngle -= x.startAngle;
            if( x.endAngle ) this.endAngle -= x.endAngle;
            if( x.clockwise ) this.clockwise -= x.clockwise;
        } else {

            this.x -= x;
        }

        if ( y ) {
            this.y -= y;
        }
        if ( radius ) { this.radius -= radius; }
        if ( startAngle ) { this.startAngle -= startAngle; }
        if ( endAngle ) { this.endAngle -= endAngle; }
        if ( clockwise ) { this.clockwise -= clockwise; }

        return this;
    },

    mul: function(x, y, radius, startAngle, endAngle, clockwise) {

        if ( Utils.isObject( x ) ) {
            Shape.prototype.mul.call( this, x );

            if( x.radius ) this.radius *= x.radius;
            if( x.startAngle ) this.startAngle *= x.startAngle;
            if( x.endAngle ) this.endAngle *= x.endAngle;
            if( x.clockwise ) this.clockwise *= x.clockwise;
        } else {

            this.x *= x;
        }

        if ( y ) {
            this.y *= y;
        }
        if ( radius ) { this.radius *= radius; }
        if ( startAngle ) { this.startAngle *= startAngle; }
        if ( endAngle ) { this.endAngle *= endAngle; }
        if ( clockwise ) { this.clockwise *= clockwise; }

        return this;
    },

    div: function(x, y, radius, startAngle, endAngle, clockwise) {

        if ( Utils.isObject( x ) ) {
            Shape.prototype.div.call( this, x );

            if( x.radius ) this.radius /= x.radius;
            if( x.startAngle ) this.startAngle /= x.startAngle;
            if( x.endAngle ) this.endAngle /= x.endAngle;
            if( x.clockwise ) this.clockwise /= x.clockwise;
        } else {

            this.x /= x;
        }

        if ( y ) {
            this.y /= y;
        }
        if ( radius ) { this.radius /= radius; }
        if ( startAngle ) { this.startAngle /= startAngle; }
        if ( endAngle ) { this.endAngle /= endAngle; }
        if ( clockwise ) { this.clockwise /= clockwise; }

        return this;
    },

    empty: function() {

        Shape.prototype.empty.call( this );

        this.radius = 0;
        this.startAngle = 0;
        this.endAngle = 360;
        this.clockwise = true;

        return this;
    },

    isEmpty: function() {

        return Shape.prototype.isEmpty.call( this ) && !this.radius && !this.startAngle && this.endAngle === 360 && this.clockwise;
    },

    bounds: function() {

        if( !this._rectInstance ) {
            this._rectInstance = new Rectangle( this.x, this.y, this.radius * 2, this.radius * 2 );
        } else {
            this._rectInstance.set( { x: this.x, y: this.y, width: this.radius * 2, height: this.radius * 2 } );
        }

        return this._rectInstance;
    },

    center: function( center ) {

        center = center || {};

        if( center.x )
            this.x = center.x - this.radius;

        if( center.y )
            this.y = center.y - this.radius;

        return new Point( this.x + this.radius, this.y + this.radius );
    },

    fill: function( canvasContext ) {

        canvasContext.beginPath();
        canvasContext.arc( this.x + this.radius, this.y + this.radius, this.radius, Utils.decToRad( this.startAngle ), Utils.decToRad( this.endAngle ), !this.clockwise );
        if( this.closePath ) canvasContext.closePath();
        canvasContext.fill();
    },

    stroke: function( canvasContext ) {

        canvasContext.beginPath();
        canvasContext.arc( this.x + this.radius, this.y + this.radius, this.radius, Utils.decToRad( this.startAngle ), Utils.decToRad( this.endAngle ), !this.clockwise );
        if( this.closePath ) canvasContext.closePath();
        canvasContext.stroke();
    },

    clear: function() {

        return this.fill.apply( this, arguments );
    },

    contains: function( rect ) {

        //TODO: only checks the WHOLE circle currently, startAngle, endAngle and clockwise need to be used as well
        var center = this.center(),
            distance = rect.distanceTo ? rect.distanceTo( center ) : rect.position.distanceTo( center );

        return distance <= this.radius;
    }

} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' )
    ShortCuts.circle = function( x, y, radius, startAngle, endAngle, clockwise ) {
        
        return new Circle( x, y, radius, startAngle, endAngle, clockwise );
    };
