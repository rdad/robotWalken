(function(){

	var robby = new Robot('robby', 1, '@rdad');

	robby.init = function(){

	}

	robby.update = function(){
	    
	    this.move(DOWN);
	   
	}

	robotWalken.add_participation(robby);

})();