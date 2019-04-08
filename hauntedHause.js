
var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
floor = null,
directionalLight = null;
orbitControls = null;
var object;
var animator = null;
var loopAnimation = true;

// Ship Movement
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

var controls = null;
var keyboard = null;


var floorAnimator = null;
var animateFloor = true;

var duration = 1500; // ms
var currentTime = Date.now();
var actualTime = Date.now();
var startedTime = Date.now();

var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 10);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector3();
var intersectPoint = new THREE.Vector3();


function animate() {
    

    var now = Date.now();
    var delta = now - currentTime;
    currentTime = now;

    direction.y = Number( moveForward ) - Number( moveBackward );
    direction.z = Number( moveLeft ) - Number( moveRight );
    direction.normalize(); // this ensures consistent movements in all directions
    if ( moveForward || moveBackward ) velocity.y -= direction.y *0.003* delta;
    if ( moveLeft || moveRight ) velocity.z -= direction.z *0.003* delta;
    
    controls.getObject().translateZ( velocity.y * delta );
    controls.getObject().translateX( velocity.z * delta );

    velocity.y = 0;
    velocity.z = 0;
    
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
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth -20, window.innerHeight -20);
    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0,10,0);
    // camera.rotation = 90;
    //camera.lookAt(new THREE.Vector3(0,50,0))
    scene.add(camera);

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    // orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
    //directionalLight.castShadow = true;
    directionalLight.position.set(0, 50, 300);
    root.add(directionalLight);

    // Point light
    // var pointLight = new THREE.PointLight (0xffffff, 0.5, 10000);
    // pointLight.position.set(350, 350, 300);
    // pointLight.castShadow = true;

    //pointLight.shadow.camera.near = 0;
    //pointLight.shadow.camera.far = 4000;
    // pointLight.shadow.camera.fov = 10;
    
    //scene.add(pointLight);

    // Create and add all the lights
    

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create grass texture map
    var map = new THREE.TextureLoader().load("images/skybox/floor.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10,10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
    floor.rotation.x = -Math.PI / 2;

    // Add the mesh to our group
    root.add( floor );
    floor.castShadow = false;
    floor.receiveShadow = true;

    // Now add the group to our scene
    scene.add( root );

    // Load ship

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

    window.addEventListener( 'resize', onWindowResize);
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    window.addEventListener('mousemove', onmousemove, false);

    // Sky Box

	// var imagePrefix = "images/skybox/";
    // //var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    // var directions  = ["wall", "wall", "roof", "floor", "wall", "wall"];
	// var imageSuffix = ".jpg";
	// var skyGeometry = new THREE.CubeGeometry( 6000, 2000, 6000 );	
	
	// var materialArray = [];
	// for (var i = 0; i < 6; i++)
	// 	materialArray.push( new THREE.MeshBasicMaterial({
	// 		map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
	// 		side: THREE.BackSide
	// 	}));
	// var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	// var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	// scene.add( skyBox );

}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onmousemove(event) {

    mouse.x = event.clientX - (window.innerWidth / 2);
    mouse.y = event.clientY - (window.innerHeight / 2);
    mouse.z = camera.position.z;

    console.log

    camera.lookAt(mouse);
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

