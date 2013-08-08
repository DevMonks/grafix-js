define(
    ['./../../js/grafix.nocache.js'],
    function() {

        QUnit.module("Random tests");

        QUnit.test("Random core tests", function() {
            var rnd_min1_max_10 = Grafix.Random.int(1, 10),
                rnd_min01_max_1 = Grafix.Random.float(0.1, 1.);

            QUnit.ok(rnd_min1_max_10 >= 1 && rnd_min1_max_10 <= 10, 'Random.int(1, 10) is in range');
            QUnit.ok(rnd_min01_max_1 >= 0.1 && rnd_min01_max_1 <= 1., 'Random.float(0.1, 1.) is in range');

        });

    });
