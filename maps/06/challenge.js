(function(ctx){

	var rw;
	
	var challenge = {

		config: {
			id: 6,
			title: 'Minefield',
			resume: 'Your robot must found the exit door<br>Avoid deadly holes !',
			max_participant: 1,
			map: {
				width: 5,
				height: 5
			}
		},

		init_map: function(){

			var w = self.config.map.width-1,
				h = self.config.map.height-1,
	        	x = parseInt(Math.random()*(w-1))+1,
	        	y = parseInt(Math.random()*(h-1))+1;

	        rw.arena.add(EXIT, x,y);

	        // holes

	        var nb_hole = 4;

			while(nb_hole>0)
	        {
	        	y = parseInt(Math.random()*h);   	
	        	x = parseInt(Math.random()*w);
	        	if(rw.arena.get_map(x,y) == EMPTY){
	        		rw.arena.add(HOLE,x,y);	
	        		nb_hole--;
	        	}        		       
	        }

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

})(robotWalken);