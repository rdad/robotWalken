(function(ctx){

	var rw;
	var mesh = [],
		camera_position = [],
		camera_id = 0;
	
	var arena_webgl = {

		width: 0,
		height: 0,
		geometry: {robot:null,wall:null,food:null, door: null},
    	material: {robot:null,wall:null, food:null, door: null},

	    init: function(){
	       
	       // container
	    
	        this.container = document.createElement( 'div' );
	        this.container.setAttribute('id','arena');
	        document.body.appendChild( this.container );

	        this.renderer = new THREE.WebGLRenderer( {antialias: true} );
	        this.renderer.setClearColor( 0xd4d1be );
	        this.renderer.setSize( window.innerWidth, window.innerHeight );

	        this.container.appendChild( this.renderer.domElement );

	        // camera
	        var radius 	= 500;
	        this.width 	= rw.arena.get('width');
	        this.height = rw.arena.get('height');

	        camera_position[0] = {x: this.width*.5*50, z: this.width*80};
	        camera_position[1] = {x: this.width*80, z: this.width*50*.5};
	        camera_position[2] = {x: this.width*.5*50, z: -this.width*30};
	        camera_position[3] = {x: -this.width*30, z: this.width*50*.5};
	        
	        this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
			this.camera.position.y = 600;
	        this.camera.position.z = camera_position[camera_id].z; //1600;
	        this.camera.position.x = camera_position[camera_id].x; //500; //this.width;
			this.cameraTarget = new THREE.Vector3( this.width*25, 0, this.width*25 );

	        // scene

	        this.scene = new THREE.Scene();


	        this.scene.add( new THREE.AmbientLight( 0x222222 ) );

			var light = new THREE.PointLight( 0xffffff );
			light.position.copy( this.camera.position );
			this.scene.add( light );

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
	        this.geometry.wall    = new THREE.BoxGeometry( 50, 50, 50 );
	        this.geometry.food    = new THREE.SphereGeometry( 20, 10, 10 );
	        this.geometry.door 	  = new THREE.TorusGeometry( 10, 10, 20, 10 );
	        
	        // objects 
	        this.material.robot   = new THREE.MeshLambertMaterial({shading: THREE.SmoothShading});
	        this.material.wall    = new THREE.MeshLambertMaterial({color: 0xbbbbbb, shading: THREE.SmoothShading});
	        this.material.food    = new THREE.MeshLambertMaterial({color: 0x999900, shading: THREE.SmoothShading});
	        this.material.door    = new THREE.MeshLambertMaterial({color: 0xff0000, shading: THREE.SmoothShading});


	        // trident
	        
	        if(robotWalken.get('debug') === true){
	        	rw.arena.graphic.scene.add( new THREE.ArrowHelper(new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( -25, -25, -25 ), 50, 0xff0000, 10, 20) );
	        	rw.arena.graphic.scene.add( new THREE.ArrowHelper(new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( -25, -25, -25 ), 50, 0x00ff00, 10, 20) );
	        	rw.arena.graphic.scene.add( new THREE.ArrowHelper(new THREE.Vector3( 0, 0, 1 ), new THREE.Vector3( -25, -25, -25 ), 50, 0x0000ff, 10, 20) );
	        }

	        prepare_mesh_map();

	        document.addEventListener("keydown", self.onKeyDown);
	       
	        log('[arena] WebGL graphic driver inited');
	    },

	    onKeyDown: function(e){

			switch(e.keyCode){

				// LEFT
				case 39:
					camera_id++;
					if(camera_id>=camera_position.length)	camera_id = 0;
					move_camera();
					break;

				case 37:
					camera_id--;
					if(camera_id<0)	camera_id = camera_position.length-1;
					move_camera();
					log('[arena_webgl] turn camera');
					break;
				



			}
			log(e.keyCode);
		},

	    build_map: function(){

	    	var map = rw.arena.get('map');

	    	for(y=0; y<rw.arena.get('height'); y++)
	        {
	            for(x=0; x<rw.arena.get('width'); x++)
	            {
	                if(map[x][y]>EMPTY){
	                	add_mesh(map[x][y], x, y);
	                	log('XXX XXX');
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

	function move_camera(){

		var tween = TweenMax.to(self.camera.position, 1, {
			z: camera_position[camera_id].z,
			x: camera_position[camera_id].x,
			ease:Linear.easeInOut
		});

		//self.camera.position.z = camera_position[camera_id].z;
	    //self.camera.position.x = camera_position[camera_id].x;
		log('[arena_webgl] turn camera');

	}

	function add_mesh(type,x,y)
    {
        
        var o;
        switch(type){
            case WALL:
                o = new THREE.Mesh(self.geometry.wall, self.material.wall);
                break;
            case FOOD:
                o = new THREE.Mesh(self.geometry.food, self.material.food);
                break;
            case DOOR:
                o = new THREE.Mesh(self.geometry.door, self.material.door);
               //o.rotation = 90;
                break;
        }

        // Robots
        
        if(typeof o == 'undefined' && type>0 && type<50){
        	var robot = rw.robot_manager.get_robot(type),
        		rgb = '#'+rw.arena.color[robot.id];
        	o = new THREE.Mesh(self.geometry.robot, new THREE.MeshLambertMaterial({shading: THREE.SmoothShading, color: new THREE.Color(rgb)}));
        	robot.set_gfx(o);
        	log(robot);
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