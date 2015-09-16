(function(ctx){

	"use strict";

	var data = {
		version : 0.1,
		debug: true,
		display_driver: 'webgl',
		time_step: 1000/60,
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

			this.action = rw.arena.action;

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


			// --- Arena
			
			rw.arena.init(data.display_driver);

			// robots
			
			self.radio('robotsReady').subscribe(function(){

				rw.homescreen.init().display();
			});
			//self.radio('arenaReady').subscribe(rw.homescreen.display);

			rw.robot_manager.init(data.robot_folder || 'robots/');
		},

		run: function(){

			rw.robot_manager.init_robots();

			document.getElementById('homescreen').style.display = 'none';
			document.getElementById('arena').style.display 		= 'block';

			log("[robotWalken] running & kickin'");

			rw.interface.running = true;
			self.running();
		},

		running: function(){

			if(rw.interface.running){
				rw.robot_manager.new_turn();
		        rw.robot_manager.update_robots();
		        rw.interface.update();
		        rw.arena.graphic.render();
		        rw.arena.graphic.stats.update();
	    	}
	        
	        setTimeout("robotWalken.running()",data.time_step);
	    },

		pause: function(){

			document.getElementById('homescreen').style.display = 'block';
			document.getElementById('arena').style.display 		= 'none';
			log("[robotWalken] !STOP!");
		},

		add_participation: function(robot){

			rw.robot_manager.add(robot);
			return this;
		},

		get: function(name){
			return data[name];
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

	ctx.get_element = function(html, id, attrs){

		var e = document.createElement( html );
		if(id)	e.setAttribute('id',id);

		if(attrs){
			for(var a in attrs){
				if(a == 'innerHTML'){
					e.innerHTML = attrs[a];
				}else{
					e.setAttribute(a,attrs[a]);
				}	
			}
		}

		return e;
	}

})(window);


const EMPTY     = 0;
const FOOD 		= 50;
const ENERGY    = 51;
const BUTTON 	= 52;
const BOMB 		= 53;
const HOLE 		= 54;
const LASER 	= 55;

const WALL      = 100;
const ROBOT 	= 101;
const DOOR 		= 102;
