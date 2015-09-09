(function(ctx){

	var config = {
		id: 1,
		title: 'Escape!',
		resume: 'Vous devez faire sortir votre robot par la sortie'
	};
	var arena_handler;
	
	var challenge = {

		get_config: function(){
			return config;
		},

		init_map: function(arena_add){

			arena_handler = arena_add;

			var w = robotWalken.arena.get_width(),
				h = robotWalken.arena.get_height(),
				nb = 10, j;

			for(j=0; j<nb; j++)
	        {            
	            arena_handler.add(WALL,parseInt(Math.random()*w),parseInt(Math.random()*h));          
	        }
			log('[challenge] init : Map is updated');
		},

		init_robot: function(robots){

			var id, p, nb=0;
			var start = [[0,0],[0,1],[1,1],[1,0]];

			for (id in robots) {
				p = robots[id].position;
				p.x = start[nb][0];
				p.y = start[nb][1];
				arena_handler.add(id, p.x, p.y);
  				nb++;
			}

			log('[challenge] init : '+nb+' robot(s) are on the map');
		},

		update: function(){

		},

		win: function(){

		}
	};

	var self 			= challenge;
	ctx.challenge 		= challenge;

})(robotWalken);