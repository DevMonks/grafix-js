define(
    ['./../../js/grafix.nocache.js'],
    function() {

        QUnit.module("Utils tests");

        QUnit.test("Utils.merge tests", function() {
            var source = {
                    member: 'value'
                },
                extension = {
                    ext: 'success'
                },
                mergedObject = Grafix.Utils.merge(source, extension);

            QUnit.ok( ('member' in mergedObject) && mergedObject.member === source.member, 'Merged object contains source members');
            QUnit.ok( ('ext' in mergedObject) && mergedObject.ext === extension.ext, 'Merged object contains extension members');
            QUnit.ok( ('ext' in source), 'Source object dos contain extension members');
            QUnit.ok( !('member' in extension), 'Extension object dos not contain source members');

        });

        QUnit.test("Utils.uid tests", function() {
            var id1 = Grafix.Utils.getUid(),
                id2 = Grafix.Utils.getUid(),
                id3 = Grafix.Utils.getUid();

            QUnit.ok(id1 !== id2, 'Id1 it not equal id2');
            QUnit.ok(id2 !== id3, 'Id2 it not equal id3');
            QUnit.ok(id1 !== id3, 'Id1 it not equal id3');

        });

    });
