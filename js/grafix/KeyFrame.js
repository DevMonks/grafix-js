
var KeyFrame = function( properties ){
    
    this._properties = properties;
    this._easing = 'easing' in properties ? properties.easing : null;
};

KeyFrame.prototype = {
    
    set: function( properties ) {
        
        for( var i in '_properties' in properties ? properties._properties : properties )
            this._properties[ i ] = properties[ i ];
        
        return this;
    },
            
    get properties() {

        return this._properties;
    },
    
    diff: function( context, endFrame, completion, easing ) {
        
        easing = this._easing || ( easing || Easing.linear );
        
        for( var i in this._properties ) {
            //@TODO: What if not all properties set in previous/next frame?
            var diff = endFrame.properties[ i ] - this._properties[ i ],
                newValue = endFrame.properties[ i ] + diff * ( easing( completion ) );

            //console.log( 'KeyFrame.diff() changed ', i, ' to ', newValue);
            context[ i ] = newValue;
        }
        
        return this;
    }
};
