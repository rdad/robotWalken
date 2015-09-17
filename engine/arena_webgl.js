(function(ctx){

	var rw;
	var mesh = [],
		camera_position = [],
		camera_id 		= 0,
		camera_y  		= 600;

	var mesh_library = {};
	
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
	        this.renderer.shadowMapEnabled = true;
	        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

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
			this.camera.position.y = camera_y; //600;
	        this.camera.position.z = camera_position[camera_id].z; //1600;
	        this.camera.position.x = camera_position[camera_id].x; //500; //this.width;
			this.cameraTarget = new THREE.Vector3( this.width*25, 0, this.width*25 );


	        // scene

	        this.scene = new THREE.Scene();

	        // stats
	        
	        this.stats = new Stats();
	        this.stats.domElement.style.position = 'absolute';
	        this.stats.domElement.style.top = '0px';
	        this.container.appendChild( this.stats.domElement );

	        // grid
	        var w 			= this.width * 50,
	        	groundMat 	= new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );

			groundMat.color.setHSL( 0.095, 1, 0.75 );

	        this.plane = new THREE.Mesh( new THREE.PlaneGeometry( this.width*50, this.height*50, this.width, this.height ), groundMat); // new THREE.MeshBasicMaterial( {color: 0x555555, wireframe: true} ) );
	        this.plane.rotation.x = - 90 * Math.PI / 180;
	        this.plane.position.x = (50*(this.width*.5))-25;
	        this.plane.position.z = (50*(this.width*.5))-25;
	        this.plane.position.y = -25;
	        this.plane.receiveShadow = true;
	        rw.arena.graphic.scene.add( this.plane );

	        var wireframe = new THREE.WireframeHelper( this.plane , 0xffffff );
	        rw.arena.graphic.scene.add( wireframe );


	        // Lights
	        
	        this.scene.add( new THREE.AmbientLight( 0x222222 ) );

			var light = new THREE.PointLight( 0xffffff );
			light.position.copy( this.camera.position );
			light.position.y = 50;

			this.scene.add( light );

			var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
			dirLight.color.setHSL( 0.1, 1, 0.95 );
			dirLight.position.set( this.width*10, 400, this.width*5 );

			dirLight.castShadow 		= true;
			dirLight.shadowMapWidth 	= 2048;
			dirLight.shadowMapHeight 	= 2048;
			//dirLight.shadowCameraVisible= true;

			dirLight.shadowBias 		= -0.0001;
			dirLight.shadowDarkness 	= 0.45;

			dirLight.target = this.plane;


			this.scene.add( dirLight );
	        

	        build_mesh_library();

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

				// RIGHT
				case 37:
					camera_id--;
					if(camera_id<0)	camera_id = camera_position.length-1;
					move_camera();
					log('[arena_webgl] turn camera');
					break;

				// UP
				case 38:
					camera_y = 600;
					move_camera();
					log('[interface] speed up : '+rw.config.time_step);
					break;

				// DOWN
				case 40:
					camera_y = 100;
					move_camera();
					log('[interface] speed down : '+rw.config.time_step);
					break;
			}
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

		animation: {

			bump: function(robot, x,y){   	

    			var o = new THREE.Mesh(new THREE.CylinderGeometry( 25, 25, 1, 15, 1 ), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.6}));
    			var selfc = self;
    			o.position.x = x*50;
        		o.position.z = y*50;
        		self.scene.add(o);

        		if(x == robot.position.x){
        			o.position.z += (y < robot.position.y) ? 25 : -25;
        			o.rotation.x = - 90 * Math.PI / 180;
        		}else{
        			o.position.x += (y < robot.position.y) ? 25 : -25;
        			o.rotation.z = - 90 * Math.PI / 180;
        		}
        		
        		var tween = TweenMax.to(o.scale, .4, {
					x: 2,
					y: 2,
					z: 2,
					ease:Cubic.easeInOut,
					onUpdate: function(){
						o.material.opacity -= 0.03;
						log('UU');
					},
					onComplete: function(){
						selfc.scene.remove(o);
					}
				});

				var scramble = TweenMax.to(robot.gfx.position, .2, {
					y: '+=20',
					ease:Back.easeOut,
					onComplete: function(){
						scramble.reverse();
					}
				});

			}
		}
	};

	var self = arena_webgl;
	ctx.add_module('arena_webgl', arena_webgl);


	// --- PRIVATE

	function move_camera(){

		var tween = TweenMax.to(self.camera.position, .6, {
			z: camera_position[camera_id].z,
			x: camera_position[camera_id].x,
			y: camera_y,
			ease:Linear.easeInOut
		});
		log('[arena_webgl] turn camera');

	}

	function add_mesh(type,x,y)
    {
		if(type>0 && type<50){
			var o = new THREE.Mesh(mesh_library[ROBOT].geometry.clone(), mesh_library[ROBOT].material.clone());
			var robot = rw.robot_manager.get_robot(type);
			rgb = '#'+rw.arena.color[robot.id];
			o.material.color = new THREE.Color(rgb);
			robot.set_gfx(o);
		}else{
			var o = mesh_library[type].clone();
		}

        o.position.x = x*50;
        o.position.z = y*50;
        o.castShadow = true;
		//o.receiveShadow = true;
        
        mesh[x][y] = o;
        self.scene.add(o);

        // Door
        if(type==DOOR){
        	o.position.y += 25;

        	var o2 = new THREE.Mesh(new THREE.BoxGeometry( 40, 90, 40 ), new THREE.MeshLambertMaterial({color: 0x67DD2C, shading: THREE.SmoothShading}));
        	o2.position.x = x*50;
        	o2.position.z = y*50;
        	o2.position.y += 20;
        	self.scene.add(o2);
        }

        // Button
        if(type==BUTTON){
        	o.position.y -= 20;
        }

        // Hole
        if(type==HOLE){
        	o.position.y -= 25;
        }

        return o;
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

    function build_mesh_library(){

	    // Robot	    
	    mesh_library[ROBOT] = new THREE.Mesh(new THREE.CylinderGeometry( 15, 25, 50, 10, 10), new THREE.MeshLambertMaterial({color: 0xbbbbbb, shading: THREE.SmoothShading}));
    
    	// Wall    	
    	mesh_library[WALL] = new THREE.Mesh(new THREE.BoxGeometry( 50, 50, 50 ), new THREE.MeshPhongMaterial( { color: 0xDEAF47, specular: 0x050505 } ));
    
    	// Door    	
    	mesh_library[DOOR] = new THREE.Mesh(new THREE.BoxGeometry( 50, 100, 50 ), new THREE.MeshLambertMaterial({color: 0x67DD2C, shading: THREE.SmoothShading, opacity: .7, transparent: true}));
    
    	// Energy    	
    	mesh_library[ENERGY] = new THREE.Mesh(new THREE.SphereGeometry( 15, 10, 10 ), new THREE.MeshPhongMaterial({color: 0xffffff}));
    
    	// Laser    	
    	mesh_library[LASER]  = new THREE.Mesh(new THREE.CylinderGeometry( 1, 25, 60, 3, 1 ), new THREE.MeshPhongMaterial({color: 0x7182F2}));
    
    	// Button    	
    	mesh_library[BUTTON]  = new THREE.Mesh(new THREE.CylinderGeometry( 20, 20, 5, 15, 1 ), new THREE.MeshPhongMaterial({color: 0x09509D}));
    
    	// Hole    	
    	mesh_library[HOLE]   = new THREE.Mesh(new THREE.CylinderGeometry( 25, 25, 1, 15, 1 ), new THREE.MeshPhongMaterial({color: 0x000000}));
    }

})(robotWalken);