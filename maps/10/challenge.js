(function(ctx){

	var rw;
	
	var challenge = {

		config: {
			id: 2,
			title: 'Escape! II',
			resume: 'Your robot must found the output door',
			max_participant: 1,
			map: {
				width: 20,
				height: 20
			}
		},

		init_map: function(){

			var w = self.config.map.width-1,
				h = self.config.map.height-1,
				nb = 4, j,x = 4,y;

			for(j=0; j<nb; j++)
	        {
	        	y = parseInt(Math.random()*h); 
	        	build_wall(x,y); 
	        	x = x+parseInt(Math.random()*3)+2;
	        		       
	        }

	        rw.arena.add(DOOR,w,parseInt(Math.random()*h));


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
			return false;
		},

		set_handler: function(m){
			rw = m;
		},
	};

	var self 			= challenge;
	ctx.add_module('challenge', challenge);

	function build_wall(x, y){

		var h = self.config.map.height,
			c;

			for(j=0; j<h; j++){
        		c = (j == y) ? EMPTY : WALL;           
	            rw.arena.add(c,x,j);          
	        }
	}

})(robotWalken);