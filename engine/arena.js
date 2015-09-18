(function(ctx){

	var data = {
		loaded: false,
		map: [],
		map_behaviour: {},
		width: 0,
		height: 0,
		robot_exited: false
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

		add: function(type, x, y, behaviour){

			data.map[x][y] = type;

			if(type == HOLE && typeof behaviour == 'undefined')	behaviour = behaviour_hole_default;
			if(type == EXIT && typeof behaviour == 'undefined')	behaviour = behaviour_exit_default;

			if(behaviour)	data.map_behaviour[x+'_'+y] = behaviour;
		},

		get: function(name){
			return data[name];
		},

		get_map: function(x, y){
			return data['map'][x][y];
		},

		get_behaviour: function(x,y){
			var b = data['map_behaviour'][x+'_'+y];
			return (typeof b == 'undefined') ? false : b;
		},

		set_robot_exit: function(r){
			data['robot_exited'] = r;
		},

		get_robot_exit: function(){
			return data['robot_exited'];
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
	                rw.robot_manager.get('move')[robot.id]--;
	                rw.arena.graphic.animation.move(robot,x,y);
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
		        rw.arena.graphic.animation.look(robot, x, y);
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
	

	// -- BEHAVIOURS
	
	function behaviour_hole_default(robot){

		rw.arena.graphic.animation.fall(robot);
		robot.update = function(){}
		log('[arena] behaviour_hole_default');
	}

	function behaviour_exit_default(robot){

		rw.arena.graphic.animation.exit(robot);
		robot.update = function(){}
		log('[arena] behaviour_exit_default');
	}
		

})(robotWalken);