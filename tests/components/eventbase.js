define(
    ['./../../js/grafix.nocache.js'],
    function() {

        // Simple test object to test the scopre of events and ensure each instance has his own scopre
        var SimpleEventedObject = function () {
            Grafix.EventBase.call(this);

            this._testFlag = 0;

            this.changed( function() {
                // Increment test flag
                this._testFlag++;
            } );
        };

        SimpleEventedObject.prototype = Grafix.Utils.extend(Grafix.EventBase, {
            get testFlag() { return this.prop( 'testFlag' ); },
            set testFlag( value ) { return this.prop( 'testFlag', value ); }
        });


        // More common object to test event delegation by children
        var ChildrenEventedObject = function () {
            Grafix.EventBase.call(this);

            this._onChangeTriggerCount = 0;
            this.changed(this.onChange);

            this._child = new Grafix.Point();
            this._child.changed(new Grafix.EventHandler(this.changed, this));
        };

        ChildrenEventedObject.prototype = Grafix.Utils.extend(Grafix.EventBase, {
            get onChangeTriggerCount() { return this._onChangeTriggerCount; },

            testChangeChildrenToInvokeChanged: function() {
                this._child.set(1, 2);
            },

            onChange: function() {
                this._onChangeTriggerCount++;
            }
        });





        QUnit.module("EventBase tests");

        QUnit.test("EventBase core tests", function() {
            var emptyFunc = function() {
                    QUnit.ok(true, 'Event handler was triggered');
                },
                simpleHandler = new Grafix.EventHandler(emptyFunc, null),
                eventName = 'test-event',
                obj = new Grafix.EventBase();

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

        QUnit.test("EventBase trigger affection scope", function() {
            var obj = new SimpleEventedObject();
            var obj2 = new SimpleEventedObject();

            QUnit.equal(obj.testFlag, 0, "obj.testFlag is 0 after initialisation");
            QUnit.equal(obj2.testFlag, 0, "obj2.testFlag is 0 after initialisation");

            obj.testFlag++;
            QUnit.equal(obj.testFlag, 1, "obj.testFlag is 1 after first changed() call");
            QUnit.equal(obj2.testFlag, 0, "obj2.testFlag is still 0");

            obj.testFlag++;
            obj2.testFlag++;
            QUnit.equal(obj.testFlag, 2, "obj.testFlag is 2 after second changed() call");
            QUnit.equal(obj2.testFlag, 1, "obj2.testFlag is 1 after first changed() call");
        });

        QUnit.test("EventBase children delegation", function() {
            var obj = new ChildrenEventedObject();

            obj.testChangeChildrenToInvokeChanged();
            QUnit.equal(obj.onChangeTriggerCount, 2, "Changed x and y of child item, obj.onChange() triggered 2 times");

            obj.changed('test');
            QUnit.equal(obj.onChangeTriggerCount, 3, "obj.changed() direct invocation");
        });

    });
