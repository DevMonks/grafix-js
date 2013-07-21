(function () {
    QUnit.config.autostart = false;

	var testModules = [
		"components/eventobject.js"
	];
	
    // Resolve all testModules and then start the Test Runner.
	require(testModules, function(){
     QUnit.load();
     QUnit.start();
	});
}());

