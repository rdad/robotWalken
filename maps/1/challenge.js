(function(ctx){

	var config;
	
	var challenge = {

		get_config: function(){
			return config;
		},

		init: function(arena_handler){

			var w = robotWalken.arena.get_width(),
				h = robotWalken.arena.get_height(),
				nb = 10, j;

			for(j=0; j<nb; j++)
	        {            
	            arena_handler.add(WALL,parseInt(Math.random()*w),parseInt(Math.random()*h));          
	        }
			log('[challenge] init : Map is updated');

		},

		update: function(){

		},

		win: function(){

		}
	};

	var self 			= challenge;
	ctx.challenge 		= challenge;

})(robotWalken);