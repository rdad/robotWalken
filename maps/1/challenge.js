(function(ctx){

	var rw;

	var exit_door;
	
	var challenge = {

		config: {
			id: 1,
			title: 'Escape! I',
			resume: 'Your robot must found the output door',
			map: {
				width: 10,
				height: 10
			}
		},

		init_map: function(){

			var w = self.config.map.width-1,
				h = self.config.map.height-1,
				nb = 10, j,x,y;

			for(j=0; j<nb; j++)
	        { 
	        	x = parseInt(Math.random()*w);
	        	y = parseInt(Math.random()*h);

        		if((x==0 && y==0) || (x==w && y==0) || (x==w && y==h) || (x==0 && y==h))    continue;           
	            rw.arena.add(WALL,x,y);          
	        }

	        rw.arena.add(DOOR, parseInt(Math.random()*w),parseInt(Math.random()*h));

	        rw.arena.add(BUTTON, parseInt(Math.random()*w),parseInt(Math.random()*h));

	        exit_door = rw.arena.add(EXIT, w,h-3);

			log('[challenge] init : Map is updated');
		},

		init_robot: function(){

			var id, p, nb=0,
				w = self.config.map.width-1,
				h = self.config.map.height-1,
				start = [[0,0],[w,h],[w,0],[0,h]],
				robots = rw.robot_manager.get('list'),
				participant = rw.robot_manager.get('participant');

			for (id in robots) {
				if(participant.indexOf(parseInt(id))<0 )	continue;
				p = robots[id].position;
				p.x = start[nb][0];
				p.y = start[nb][1];
				rw.arena.add(id, p.x, p.y);
  				nb++;
			}

			log('[challenge] init : '+nb+' robot(s) are on the map');
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