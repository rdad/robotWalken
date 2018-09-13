(function(ctx) {
	var rw;

	var door_pos;

	var challenge = {
		config: {
			id: 4,
			title: 'The Tower',
			resume: 'You must enter the tower but the door is locked.<br>Action the button to open the door<br>Beware the dead holes',
			max_participant: 4,
			map: {
				width: 13,
				height: 13
			}
		},

		init_map: function() {
			var w = self.config.map.width - 1,
				h = self.config.map.height - 1,
				nbh = 8,
				j,
				x = 4,
				y;

			// Walls

			build_horizontal_wall(4, 4, 5);
			build_horizontal_wall(4, 8, 5);

			build_vertical_wall(4, 5, 3);
			build_vertical_wall(8, 5, 3);

			// Exit
			rw.arena.add(EXIT, 6, 6);

			// Door
			var pd = [[4, 6], [6, 4], [6, 8], [8, 6]];
			door_pos = pd[parseInt(Math.random() * pd.length)];

			rw.arena.add(DOOR, door_pos[0], door_pos[1], self.action_button);

			var we_have_button = false;
			while (!we_have_button) {
				x = parseInt(Math.random() * w);
				y = parseInt(Math.random() * h);
				if (x >= 4 && x <= 8 && y >= 4 && y <= 8) {
				} else {
					rw.arena.add(BUTTON, x, y, self.push_button);
					we_have_button = true;
				}
			}

			// random Holes

			for (j = 0; j < nbh; j++) {
				x = parseInt(Math.random() * w);
				y = parseInt(Math.random() * h);

				if ((x == 0 && y == 0) || (x == w && y == 0) || (x == w && y == h) || (x == 0 && y == h)) continue;
				if (x >= 4 && x <= 8 && y >= 4 && y <= 8) continue;
				if (rw.arena.get_map(x, y) == EMPTY) rw.arena.add(HOLE, x, y);
			}

			log('[challenge] init : Map is updated');
		},

		init_robot: function() {
			var id,
				p,
				nb = 0,
				w = self.config.map.width - 1,
				h = self.config.map.height - 1,
				start = [[0, 0], [w, h], [w, 0], [0, h]],
				robots = rw.robot_manager.get('list'),
				participant = rw.robot_manager.get('participant');

			for (id in robots) {
				if (participant.indexOf(parseInt(id)) < 0) continue;

				p = robots[id].position;
				p.x = start[nb][0];
				p.y = start[nb][1];

				rw.arena.add(id, p.x, p.y);
				nb++;
			}

			log('[challenge] init : ' + nb + ' robot(s) are on the map');
		},

		update: function() {},

		win: function() {
			return false;
		},

		set_handler: function(m) {
			rw = m;
		},

		push_button: function(robot) {
			rw.arena.graphic.animation.click_button(robot);
			var d = rw.arena.graphic.get_mesh(door_pos[0], door_pos[1]);

			if (d) {
				rw.arena.graphic.animation.open_door(d);
				rw.arena.add(EMPTY, door_pos[0], door_pos[1]);
			}

			log('[challenge] Robot "' + robot.name + '" action a button !');
		}
	};

	var self = challenge;
	ctx.add_module('challenge', challenge);

	function build_horizontal_wall(x, y, l) {
		for (var j = 0; j < l; j++) {
			rw.arena.add(WALL, x + j, y);
		}
	}

	function build_vertical_wall(x, y, l) {
		for (var j = 0; j < l; j++) {
			rw.arena.add(WALL, x, y + j);
		}
	}
})(robotWalken);
