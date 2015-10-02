(function(){

    var boulon = new Robot('Z6PO',3, '@rdad');

    boulon.init = function(){

    }

    boulon.update = function(){
    	this.move(DOWN);
    }

    robotWalken.add_participation(boulon);
    
})();