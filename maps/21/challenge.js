(function(ctx){

	var rw;

	var nb_spot = 0;
	
	var challenge = {

		config: {
			id: 21,
			title: 'Energy field',
			resume: 'In a field full of stones, your robot must collecte Energy spots (ENERGY).<br>The winner will be the one who has collected the most energy spots',
			map: {
				width: 19,
				height: 19
			}
		},

		init_map: function(){

			var w = self.config.map.width-1,
				h = self.config.map.height-1,
				nb = 4, j,x = 4,y;

			// Walls
			
			for(var y = 1; y<18; y+=2){
				for(x=1; x<18; x+=2)
		        {
		        	rw.arena.add(WALL,x,y);     		       
		        }
			}

			// Energies
			for(j=0; j<10; j++)
	        { 
	        	x = parseInt(Math.random()*w);
	        	y = parseInt(Math.random()*h);

        		if((x==0 && y==0) || (x==w && y==0) || (x==w && y==h) || (x==0 && y==h))    continue; 
        		if(rw.arena.get_map(x,y)>0)	continue;

	            rw.arena.add(ENERGY, x, y, self.eat_energy); 

	            nb_spot++;         
	        }


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

				robots[id].energy = 0;

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

			if(nb_spot<0){

				var robots = rw.robot_manager.get('list'),
					winner = {energy: 0};

				for (id in robots) {
					if(robots[id].energy > winner.energy){
						winner = robots[id];
					}
				}
				return winner;

			}else{
				return false;
			}		
		},

		set_handler: function(m){
			rw = m;
		},

		eat_energy: function(robot){

			nb_spot--;
			robot.energy++;		
			rw.arena.graphic.animation.energy(robot);

			log('[challenge] Robot "'+robot.name+'" eat a energy ball !');
		}
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