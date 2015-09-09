(function(ctx){

	var rw;
	var mesh = [];

	var robot_color= ['','0xff0000','0x00ff00','0x0000ff','0xffffff'];
	
	var arena_webgl = {

		width: 0,
		height: 0,
		geometry: {robot:null,wall:null,food:null},
    	material: {robot:null,wall:null, food:null},

	    init: function(){
	       
	       // container
	    
	        this.container = document.createElement( 'div' );
	        this.container.setAttribute('id','arena');
	        document.body.appendChild( this.container );

	        this.renderer = new THREE.WebGLRenderer( {antialias: true} );
	        this.renderer.setSize( window.innerWidth, window.innerHeight );

	        this.container.appendChild( this.renderer.domElement );

	        // camera
	        var radius 	= 500;
	        this.width 	= rw.arena.get('width');
	        this.height = rw.arena.get('height');
	        
	        this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
			this.camera.position.y = 600;
	        this.camera.position.z = 1600;
	        this.camera.position.x = 500; //this.width;
			this.cameraTarget = new THREE.Vector3( this.width*25, 0, this.width*25 );

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

	        // grid
	        var w = this.width * 50;
	        this.plane = new THREE.Mesh( new THREE.PlaneGeometry( this.width*50, this.height*50, this.width, this.height ), new THREE.MeshBasicMaterial( {color: 0x555555, wireframe: true} ) );
	        this.plane.rotation.x = - 90 * Math.PI / 180;
	        this.plane.position.x = (50*(this.width*.5))-25;
	        this.plane.position.z = (50*(this.width*.5))-25;
	        this.plane.position.y = -25;
	        rw.arena.graphic.scene.add( this.plane );
	        
	        // geometry        
	        this.geometry.robot   = new THREE.CylinderGeometry( 15, 25, 50, 10, 10);
	        this.geometry.wall    = new THREE.CubeGeometry( 50, 50, 50 );
	        this.geometry.food    = new THREE.SphereGeometry( 20, 10, 10 );
	        
	        // objects 
	        this.material.robot   = new THREE.MeshLambertMaterial({shading: THREE.shading});
	        this.material.wall    = new THREE.MeshLambertMaterial({color: 0xbbbbbb, shading: THREE.shading});
	        this.material.food    = new THREE.MeshLambertMaterial({color: 0x999900, shading: THREE.shading});

	        prepare_mesh_map();
	       
	        log('[arena] WebGL graphic driver inited');
	    },

	    build_map: function(){

	    	var map = rw.arena.get('map');

	    	for(y=0; y<rw.arena.get('height'); y++)
	        {
	            for(x=0; x<rw.arena.get('width'); x++)
	            {
	                if(map[x][y]>EMPTY){
	                	add_mesh(map[x][y], x, y);
	                }
	            }
	        }

	        self.render();

	        log('[arena.graphic] build_map : All elements are on map');
	    },

	    render: function()
	    {
	        this.camera.lookAt( this.cameraTarget );
	        this.renderer.render( this.scene, this.camera );
	    },

		set_handler: function(m){
			rw = m;
		},
	};

	var self = arena_webgl;
	ctx.add_module('arena_webgl', arena_webgl);


	// --- PRIVATE

	function add_mesh(type,x,y)
    {
    	console.log(type,x,y);

        // laisse libre les 4 coins
        //if((x==0 && y==0) || (x==this.width && y==0) || (x==this.width && y==this.width) || (x==0 && y==this.width))    return;
        
        var o;
        switch(type){
            case WALL:
                o = new THREE.Mesh(self.geometry.wall, self.material.wall);
                break;
            case FOOD:
                o = new THREE.Mesh(self.geometry.food, self.material.food);
                break;
        }

        // Robts
        
        if(!o && type>0 && type<50){
        	var robot = rw.robot_manager.get_robot(type);
        	o = new THREE.Mesh(self.geometry.robot, new THREE.MeshLambertMaterial({shading: THREE.shading}));
        	o.materials[0].color = new THREE.Color(robot_color[robot.id]);
        	robot.gfx = o;
        }

        o.position.x = x*50;
        o.position.z = y*50;
        
        mesh[x][y] = o;
        self.scene.add(o);
    }
    
    function del(x,y){
         mesh[x][y].visible = false;
    }

    function prepare_mesh_map(){

    	var lined,y,x;
	        
        for(y=0; y<rw.arena.get('height'); y++)
        {
            lined = [];
            for(x=0; x<rw.arena.get('width'); x++)
            {
                lined.push(EMPTY);
            }
            mesh.push(lined);
        }
    }

})(robotWalken);