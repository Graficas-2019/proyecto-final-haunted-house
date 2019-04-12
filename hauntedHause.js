
var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
floor = null,
roof = null,
wall = null;

// Movement
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var objLoader = null;
var mtlLoader = null;

var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

var objects = [];

var Cuarto1 = [];


var floorAnimator = null;
var animateFloor = true;

var prevTime = performance.now();

var raycaster;
var vertex = new THREE.Vector3();
var color = new THREE.Color();



function animate() {
    

    requestAnimationFrame( animate );
    
    if ( controls.isLocked === true ) {

        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 80.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveLeft ) - Number( moveRight );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 180.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 180.0 * delta;

        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );
        

        if ( controls.getObject().position.y < 10 ) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
        prevTime = time;
    }
    
}


function run()
{
    requestAnimationFrame(function() { run(); });

        renderer.render( scene, camera );
    
        // Update the animations
        KF.update();
    
        //floorAnimator.start();
        animate();

        // Update the camera controller
        //orbitControls.update();
        
}

function createScene(canvas) 
{
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 ); 

    scene = new THREE.Scene();

    controls = new THREE.PointerLockControls( camera );
    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );

    instructions.addEventListener( 'click', function () {
        controls.lock();
    }, false );

    controls.addEventListener( 'lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    } );

    controls.addEventListener( 'unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    } );

    scene.add( controls.getObject() );

    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                if ( canJump === true ) velocity.y += 100;
                canJump = false;
                break;
        }
    };
    var onKeyUp = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    CreateRoom1();
  
    //
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    renderer.setSize(window.innerWidth -40, window.innerHeight -40);
    document.body.appendChild( renderer.domElement );
    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //
    window.addEventListener( 'resize', onWindowResize, false );
}

