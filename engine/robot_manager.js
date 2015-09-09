(function(ctx){

	var data = {
		loaded: false,
		list: {},
		participant: [],
		nb_robot: 0,
		nb_loaded: 0,
		nb_max_robot: 4,
		max_loading_ms: 2000
	};

	var p = {};

	var rw;

	var robot_manager = {

		init: function(folder){

			if(data.loaded === true)	return this;

			log('[robot_manager] robots loading ...');

			load_local_data();

			for(var j=1; j<=data.nb_max_robot; j++){
				var s = document.createElement( 'script' );
				s.setAttribute('src',folder+'robot-'+j+'.js');
				s.onload = s.onerror = robot_loaded;
				document.body.appendChild( s );
			}

			p.timeout = setTimeout(end_robot_loading, data.max_loading_ms);	
		},

		set_participant_list: function(list){

			data.participant = list;
			localStorage.setItem('rw_participants', JSON.stringify(list));

			log('[robot_manager] set_participant_list : New list is saved localy');
			log(list);
		},

		set_handler: function(m){
			rw = m;
		},

		get: function(name){
			return data[name];
		},

		add: function(robot){

			// has a name ?
			if(!robot.name || robot.name.length<2){
				log('[robot_manager] add : Robot is unnamed :(','warning');
				return;
			}

			// has a id ?
			if(!robot.id || typeof robot.id != 'number'){
				log('[robot_manager] add : Robot has no valid id :(','warning');
				return;
			}

			// a real Robot ?
			if(robot instanceof Robot === false){
				log('[robot_manager] add : '+robot.name+' is not a real Robot :(','warning');
				return;
			}

			// a robot with init & update ?
			if(!robot.init || !robot.update || typeof robot.init != 'function' || typeof robot.update != 'function'){
				log("[robot_manager] add : "+robot.name+" is not a well formated Robot :( Can't be inited and updated",'warning');
				return;
			}

			// Already in list ?
			if(typeof(data.list[robot.id]) != 'undefined'){
				log('[robot_manager] add : '+robot.name+' is already registered :|','warning');
				return;
			}

			// GREAT : a new robot !
			
			data.list[robot.id] = robot;
			data.nb_robot++;
			log('[robot_manager] add : '+robot.name+' is added to the next challenge');
		}
	};

	var self = robot_manager;
	ctx.add_module('robot_manager', robot_manager);


	// --- PRIVATE
	
	function end_robot_loading(){

		data.loaded = true;
		log("[robot_manager] End of robot's loading : "+data.nb_robot+" found(s)");
		robotWalken.radio('robotsReady').broadcast(data);
	}

	function robot_loaded(){

		data.nb_loaded++;
		if(data.nb_loaded >= data.nb_max_robot){
			clearTimeout(p.timeout);
			end_robot_loading();
		}
	}

	function load_local_data(){

		var d = localStorage.getItem('rw_participants');

		if(d){
			data.participant = JSON.parse(d);
			log('[robot_manager] Local participant list found ...');
		}
	}
	

})(robotWalken);