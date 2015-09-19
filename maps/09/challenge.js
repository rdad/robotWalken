(function(ctx){

	var rw;

	var exit_door;
	
	var challenge = {

		config: {
			id: 9,
			title: 'The Maze',
			resume: 'Your robot must found the output door',
			map: {
				width: 10,
				height: 10
			}
		},

		init_map: function(){

			var w = self.config.map.width,
				h = self.config.map.height,
				nb = 10, j,x,y;

			var maze = Maze.get(h+2, w+2);
			log(maze);
			
			generate_maze(maze);

			// exit
			var e = [{x:0, y:9},{x:9, y:9},{x:9, y:0}];
			var id = parseInt(Math.random()*3);
			rw.arena.add(EXIT, e[id].x, e[id].y);

			log('[challenge] init : Map is updated');
		},

		init_robot: function(){

			var robot = rw.robot_manager.get_robot(rw.robot_manager.get('participant')[0]);
			rw.arena.add(robot.id, 0,0);

			log('[challenge] init : The robot is on the map');
		},

		update: function(){

		},

		win: function(){
			
			return rw.arena.get_robot_exit();
		},

		set_handler: function(m){
			rw = m;
		},
	};

	var self 			= challenge;
	ctx.add_module('challenge', challenge);

	function generate_maze(maze){

		for(var x = 1; x<maze.length-2; x++){

			var l  = maze[x];

			for(var y = 1; y<l.length-2; y++){

				var t = (l[y] == 'x') ? WALL : EMPTY;
				rw.arena.add(t, x-1,y-1);
			}
		}
	}


	/*Maz générator e*/

	var Maze = (function(){
	  var get = function(h, w){

	      "use strict";

	      var LEFT = 0, RIGHT = 1, DOWN = 2, UP = 3;

	      var l = [];
	      
	      //generate the maze blocks full
	      for(var x=0; x<h; x++){
	        var row=[];
	        for(var y=0; y<w; y++){
	          row[y]="x";
	        }
	        l[x]=row;
	      }
	    

	      l[1][1]="p"; //start point

	      var finished=false;
	      var nowx=1;
	      var nowy=1;
	      var lastx=1;
	      var lasty=1;
	      var direction = DOWN;
	      var _block=0;

	      var goResults=[];
	      //generate the maze
	      while(!finished){
	        direction = Utils.random(0,3);
	        var goRes = canGo(direction, nowx, nowy);
	        if(goRes){
	          goResults.push(goRes);
	          nowx=goRes.x;
	          nowy=goRes.y;
	          lastx=goRes.x;
	          lasty=goRes.y;
	          l[nowx][nowy]="p";
	          _block=0;
	        }else{
	          if(goResults.length){
	            var restart = goResults[Utils.random(0,goResults.length-1)];
	            nowx = restart.x;
	            nowy = restart.y;
	            _block++;
	          }
	        }
	      
	        if(_block>500){
	          finished=true;
	          l[lastx][lasty]="e";
	        }

	      }

	      function canGo(dir, x, y){
	        try{
	          var _p;
	          if(dir==LEFT){
	            if(l[x-2][y]=="x" && l[x-1][y+1]=="x" && l[x-1][y-1]=="x")
	              _p = {x: x-1, y: y};
	          }
	          if(dir==RIGHT){
	            if(l[x+2][y]=="x" && l[x+1][y+1]=="x" && l[x+1][y-1]=="x")
	              _p = {x: x+1, y: y};
	          }
	          if(dir==DOWN){
	            if(l[x][y-2]=="x" && l[x-1][y-1]=="x" && l[x+1][y-1]=="x")
	              _p = {x: x, y: y-1};
	          }
	          if(dir==UP){
	            if(l[x][y+2]=="x" && l[x-1][y+1]=="x" && l[x+1][y+1]=="x")
	              _p = {x: x, y: y+1};
	          }

	          if(validPoint(_p)) return _p;
	        }catch(e){}
	        return false;
	      }

	      function validPoint(p){
	        if(p && p.x>0 && p.y>0 && p.x<h-1 && p.y<w-1){
	          var _c=0;
	          for(var x=-1; x<=1; x++){
	            for(var y=-1; y<=1; y++){
	              if(l[p.x+x][p.y+y]=="p") _c++;
	            }
	          }
	          if(_c<=2)
	            return true;
	        }
	        return false;
	      }

	      //convert bidimensional array 2 string array 
	      for(var x=0; x<l.length; x++){
	        l[x]=l[x].join().replace(/,/g,'');
	      }
	      return l;

	  };

	  var getFreePoint = function(maze){
	    while(true){
	      var x = Utils.random(0, maze.length-1);
	      var y = Utils.random(0, maze[0].length-1);
	      if(maze[x][y]=="p"){
	        return {p1: x, p2: y};
	      }
	    }
	  }
	  
	  return {
	    get: get,
	    getFreePoint: getFreePoint
	  };
	})();

	var Utils = (function(){

	  var nextId = 0;
	  var getId = function(){
	    return nextId++;
	  };

	  var random = function(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	  }

	  return {
	    getId: getId,
	    random: random
	  };
	})();

})(robotWalken);