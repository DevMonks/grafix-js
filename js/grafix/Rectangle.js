var Rectangle = function( x, y, width, height ) {

    Shape.call( this );

    this.set( x, y, width, height );
};

Rectangle.prototype = Utils.extend( Shape, {

    get clone() {
        
        return Utils.clone( Rectangle, this );
    },

    set: function( x, y, width, height, deep ) {
        
        Shape.prototype.set.call( this, x, y, deep );
        
        if( Utils.isUndefined( width ) === false ) {
            this.width = width;
        }

        if( Utils.isUndefined( height ) === false ) {
            this.height = height;
        }
        
        return this;
    },


    /* Calculation operations */
    add: function ( rect ) {
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
