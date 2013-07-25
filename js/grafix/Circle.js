var Circle = function(x, y, radius, startAngle, endAngle, clockwise) {

    Shape.call( this );

    this._x = 0;
    this._y = 0;
    this._radius = 0;
    this._startAngle = 0;
    this._endAngle = 360;
    this._clockwise = true;

    this._rectInstance = false;

    this.set( x, y, radius, startAngle, endAngle, clockwise );
};

Circle.prototype = Utils.extend( Shape, {
    get clone() {
        return new Circle( this );
    },

    get radius() { return this._radius; },
    set radius( value ) {
        this.changed( this.prepareChanged( 'radius', this._radius, value ) );
        this._radius = value;
    },

    get startAngle() { return this._startAngle; },
    set startAngle( value ) {
        this.changed( this.prepareChanged( 'startAngle', this._startAngle, value ) );
        this._startAngle = value;
    },

    get endAngle() { return this._endAngle; },
    set endAngle( value ) {
        this.changed( this.prepareChanged( 'endAngle', this._endAngle, value ) );
        this._endAngle = value;
    },

    get clockwise() { return this._clockwise; },
    set clockwise( value ) {
        this.changed( this.prepareChanged( 'clockwise', this._clockwise, value ) );
        this._clockwise = value;
    },


    set: function(x, y, radius, startAngle, endAngle, clockwise) {

        if ( Utils.isObject( x ) ) {

            Shape.prototype.set.call( this, x );

            if ( x.radius ) this.radius = x.radius;
            if ( x.startAngle ) this.startAngle = x.startAngle;
            if ( x.endAngle ) this.endAngle = x.endAngle;
            if ( x.clockwise ) this.clockwise = x.clockwise;

        } else {
            this.x = x;
        }

        if ( y ) {
            this.y = y;
        }
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

    circle: function() {

        return new Circle( {x: this.x, y: this.y, radius: this.radius, startAngle: this.startAngle, endAngle: this.endAngle, clockwise: this.clockwise} );
    },

    rect: function() {

        if( !this._rectInstance ) {
            this._rectInstance = new Rectangle( this.x, this.y, this.radius * 2, this.radius * 2 );
        }

        this._rectInstance.set( { x: this.x, y: this.y, width: this.radius * 2, height: this.radius * 2 } );

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
        var distance = rect.distanceTo ? rect.distanceTo( this.center() ) : rect.point().distanceTo( this.center() );

        return distance <= this.radius;
    }

} );

