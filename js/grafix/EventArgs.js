var EventArgs = function ( args ) {

    // Copy all properties to this instance
    Utils.merge(this, args || {});

    if (!this._time) {
        this._time = new Date().getTime();
    }
};

EventArgs.prototype = {

    get time() { return this._time; }

};
