(function(ctx){

	var rw;
	
	var arena_webgl = {

		init: function(){

			log('[arena] is ready');
		},

		set_handler: function(m){
			rw = m;
		},
	};

	var self 			= arena_webgl;
	ctx.add_module('arena_webgl', arena_webgl);


	// --- PRIVATE
		

})(robotWalken);