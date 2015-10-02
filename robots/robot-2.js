(function(){

    var boulon = new Robot('boulon',2, '@rdad');

    boulon.init = function(){
    	this.dir = [DOWN,RIGHT,UP,LEFT];
	    this.v = 0;
	    this.pas = [];
    }

    boulon.update = function(){

        // exit
        
        var exit;

        if(this.look(DOWN) == EXIT){
            exit = DOWN;
        }else if(this.look(UP) == EXIT){
            exit = UP;
        }else if(this.look(RIGHT) == EXIT){
            exit = RIGHT;
        }else if(this.look(LEFT) == EXIT){
            exit = LEFT;
        }else{
            var found = [];

            if(this.look(DOWN) == EMPTY)    found.push(DOWN);
            if(this.look(UP) == EMPTY)      found.push(UP);
            if(this.look(RIGHT) == EMPTY)   found.push(RIGHT);
            if(this.look(LEFT) == EMPTY)    found.push(LEFT);

            var r = Math.round(Math.random() * (found.length - 1));
            exit = found[r];
        }

	    this.move(exit);
	        
    }

    robotWalken.add_participation(boulon);
    
})();