function CreateRoom1(){

    // Create floor texture map
        var map = new THREE.TextureLoader().load("images/skybox/floor.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
        floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        floor.rotation.x = -Math.PI / 2;

        // Add the mesh to our group
        scene.add( floor );
        floor.castShadow = false;
        floor.receiveShadow = true;

    // Create Wall 1 texture map
        var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(100, 50, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.position.z = 50
        
        scene.add( wall );
        wall.castShadow = false;
        wall.receiveShadow = true;
  
    // Create Wall 2 texture map
        var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(100, 50, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.position.z = -50
        
        scene.add( wall );
        wall.castShadow = false;
        wall.receiveShadow = true;

    // Create Wall 3 texture map
        var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(100, 50, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.rotation.y = -Math.PI / 2;
        wall.position.x = 50
        
        scene.add( wall );
        wall.castShadow = false;
        wall.receiveShadow = true;

    // Create Wall 4 texture map
        var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(100, 50, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.rotation.y = -Math.PI / 2;
        wall.position.x = -50
        
        scene.add( wall );
        wall.castShadow = false;
        wall.receiveShadow = true;

    // Create roof texture map
        var map = new THREE.TextureLoader().load("images/skybox/roof.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
        roof = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        roof.rotation.x = -Math.PI / 2;
        roof.position.y = 25


        // Add the mesh to our group
        scene.add( roof );
        roof.castShadow = false;
        roof.receiveShadow = true;

    // Create 4 Lights
        var pointLight = new THREE.PointLight (0xffff33, 0.9, 90);
        pointLight.position.set(45, 20, 45);
        pointLight.castShadow = true;
        
        scene.add(pointLight);

        var pointLight = new THREE.PointLight (0xffff33, 0.9, 90);
        pointLight.position.set(-45, 20, 45);
        pointLight.castShadow = true;
        
        scene.add(pointLight);


        var pointLight = new THREE.PointLight (0xffff33, 0.9, 90);
        pointLight.position.set(45, 20, -45);
        pointLight.castShadow = true;
        
        scene.add(pointLight);


        var pointLight = new THREE.PointLight (0xffff33, 0.9, 90);
        pointLight.position.set(-45, 20, -45);
        pointLight.castShadow = true;
        
        scene.add(pointLight);

        var pointLight = new THREE.PointLight (0xffff33, 0.9, 50);
        pointLight.position.set(0, 20, 0);
        pointLight.castShadow = true;
        
        scene.add(pointLight);

    loadDesk();
    loadBookCase();
}

function loadDesk(){


    if(!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/deskWorn_OBJ/deskWorn_OBJ.mtl',
        
        function(materials){

            materials.preload();

        if(!objLoader)

            objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

        objLoader.load(
            'models/deskWorn_OBJ/deskWorn_OBJ.obj',

            function(object)
            {
                //var texture = new THREE.TextureLoader().load('models/Tie_Fighter/texture.jpg');
                //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                object.traverse( function ( child ) 
                {
                    if ( child instanceof THREE.Mesh ) 
                    {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        //child.material.map = texture;
                        //child.material.normalMap = normalMap;
                    }
                } );
                        
                desk = object;
                desk.scale.set(.2,.2,.2);
                desk.position.z = 0;
                desk.position.x = 45;
                desk.position.y = 0;
                //enemyShip.rotation.y = Math.PI/2;
                
                scene.add(desk);
            },
            function ( xhr ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

                building_loaded = ( xhr.loaded / xhr.total * 100 )
        
            },
            // called when loading has errors
            function ( error ) {
        
                console.log( 'An error happened' );
        
            });
        }
    )
}

function loadBookCase(){

    if(!objLoader)

        objLoader = new THREE.OBJLoader();

    objLoader.load(
        'models/BOOKCASE_MODEL/BOOKCASE_OBJ/SHELF_OBJ.obj',

        function(object)
        {
            var texture = new THREE.TextureLoader().load('models/BOOKCASE_MODEL/SHELF_TEXTURE.bmp');
            //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
            object.traverse( function ( child ) 
            {
                if ( child instanceof THREE.Mesh ) 
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    //child.material.normalMap = normalMap;
                }
            } );
                    
            desk = object;
            desk.scale.set(.15,.15,.15);
            desk.position.z = -50;
            desk.position.x = 0;
            desk.position.y = -3;
            //enemyShip.rotation.y = Math.PI/2;
            
            scene.add(desk);
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            building_loaded = ( xhr.loaded / xhr.total * 100 )
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened' );
    
        }
    );

}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function playAnimations()
{

    if (animateFloor)
    {
        floorAnimator = new KF.KeyFrameAnimator;
        floorAnimator.init({ 
            interps:
                [
                    { 
                        keys:[0, 1], 
                        values:[
                                { x : 0, y : 0 },
                                { x : -3, y : 0 },
                                ],
                        target:floor.material.map.offset
                    },
                ],
            loop: loopAnimation,
            duration:duration,
        });
        //floorAnimator.start();
    }
}

THREE.PointerLockControls = function ( camera, domElement ) {

    console.log("CONTROLES")

	var scope = this;

	this.domElement = domElement || document.body;
	this.isLocked = false;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

	function onMouseMove( event ) {

        console.log("Moviendo mouse")

		if ( scope.isLocked === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	}

	function onPointerlockChange() {

		if ( document.pointerLockElement === scope.domElement ) {

			scope.dispatchEvent( { type: 'lock' } );

			scope.isLocked = true;

		} else {

			scope.dispatchEvent( { type: 'unlock' } );

			scope.isLocked = false;

		}

	}

	function onPointerlockError() {

		console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

	}

	this.connect = function () {

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'pointerlockchange', onPointerlockChange, false );
		document.addEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.disconnect = function () {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
		document.removeEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.getObject = function () {

		return yawObject;

	};

	this.getDirection = function () {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, 'YXZ' );

		return function ( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		};

	}();

	this.lock = function () {

		this.domElement.requestPointerLock();

	};

	this.unlock = function () {

		document.exitPointerLock();

	};

	this.connect();

};

THREE.PointerLockControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.PointerLockControls.prototype.constructor = THREE.PointerLockControls;