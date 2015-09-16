(function(ctx){


	var data = {
		displayed: 'home'
	};
	var el, rw;
	var speed_list 	= [1, 5, 20, 30, 200],
		speed_id 	= 2,
		timer 		= 0;
	var el_timer, el_speed, el_gameover;

	var interface = {

		running: false,

		init: function(){

			build_dom();
			prepare_events();

			log('[interface] is ready');

			return this;
		},

		update: function(){

			// timer
			
			timer++;
			el_timer.innerHTML = timer;
			el_speed.innerHTML = 5-speed_id;
		},
		

		set_handler: function(m){
			rw = m;
		},

		onKeyDown: function(e){

			switch(e.keyCode){

				// SPACE
				
				case 32:
					self.running = !self.running;
					log('[interface] space');
					break;

				// 2
				case 50:
					rw.config.timer = 0;
					speed_id--;
					if(speed_id<0)	speed_id = 0;
					rw.config.time_step = speed_list[speed_id];
					log('[interface] speed up : '+rw.config.time_step);
					break;

				// 1
				case 49:
					rw.config.timer = 0;
					speed_id++;
					if(speed_id>=speed_list.length)	speed_id = speed_list.length-1;
					rw.config.time_step = speed_list[speed_id];
					log('[interface] speed down : '+rw.config.time_step);
					break;

			}
			//log(e.keyCode);
		},

		game_over: function(winner){
			el_gameover.innerHTML = winner;
			el_gameover.style.display = 'block';
		}
	};

	var self 		= interface;
	ctx.add_module('interface', interface);


	// --- PRIVATE	

	function prepare_events(){
		
		document.addEventListener("keydown", self.onKeyDown);
	}


	function build_dom(){

		// infos
		
		infos = "<h3><span  id='timer'>"+timer+"</span></h3><h3 class='speed'><span id='speed'></span>/5</h4>";
		el = get_element('div', 'interface', {
			innerHTML: infos
		});
		rw.arena.graphic.container.appendChild( el );


		// Game over
		rw.arena.graphic.container.appendChild( get_element('div', 'game_over') );


		el_timer 	= document.getElementById('timer');
		el_speed 	= document.getElementById('speed');
		el_gameover = document.getElementById('game_over');
	}

})(robotWalken);