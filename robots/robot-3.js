(function(){

    var boulon = new Robot('Z6PO',3);

    boulon.init = function(){

    }

    boulon.update = function(){
    	this.move(HAUT);
    }

    robotWalken.add_participation(boulon);
    
})();