
var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
floor = null,
roof = null,
wall = null,
door1 = null;

var Player = new THREE.Object3D;

// objects in room 1
var clockRoom1 = null, 
deskRoom1 = null, 
bookCaseRoom1 = null;
var clockGroup = new THREE.Object3D;
var duration = 1500; // ms
var keyRoom1 = null;

var animatorClock = null;
var loopAnimation = false;

var mouse = new THREE.Vector3(), INTERSECTED, CLICKED; 
var hallLight = null;

// Audio
var listener = new THREE.AudioListener();
var sound = new THREE.Audio( listener );
var keySound = new THREE.Audio( listener );
var ScreamSound = new THREE.Audio( listener );

srcreamHall1 = true;

// Movement
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var action = false;

var objLoader = null;
var mtlLoader = null;

var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

var objects = [];

var Cuarto1 = [];
var Hall1 = [];

var walls = [];


var prevTime = performance.now();
var raycaster = new THREE.Raycaster();
var vertex = new THREE.Vector3();
var color = new THREE.Color();

// WORLD

var world = new CANNON.World();
world.gravity.set(0, 0, -9.82);


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
    
    if (clockRoom1.moving){


        if (!animatorClock.running){
            sound.stop();
            clockRoom1.moving = false;
        }

    }

    if (Player.room == "1"){

        if (controls.getObject().position.x >= 25.5){controls.getObject().position.x = 25}
        if (controls.getObject().position.x <= -25.5){controls.getObject().position.x = -25}
        if (controls.getObject().position.z >= 25.5){controls.getObject().position.z = 25}

        if (!Player.key1){

            if (controls.getObject().position.z <= -25.5){controls.getObject().position.z = -25}
        }
        else{
            
            if (controls.getObject().position.z <= -25.5 && controls.getObject().position.x <= 10 ){controls.getObject().position.z = -25}
            if (controls.getObject().position.z <= -30) 
            {
                DeleteRoom1();
                //CreateRoom2();
                Player.room = "2";
            }
        }
    }

    hallLight.position.x = controls.getObject().position.x;
    hallLight.position.z = controls.getObject().position.z;

    if (Player.room == "2"){


        if (controls.getObject().position.z >= -31.5){controls.getObject().position.z = -32}
        //if (controls.getObject().position.z <= -128.5){controls.getObject().position.z = -128}
        if (controls.getObject().position.x >= 29){controls.getObject().position.x = 28.5}
        if (controls.getObject().position.x <= 1){controls.getObject().position.x = 1.5}

        if(controls.getObject().position.z <= -50 && srcreamHall1){

            ScreamSound.play();
            srcreamHall1 = false;
            loadJumpScare();            
        }

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
    Player.room = "1";
    Player.key1 = false;
    Player.key2 = false;
    Player.key3 = false;
    
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
            case 69: // e

                // Origin from the raycast
                var origin = new THREE.Vector3( controls.getObject().position.x ,controls.getObject().position.y ,controls.getObject().position.z);

                // Direction of the camera
                var lookAtVector = new THREE.Vector3;
                lookAtVector = camera.getWorldDirection();
                // find intersections
                raycaster.set(origin, lookAtVector)

                var intersects = raycaster.intersectObjects( scene.children, true );

                if ( intersects.length > 0 ) 
                {
                    
                    
                    if (intersects[0].object.name == "clock body_clock texture"){

                        loadKey();
                        for(var i = 0; i<= animatorClock.interps.length -1; i++)
                        {
                            animatorClock.interps[0].target = clockGroup.position
                            clockRoom1.moving = true;
                            animatorClock.start();
                            sound.play();
                        }
                    }

                    if (intersects[0].object.name == "Key_B"){

                        console.log(intersects[0].object)
                        scene.remove(keyRoom1);
                        scene.remove(door1);
                        Player.key1 = true;
                        keySound.play();
                        loadOpenDoor1();
                        CreateHall1();
                        document.getElementById("KEYS").innerHTML = "KEYS: 1"
                    }

                }

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
            case 69: // e
                action = false;
                break;
        }
    };
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    var pointLight = new THREE.PointLight (0xffffff, 0.4, 40);
    pointLight.position.set(15, 20, -60);
    pointLight.castShadow = true;

    hallLight = pointLight;
    
    scene.add(hallLight);

    CreateRoom1();
  
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    renderer.setSize(window.innerWidth -40, window.innerHeight -40);
    document.body.appendChild( renderer.domElement );
    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //
    window.addEventListener( 'resize', onWindowResize, false );

    ClockAnimations();

    camera.add( listener ); 

    loadClockAudio();
    loadKeyAudio();
}

