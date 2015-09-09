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

	var handler = {
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
				for (var attrname in cfg) { data.config[attrname] = cfg[attrname]; }
				log('[robotWalken] start : Challenge configuration ready');
			}else{
				log('[robotWalken] start : Default configuration ready');
			}

			// homescreen
			
			self.homescreen.init();

			// arena
			
			self.arena.init(data.config.map);

			// robots
			
			self.radio('robotsReady').subscribe(self.arena.build);
			self.radio('arenaReady').subscribe(self.homescreen.display);

			self.robot_manager.init(config.robot_folder || 'robots/');
		},

		splash_screen: function(){

			document.getElementById('homescreen').style.display = 'block';
			document.getElementById('arena').style.display 		= 'none';

			log('[robotWalken] splash_screen : display');
		},

		arena_screen: function(){

			document.getElementById('homescreen').style.display = 'none';
			document.getElementById('arena').style.display 		= 'block';

			log('[robotWalken] arena_screen : display');
		},

		get_version: function(){
			return data.version;
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


const EMPTY     = 0;
const ENERGY    = 51;
const BUTTON 	= 52;
const BOMB 		= 53;
const HOLE 		= 54;
const LASER 	= 55;

const WALL      = 100;
const ROBOT 	= 101;
const DOOR 		= 102;
