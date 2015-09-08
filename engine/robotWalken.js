(function(ctx){


	var data = {
		version : 0.1,
		debug: true,
		config: {
			map: {
				width: 20,
				height: 20,
			}
		}
	};

	var app = {

		start: function(config){

			log("_-_-==> Welcome to Robot Walken version "+data.version+" bip!yuuuuu!deep! <==-_-_");

			// challenge configuration
			
			if(typeof self.challenge == 'undefined'){
				log('[robotWalken] Challenge not found :( No start & exit', 'error');
				return;
			}
			var cfg = self.challenge.get_config();
			if(cfg){
				data.config = cfg;
				log('[robotWalken] start : Challenge configuration ready');
			}else{
				log('[robotWalken] start : Default configuration ready');
			}


			// arena
			
			self.arena.init(data.config.map);

			// robots
			
			self.radio('robotsReady').subscribe(self.arena.build);
			self.robot_manager.init(config.robot_folder || 'robots/');
		}
	};

	var self 		= app;
	ctx.robotWalken = app;


	// --- PRIVATE
	
	ctx.log = function(txt, type){

		if(data.debug){
			console.log(txt);
		}else{
			if(type!='log')	console.log(txt);
		}		
	}

})(window);


const WALL      = 100;
const EMPTY     = 0;
const FOOD      = 1;