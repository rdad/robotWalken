(function(ctx){

	var el, home, config;
	var displayed = 'home';

	var homescreen = {

		init: function(){

			build_dom();

			document.getElementById('bt_config').addEventListener("click", function(){
			    self.display('config');
			});

			document.getElementById('bt_run').addEventListener("click", function(){
			    robotWalken.arena_screen();
			});

			document.getElementById('bt_config_save').addEventListener("click", function(){
			    // @todo : save
			    self.display('home');
			});
			
			log('[homescreen] is ready');
		},

		display: function(part){

			if(typeof part != 'undefined'){

				document.getElementById(displayed).style.display 	= 'none';
				document.getElementById(part).style.display 		= 'block';
				displayed = part;
				log('[homescreen] '+displayed+' displayed ');
			}else{
				el.style.display = 'block';
				log('[homescreen] displayed full');
			}
		}
	};

	var self 		= homescreen;
	ctx.homescreen	= homescreen;


	// --- PRIVATE
	
	function build_dom(){


		var challenge = robotWalken.challenge.get_config();

		el = get_element('div', 'homescreen', {
			style : 'width:'+window.innerWidth+'px; height:'+window.innerHeight+'px'
		})
		document.body.appendChild( el );



		// ---- div home ----
		
		home = get_element( 'div', 'home' );
		el.appendChild(home);

		// infos
		var infos = "<h2>"+challenge.title+"</h2>RobotWalken version "+robotWalken.get_version();
		infos += " by <a href='https://github.com/rdad' target='_blank'>@rdad</a>";
		infos += "<p><strong>CHALLENGE "+challenge.id+"</strong> : "+challenge.resume+"</p>";

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
		var rob  = "<input type='checkbox'> robby<br>";
		rob 	+= "<input type='checkbox'> bob<br>";

		var r = get_element( 'p',null, {innerHTML: rob} );
		config.appendChild(r);

		// bt back
		var bt3 = get_element('button', 'bt_config_save', {
			innerHTML: 'SAVE'
		})
		config.appendChild(bt3);

	}

	function get_element(html, id, attrs){

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
		

})(robotWalken);