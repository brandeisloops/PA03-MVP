
/*
Game 0
This is a ThreeJS program which implements a simple game
The user moves a cube around the board trying to knock balls into a cone

*/


	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam;  // we have two cameras in the main scene
	var avatar;
	// here are some mesh objects ...

	var cone;


	var endScene, endCamera, endText;

    var numPenguins = 4;



	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false,
		    camera:camera}

	var gameState =
	     {score:0, health:10, scene:'main', camera:'none' }


	// Here is the main game control
  init(); //
	initControls();
	animate();  // start the animation loop!




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

			// create the avatar
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			avatar = createAvatar();
			avatar.translateY(5);
			avatarCam.translateY(-4);
			avatarCam.translateZ(3);
			scene.add(avatar);
			gameState.camera = avatarCam;

			
            //addBalls();
        
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
							gameState.scene='youwon';
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
							gameState.scene='youwon';
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
							gameState.scene='youwon';
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
							gameState.scene='youwon';
						}
						investigated4 = true;
					}
				}
			)
    
        
            var bear = createBearMesh();
            bear.position.set(20, 5, 0);
            scene.add(bear);
            bear.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar){
						gameState.scene = "youlose";  // add one to the score		
					}
				}
			);
        
            

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
		var geometry = new THREE.BoxGeometry( 2, 10, 30);
		var material = new THREE.MeshLambertMaterial( { color: 0x000000} );
		mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
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
							gameState.scene='youwon';
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

	function createAvatar(){
		var mesh = createPenguinMesh();

		avatarCam.position.set(0,10,-5);
		avatarCam.lookAt(0,4,10);
		mesh.add(avatarCam);

		return mesh;

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

    function createBearMesh(){
        var geometry = new THREE.BoxGeometry( 5, 5, 6);
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
        return mesh;
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
		if ((gameState.scene == 'youwon' || gameState.scene == 'youlose') && event.key=='r') {
			gameState.scene = 'main';
			gameState.score = 0;
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


			// switch cameras
			case "1": gameState.camera = camera; break;
			case "2": gameState.camera = avatarCam; break;

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

			case "youwon":
				renderer.render( winScene, winCamera );
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
