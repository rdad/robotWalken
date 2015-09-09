(function(ctx){


	var data = {
		version : 0.1,
		debug: true,
		default: {
			map: {
				width: 20,
				height: 20,
			}
		}
	};

	var rw = {
		config: data
	};


	var app = {

		init: function(config){

			log("_-_-==> Welcome to Robot Walken version "+data.version+" bip!yuuuuu!deep! <==-_-_");

			// config values
			 
			for (var attrname in config) {
				if(typeof data[attrname] == 'undefined'){
					data[attrname] = config[attrname];
				}
			}

			// security
			
			delete self.add_module;

			if(!data.debug){
				delete self.get_module;
			}
			return this;
		},

		start: function(){

			// --- Challenge configuration
			
			if(typeof rw.challenge == 'undefined'){
				log('[robotWalken] Challenge not found :( No start possible', 'error');
				return;
			}

			// default values
			 
			for (var attrname in data.default) {
				if(typeof rw.challenge.config[attrname] == 'undefined'){
					rw.challenge.config[attrname] = data.default[attrname];
				}
			}

			log('[robotWalken] start : Challenge configuration done');


			// homescreen
			
			rw.homescreen.init();

			// arena
			
			rw.arena.init();

			// robots
			
			self.radio('robotsReady').subscribe(function(){
				rw.homescreen.display();
			});
			//self.radio('arenaReady').subscribe(rw.homescreen.display);

			rw.robot_manager.init(data.robot_folder || 'robots/');
		},

		run: function(){

			log("[robotWalken] running & kickin'");
		},

		add_participation: function(robot){

			rw.robot_manager.add(robot);
			return this;
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
		},


		// --- MODULES
		
		add_module: function(name, mod){

			rw[name] = mod;
			mod.set_handler(rw);
			delete mod.set_handler;

			if(data.debug)	log('[robotWalken] module added : '+name);
		},

		get_modules: function(){
			return rw;
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
