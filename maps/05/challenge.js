(function(ctx) {
	var rw;

	var challenge = {
		config: {
			id: 5,
			title: 'In the field',
			resume: 'Your robot must found the moving exit door',
			max_participant: 1,
			map: {
				width: 5,
				height: 5
			}
		},

		init_map: function() {
			var w = self.config.map.width - 2,
				h = self.config.map.height - 2,
				x = parseInt(Math.random() * w) + 1,
				y = parseInt(Math.random() * h) + 1;

			rw.arena.add(EXIT, x, y);

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

	var self = challenge;
	ctx.add_module('challenge', challenge);
})(robotWalken);
