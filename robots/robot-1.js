(function() {
	var robby = new Robot('robby', 1, '@rdad');

	robby.init = function() {
		this.dir = [DOWN, RIGHT, DOWN, DOWN, DOWN, LEFT, RIGHT, DOWN, DOWN, DOWN, LEFT];
		//this.dir = [DOWN, RIGHT, DOWN, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT, LEFT];
		this.v = 0;
	};

	robby.update = function() {
		this.move(this.dir[this.v]);
		this.v++;
	};

	robotWalken.add_participation(robby);
})();
