(function(ctx){


	var data = {
		displayed: 'home'
	};
	var el;
	var rw;
	var timer = 0;
	var el_timer;

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


			}

		}
	};

	var self 		= interface;
	ctx.add_module('interface', interface);


	// --- PRIVATE	

	function prepare_events(){
		
		document.addEventListener("keydown", self.onKeyDown);
	}


	function build_dom(){

		infos = "<h3 id='timer'>"+timer+"</h3>";
		el = get_element('div', 'interface', {
			innerHTML: infos
		});
		rw.arena.graphic.container.appendChild( el );

		el_timer = document.getElementById('timer');
	}

})(robotWalken);