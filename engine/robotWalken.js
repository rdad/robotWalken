(function(ctx){

	"use strict";

	var data = {
		version : 0.13,
		debug: true,
		display_driver: 'webgl',
		timer: 0,
		time_step: 30,
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

	var timer = 0,
		raf_id;


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

			document.title = 'RobotWalken Map '+rw.challenge.config.id+' : '+rw.challenge.config.title;

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

			raf_id = requestAnimationFrame(robotWalken.running);

			if(rw.interface.running){

				data.timer++;
				if(data.timer > data.time_step){

					data.timer = 0;

					rw.robot_manager.new_turn();
			        rw.robot_manager.update_robots();
			        rw.interface.update();
			        rw.challenge.update();

			        var winner = rw.challenge.win();
			        if(winner !== false){
			        	game_over(winner);
			        }
				}
	    	}

	    	rw.arena.graphic.render();
			rw.arena.graphic.stats.update();
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

	function game_over(winner){

		var winner_name = winner.name;
		log('[robotWalken] GAME OVER. The winner is '+winner_name);
		cancelAnimationFrame(raf_id);
		rw.interface.game_over(winner_name);
	}

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

// robots : 1 - 49

const ENERGY    = 50;
const BUTTON 	= 51;
const HOLE 		= 52;
const EXIT 		= 55;

const BOMB 		= 53;
const LASER 	= 54;

const WALL      = 100;
const ROBOT 	= 101;
const DOOR 		= 102;
