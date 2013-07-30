define(
    ['./../../js/grafix.nocache.js'],
    function() {

        QUnit.module("Uid tests");

        QUnit.test("Uid core tests", function() {
            var id1 = Grafix.Uid.create(),
                id2 = Grafix.Uid.create(),
                id3 = Grafix.Uid.create();

            QUnit.ok(id1 !== id2, 'Id1 it not equal id2');
            QUnit.ok(id2 !== id3, 'Id2 it not equal id3');
            QUnit.ok(id1 !== id3, 'Id1 it not equal id3');

        });

    });
