(function(ctx){

	var rw;
	
	var challenge = {

		config: {
			id: 4,
			title: 'Double protection',
			resume: 'Your robot must reach the exit door<br>Breaking the walls need attention !',
			max_participant: 1,
			map: {
				width: 5,
				height: 5
			}
		},

		init_map: function(){

			build_vertical_wall(1, 0, 5);
			build_vertical_wall(3, 0, 5);

			var exit_post 	= [{x:4, y:4},{x:4, y:0}];
			var i 			= (parseInt(Math.random()*100) > 50) ? 0 : 1;
			rw.arena.add(EXIT, exit_post[i].x, exit_post[i].y);

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

	function build_vertical_wall(x, y, l){

		var b = parseInt(Math.random()*5);

		for(var j=0; j<l; j++){          
	        if(j == b)	continue;
	        rw.arena.add(WALL, x,y+j);          
	    }
	}

	var self = challenge;
	ctx.add_module('challenge', challenge);

})(robotWalken);