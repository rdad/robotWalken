(function(ctx) {
	var rw;

	var challenge = {
		config: {
			id: 3,
			title: 'Small Maze',
			resume: 'Your robot must reach the exit door<br>Pay attention : the exit like to move his ass',
			max_participant: 1,
			map: {
				width: 5,
				height: 5
			}
		},

		init_map: function() {
			var map = [[0, 0, 0, WALL, 0], [WALL, WALL, 0, WALL, 0], [0, 0, 0, WALL, 0], [0, WALL, 0, 0, 0], [0, WALL, WALL, WALL, 0]];

			build_map(map);

			var exit_post = [{ x: 0, y: 4 }, { x: 4, y: 0 }];
			var i = parseInt(Math.random() * 100) > 50 ? 0 : 1;

			rw.arena.add(EXIT, exit_post[i].x, exit_post[i].y);

			log('[challenge] init : Map is updated');
		},

		init_robot: function() {
			var robot = rw.robot_manager.get_robot(rw.robot_manager.get('participant')[0]);
			rw.arena.add(robot.id, 0, 0);

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

	function build_map(map) {
		for (var x = 0; x < map.length; x++) {
			var l = map[x];

			for (var y = 0; y < l.length; y++) {
				rw.arena.add(l[y], x, y);
			}
		}
	}

	var self = challenge;
	ctx.add_module('challenge', challenge);
})(robotWalken);
