(function() {
	var robby = new Robot('robby', 1, '@rdad');

	robby.init = function() {
		this.direction = DOWN;
	};

	robby.update = function() {
		this.move(this.direction);
	};

	robotWalken.add_participation(robby);
})();
