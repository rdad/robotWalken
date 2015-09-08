(function(ctx){

	var data = {
		loaded: false,
		map: [],
		width: 0,
		height: 0,
		robots: null,
		nb_robot: 0
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
	        
	        robotWalken.challenge.init_map({
	        	add: add
	        });

			log('[arena] is ready');
		},

		build: function(robot_data){

			log('[arena] build : on the way ...');

			// place robots on map
			
			data.robot 		= robot_data.list;
			data.nb_robot 	= robot_data.nb_robot;
			
			robotWalken.challenge.init_robot(data.robot);
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