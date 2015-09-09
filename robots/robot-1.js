(function(){


	var robby = new Robot('robby', 1);

	robby.init = function(){
	    this.dir = [BAS,DROITE,HAUT,GAUCHE];
	    this.v = 0;
	    this.pas = [];
	}

	robby.update = function(){
	    
	    var found = false;
	    
	    while(found==false){
	        var p = this.dir[this.v];
	        var l = this.look(p);
	        if(l==0){
	            this.move(p);
	            found = true;
	        }else{
	            this.v++;
	            if(this.v>3) this.v=0;
	        }
	    }
	}

	robotWalken.add_participation(robby);

})();