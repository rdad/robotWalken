(function(ctx){

	var rw;
	var mesh = [];
	
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
	        this.renderer.setClearColor( 0xd4d1be );
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

	        /*var ambientLight = new THREE.AmbientLight( 0x444444 );
	        this.scene.add( ambientLight );

	        var dirLight = new THREE.DirectionalLight( 0xFFFFFF );
	        dirLight.position.set( -1, 1, 0 ).normalize();
	        this.scene.add( dirLight );*/

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
	        
	        // objects 
	        this.material.robot   = new THREE.MeshLambertMaterial({shading: THREE.SmoothShading});
	        this.material.wall    = new THREE.MeshLambertMaterial({color: 0xbbbbbb, shading: THREE.SmoothShading});
	        this.material.food    = new THREE.MeshLambertMaterial({color: 0x999900, shading: THREE.SmoothShading});

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
        	var robot = rw.robot_manager.get_robot(type),
        		rgb = '#'+rw.arena.color[robot.id];
        	o = new THREE.Mesh(self.geometry.robot, new THREE.MeshLambertMaterial({shading: THREE.SmoothShading, color: new THREE.Color(rgb)}));
        	// o.material.color = new THREE.Color('0x'+rw.arena.color[robot.id]);
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