(function(ctx){

	var el, home, config;
	var data = {
		displayed: 'home'
	};

	var rw;

	var homescreen = {

		init: function(){

			build_dom();
			prepare_events();

			log('[homescreen] is ready');

			return this;
		},

		display: function(part){

			if(typeof part != 'undefined'){

				document.getElementById(data.displayed).style.display 	= 'none';
				document.getElementById(part).style.display 			= 'block';
				data.displayed = part;
				log('[homescreen] '+data.displayed+' displayed ');
			}else{
				el.style.display = 'block';
				log('[homescreen] displayed full');
			}
		},

		set_handler: function(m){
			rw = m;
		},
	};

	var self 		= homescreen;
	ctx.add_module('homescreen', homescreen);


	// --- PRIVATE	

	function prepare_events(){

		document.getElementById('bt_config').addEventListener("click", function(){
		    self.display('config');
		});

		document.getElementById('bt_run').addEventListener("click", function(){

			rw.challenge.init_robot();
			rw.arena.build();
		    robotWalken.run();
		});

		document.getElementById('bt_config_save').addEventListener("click", function(){


		    // save participants
		    
		    var cbox = document.getElementsByTagName('input');
		    var new_list = [];

		    for (i = 0; i < cbox.length; i++) {
		    	if(cbox[i].checked)	new_list.push(parseInt(cbox[i].value));
			}

			rw.robot_manager.set_participant_list(new_list);
		    self.display('home');
		});

		

		var i;
		
		
	}


	function build_dom(){


		var challenge = rw.challenge.config;

		el = get_element('div', 'homescreen', {
			style : 'width:'+window.innerWidth+'px; height:'+window.innerHeight+'px'
		})
		document.body.appendChild( el );



		// ---- div home ----
		
		home = get_element( 'div', 'home' );
		el.appendChild(home);

		// infos
		var infos = "<h2>"+challenge.title+"</h2>RobotWalken version "+robotWalken.get('version');
		infos += " by <a href='https://github.com/rdad' target='_blank'>@rdad</a>";
		infos += "<p><strong>CHALLENGE "+challenge.id+"</strong><br>"+challenge.resume+"</p>";

		var i = get_element( 'p',null, {innerHTML: infos} );
		home.appendChild(i);

		// bt config
		var bt1 = get_element('button', 'bt_config', {
			innerHTML: 'CONFIGURATION'
		})
		home.appendChild(bt1);

		// bt run
		
		var bt2 = get_element('button', 'bt_run', {
			innerHTML: 'RUN'
		})
		home.appendChild(bt2);




		// ---- div config ----
		
		config = get_element( 'div', 'config' );
		el.appendChild(config);

		// infos
		
		var participants 	= rw.robot_manager.get('participant'),
			list 			= rw.robot_manager.get('list'),
			rob 			= '', r, i, c, color;

		if(list){
			for(i in list){
				c 		 = (participants.indexOf(parseInt(i)) >= 0) ? ' checked' : '';
				color 	 = rw.arena.color[parseInt(i)];
				rob 	+= "<input type='checkbox'"+c+" value='"+i+"'><span style='color:#"+color+"'> "+list[i].name+"</span><br>";
			}			
		}

		var r = get_element( 'p',null, {innerHTML: rob} );
		config.appendChild(r);

		// bt back
		var bt3 = get_element('button', 'bt_config_save', {
			innerHTML: 'SAVE'
		})
		config.appendChild(bt3);

	}

	

})(robotWalken);