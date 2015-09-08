(function(ctx){

	var data = {
		loaded: false,
		map: [],
		width: 0,
		height: 0
	};

	var p = {};

	var arena = {

		init: function(config){

			data.width  = config.width || 5;
			data.height = config.height || 5;

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
	        
	        robotWalken.challenge.init({
	        	add: add
	        });

	        // --- robots are added
	        



			log('[arena] is ready');
		},

		build: function(){
			log('[arena] build : on the way ...');
		},

		get_width: function(){
			return data.width;
		},

		get_height: function(){
			return data.height;
		}
	};

	var self 			= arena;
	ctx.arena 			= arena;


	// --- PRIVATE
	
	function add(type, x, y){
		data.map[x][y] = type;
	}
		

})(robotWalken);