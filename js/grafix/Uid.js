var Uid = {
    _currentId: 0,

    create: function() {
        return ++Uid._currentId;
    }

};
