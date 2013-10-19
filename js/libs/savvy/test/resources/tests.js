function runTests(){
	var frame;
	if (window.frames[0]) {
		frame = window.frames[0];
	} else {
		frame = document.getElementById("savvy-frame");
	}

	with (frame) {
		test("Global objects", function() {
			ok(typeof Savvy == "object", "Savvy");
			ok(typeof _global == "object", "_global");
			ok(typeof _screen == "object", "_screen");
		});

		test("Public objects", function() {
			ok(typeof Savvy.READY == "string", "Savvy.READY");
			ok(typeof Savvy.ENTER == "string", "Savvy.ENTER");
			ok(typeof Savvy.EXIT == "string", "Savvy.EXIT");

			ok(typeof Savvy.go == "function", "Savvy.go");

			ok(typeof Savvy.getScreen() == "object", "Savvy.getScreen");
			ok(typeof Savvy.getGlobal() == "object", "Savvy.getGlobal");

			ok(typeof Savvy.subscribe == "function", "Savvy.subscribe");
			ok(typeof Savvy.unsubscribe == "function", "Savvy.unsubscribe");

			ok(typeof Savvy.getInfo() == "object", "Savvy.getInfo");
		});

		test("Screen HTML", function() {
			ok(typeof Savvy.getGlobal().innerHTML == "string", "Global HTML");
			ok(typeof Savvy.getScreen().innerHTML == "string", "Screen HTML");
		});
		
		var screen1 = Savvy.getScreen().innerHTML;
		
		asyncTest("Screen life cycle", function() {
			Savvy.subscribe(Savvy.EXIT, function exit(){
				Savvy.unsubscribe(Savvy.EXIT, exit);
				ok(Savvy.getScreen().innerHTML == screen1, "Savvy.EXIT event");
			});
			Savvy.subscribe(Savvy.READY, function ready(){
				Savvy.unsubscribe(Savvy.READY, ready);
				ok(Savvy.getScreen().innerHTML != screen1, "Savvy.READY event");
			});
			Savvy.subscribe(Savvy.ENTER, function enter(){
				Savvy.unsubscribe(Savvy.ENTER, enter);
				ok(Savvy.getScreen().innerHTML != screen1, "Savvy.ENTER event");
				start();
			});
			Savvy.go("Settings");
		});
		
		asyncTest("Navigation back", function() {
			Savvy.subscribe(Savvy.ENTER, function enter(){
				Savvy.unsubscribe(Savvy.ENTER, enter);
				ok(Savvy.getScreen().innerHTML == screen1, "hitstory.back()");
				start();
			});
			history.back();
		});

		asyncTest("Navigation forward", function() {
			Savvy.subscribe(Savvy.ENTER, function enter(){
				Savvy.unsubscribe(Savvy.ENTER, enter);
				ok(Savvy.getScreen().innerHTML != screen1, "hitstory.forward()");
				start();
			});
			history.forward();
		});

	}
}