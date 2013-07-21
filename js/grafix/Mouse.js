var Mouse = function (context)
{
    EventObject.call(this);

    this.context = context || window;
    this.position = new Point;
    this.buttonStates = [];

    var mouse = this;
    this.context.addEventListener('mousemove', function (e)
    {
        var offsetX = mouse.context.offsetLeft;
        var offsetY = mouse.context.offsetTop;
        /*if( mouse.context.parentNode && ( mouse.context.parentNode.offsetLeft > 0 || mouse.context.parentNode.offsetTop > 0 ) ) {

         offsetX += mouse.context.parentNode.offsetLeft;
         offsetY += mouse.context.parentNode.offsetTop;
         }*/

        mouse.position.set({
            x: e.pageX - offsetX,
            y: e.pageY - offsetY
        });

        mouse.move();
    });

    this.context.addEventListener('mouseout', function (e)
    {
        mouse.move();
    });

    this.context.addEventListener('mousedown', function (e)
    {
        mouse.buttonStates[e.which] = true;

        mouse.down(e.which);
    });

    this.context.addEventListener('mouseup', function (e)
    {
        mouse.buttonStates[e.which] = false;

        mouse.up(e.which);
    });

    this.context.addEventListener('click', function (e)
    {
        mouse.click(e.which);
    });
};

Mouse.prototype = Utils.extend(EventObject, {

    handleMouseEvent: function(event, callback) {
        if (Utils.isFunction(callback)) {
            return this.bind(event, callback);
        }

        var args = Utils.merge({
            mouse: this,
            context: this.context,
            position:     this.position,
            buttonStates: this.buttonStates
        }, callback || {});

        return this.trigger(event, args);
    },

    move:  function (callback)
    {
        return this.handleMouseEvent('move', callback);
    },

    down:  function (callback)
    {
        return this.handleMouseEvent('down', { button: callback });
    },

    up:    function (callback)
    {
        return this.handleMouseEvent('up', { button: callback });
    },

    click: function (callback)
    {
        return this.handleMouseEvent('click', { button: callback });
    }

});
