(function(ctx){

	var rw;

	var exit_door;
	
	var challenge = {

		config: {
			id: 9,
			title: 'The secret door',
			resume: 'Your robot must found the secret output door',
			max_participant: 1,
			map: {
				width: 5,
				height: 5
			}
		},

		init_map: function(){

			var w = self.config.map.width-1,
				h = self.config.map.height-1,
				map = [
				[0,0,WALL, 0,0],
				[WALL,0,WALL,WALL,0],
				[0,0,WALL,0,0],
				[0,WALL,WALL,0,WALL],
				[0,0,WALL,0,0]
			];

			build_map(map);

			rw.arena.add(BUTTON, 0,1, self.push_button);

			log('[challenge] init : Map is updated');
		},

		init_robot: function(){

			var robot = rw.robot_manager.get_robot(rw.robot_manager.get('participant')[0]);
			rw.arena.add(robot.id, 0, 0);

			log('[challenge] init : The robot is on the map');
		},

		update: function(){

		},

		win: function(){
			
			return rw.arena.get_robot_exit();
		},

		set_handler: function(m){
			rw = m;
		},
	};

	var self 			= challenge;
	ctx.add_module('challenge', challenge);

	function build_map(map){

		for(var x = 0; x<map.length; x++){

			var l  = map[x];

			for(var y = 0; y<l.length; y++){
				rw.arena.add(l[y], x,y);
			}
		}
	}

	function get_new_pos(w,h){

		var found = false,
			px, py;

		while(found === false){

			px = parseInt(Math.random()*w);
	        py = parseInt(Math.random()*h);

        	if(px==2 && py==2)	continue; 
        	if(rw.arena.get_map(px,py) == EMPTY){
        		found  = {x:px, y:py};
        	}
		}

		return found;
	}

})(robotWalken);