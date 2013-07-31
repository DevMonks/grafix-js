var Rectangle = function( x, y, width, height ) {

    Shape.call( this, x, y );

    this.set( x, y, width, height );
};

Rectangle.prototype = Utils.extend( Shape, {

    get clone() {
        
        return new Rectangle( this );
    },

    /**
     * Gets the image destination bounds (unscaled)
     * @returns {Rectangle}
     */
    get originBounds() {
        // @TODO: Maybe cache this
        return new Rectangle( this.x, this.y, this.width, this.height );
    },

    /**
     * Gets the image destination bounds (scaled)
     * @returns {Rectangle}
     */
    get bounds() {
        return this.originBounds.clone.mul( this.scale );
    },


    set: function( x, y, width, height ) {
        
        Shape.prototype.set.call( this, x, y );
        
        if( typeof width !== 'undefined' )
            this.width = width;
        
        if( typeof height !== 'undefined' )
            this.height = height;
        
        return this;
    },


    /* Calculation operations */
    add:        function ( rect ) {
        if ( Utils.isNumeric( rect ) ) {
            rect = { x: rect, y: rect, width: rect, height: rect };
        }

        if ( rect.x ) {
            this.x += rect.x;
        }
        if ( rect.y ) {
            this.y += rect.y;
        }
        if ( rect.width ) {
            this.width += rect.width;
        }
        if ( rect.height ) {
            this.height += rect.height;
        }

        return this;
    },

    sub: function ( rect ) {
        if ( Utils.isNumeric( rect ) ) {
            rect = { x: rect, y: rect, width: rect, height: rect };
        }

        if ( rect.x ) {
            this.x -= rect.x;
        }
        if ( rect.y ) {
            this.y -= rect.y;
        }
        if ( rect.width ) {
            this.width -= rect.width;
        }
        if ( rect.height ) {
            this.height -= rect.height;
        }

        return this;
    },

    mul: function ( rect ) {
        if ( Utils.isNumeric( rect ) ) {
            rect = { x: rect, y: rect, width: rect, height: rect };
        }

        if ( rect.x ) {
            this.x *= rect.x;
        }
        if ( rect.y ) {
            this.y *= rect.y;
        }
        if ( rect.width ) {
            this.width *= rect.width;
        }
        if ( rect.height ) {
            this.height *= rect.height;
        }

        return this;
    },

    div: function ( rect ) {
        if ( Utils.isNumeric( rect ) ) {
            rect = { x: rect, y: rect, width: rect, height: rect };
        }

        if ( rect.x ) {
            this.x /= rect.x;
        }
        if ( rect.y ) {
            this.y /= rect.y;
        }
        if ( rect.width ) {
            this.width /= rect.width;
        }
        if ( rect.height ) {
            this.height /= rect.height;
        }

        return this;
    }

} );

/* Add ShortCut */
if( typeof ShortCuts !== 'undefined' ) {
    ShortCuts.rect = function( x, y, width, height ) {
        
        return new Rectangle( x, y, width, height );
    };
    //Avoid confusion
    ShortCuts.rectangle = ShortCuts.rect;
}
