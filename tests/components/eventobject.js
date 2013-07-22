define(
    ['./../../js/grafix.nocache.js'],
    function() {
        console.log(Grafix);

        // Simple test object to test the scopre of events and ensure each instance has his own scopre
        var SimpleEventedObject = function () {
            Grafix.EventObject.call(this);

            this._testFlag = 0;

            this.bind('changed', function() {
                // Increment test flag
                this._testFlag++;
            });
        };

        SimpleEventedObject.prototype = Grafix.Utils.extend(Grafix.EventObject, {
            get testFlag() { return this._testFlag; },

            testInvokeOfChanged: function() {
                // Just call changed() event to trigger internal handler
                this.changed(new Grafix.EventArgs());
            }
        });


        // More common object to test event delegation by children
        var ChildrenEventedObject = function () {
            Grafix.EventObject.call(this);

            this._onChangeTriggerCount = 0;
            this.changed(this.onChange, this);

            this._child = new Grafix.Point();
            this._child.changed(this.changed, this);
        };

        ChildrenEventedObject.prototype = Grafix.Utils.extend(Grafix.EventObject, {
            get onChangeTriggerCount() { return this._onChangeTriggerCount; },

            testChangeChildrenToInvokeChanged: function() {
                this._child.set(1, 2);
            },

            onChange: function() {
                this._onChangeTriggerCount++;
            }
        });





        QUnit.module("EventObject tests");

        QUnit.test("EventObject core tests", function() {
            var emptyFunc = function() {
                    QUnit.ok(true, 'Event handler was triggered');
                },
                simpleHandler = new Grafix.EventHandler(emptyFunc, null),
                eventName = 'test-event',
                obj = new Grafix.EventObject();

            QUnit.equal(obj.eventCallbacks.length, 0, 'No callbacks after initialisation');

            // Bind the event and verify using .has()
            obj.bind(eventName, simpleHandler);
            QUnit.equal(obj.has(eventName), true, 'Object has a handler for "' + eventName + '"');

            // Try to trigger
            obj.trigger(eventName);

            // Unbind the event
            obj.unbind(eventName, simpleHandler);
            QUnit.equal(obj.has(eventName), false, 'Object\'s handler has been removed');
        });

        QUnit.test("EventObject trigger affection scopre", function() {
            var obj = new SimpleEventedObject();
            var obj2 = new SimpleEventedObject();

            QUnit.equal(obj.testFlag, 0, "obj.testFlag is 0 after initialisation");
            QUnit.equal(obj2.testFlag, 0, "obj2.testFlag is 0 after initialisation");

            obj.testInvokeOfChanged();
            QUnit.equal(obj.testFlag, 1, "obj.testFlag is 1 after first changed() call");
            QUnit.equal(obj2.testFlag, 0, "obj2.testFlag is still 0");

            obj.testInvokeOfChanged();
            obj2.testInvokeOfChanged();
            QUnit.equal(obj.testFlag, 2, "obj.testFlag is 2 after second changed() call");
            QUnit.equal(obj2.testFlag, 1, "obj2.testFlag is 1 after first changed() call");
        });

        QUnit.test("EventObject children delegation", function() {
            var obj = new ChildrenEventedObject();

            obj.testChangeChildrenToInvokeChanged();
            QUnit.equal(obj.onChangeTriggerCount, 2, "Changed x and y of child item, obj.onChange() triggered 2 times");

            obj.changed(obj.prepareChanged('test', 1, 2));
            QUnit.equal(obj.onChangeTriggerCount, 3, "obj.changed() direct invocation");
        });

    });