// Room 1 functions

function CreateRoom1(){

    // Create floor texture map
        var map = new THREE.TextureLoader().load("images/skybox/floor.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(60, 60, 50, 50);
        floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        floor.rotation.x = -Math.PI / 2;

        // Add the mesh to our group
        scene.add( floor );
        floor.castShadow = false;
        floor.receiveShadow = true;

        Cuarto1.push(floor);

    // Create Wall 1 texture map
        var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10,10);

        var color = 0xffffff;
        

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.position.z = 30
        
        scene.add( wall );
        wall.castShadow = false;
        wall.receiveShadow = true;

        walls.push(wall)
        Cuarto1.push(wall)
  
    // Create Wall 2 texture map
        var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.position.z = -30

        scene.add( wall );
        wall.castShadow = false;
        wall.receiveShadow = true;

        walls.push(wall)
        Cuarto1.push(wall)

    // Create Wall 3 texture map
        var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.rotation.y = -Math.PI / 2;
        wall.position.x = 30
        
        scene.add( wall );
        wall.castShadow = false;
        wall.receiveShadow = true;

        walls.push(wall)
        Cuarto1.push(wall)

    // Create Wall 4 texture map
        var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.rotation.y = -Math.PI / 2;
        wall.position.x = -30

        scene.add( wall );
        wall.castShadow = false;
        wall.receiveShadow = true;

        walls.push(wall)
        Cuarto1.push(wall);

    // Create riddle 

        var map = new THREE.TextureLoader().load("./images/acertijo.jpg");
        geometry = new THREE.PlaneGeometry(20, 10, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.castShadow = false;
        wall.receiveShadow = true;

        wall.position.y = 14 
        wall.position.x = -29.5

        wall.rotation.y = Math.PI /2

        scene.add( wall );
        Cuarto1.push(wall);

    // Create roof texture map
        var map = new THREE.TextureLoader().load("images/skybox/roof.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(60, 60, 50, 50);
        roof = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        roof.rotation.x = -Math.PI / 2;
        roof.position.y = 25


        // Add the mesh to our group
        scene.add( roof );
        roof.castShadow = false;
        roof.receiveShadow = true;

        Cuarto1.push(roof);


    loadBookCase();
    loadClock();
    loadSofa();
    loadDoor1();
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
                        
                object.scale.set(.2,.2,.2);
                object.position.z = 0;
                object.position.x = 25;
                object.position.y = 0;
                
                object.collider = new THREE.Box3().setFromObject(object)

                deskRoom1 = object;

                scene.add(deskRoom1);
                Cuarto1.push(deskRoom1)
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

function loadClock(){


    if(!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/grandfatherclock/grandfatherclock.mtl',
        
        function(materials){

            materials.preload();

        if(!objLoader)

            objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

        objLoader.load(
            'models/grandfatherclock/grandfatherclock.obj',

            function(object)
            {
                var texture = new THREE.TextureLoader().load('models/grandfatherclock/grandfatherclock_uv.bmp');
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
                        
                object.scale.set(2,2,2);
                object.position.z = 29;
                object.position.x = 0;
                object.position.y = 0;
                object.rotation.y = Math.PI;

                object.collider = new THREE.Box3().setFromObject(object)
                
                clockRoom1 = object;
                clockRoom1.moving = false;
                clockGroup.add(clockRoom1)

                scene.add(clockGroup);
                Cuarto1.push(clockRoom1);
                
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
                    
            object.scale.set(.15,.15,.15);
            object.position.z = -32;
            object.position.x = 0;
            object.position.y = -2;
           
            object.collider = new THREE.Box3().setFromObject(object)
            
            bookCaseRoom1 = object

            scene.add(bookCaseRoom1);
            Cuarto1.push(bookCaseRoom1)
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

function loadClockAudio(){

    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( './audio/wood.wav', function( buffer ) {

        console.log("playin sound");
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.5 );
    });

}

function loadKeyAudio(){

    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( './audio/keySound.wav', function( buffer ) {

        
        keySound.setBuffer( buffer );
        keySound.setLoop( false );
        keySound.setVolume( 0.5 );
    });

}

function loadSofa(){

    if(!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/LuxuryLivingRoomSofaOBJ/LuxuryLivingRoomSofa.mtl',
        
        function(materials){

            materials.preload();

        if(!objLoader)

            objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

        objLoader.load(
            'models/LuxuryLivingRoomSofaOBJ/LuxuryLivingRoomSofa.obj',

            function(object)
            {
                var texture = new THREE.TextureLoader().load('models/LuxuryLivingRoomSofaOBJ/Textures/FabricDiffuse.jpg');
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
                        
                object.scale.set(.3,.3,.3);
                object.position.z = 0;
                object.position.x = -25;
                object.position.y = 0;
                object.rotation.y = Math.PI /2
                
                object.collider = new THREE.Box3().setFromObject(object)

                scene.add(object);
                Cuarto1.push(object)
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

function loadKey(){

    console.log("loading key");

    if(!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/Key_B/Key_B_02.mtl',
        
        function(materials){

            materials.preload();

        if(!objLoader)

            objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

        objLoader.load(
            'models/Key_B/Key_B_02.obj',

            function(object)
            {
                //var texture = new THREE.TextureLoader().load('models/LuxuryLivingRoomSofaOBJ/Textures/FabricDiffuse.jpg');
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
                        
                object.scale.set(.3,.3,.3);
                object.position.z = 30;
                object.position.x = 0;
                object.position.y = 10;
                
                keyRoom1 = object;

                scene.add(keyRoom1);
                
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

function loadDoor1(){
    if(!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/InteriorDoorObj/InteriorDoor.mtl',
        
        function(materials){

            materials.preload();

        if(!objLoader)

            objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

        objLoader.load(
            'models/InteriorDoorObj/InteriorDoor.obj',

            function(object)
            {
                var texture = new THREE.TextureLoader().load('models/InteriorDoorObj/InteriorDoor_Diffuce.jpg');
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
                        
                object.scale.set(.17,.17,.17);
                object.position.z = -30;
                object.position.x = 15;
                object.position.y = 0;
                
                door1 = object

                scene.add(door1);
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

function loadOpenDoor1(){

    var map = new THREE.TextureLoader().load("images/portal2.png");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10,20);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(10, 16, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
    mesh.position.y = 8;
    mesh.position.z = -29.5;
    mesh.position.x = 15;


    // Add the mesh to our group
    scene.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    Cuarto1.push(mesh);

}

function ClockAnimations()
{

   
    animatorClock = new KF.KeyFrameAnimator;
    animatorClock.init({ 
        interps:
            [
                { 
                    keys:[0, 1], 
                    values:[
                            { x : 0, y : 0 },
                            { x : -5, y : 0 },
                            ],
                },
                {
                    keys:[0, 1], 
                    values:[
                            true,
                            false
                        ],
                }
            ],
        loop: loopAnimation,
        duration:duration,
    });

}

function DeleteRoom1(){

    for (i = 0; i < Cuarto1.length; i++){

        scene.remove(Cuarto1[i]);
    }
}

// Hall 1 functions

function CreateHall1(){

    // Create floor texture map
        var map = new THREE.TextureLoader().load("images/hall1.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(3,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(30, 100, 50, 50);
        floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        floor.rotation.x = -Math.PI / 2;
        floor.position.x = 15;
        floor.position.z = -80;

        // Add the mesh to our group
        scene.add( floor );
        floor.castShadow = false;
        floor.receiveShadow = true;

        Hall1.push(floor);

    // Create roof texture map
        var map = new THREE.TextureLoader().load("images/hall1.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(3,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(30, 100, 50, 50);
        roof = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        roof.rotation.x = -Math.PI / 2;
        roof.position.x = 15;
        roof.position.z = -80;
        roof.position.y = 25;

        // Add the mesh to our group
        scene.add( roof );
        roof.castShadow = false;
        roof.receiveShadow = true;

        Hall1.push(roof);

    // Create wall 1 texture map
        var map = new THREE.TextureLoader().load("images/hall1.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(3,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(30, 100, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.rotation.z = -Math.PI / 2;
        wall.rotation.y = -Math.PI / 2;
        wall.position.x = 30;
        wall.position.z = -80;
        wall.position.y = 12.5;

        // Add the mesh to our group
        scene.add( wall );
        wall.castShadow = false;
        wall.receiveShadow = true;

        Hall1.push(wall);

    // Create wall 2 texture map
        var map = new THREE.TextureLoader().load("images/hall1.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(3,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(30, 100, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.rotation.z = -Math.PI / 2;
        wall.rotation.y = -Math.PI / 2;
        wall.position.x = 0;
        wall.position.z = -80;
        wall.position.y = 12.5;

        // Add the mesh to our group
        scene.add( wall );
        wall.castShadow = false;
        wall.receiveShadow = true;

        Hall1.push(wall);

    // Create wall 3 texture map
        var map = new THREE.TextureLoader().load("images/hall1.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(3,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.rotation.z = -Math.PI / 2;
        wall.position.x = 15;
        wall.position.z = -30.5;
        wall.position.y = 12.5;

        // Add the mesh to our group
        scene.add( wall );
        wall.castShadow = false;
        wall.receiveShadow = true;

        Hall1.push(wall);

    // Create wall 4 texture map
        var map = new THREE.TextureLoader().load("images/hall1.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(3,10);

        var color = 0xffffff;

        // Put in a ground plane to show off the lighting
        geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
        wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
        wall.rotation.z = -Math.PI / 2;
        wall.position.x = 15;
        wall.position.z = -130;
        wall.position.y = 12.5;

        // Add the mesh to our group
        scene.add( wall );
        wall.castShadow = false;
        wall.receiveShadow = true;

        Hall1.push(wall);

    loadScreamAudio();
    loadOpenDoor2();
}

function loadScreamAudio(){

    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( './audio/scream.ogg', function( buffer ) {

        ScreamSound.setBuffer( buffer );
        ScreamSound.setLoop( false );
        ScreamSound.setVolume( 0.5 );
    });

}

function loadJumpScare(){

    var map = new THREE.TextureLoader().load("images/jumpscare.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(1,1);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(5, 5, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
    mesh.position.y = 8;
    mesh.position.z = -60;
    mesh.position.x = 15;


    // Add the mesh to our group
    scene.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    Hall1.push(mesh);

}

function loadOpenDoor2(){

    var map = new THREE.TextureLoader().load("images/portal2.png");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10,20);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(10, 16, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
    mesh.position.y = 8;
    mesh.position.z = -129.5;
    mesh.position.x = 15;


    // Add the mesh to our group
    scene.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    Hall1.push(mesh);

}

function DeleteHall1(){

    for (i = 0; i < Hall1.length; i++){

        scene.remove(Hall1[i]);
    }
}

// Room 2 functions

function CreateRoom2(){

    // Create floor
    var groundBody = new CANNON.body({
        mass : 0,
        position: new CANNON.Vector3(0,-135,0)
    });
    var groundShape = new CANNON.PlaneGeometry();
    groundBody.addShape(groundShape);
    world.addBody(groundBody);

}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


THREE.PointerLockControls = function ( camera, domElement ) {


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