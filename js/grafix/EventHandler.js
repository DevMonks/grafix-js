var EventHandler = function(callback, context) {
    if (Utils.isFunction(callback) == false) {
        throw 'Callback needs to be a callable function';
    }

    this._callback = callback;
    this._context = context;
};

EventHandler.prototype = {
    get callback() { return this._callback; },
    set callback(value) { throw 'Dont change the EventHandler but create a new one instead'; },

    get context() { return this._context; },
    set context(value) { throw 'Dont change the EventHandler but create a new one instead'; },


    trigger: function(args) {
        //console.log('EventHandler.trigger() context (', this.context, ') calls: ', this.callback);
        return this.callback.call(this.context, args);
    }

};
