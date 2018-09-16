(function(ctx) {
	var rw;

	var exit_door;

	var challenge = {
		config: {
			id: 14,
			title: 'French garden',
			resume: 'Lost in a french garden<br>Your robot must found the output door',
			max_participant: 1,
			map: {
				width: 9,
				height: 9
			}
		},

		init_map: function() {
			var w = self.config.map.width - 1,
				h = self.config.map.height - 1,
				map = [
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, WALL, WALL, WALL, 0, WALL, WALL, WALL, 0],
					[0, 0, 0, WALL, 0, WALL, 0, 0, 0],
					[WALL, WALL, WALL, WALL, 0, WALL, WALL, WALL, WALL],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, WALL, WALL, WALL, 0, WALL, WALL, WALL, 0],
					[0, WALL, 0, WALL, 0, WALL, 0, WALL, 0],
					[0, WALL, 0, WALL, 0, WALL, 0, WALL, 0],
					[0, 0, 0, WALL, 0, WALL, 0, 0, 0]
				];

			build_map(map);

			const p = [[2, 2], [6, 2], [2, 6], [6, 6]];
			const id = parseInt(Math.random() * 4);

			rw.arena.add(EXIT, p[id][0], p[id][1]);

			log('[challenge] init : Map is updated');
		},

		init_robot: function() {
			var robot = rw.robot_manager.get_robot(rw.robot_manager.get('participant')[0]);
			robot.position.x = 4;
			robot.position.y = 4;
			rw.arena.add(robot.id, 4, 4);

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

	function build_map(map) {
		for (var x = 0; x < map.length; x++) {
			var l = map[x];

			for (var y = 0; y < l.length; y++) {
				rw.arena.add(l[y], y, x);
			}
		}
	}
})(robotWalken);
