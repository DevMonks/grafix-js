var EventArgs = function ( args ) {
    if ( args ) {
        this._context = args.context;
        this._eventName = args.event || args.eventName;
    }
    this._time = new Date().getTime();
};

EventArgs.prototype = {
    get context() { return this._context; },
    set context( value ) { this.updateContext( value ); },

    get eventName() { return this._eventName; },
    set eventName( value ) { this.handleNotAllowedPropertyChange(); },

    get time() { return this._time; },
    set time( value ) { this.handleNotAllowedPropertyChange(); },

    updateContext: function ( newContext ) {
        this._context = newContext;
    },

    handleNotAllowedPropertyChange: function () {
        throw "Unable to change properties after initialisation. Please create a new EventArgs object instead.";
    }
};

// EventArgs for common events
EventArgs.ChangedProperty = function ( args ) {
    EventArgs.call( this, args );

    if ( args ) {
        this._propertyName = args.property;
        this._valueOld = args.oldValue || args.valueOld;
        this._valueNew = args.newValue || args.valueNew;
    }
};

// Allow inheritance to work (EventArgs.ChangedProperty instanceof EventArgs)
EventArgs.ChangedProperty.prototype = Utils.merge( new EventArgs(), {
    get property() { return this._propertyName; },
    set property( value ) { this.handleNotAllowedPropertyChange(); },

    get valueOld() { return this._valueOld; },
    set valueOld( value ) { this.handleNotAllowedPropertyChange(); },

    get valueNew() { return this._valueNew; },
    set valueNew( value ) { this.handleNotAllowedPropertyChange(); }

} );
