(function(){


	var robby = new Robot('robby', 1, '@rdad');

	robby.init = function(){
	    this.dir = [BAS,DROITE,HAUT,GAUCHE];
	    this.v = 0;
	    this.pas = [];
	}

	robby.update = function(){
	    
	   
	}

	robotWalken.add_participation(robby);

})();