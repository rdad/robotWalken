
const UP      = 0;
const DOWN    = 2;
const LEFT    = 10;
const RIGHT   = 12;

var Robot = function (name, id, author)
{
    this.name       = name;
    this.id         = id;
    this.author     = author || 'anonyme';
    this.gfx        = null;
    this.position   = {x:0,y:0};
}

Robot.prototype = {

    set_gfx: function(gfx){
        this.gfx = gfx;
    },

    move : function(direction)
    {
        var new_pos = {x:0, y:0};
        new_pos.x   = (direction>5) ? this.position.x + (direction-11) : this.position.x;
        new_pos.y   = (direction<5) ? this.position.y + (direction-1) : this.position.y;
        
        return robotWalken.action.move(this, new_pos.x, new_pos.y);
         
    },
    look: function(direction) {
        
        var pos = {x:0, y:0};
        pos.x   = (direction>5) ? this.position.x + (direction-11) : this.position.x;
        pos.y   = (direction<5) ? this.position.y + (direction-1) : this.position.y;
        
        return robotWalken.action.look(this, pos.x, pos.y);
    },
    eat: function(direction) {
        
        var pos = {x:0, y:0};
        pos.x   = (direction>5) ? this.position.x + (direction-11) : this.position.x;
        pos.y   = (direction<5) ? this.position.y + (direction-1) : this.position.y;
        
        return robotWalken.action.robot.eat(this, pos.x, pos.y);
    },
    
    getPosition: function(){
        return this.position;
    },

    hit: function(direction){
        
        var pos = {x:0, y:0};
        pos.x   = (direction>5) ? this.position.x + (direction-11) : this.position.x;
        pos.y   = (direction<5) ? this.position.y + (direction-1) : this.position.y;
        
        return robotWalken.action.robot_hit(this, pos.x, pos.y);
    },
    bit: function(direction){
        
        var pos = {x:0, y:0};
        pos.x   = (direction>5) ? this.position.x + (direction-11) : this.position.x;
        pos.y   = (direction<5) ? this.position.y + (direction-1) : this.position.y;
        
        return robotWalken.action.robot_bit(this, pos.x, pos.y);
    },
    sleep:function(){
        
    }
  };



