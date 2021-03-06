
/*
Game 0
This is a ThreeJS program which implements a simple game
The user moves a cube around the board trying to knock balls into a cone

*/


	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam;  // we have two cameras in the main scene
	var avatar, bear;
	// here are some mesh objects ...

	var cone;

	var startScene, startCamera, startPlane;

	var endScene, endCamera, endText;

    var numPenguins = 4;



	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false,
		    camera:camera, p1:false, p2:false, p3:false, p4: false}

	var gameState =
	     {score:0, health:10, scene:'thestart', camera:'none' }


	var investigated1 = false;
	var penguin1;
	var investigated2 = false;
	var penguin2;
	var investigated3 = false;
	var penguin3;
	var investigated4 = false;
	var penguin4;

	// Here is the main game control
  init(); //
	initControls();
	animate();  // start the animation loop!


	function createStartScene(){
		startScene = initScene();

		var geometry = new THREE.PlaneGeometry( 40, 30, 128 );
		var texture = new THREE.TextureLoader().load( '../images/startmenu.png' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		startPlane = new THREE.Mesh( geometry, material );

		startScene.add(startPlane);
		var light1 = createPointLight();
		var light2 = createPointLight();
		light1.position.set(5,0,10);
		light2.position.set(-5,0,10);
		startScene.add(light1);
		startScene.add(light2);
		startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		startCamera.position.set(0,0,15);
		startCamera.lookAt(0,0,0);

	}

	function createWhichScene(){
		whichScene = initScene();
		whichText = createEndScreen('whichpenguin.jpg');
		//endText.rotateX(Math.PI);
		whichScene.add(whichText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		whichScene.add(light1);
		whichCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		whichCamera.position.set(0,80,1);
		whichCamera.lookAt(0,0,0);

	}

	function createWinScene(){
		winScene = initScene();
		winText = createEndScreen('penguin.jpg');
		//endText.rotateX(Math.PI);
		winScene.add(winText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		winScene.add(light1);
		winCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		winCamera.position.set(0,80,1);
		winCamera.lookAt(0,0,0);

	}

    function createLoseScene(){
		loseScene = initScene();
		loseText = createEndScreen('polarbear.jpg');
		//endText.rotateX(Math.PI);
		loseScene.add(loseText);
		var light2 = createPointLight();
		light2.position.set(0,200,20);
		loseScene.add(light2);
		loseCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		loseCamera.position.set(0,80,1);
		loseCamera.lookAt(0,0,0);

	}

	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			scene = initScene();
			createStartScene()
			createWhichScene();
			createWinScene();
            createLoseScene();
			initRenderer();
			createMainScene();
	}


	function createMainScene(){
      // setup lighting
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			scene.add(light1);
			var light0 = new THREE.AmbientLight( 0xffffff,0.25);
			scene.add(light0);

			// create main camera
			camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(0,50,0);
			camera.lookAt(0,0,0);



			// create the ground and the skybox
			var ground = createGround('white.jpg');
			scene.add(ground);
			var skybox = createSkyBox('snow1.jpg',1);
			scene.add(skybox);


            //addBalls();
	    addQM1();
            addQM2();
            addQM3();
            addQM4();

	/*
            var investigated1 = false;
						var penguin1 = createPenguinMesh();
			penguin1.position.set(25,5,25);
			scene.add(penguin1);
			penguin1.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar && !investigated1){
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==numPenguins) {
							gameState.scene='decide';
						}
						investigated1 = true;
					}
				}
			)

            var investigated2 = false;
            var penguin2 = createPenguinMesh();
			penguin2.position.set(25,5,-25);
			scene.add(penguin2);

			penguin2.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar && !investigated2){
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==numPenguins) {
							gameState.scene='decide';
						}
						investigated2 = true;
					}
				}
			)

            var investigated3 = false;
            var penguin3 = createPenguinMesh();
			penguin3.position.set(-25,5,30);
			scene.add(penguin3);

			penguin3.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar && !investigated3){
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==numPenguins) {
							gameState.scene='decide';
						}
						investigated3 = true;
					}
				}
			)

            var investigated4 = false;
            var penguin4 = createPenguinMesh();
			penguin4.position.set(-25,5,-25);
			scene.add(penguin4);

			penguin4.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar && !investigated4){
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==numPenguins) {
							gameState.scene='decide';
						}
						investigated4 = true;
					}
				}
			)
		*/
			// create the avatar
			addPenguinOBJ();
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			gameState.camera = avatarCam;


            bear = createBearMesh();



			cone = createConeMesh(4,6);
			cone.position.set(10,3,7);
			//scene.add(cone);

			roadBlock1 = createStaticRoadBlock();
			roadBlock1.position.set(-15,0,-15);
			scene.add(roadBlock1);

			roadBlock2 = createStaticRoadBlock();
			roadBlock2.position.set(40,0,20);
			roadBlock2.rotateY(Math.PI/7);
			scene.add(roadBlock2);

			roadBlock3 = createStaticRoadBlock();
			roadBlock3.position.set(-30,0,20);
			roadBlock3.rotateY(Math.PI/3);
			scene.add(roadBlock3);

			roadBlock4 = createStaticRoadBlock();
			roadBlock4.position.set(30,0,-20);
			roadBlock4.rotateY(Math.PI/2);
			scene.add(roadBlock4);

			//playGameMusic();

	}

	function createStaticRoadBlock(){
		var geometry = new THREE.BoxGeometry( 2, 15, 30);
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
		mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		mesh.rotateX(Math.PI/4);
		mesh.rotateZ(Math.PI/4);
		return mesh;
	}

	function randN(n){
		return Math.random()*n;
	}




	function addBalls(){


		for(i=0;i<numPenguins;i++){
			var ball = createPenguinMesh();
			ball.position.set(randN(20)+Math.pow(-1,Math.floor(i/2))*25,5,randN(20)+Math.pow(-1,i+1)*25);
			scene.add(ball);

			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar){
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==numPenguins) {
							gameState.scene='decide';
						}
						// make the ball drop below the scene ..
						// threejs doesn't let us remove it from the schene...
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
					}
				}
			)
		}
	}

	function playGameMusic(){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '../sounds/loop.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.05 );
			sound.play();
		});
	}

	function soundEffect(file){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '../sounds/'+file, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '../js/physijs_worker.js';
    Physijs.scripts.ammo = '../js/ammo.js';
  }
	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}



	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}



	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );

		mesh.receiveShadow = true;

		mesh.rotateX(Math.PI/2);
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}

    function createEndScreen(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );

		mesh.receiveShadow = false;

		mesh.rotateX(Math.PI/2);
        mesh.rotateZ(Math.PI);
        mesh.rotateY(Math.PI);
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical

    }



	function createSkyBox(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.SphereGeometry( 80, 80, 80 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );

		mesh.receiveShadow = false;


		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical


	}
