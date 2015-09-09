(function(ctx){

	var data = {
		loaded: false,
		map: [],
		width: 0,
		height: 0
	};

	var p = {},
		rw;

	var arena = {

		graphic: null,

		init: function(driver_name){

			// --- configuration
			
			data.width  = rw.challenge.config.map.width || 5;
			data.height = rw.challenge.config.map.height || 5;

			// --- map reset
        
	        map_reset();

			// -- driver init
			
			var d = rw['arena_'+driver_name];
			if(typeof d == 'undefined'){
				log("[arena] init : Driver not found :( Can't start",'error');
				return;
			}
			self.graphic = d;
			self.graphic.init();

			
			

	        // --- challenge init
	        
	        rw.challenge.init_map();

			log('[arena] is ready');
		},

		build: function(){
			self.graphic.build_map();
		},

		add: function(type, x, y){
			log(data.map);
			console.log(x,y);
			data.map[x][y] = type;
		},

		get: function(name){
			return data[name];
		},

		set_handler: function(m){
			rw = m;
		},
	};

	var self 			= arena;
	ctx.add_module('arena', arena);


	// --- PRIVATE
	
	function map_reset(){

		var lined,y,x;
	        
        for(y=0; y<data.height; y++)
        {
            lined = [];
            for(x=0; x<data.width; x++)
            {
                lined.push(EMPTY);
            }
            data.map.push(lined);
        }
	}
	
		

})(robotWalken);