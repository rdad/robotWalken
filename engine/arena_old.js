
const WALL      = -1;
const EMPTY     = 0;
const FOOD      = 100;

var arena = arena || {
    
    time_step: 500,
    display_effect: [],
    log_list: [],

    init: function(){
        
        this.graphic.init();
        this.map.init();
        this.robot.init();
        console.log('Arena inited');
    },
    
    run: function(){
        //requestAnimationFrame( arena.run );

        arena.robot.update();
        arena.graphic.render();
        arena.graphic.stats.update();
        console.log('Arena running');
        
        setTimeout("arena.run()",this.time_step);
    },
    
    add_display_effect: function(d){
        this.display_effect.push(d);
    },
    
    log: function(message){
        this.log_list.push(message);
        console.log(message);
    }
};

arena.robot = {
    
    list: [],
    moved: [],
    start_pos: [{x:0,y:0},{x:19,y:19},{x:19,y:0},{x:0,y:19}],
    color: ['0xff0000','0x00ff00','0x0000ff','0xffffff'],
    nb:0,
    
    init: function(){
        
        for(var j=0; j<this.nb; j++){
            this.list[j].init();
            arena.map.add_robot(this.list[j]);
        }
    },
    
    update: function(){
        
        // init moved
        for(var j=0; j<this.nb; j++){
            this.moved[j] += 1;
        }
        
        for(var j=0; j<this.nb; j++){
            this.list[j].update();
        }
    },
    
    add: function(r){
        
        if(this.verify(r))
        {           
            r.id = this.nb;
            this.list.push(r);
            this.moved[r.id] = 1;
            this.nb++;
            console.log('Robot "'+r.name+'" added');
        }else{
            console.log('Robot "'+r.name+'" not added');
        }
        
    },
    
    verify: function(r)
    {
        // @todo: verifier les fonctions du robot, le type d'objet ...
        return true;
    },
    
    move: function(robot, x,y)
    {
        var m = arena.map;
        
        if(this.moved[robot.id]>0)
        {
            this.moved[robot.id]--;

            // limits
            if(x<0 || x>=m.width || y<0 || y>=m.width)                return false;

            var c = m.data[x][y];
            if(c==EMPTY)
            {
                m.data[robot.position.x][robot.position.y]   = EMPTY;
                m.data[x][y]                                 = robot.id;
                robot.position                                  = {x:x, y:y};
                robot.gfx.position.x                            = (x * 50);
                robot.gfx.position.z                            = (y * 50);
                arena.log('Robot '+robot.name+' move to '+x+'/'+y);
                return true;
            }
        }
        return false;
    },
    
    look: function(robot, x,y)
    {
        var m = arena.map;
        var l = 'Robot '+robot.name+' look at '+x+'/'+y;
        
        // limits
        if(x<0 || x>=m.width || y<0 || y>=m.width)                return -1;
        
        var r = m.data[x][y];
        arena.log(l+': '+r);
        return r;
    },
    
    eat: function(robot, x,y)
    {
        var m = arena.map;
        
        // limits
        if(x<0 || x>=m.width || y<0 || y>=m.width)                return false;
        
        if(m.data[x][y] == FOOD){
            
           robot.life+=5;
           arena.map.del(x,y);
           this.move(robot,x,y);
           arena.log('Robot '+robot.name+' eat food!');
           return true;
        }
        return false;
    }
};

