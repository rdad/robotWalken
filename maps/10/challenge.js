(function(ctx) {
	var rw;

	var challenge = {
		config: {
			id: 13,
			title: 'The corridor',
			resume: 'Found a path in this living corridor',
			max_participant: 1,
			map: {
				width: 12,
				height: 12
			}
		},

		init_map: function() {
			var w = self.config.map.width - 1,
				h = self.config.map.height - 1,
				j,
				p;

			build_wall(4);
			build_wall(8);

			for (j = 1; j < 10; j += 2) {
				p = parseInt(Math.random() * 3);
				if (p != 0) rw.arena.add(WALL, j, 5);
				if (p != 1) rw.arena.add(WALL, j, 6);
				if (p != 2) rw.arena.add(WALL, j, 7);
			}

			rw.arena.add(EXIT, 11, 6);

			log('[challenge] init : Map is updated');
		},

		init_robot: function() {
			var robot = rw.robot_manager.get_robot(rw.robot_manager.get('participant')[0]);
			robot.position.x = 0;
			robot.position.y = 6;
			rw.arena.add(robot.id, 0, 6);

			log('[challenge] init : The robot is on the map');
		},

		update: function() {},

		win: function() {
			return rw.arena.get_robot_exit();
		},

		set_handler: function(m) {
			rw = m;
		}
	};

	var self = challenge;
	ctx.add_module('challenge', challenge);

	function build_wall(y) {
		var h = self.config.map.width;

		for (j = 0; j < h; j++) {
			rw.arena.add(WALL, j, y);
		}
	}

	function get_new_pos(w, h) {
		var found = false,
			px,
			py;

		while (found === false) {
			px = parseInt(Math.random() * w);
			py = parseInt(Math.random() * h);

			if (px == 0 && py == 0) continue;
			if (rw.arena.get_map(px, py) == EMPTY) {
				found = { x: px, y: py };
			}
		}

		return found;
	}
})(robotWalken);
