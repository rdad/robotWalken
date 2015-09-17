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

		color: ['','A50A02','43A2A6','FA4E2C','2E2525'],

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

			// interface
			
			rw.interface.init();


	        // --- challenge init
	        
	        rw.challenge.init_map();

			log('[arena] is ready');
		},

		build: function(){
			self.graphic.build_map();
		},

		add: function(type, x, y){
			data.map[x][y] = type;
		},

		get: function(name){
			return data[name];
		},

		set_handler: function(m){
			rw = m;
		},

		action: {

			move: function(robot, x,y){

				// have we move point ?
				
				if(rw.robot_manager.get('move')[robot.id]<1)	return false;


				// limits of the map
				
	            if(x<0 || x>=data.width || y<0 || y>=data.width){

	            	rw.arena.graphic.animation.bump(robot, x,y);
	            	return false;
	            }                

	            var c = data.map[x][y];

	            if(c==0 || (c>=50 && c<100))
	            {
	                data.map[robot.position.x][robot.position.y]    = EMPTY;
	                data.map[x][y]                                  = robot.id;
	                robot.position                                  = {x:x, y:y};
	                robot.gfx.position.x                            = (x * 50);
	                robot.gfx.position.z                            = (y * 50);
	                rw.robot_manager.get('move')[robot.id]--;
	                return true;
	            }else{

	            	rw.arena.graphic.animation.bump(robot, x,y);
	            	return false;
	            }
			},

			look: function(robot, x, y){

				var m = data.map;
		        var l = 'Robot '+robot.name+' look at '+x+'/'+y;
		        
		        // limits
		        if(x<0 || x>=data.width || y<0 || y>=data.width)                return -1;
		        
		        var r = m[x][y];
		        return r;
			}
		}
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