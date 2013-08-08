define(
    ['./../../js/grafix.nocache.js'],
    function() {

        QUnit.module("Grafix tests");

        QUnit.test("Grafix core tests", function() {

            // Simple test of import
            var importTarget = {};
            Grafix.import(importTarget);

            QUnit.ok(
                ('ShapeBase' in importTarget) && importTarget.ShapeBase === Grafix.ShapeBase,
                'import target contains ShapeBase class'
            );

        });

    });
