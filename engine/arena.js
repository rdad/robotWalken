(function(ctx){

	var data = {
		loaded: false,
		map: [],
		width: 0,
		height: 0
	};

	var p = {};

	var rw;

	var arena = {

		init: function(){

			data.width  = rw.challenge.config.map.width || 5;
			data.height = rw.challenge.config.map.height || 5;

			// --- map reset
        
	        var lined,linem,y,x;
	        
	        for(y=0; y<data.height; y++)
	        {
	            lined = [];
	            for(x=0; x<data.width; x++)
	            {
	                lined.push(EMPTY);
	            }
	            data.map.push(lined);
	        }

	        // --- challenge init
	        
	        rw.challenge.init_map();

			log('[arena] is ready');
		},

		add: function(type, x, y){
			data.map[x][y] = type;
		},

		set_handler: function(m){
			rw = m;
		},
	};

	var self 			= arena;
	ctx.add_module('arena', arena);


	// --- PRIVATE
	
	
		

})(robotWalken);