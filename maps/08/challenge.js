(function(ctx){

	var rw;

	var exit_door;
	
	var challenge = {

		config: {
			id: 8,
			title: 'The forest',
			resume: 'Your robot is lost in the forest.<br>He must found the output door',
			map: {
				width: 8,
				height: 8
			}
		},

		init_map: function(){

			var w = self.config.map.width-1,
				h = self.config.map.height-1,
				j,p;

			for(j=0; j<6; j++)
	        { 
	        	p = get_new_pos(w,h);
	            rw.arena.add(WALL,p.x,p.y);          
	        }

	        for(j=0; j<3; j++)
	        { 
	        	p = get_new_pos(w,h);
	            rw.arena.add(HOLE,p.x,p.y);          
	        }

	        p = get_new_pos(w,h);
	        rw.arena.add(EXIT, p.x,p.y);

			log('[challenge] init : Map is updated');
		},

		init_robot: function(){

			var robot = rw.robot_manager.get_robot(rw.robot_manager.get('participant')[0]);
			rw.arena.add(robot.id, 0,0);

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

	function get_new_pos(w,h){

		var found = false,
			px, py;

		while(found === false){

			px = parseInt(Math.random()*w);
	        py = parseInt(Math.random()*h);

        	if(px==0 && py==0)	continue; 
        	if(rw.arena.get_map(px,py) == EMPTY){
        		found  = {x:px, y:py};
        	}
		}

		return found;
	}

})(robotWalken);