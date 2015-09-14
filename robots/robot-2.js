(function(){

    var boulon = new Robot('boulon',2);

    boulon.init = function(){
    	this.dir = [BAS,DROITE,HAUT,GAUCHE];
	    this.v = 0;
	    this.pas = [];
    }

    boulon.update = function(){

    	var found = [];

    	if(this.look(BAS) == EMPTY)		found.push(BAS);
    	if(this.look(HAUT) == EMPTY)	found.push(HAUT);
    	if(this.look(DROITE) == EMPTY)	found.push(DROITE);
    	if(this.look(GAUCHE) == EMPTY)	found.push(GAUCHE);
	    
	    var r = Math.round(Math.random() * (found.length));
	    
	    this.move(found[r]);
	        
    }

    robotWalken.add_participation(boulon);
    
})();