arena.map = {
    
    data: [],
    mesh: [],
    width: 20,
    geometry: {robot:null,wall:null,food:null},
    material: {robot:null,wall:null, food:null},
    random: {wall:30, food:2},
    
    init: function(){
        
        // grid
        var w = this.width * 50;
        this.plane = new THREE.Mesh( new THREE.PlaneGeometry( w, w, this.width, this.width ), new THREE.MeshBasicMaterial( {color: 0x555555, wireframe: true} ) );
        this.plane.rotation.x = - 90 * Math.PI / 180;
        this.plane.position.x = (50*(this.width*.5))-25;
        this.plane.position.z = (50*(this.width*.5))-25;
        this.plane.position.y = -25;
        arena.graphic.scene.add( this.plane );
        
        // geometry        
        this.geometry.robot   = new THREE.CylinderGeometry( 15, 25, 50, 10, 10);
        this.geometry.wall    = new THREE.CubeGeometry( 50, 50, 50 );
        this.geometry.food    = new THREE.SphereGeometry( 20, 10, 10 );
        
        // objects 
        this.material.robot   = new THREE.MeshLambertMaterial({shading: THREE.shading});
        this.material.wall    = new THREE.MeshLambertMaterial({color: 0xbbbbbb, shading: THREE.shading});
        this.material.food    = new THREE.MeshLambertMaterial({color: 0x999900, shading: THREE.shading});
        
        // map reset
        
        var lined,linem,y,x;
        
        for(y=0; y<this.width; y++)
        {
            lined = [];
            linem = [];
            for(x=0; x<this.width; x++)
            {
                lined.push(0);
                linem.push(0);
            }
            this.data.push(lined);
            this.mesh.push(linem);
        }
        
        // map wall & food
       
        for(y=0; y<this.random.wall; y++)
        {            
            this.add(WALL,parseInt(Math.random()*this.width),parseInt(Math.random()*this.width));          
        }
        
        for(y=0; y<this.random.food; y++)
        {            
            this.add(FOOD,parseInt(Math.random()*this.width),parseInt(Math.random()*this.width));          
        }
    },
    
    add: function(type,x,y)
    {
        // laisse libre les 4 coins
        if((x==0 && y==0) || (x==this.width && y==0) || (x==this.width && y==this.width) || (x==0 && y==this.width))    return;
        
        this.data[x][y] = type;
        
        var o;
        switch(type){
            case WALL:
                o = new THREE.Mesh(this.geometry.wall, this.material.wall);
                break;
            case FOOD:
                o = new THREE.Mesh(this.geometry.food, this.material.food);
                break;
        }
        o.position.x = x*50;
        o.position.z = y*50;
        
        this.mesh[x][y] = o;
        arena.graphic.scene.add(o);
    },
    
    del: function(x,y){
         this.data[x][y] = 0;
         this.mesh[x][y].visible = false;
    },
    
    add_robot: function(r)
    {
        var ar = arena.robot;
        this.data[r.position.x][r.position.y] = r.id;
                
        r.gfx = new THREE.Mesh(this.geometry.robot, new THREE.MeshLambertMaterial({shading: THREE.shading}));
        r.gfx.materials[0].color = new THREE.Color(arena.robot.color[r.id]);

        ar.move(r,ar.start_pos[r.id].x, ar.start_pos[r.id].y);
               
        r.gfx.position.x = r.position.x*50;
        r.gfx.position.z = r.position.y*50;
        arena.graphic.scene.add(r.gfx);
    }
};

arena.graphic = {
    
    render: function()
    {
        this.camera.lookAt( this.cameraTarget );
        this.renderer.render( this.scene, this.camera );
    },
    
    init: function(){
       
       // container
    
        this.container = document.createElement( 'div' );
        document.body.appendChild( this.container );

        this.renderer = new THREE.WebGLRenderer( {antialias: true} );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.container.appendChild( this.renderer.domElement );

        // camera
        var radius = 500;
        
        this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.y = 600;
        this.camera.position.z = 1600;
        this.camera.position.x = arena.map.width*25;
	this.cameraTarget = new THREE.Vector3( arena.map.width*25, 0, arena.map.width*25 );

        // scene

        this.scene = new THREE.Scene();

        // Lights

        var ambientLight = new THREE.AmbientLight( 0x444444 );
        this.scene.add( ambientLight );

        var dirLight = new THREE.DirectionalLight( 0xFFFFFF );
        dirLight.position.set( -1, 1, 0 ).normalize();
        this.scene.add( dirLight );

        // stats
        
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.container.appendChild( this.stats.domElement );
       
        console.log('WebGL graphic inited');
    }
};