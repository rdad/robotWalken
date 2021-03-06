(function(ctx) {
	var rw;
	var mesh = [],
		camera_position = [],
		camera_id = 0,
		camera_y = 600,
		background_color = 0xd4d1be;

	var mesh_library = {};

	var arena_webgl = {
		width: 0,
		height: 0,

		init: function() {
			// container

			this.container = document.createElement('div');
			this.container.setAttribute('id', 'arena');
			document.body.appendChild(this.container);

			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setClearColor(background_color);
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.shadowMap.enabled = true;
			this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

			this.container.appendChild(this.renderer.domElement);

			// camera
			var radius = 500;
			this.width = rw.arena.get('width');
			this.height = rw.arena.get('height');

			camera_position[0] = { x: this.width * 0.5 * 50, z: this.width * 80 };
			camera_position[1] = { x: this.width * 80, z: this.width * 50 * 0.5 };
			camera_position[2] = { x: this.width * 0.5 * 50, z: -this.width * 30 };
			camera_position[3] = { x: -this.width * 30, z: this.width * 50 * 0.5 };

			this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
			this.camera.position.y = camera_y; //600;
			this.camera.position.z = camera_position[camera_id].z; //1600;
			this.camera.position.x = camera_position[camera_id].x; //500; //this.width;
			this.cameraTarget = new THREE.Vector3(this.width * 25, 0, this.width * 25);

			// scene

			this.scene = new THREE.Scene();

			// grid
			var w = this.width * 50,
				groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });

			groundMat.color.setHSL(0.095, 1, 0.75);

			const p = new THREE.PlaneGeometry(this.width * 50, this.height * 50, this.width, this.height);
			this.plane = new THREE.Mesh(p, groundMat); // new THREE.MeshBasicMaterial( {color: 0x555555, wireframe: true} ) );
			this.plane.rotation.x = (-90 * Math.PI) / 180;
			this.plane.position.x = 50 * (this.width * 0.5) - 25;
			this.plane.position.z = 50 * (this.width * 0.5) - 25;
			this.plane.position.y = -25;
			this.plane.receiveShadow = true;
			rw.arena.graphic.scene.add(this.plane);

			var wireframe = new THREE.WireframeGeometry(p);

			var line_mat = new THREE.LineBasicMaterial({
				color: 0x000000,
				linewidth: 10
			});

			var line = new THREE.LineSegments(wireframe, line_mat);
			line.material.depthTest = true;
			line.material.opacity = 0.5;
			line.material.transparent = true;
			line.rotation.x = (-90 * Math.PI) / 180;
			line.position.x = 50 * (this.width * 0.5) - 25;
			line.position.z = 50 * (this.width * 0.5) - 25;
			line.position.y = -25;

			rw.arena.graphic.scene.add(line);

			// Lights

			this.scene.add(new THREE.AmbientLight(0x222222));

			var light = new THREE.PointLight(0xffffff);
			light.position.copy(this.camera.position);
			light.position.y = 50;

			this.scene.add(light);

			var dirLight = new THREE.DirectionalLight(0xffffff, 1);
			dirLight.color.setHSL(0.1, 1, 0.95);
			dirLight.position.set(this.width * 10, 400, this.width * 5);

			dirLight.castShadow = true;
			dirLight.shadow.mapSize.width = 2048;
			dirLight.shadow.mapSize.height = 2048;

			dirLight.shadow.bias = -0.0001;

			dirLight.target = this.plane;

			this.scene.add(dirLight);

			build_mesh_library();

			// trident

			if (robotWalken.get('debug') === true) {
				// stats

				this.stats = new Stats();
				this.stats.domElement.style.position = 'absolute';
				this.stats.domElement.style.top = '0px';
				this.container.appendChild(this.stats.domElement);

				// trident

				rw.arena.graphic.scene.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-25, -25, -25), 50, 0xff0000, 10, 20));
				rw.arena.graphic.scene.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-25, -25, -25), 50, 0x00ff00, 10, 20));
				rw.arena.graphic.scene.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(-25, -25, -25), 50, 0x0000ff, 10, 20));
			}

			prepare_mesh_map();

			document.addEventListener('keydown', self.onKeyDown);

			log('[arena] WebGL graphic driver inited');
		},

		onKeyDown: function(e) {
			switch (e.keyCode) {
				// LEFT
				case 39:
					camera_id++;
					if (camera_id >= camera_position.length) camera_id = 0;
					move_camera();
					break;

				// RIGHT
				case 37:
					camera_id--;
					if (camera_id < 0) camera_id = camera_position.length - 1;
					move_camera();
					log('[arena_webgl] turn camera');
					break;

				// UP
				case 38:
					camera_y = 600;
					move_camera();
					log('[interface] speed up : ' + rw.config.time_step);
					break;

				// DOWN
				case 40:
					camera_y = 100;
					move_camera();
					log('[interface] speed down : ' + rw.config.time_step);
					break;
			}
		},

		build_map: function() {
			var map = rw.arena.get('map');

			for (y = 0; y < rw.arena.get('height'); y++) {
				for (x = 0; x < rw.arena.get('width'); x++) {
					if (map[x][y] > EMPTY) {
						add_mesh(map[x][y], x, y);
					}
				}
			}

			self.render();

			log('[arena.graphic] build_map : All elements are on map');
		},

		render: function() {
			this.camera.lookAt(this.cameraTarget);
			this.renderer.render(this.scene, this.camera);
		},

		set_handler: function(m) {
			rw = m;
		},

		get_mesh: function(x, y) {
			return mesh[x][y];
		},

		animation: {
			click_button: function(robot) {
				var o = new THREE.Mesh(
						new THREE.CylinderGeometry(25, 25, 600, 20, 1),
						new THREE.MeshBasicMaterial({ color: 0x09509d, transparent: true, opacity: 0.6 })
					),
					selfc = self;

				o.position.x = robot.position.x * 50;
				o.position.z = robot.position.y * 50;
				o.position.y = 275;
				self.scene.add(o);

				mesh[robot.position.x][robot.position.y].position.y = -27;

				var tween = TweenMax.to(o.material, 0.4, {
					opacity: 0,
					ease: Cubic.CubicIn,
					onComplete: function() {
						selfc.scene.remove(o);
					}
				});
			},

			open_door: function(door, remove_at_end) {
				var d = door,
					o = new THREE.Mesh(
						new THREE.CylinderGeometry(25, 25, 600, 20, 1),
						new THREE.MeshBasicMaterial({ color: 0x09509d, transparent: true, opacity: 0.6 })
					),
					selfc = self;

				remove_at_end = typeof remove_at_end === 'undefined' ? true : false;

				o.position.x = door.position.x;
				o.position.z = door.position.z;
				o.position.y = 275;
				self.scene.add(o);

				var t1 = TweenMax.to(o.material, 0.4, {
					opacity: 0,
					ease: Cubic.CubicIn,
					onComplete: function() {
						selfc.scene.remove(o);
					}
				});

				var t2 = TweenMax.to(door.material, 0.4, {
					opacity: 0,
					ease: Cubic.CubicIn,
					onComplete: function() {
						if (remove_at_end === true) selfc.scene.remove(d);
					}
				});
			},

			energy: function(robot) {
				var o = new THREE.Mesh(
						new THREE.CylinderGeometry(25, 25, 600, 20, 1),
						new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
					),
					selfc = self;

				o.position.x = robot.position.x * 50;
				o.position.z = robot.position.y * 50;
				o.position.y = 275;
				self.scene.add(o);

				mesh[robot.position.x][robot.position.y].visible = false;

				var tween = TweenMax.to(o.material, 0.4, {
					opacity: 0,
					ease: Cubic.CubicIn,
					onComplete: function() {
						selfc.scene.remove(o);
					}
				});

				robot.gfx.position.y += 10;
				var scramble = TweenMax.to(robot.gfx.position, 0.2, {
					y: 0,
					ease: Back.easeOut
				});
			},

			exit: function(robot) {
				var r = robot;
				var t = TweenMax.to(robot.gfx.position, 0.6, {
					y: 105,
					ease: Back.easeInOut,
					onComplete: function() {
						rw.arena.set_robot_exit(r);
					}
				});
			},

			fall: function(robot) {
				var r = robot;
				var t = TweenMax.to(robot.gfx.position, 0.6, {
					y: -100,
					ease: Back.easeInOut,
					onComplete: function() {
						r.gfx.visible = false;
					}
				});
			},

			move: function(robot, x, y) {
				var anim_length = rw.config.time_step * (1000 / 60) * 0.001;
				var rob = robot;

				var tween = TweenMax.to(robot.gfx.position, anim_length, {
					x: x * 50,
					z: y * 50,
					ease: Cubic.easeInOut,
					onComplete: function() {
						var b = rw.arena.get_behaviour(rob.position.x, rob.position.y);
						if (b !== false) {
							b(rob);
						}
					}
				});
			},

			look: function(robot, x, y) {
				var o = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }));
				var selfc = self;
				o.position.x = x * 50;
				o.position.z = y * 50;
				o.position.y -= 25;
				o.rotation.x = (-90 * Math.PI) / 180;

				self.scene.add(o);

				var tween = TweenMax.to(o.material, 0.2, {
					opacity: 0,
					ease: Cubic.easeInOut,
					onComplete: function() {
						selfc.scene.remove(o);
					}
				});
			},

			bump: function(robot, x, y) {
				var o = new THREE.Mesh(
						new THREE.CylinderGeometry(25, 25, 1, 15, 1),
						new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 })
					),
					selfc = self,
					r = robot;

				o.position.x = x * 50;
				o.position.z = y * 50;
				self.scene.add(o);

				if (x == robot.position.x) {
					o.position.z += y < robot.position.y ? 25 : -25;
					o.rotation.x = (-90 * Math.PI) / 180;
				} else {
					o.position.x += y < robot.position.y ? 25 : -25;
					o.rotation.z = (-90 * Math.PI) / 180;
				}

				var tween = TweenMax.to(o.scale, 0.4, {
					x: 2,
					y: 2,
					z: 2,
					ease: Cubic.easeInOut,
					onUpdate: function() {
						o.material.opacity -= 0.03;
					},
					onComplete: function() {
						selfc.scene.remove(o);
					}
				});

				robot.gfx.position.y += 10;
				var scramble = TweenMax.to(robot.gfx.position, 0.2, {
					y: 0,
					ease: Back.easeOut
				});
			}
		}
	};

	var self = arena_webgl;
	ctx.add_module('arena_webgl', arena_webgl);

	// --- PRIVATE

	function move_camera() {
		var tween = TweenMax.to(self.camera.position, 0.6, {
			z: camera_position[camera_id].z,
			x: camera_position[camera_id].x,
			y: camera_y,
			ease: Linear.easeInOut
		});
		log('[arena_webgl] turn camera');
	}

	function add_mesh(type, x, y) {
		if (type > 0 && type < 50) {
			var o = new THREE.Mesh(mesh_library[ROBOT].geometry.clone(), mesh_library[ROBOT].material.clone());
			var robot = rw.robot_manager.get_robot(type);
			rgb = '#' + rw.arena.color[robot.id];
			o.material.color = new THREE.Color(rgb);
			robot.set_gfx(o);
		} else {
			var o = mesh_library[type].clone();
		}

		o.position.x = x * 50;
		o.position.z = y * 50;
		o.castShadow = true;

		mesh[x][y] = o;
		self.scene.add(o);

		// Exit Door
		if (type == EXIT) {
			var o2 = new THREE.Mesh(new THREE.BoxGeometry(40, 90, 40), new THREE.MeshLambertMaterial({ color: 0x67dd2c, shading: THREE.SmoothShading }));
			o.add(o2);
			o.position.y += 25;
		}

		// Button
		if (type == BUTTON) {
			o.position.y -= 20;
		}

		// Hole
		if (type == HOLE) {
			o.position.y -= 24;
			o.castShadow = false;
		}

		return o;
	}

	function del(x, y) {
		mesh[x][y].visible = false;
	}

	function prepare_mesh_map() {
		var lined, y, x;

		for (y = 0; y < rw.arena.get('height'); y++) {
			lined = [];
			for (x = 0; x < rw.arena.get('width'); x++) {
				lined.push(EMPTY);
			}
			mesh.push(lined);
		}
	}

	function build_mesh_library() {
		// Robot
		mesh_library[ROBOT] = new THREE.Mesh(
			new THREE.CylinderGeometry(15, 25, 50, 10, 10),
			new THREE.MeshLambertMaterial({ color: 0xbbbbbb, shading: THREE.SmoothShading })
		);

		// Wall
		mesh_library[WALL] = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshPhongMaterial({ color: 0xdeaf47, specular: 0x050505 }));

		// Door
		mesh_library[DOOR] = new THREE.Mesh(
			new THREE.BoxGeometry(50, 50, 50),
			new THREE.MeshPhongMaterial({ color: 0xdeff47, specular: 0x050505, opacity: 0.7, transparent: true })
		);

		// Exit
		mesh_library[EXIT] = new THREE.Mesh(
			new THREE.BoxGeometry(50, 100, 50),
			new THREE.MeshLambertMaterial({ color: 0x67dd2c, shading: THREE.SmoothShading, opacity: 0.7, transparent: true })
		);

		// Energy
		mesh_library[ENERGY] = new THREE.Mesh(new THREE.SphereGeometry(15, 10, 10), new THREE.MeshPhongMaterial({ color: 0xffffff }));

		// Laser
		mesh_library[LASER] = new THREE.Mesh(new THREE.CylinderGeometry(1, 25, 60, 3, 1), new THREE.MeshPhongMaterial({ color: 0x7182f2 }));

		// Button
		mesh_library[BUTTON] = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 5, 15, 1), new THREE.MeshPhongMaterial({ color: 0x09509d }));

		// Hole
		mesh_library[HOLE] = new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 1, 20, 1), new THREE.MeshBasicMaterial({ color: 0x000000 }));

		// SUPER SIMPLE GLOW EFFECT
		// use sprite because it appears the same from all angles
		/*var spriteMaterial = new THREE.SpriteMaterial( 
		{ 
			map: new THREE.ImageUtils.loadTexture( 'images/glow.png' ), 
			useScreenCoordinates: false, alignment: THREE.SpriteAlignment.center,
			color: 0x0000ff, transparent: false, blending: THREE.AdditiveBlending
		});
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(200, 200, 1.0);
		mesh.add(sprite); // this centers the glow at the mesh*/
	}
})(robotWalken);
