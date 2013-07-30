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

    });
