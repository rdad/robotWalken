(function(ctx) {
	var rw;

	var challenge = {
		config: {
			id: 12,
			title: 'Alcatraz',
			resume: 'Visite the jails to switch off the doors<br>and escape Alcatraz.',
			max_participant: 1,
			map: {
				width: 8,
				height: 8
			}
		},

		init_map: function() {
			var w = self.config.map.width - 1,
				h = self.config.map.height - 1,
				map = [
					[0, 0, WALL, 0, 0, WALL, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0],
					[WALL, WALL, WALL, WALL, 0, WALL, WALL, WALL],
					[0, 0, 0, 0, 0, WALL, 0, 0],

					[0, 0, WALL, 0, 0, 0, 0, 0],
					[WALL, WALL, WALL, 0, WALL, WALL, WALL, WALL],
					[0, 0, 0, 0, 0, DOOR, DOOR, DOOR],
					[0, 0, WALL, 0, 0, WALL, WALL, EXIT]
				];

			build_map(map);

			rw.arena.add(BUTTON, 7, 0, self.push_button);
			rw.arena.add(BUTTON, 0, 4, self.push_button);
			rw.arena.add(BUTTON, 3, 7, self.push_button);

			this.did = 5;
			this.doors = {
				d70: 0,
				d04: 0,
				d37: 0
			};

			log('[challenge] init : Map is updated');
		},

		init_robot: function() {
			var robot = rw.robot_manager.get_robot(rw.robot_manager.get('participant')[0]);
			rw.arena.add(robot.id, 0, 0);

			log('[challenge] init : The robot is on the map');
		},

		update: function() {},

		push_button: function(robot) {
			if (self.doors['d' + robot.position.x + robot.position.y] === 1) return;
			rw.arena.graphic.animation.click_button(robot);
			const d = rw.arena.graphic.get_mesh(6, self.did);
			console.log(d);
			if (d) {
				d.visible = false;
				//rw.arena.graphic.animation.open_door(d, false);
				rw.arena.add(EMPTY, 6, self.did);
				self.did++;
				self.doors['d' + robot.position.x + robot.position.y] = 1;
			}

			log('[challenge] Robot "' + robot.name + '" action a button !');
		},

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
				rw.arena.add(l[y], x, y);
			}
		}
	}
})(robotWalken);