/*
	function createAvatar(){
		var mesh = createPenguinMesh();

		avatarCam.position.set(0,10,-5);
		avatarCam.lookAt(0,4,10);
		mesh.add(avatarCam);

		return mesh;

	}
*/
	var penguinAvatarOBJ;

		function addPenguinOBJ(){
			var loader = new THREE.OBJLoader();
			loader.load("../models/PenguinB.obj",
						function ( obj) {
							console.log("loading obj file");
							console.dir(obj);
							obj.castShadow = true;
							penguinAvatarOBJ = obj;
							
							
							var geometry = penguinAvatarOBJ.children[0].geometry;
							var material = penguinAvatarOBJ.children[0].material;
							avatar = new Physijs.BoxMesh(geometry,material)
								
							for(var i=1; i<penguinAvatarOBJ.children.length; i++){
								var geometry = penguinAvatarOBJ.children[i].geometry;
								var material = penguinAvatarOBJ.children[i].material;
								var penguin = new Physijs.BoxMesh(geometry,material);
								avatar.add(penguin)
							}
							avatar.position.set(0,5,0);
							avatarCam.position.set(0,16,-8);
							avatarCam.lookAt(0,4,10);
							avatar.add(avatarCam);

							scene.add(avatar);
//							avatar = penguinAvatarOBJ;
							console.log("just added penguinAvatarOBJ");

							//
						},
						function(xhr){
							console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

						function(err){
							console.log("error in loading: "+err);}
					)
		}

		function addQM1(){
			var loader = new THREE.OBJLoader();
			loader.load("../models/QuestionMark.obj",
					function ( obj) {
						console.log("loading obj file");

						var geometry = obj.children[0].geometry;
						geometry.translate(0,0.2,0);
						var material = new THREE.MeshLambertMaterial( { color: 0xccffff} );
						var penguin1 = new Physijs.BoxMesh(geometry,material);
						penguin1.scale.set(10,10,10);
						penguin1.position.set(25,5,25);
						penguin1.castShadow = true;
						scene.add(penguin1);

						penguin1.addEventListener( 'collision',
							function( other_object, relative_velocity, relative_rotation, contact_normal ) {
								if (other_object==avatar && !investigated1){
									soundEffect('good.wav');
									gameState.score += 1;  // add one to the score
									if (gameState.score==numPenguins) {
										gameState.scene='decide';
									}
									penguin1.position.set(0,-50,0);
									penguin1.__dirtyPosition = true;
									investigated1 = true;
								}
							}
						)
					},
					function(xhr){
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

					function(err){
						console.log("error in loading: "+err);
					}
				)
		}

		function addQM2(){
			var loader = new THREE.OBJLoader();
			loader.load("../models/QuestionMark.obj",
					function ( obj) {
						console.log("loading obj file");

						var geometry = obj.children[0].geometry;
						geometry.translate(0,0.2,0);
						var material = new THREE.MeshLambertMaterial( { color: 0xccffff} );
						var penguin2 = new Physijs.BoxMesh(geometry,material);
						penguin2.scale.set(10,10,10);
						penguin2.position.set(25,5,-25);
						penguin2.castShadow = true;
						scene.add(penguin2);

						penguin2.addEventListener( 'collision',
							function( other_object, relative_velocity, relative_rotation, contact_normal ) {
								if (other_object==avatar && !investigated2){
									soundEffect('good.wav');
									gameState.score += 1;  // add one to the score
									if (gameState.score==numPenguins) {
										gameState.scene='decide';
									}
									penguin2.position.set(0,-50,0);
									penguin2.__dirtyPosition = true;
									investigated2 = true;
								}
							}
						)
					},
					function(xhr){
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

					function(err){
						console.log("error in loading: "+err);
					}
				)
		}

		function addQM3(){
			var loader = new THREE.OBJLoader();
			loader.load("../models/QuestionMark.obj",
					function ( obj) {
						console.log("loading obj file");

						var geometry = obj.children[0].geometry;
						geometry.translate(0,0.2,0);
						var material = new THREE.MeshLambertMaterial( { color: 0xccffff} );
						var penguin3 = new Physijs.BoxMesh(geometry,material);
						penguin3.scale.set(10,10,10);
						penguin3.position.set(-15,5,30);
						penguin3.castShadow = true;
						scene.add(penguin3);

						penguin3.addEventListener( 'collision',
							function( other_object, relative_velocity, relative_rotation, contact_normal ) {
								if (other_object==avatar && !investigated3){
									soundEffect('good.wav');
									gameState.score += 1;  // add one to the score
									if (gameState.score==numPenguins) {
										gameState.scene='decide';
									}
									penguin3.position.set(0,-50,0);
									penguin3.__dirtyPosition = true;
									investigated3 = true;
								}
							}
						)
					},
					function(xhr){
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

					function(err){
						console.log("error in loading: "+err);
					}
				)
		}

		function addQM4(){
			var loader = new THREE.OBJLoader();
			loader.load("../models/QuestionMark.obj",
					function ( obj) {
						console.log("loading obj file");

						var geometry = obj.children[0].geometry;
						geometry.translate(0,0.2,0);
						var material = new THREE.MeshLambertMaterial( { color: 0xccffff} );
						var penguin4 = new Physijs.BoxMesh(geometry,material);
						penguin4.scale.set(10,10,10);
						penguin4.position.set(-25,5,-25);
						penguin4.castShadow = true;
						scene.add(penguin4);

						penguin4.addEventListener( 'collision',
							function( other_object, relative_velocity, relative_rotation, contact_normal ) {
								if (other_object==avatar && !investigated4){
									soundEffect('good.wav');
									gameState.score += 1;  // add one to the score
									if (gameState.score==numPenguins) {
										gameState.scene='decide';
									}
									penguin4.position.set(0,-50,0);
									penguin4.__dirtyPosition = true;
									investigated4 = true;
								}
							}
						)
					},
					function(xhr){
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

					function(err){
						console.log("error in loading: "+err);
					}
				)
		}

    function createPenguinMesh(){
        //var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.BoxGeometry( 5, 5, 6);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
        return mesh;
    }

	var bearCop
    function createBearMesh(){
		var loader = new THREE.OBJLoader();
			loader.load("../models/PolarBear3.obj",
						function ( obj) {
							console.log("loading obj file");
							console.dir(obj);
							obj.castShadow = true;
							bearCop = obj;
							
							
							var geometry = bearCop.children[0].geometry;
							var material = bearCop.children[0].material;
							bear = new Physijs.BoxMesh(geometry,material)
								
							for(var i=1; i<bearCop.children.length; i++){
								var geometry = bearCop.children[i].geometry;
								var material = bearCop.children[i].material;
								var penguin = new Physijs.BoxMesh(geometry,material);
								bear.add(penguin)
							}
							bear.position.set(35, 5, 0);

							bear.addEventListener( 'collision',
								function( other_object, relative_velocity, relative_rotation, contact_normal ) {
									if (other_object==avatar){
										gameState.scene = "youlose";  // add one to the score
									}
								}
							)
							
							scene.add(bear);
//							avatar = penguinAvatarOBJ;
							console.log("just added bearCop");

							//
						},
						function(xhr){
							console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

						function(err){
							console.log("error in loading: "+err);}
					)
					return bear;
    }


	function createConeMesh(r,h){
		var geometry = new THREE.ConeGeometry( r, h, 32);
		var texture = new THREE.TextureLoader().load( '../images/tile.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var mesh = new Physijs.ConeMesh( geometry, pmaterial, 0 );
		mesh.castShadow = true;
		return mesh;
	}

	var clock;

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
  }

	function keydown(event){
		console.log("Keydown:"+event.key);
		//console.dir(event);
		// first we handle the "play again" key in the "youwon" scene
		if ((gameState.scene == 'decide' || gameState.scene == 'youlose' || gameState.scene == 'youwin') && event.key=='r') {
			gameState.scene = 'main';
			gameState.score = 0;
			investigated1 = false;
			investigated2 = false;
			investigated3 = false;
			investigated4 = false;
			return;
		}

		if (gameState.scene == 'thestart' && event.key=='p') {
			gameState.scene = 'main';
			return;
		}

		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "r": controls.up = true; break;
			case "f": controls.down = true; break;
			case "m": controls.speed = 30; break;
      case " ": controls.fly = true; break;
      case "h": controls.reset = true; break;

			case "1": gameState.scene = "youlose"; break;
			case "2": gameState.scene = "youlose"; break;
			case "3": gameState.scene = "youwin"; break;
			case "4": gameState.scene = "youlose"; break;
			
			// switch cameras
			case "9": gameState.camera = camera; break;
			case "0": gameState.camera = avatarCam; break;


			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1);break;
			case "ArrowRight": avatarCam.translateY(-1);break;
			case "ArrowUp": avatarCam.translateZ(-1);break;
			case "ArrowDown": avatarCam.translateZ(1);break;

		}

	}

	function keyup(event){
		//console.log("Keydown:"+event.key);
		//console.dir(event);
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "r": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 10; break;
      case " ": controls.fly = false; break;
      case "h": controls.reset = false; break;
		}
	}




  function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection();
		if (controls.fwd){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar.setLinearVelocity(velocity); //stop the xz motion
		}

    if (controls.fly){
      avatar.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.left){
			avatar.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.right){
			avatar.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}

    if (controls.reset){
      avatar.__dirtyPosition = true;
      avatar.position.set(40,10,40);
    }

	}



	function animate() {

		requestAnimationFrame( animate );

		switch(gameState.scene) {

			case "decide":
				renderer.render( whichScene, whichCamera );
				break;
			
			case "youwin":
				renderer.render(winScene, winCamera);
				break;

			case "thestart":
				renderer.render( startScene, startCamera );
				break;

            case "youlose":
                renderer.render(loseScene, loseCamera);
                break;


            case "main":
				updateAvatar();
	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				break;

			default:
			  console.log("don't know the scene "+gameState.scene);

		}

		//draw heads up display ..
	  var info = document.getElementById("info");
		info.innerHTML='<div style="font-size:24pt">Clues: ' + gameState.score + ' out of 4' + '</div>';

	}
