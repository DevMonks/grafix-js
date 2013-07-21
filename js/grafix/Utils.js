var Utils = {

    merge: function (target, source)
    {
        for (var i in source) {
            target[ i ] = source[ i ];
        }

        return target;
    },

    extend: function (parent, childMethods)
    {
        var instance = new parent();
        for (var i in childMethods) {
            var desc = Object.getOwnPropertyDescriptor(childMethods, i);
            Object.defineProperty(instance, i, desc);
        }

        return instance;
    },

    isType: function (val, type)
    {
        return typeof val === type;
    },

    isString: function (val)
    {
        return Utils.isType(val, 'string');
    },

    isArray: function (val)
    {
        return Array.isArray(val);
    },

    isObject: function (val)
    {
        return Utils.isType(val, 'object');
    },

    isNumber: function (val)
    {
        return Utils.isType(val, 'number');
    },

    isNumeric: function (val)
    {
        return !isNaN(parseFloat(val)) && isFinite(val);
    },

    isFunction: function (val)
    {
        return Utils.isType(val, 'function');
    },

    isDomNode: function(o) {
        return o && (
            Utils.isObject(Node) ?
                (o instanceof Node) :
                Utils.isObject(o) && Utils.isNumber(o.nodeType) && Utils.isString(o.nodeName)
            );
    },
    
    isElement: function (o){
        return o && (
            Utils.isObject(HTMLElement) ?
                (o instanceof HTMLElement) :
                Utils.isObject(o) && o.nodeType === 1 && Utils.isString(o.nodeName)
            );
    },

    inArray: function (array, value)
    {
        if (array.indexOf) {
            return array.indexOf(value) !== -1;
        }

        for (var i = 0; i < array.length;) {
            if (array[i] === value) {
                return true;
            }
        }

        return false;
    },

    decToRad: function (dec)
    {
        return dec * Math.PI / 180;
    },

    radToDec: function (rad)
    {
        return ( rad * 180 ) / Math.PI;
    }

};
