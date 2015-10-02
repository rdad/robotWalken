(function(){

	var robby = new Robot('robby', 1, '@rdad');

	robby.init = function(){
	    this.dir = [DOWN,RIGHT,UP,LEFT];
	    this.v = 0;
	    this.pas = [];
	}

	robby.update = function(){
	    
	    var found = false;
	    
	    while(found==false){
	        var p = this.dir[this.v];
	        var l = this.look(p);
	        if(l==EMPTY){
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