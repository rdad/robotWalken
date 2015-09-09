(function(ctx){

	var rw;
	
	var challenge = {

		config: {
			id: 1,
			title: 'Escape!',
			resume: 'Vous devez faire sortir votre robot par la sortie'
		},

		init_map: function(){

			var w = rw.challenge.config.map.width,
				h = rw.challenge.config.map.height,
				nb = 10, j;

			for(j=0; j<nb; j++)
	        {            
	            rw.arena.add(WALL,parseInt(Math.random()*w),parseInt(Math.random()*h));          
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
				rw.arena.add(id, p.x, p.y);
  				nb++;
			}

			log('[challenge] init : '+nb+' robot(s) are on the map');
		},

		update: function(){

		},

		win: function(){

		},

		set_handler: function(m){
			rw = m;
		},
	};

	var self 			= challenge;
	ctx.add_module('challenge', challenge);

})(robotWalken);