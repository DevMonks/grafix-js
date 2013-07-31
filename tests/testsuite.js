(function () {
    QUnit.config.autostart = false;

	var testModules = [
		"components/eventobject.js",
		"components/grafix.js",
		"components/random.js",
		"components/shapebase.js",
		"components/utils.js"
	];
	
    // Resolve all testModules and then start the Test Runner.
	require(testModules, function(){
     QUnit.load();
     QUnit.start();
	});
}());

