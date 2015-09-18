(function(){

    var boulon = new Robot('boulon',2);

    boulon.init = function(){
    	this.dir = [BAS,DROITE,HAUT,GAUCHE];
	    this.v = 0;
	    this.pas = [];
    }

    boulon.update = function(){

        // exit
        
        var exit;

        if(this.look(BAS) == EXIT){
            exit = BAS;
        }else if(this.look(HAUT) == EXIT){
            exit = HAUT;
        }else if(this.look(DROITE) == EXIT){
            exit = DROITE;
        }else if(this.look(GAUCHE) == EXIT){
            exit = GAUCHE;
        }else{
            var found = [];

            if(this.look(BAS) == EMPTY)     found.push(BAS);
            if(this.look(HAUT) == EMPTY)    found.push(HAUT);
            if(this.look(DROITE) == EMPTY)  found.push(DROITE);
            if(this.look(GAUCHE) == EMPTY)  found.push(GAUCHE);

            var r = Math.round(Math.random() * (found.length - 1));
            exit = found[r];
        }

	    this.move(exit);
	        
    }

    robotWalken.add_participation(boulon);
    
})();