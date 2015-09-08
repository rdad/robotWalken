
const HAUT      = 0;
const BAS       = 2;
const GAUCHE    = 10;
const DROITE    = 12;

var Robot = function (name, id)
{
    this.name       = name;
    this.id         = id;
    this.life       = 10;
    this.strength   = 10;
    this.gfx        = null;
    this.position   = {x:0,y:0};
    this.moved      = false;
}

Robot.prototype = {
    move : function(direction)
    {
        var new_pos = {x:0, y:0};
        new_pos.x   = (direction>5) ? this.position.x + (direction-11) : this.position.x;
        new_pos.y   = (direction<5) ? this.position.y + (direction-1) : this.position.y;
        
        return arena.robot.move(this, new_pos.x, new_pos.y);
         
    },
    look: function(direction) {
        
        var pos = {x:0, y:0};
        pos.x   = (direction>5) ? this.position.x + (direction-11) : this.position.x;
        pos.y   = (direction<5) ? this.position.y + (direction-1) : this.position.y;
        
        return arena.robot.look(this, pos.x, pos.y);
    },
    eat: function(direction) {
        
        var pos = {x:0, y:0};
        pos.x   = (direction>5) ? this.position.x + (direction-11) : this.position.x;
        pos.y   = (direction<5) ? this.position.y + (direction-1) : this.position.y;
        
        return arena.robot.eat(this, pos.x, pos.y);
    },
    
    getMyPosition: function(){
        return this.position;
    },
    hit: function(direction){
        
        var pos = {x:0, y:0};
        pos.x   = (direction>5) ? this.position.x + (direction-11) : this.position.x;
        pos.y   = (direction<5) ? this.position.y + (direction-1) : this.position.y;
        
        return arena.robot_hit(this, pos.x, pos.y);
    },
    bit: function(direction){
        
        var pos = {x:0, y:0};
        pos.x   = (direction>5) ? this.position.x + (direction-11) : this.position.x;
        pos.y   = (direction<5) ? this.position.y + (direction-1) : this.position.y;
        
        return arena.robot_bit(this, pos.x, pos.y);
    },
    sleep:function(){
        
    }
  };



