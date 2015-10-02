(function(ctx){

	var el, home, config;
	var data = {
		displayed: 'home'
	};

	var rw;

	var robot_selection = [];

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

		document.getElementById('bt_config_save').addEventListener("click", function(){

			rw.robot_manager.set_participant_list(robot_selection);
		    self.display('home');
		});

		

		var li = document.querySelectorAll("#config li");
		for(var i=0; i<li.length; i++) {
        	li[i].addEventListener('click', select_robot, true);
    	}
	}

	function select_robot(e){

		var target 	= e.target;
		var color 	= target.style.backgroundColor;
		var id 		= parseInt(target.dataset.id);

		if(color == 'rgb(255, 255, 255)'){

			// retirer
			target.style.backgroundColor = 'rgba(255,255,255,.2)';

			robot_selection.forEach(function(el, index){
				if(el == id)	delete robot_selection[index];
			});

		}else{

			// ajouter
			target.style.backgroundColor = 'rgb(255, 255, 255)';
			robot_selection.unshift(id);
		}

		// limit ?
		
		while(robot_selection.length > rw.challenge.config.max_participant){
			var r = parseInt(robot_selection.pop())-1;
			document.querySelectorAll("#config li")[r].style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
		}	
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
		var r = challenge.max_participant;
		r += (r>1) ? 'robots' : 'robot';
		var infos = "<h2>"+challenge.title+"</h2>RobotWalken version "+robotWalken.get('version');
		infos += " by <a href='https://github.com/rdad' target='_blank'>@rdad</a>";
		infos += "<p><strong>CHALLENGE "+challenge.id+" ("+r+")</strong><br>"+challenge.resume+"</p>";

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
				c 		 = (participants.indexOf(parseInt(i)) >= 0) ? '#fff' : 'rgba(255,255,255,.2)';
				color 	 = rw.arena.color[parseInt(i)];
				rob 	+= "<li style='background-color: "+c+"; color:#"+color+"' data-id='"+i+"'>"+list[i].name+"</li>";
				if(c == '#fff')	robot_selection.push(i);
			}			
		}

		var r = get_element( 'ul',null, {innerHTML: rob} );
		config.appendChild(r);

		// bt back
		var bt3 = get_element('button', 'bt_config_save', {
			innerHTML: 'SAVE'
		})
		config.appendChild(bt3);

	}

	

})(robotWalken);