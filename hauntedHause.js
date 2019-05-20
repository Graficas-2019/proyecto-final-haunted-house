
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
var animatorKey = null;
var loopAnimation = false;

var mouse = new THREE.Vector3(), INTERSECTED, CLICKED;
var hallLight = null;

// Audio
var listener = new THREE.AudioListener();
var sound = new THREE.Audio(listener);
var keySound = new THREE.Audio(listener);
var ScreamSound = new THREE.Audio(listener);

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
var Cuarto2 = [];
var Boxes = [];
var Hall2 = [];
var Cuarto3 = [];
var Bullets = [];

var walls = [];

var Fan = null;
var Gun = null;
var FakeGun = null;
var Key_3 = null;

var prevTime = performance.now();
var raycaster = new THREE.Raycaster();
var vertex = new THREE.Vector3();
var color = new THREE.Color();

var world = new CANNON.World();
var timeStep = 1.0 / 60.0;


function animate() {


    requestAnimationFrame(animate);

    if (controls.isLocked === true) {

        var time = performance.now();
        var delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 80.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);

        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 180.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 180.0 * delta;

        if (Player.crouch) {

            velocity.z /= 1.001;
            velocity.x /= 1.001;

        }

        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateZ(velocity.z * delta);

        velocity.y = 0;

        prevTime = time;
    }

    if (clockRoom1.moving) {


        if (!animatorClock.running) {
            sound.stop();
            clockRoom1.moving = false;
        }

    }

    hallLight.position.x = controls.getObject().position.x;
    hallLight.position.z = controls.getObject().position.z;


    if (Player.room == "1") {


        if (controls.getObject().position.x >= 25.5) { controls.getObject().position.x = 25 }
        if (controls.getObject().position.x <= -25.5) { controls.getObject().position.x = -25 }
        if (controls.getObject().position.z >= 25.5) { controls.getObject().position.z = 25 }

        if (!Player.key1) {

            if (controls.getObject().position.z <= -25.5) { controls.getObject().position.z = -25 }
        }
        else {

            if (controls.getObject().position.z <= -25.5 && controls.getObject().position.x <= 10) { controls.getObject().position.z = -25 }
            if (controls.getObject().position.z <= -30) {
                DeleteRoom1();
                Player.room = "2";
                CreateRoom2();

            }
        }
    }

    if (Player.room == "2") {

        if (controls.getObject().position.z >= -31.5) { controls.getObject().position.z = -32 }
        //if (controls.getObject().position.z <= -128.5){controls.getObject().position.z = -128}
        if (controls.getObject().position.x >= 29) { controls.getObject().position.x = 28.5 }
        if (controls.getObject().position.x <= 1) { controls.getObject().position.x = 1.5 }

        if (controls.getObject().position.z <= -50 && srcreamHall1) {

            ScreamSound.play();
            srcreamHall1 = false;
            loadJumpScare();
        }

        if (controls.getObject().position.z <= -130) {

            Player.room = "3";
            DeleteHall1();
            loadKey2();

        }

    }

    if (Player.room == "3") {

        //if (controls.getObject().position.z >= -130.5){controls.getObject().position.z = -131}
        if (controls.getObject().position.z <= -188.5) { controls.getObject().position.z = -188 }
        if (controls.getObject().position.x >= 25.5) { controls.getObject().position.x = 25 }
        if (controls.getObject().position.x <= -25.5) { controls.getObject().position.x = -25 }

        if (!Player.key2) {

            if (controls.getObject().position.z >= -130.5) { controls.getObject().position.z = -131 }
        }
        else {

            if (controls.getObject().position.z >= -130.5 && controls.getObject().position.x <= 10) {
                controls.getObject().position.z = -131
            }
            if (controls.getObject().position.z >= -130) {
                DeleteRoom2();
                Player.room = "4";
                createRoom3();

            }
        }

        for (i = 0; i < Boxes.length; i++) {

            if (Boxes[i].grab) {

                scene.remove(Boxes[i])
            }

        }

    }

    if (Player.room == "4") {

        //if (controls.getObject().position.z >= -31.5){controls.getObject().position.z = -32}
        if (controls.getObject().position.z <= -128.5) { controls.getObject().position.z = -128 }
        if (controls.getObject().position.x >= 29) { controls.getObject().position.x = 28.5 }
        if (controls.getObject().position.x <= 1) { controls.getObject().position.x = 1.5 }

        if (controls.getObject().position.z >= -30) {

            Player.room = "5";
            DeleteHall2();
        }
    }

    if (Player.room == "5") {


        if (controls.getObject().position.x >= 25.5) { controls.getObject().position.x = 25 }
        if (controls.getObject().position.x <= -25.5) { controls.getObject().position.x = -25 }
        if (controls.getObject().position.z >= 25.5) { controls.getObject().position.z = 25 }

        if (!Player.key3) {

            if (controls.getObject().position.z <= -25.5) { controls.getObject().position.z = -25 }
        }

    }

    var delta = (time - prevTime) / 1000;

    if (Bullets.length > 0) {

        for (bullet of Bullets) {

            if (bullet.position.x > 30 || bullet.position.x < -30 || bullet.position.y < 0 || bullet.position.y > 25 || bullet.position.z > 30 || bullet.position.z < -30) {
                Bullets.shift();
                scene.remove(bullet)
            }

            else {

                bullet.position.x += bullet.moveto.x / 70;
                bullet.position.y += bullet.moveto.y / 70;
                bullet.position.z += bullet.moveto.z / 70;

            }

            bullet.collider = new THREE.Box3().setFromObject(bullet)

            if (bullet.collider.intersectsBox(Fan.collider) && !Key_3.drop) {

                for (var i = 0; i <= animatorKey.interps.length - 1; i++) {
                    animatorKey.interps[0].target = Key_3.position
                    animatorKey.start();

                }

                Key_3.drop = true;

            }

        }
    }

}


function run() {
    requestAnimationFrame(function () { run(); });

    renderer.render(scene, camera);

    // Update the animations
    KF.update();

    //floorAnimator.start();
    animate();

    // Update the camera controller
    //orbitControls.update();

}

function createScene(canvas) {
    Player.room = "1";
    Player.key1 = false;
    Player.key2 = false;
    Player.key3 = false;
    Player.crouch = false;
    Player.gun = false;

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    scene = new THREE.Scene();
    controls = new THREE.PointerLockControls(Player);

    Player.add(camera)

    var blocker = document.getElementById('blocker');
    var instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {
        controls.lock();
    }, false);

    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });

    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });

    scene.add(controls.getObject());

    var onKeyDown = function (event) {
        switch (event.keyCode) {
            case 17: // ctrl
                if (!Player.crouch) {

                    controls.getObject().position.y = 6
                    Player.crouch = true;
                }
                else {

                    controls.getObject().position.y = 10
                    Player.crouch = false;
                }
                break;
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
                if (Player.gun) {

                    ShootBullet();
                }
                break;
            case 69: // e

                // Origin from the raycast
                var origin = new THREE.Vector3(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);

                // Direction of the camera
                var lookAtVector = new THREE.Vector3;
                lookAtVector = camera.getWorldDirection();
                // find intersections
                raycaster.set(origin, lookAtVector)

                if (Player.room == "1") {

                    var intersects = raycaster.intersectObjects(scene.children, true);

                    if (intersects.length > 0) {


                        if (intersects[0].object.name == "clock body_clock texture") {

                            loadKey();
                            for (var i = 0; i <= animatorClock.interps.length - 1; i++) {
                                animatorClock.interps[0].target = clockGroup.position
                                clockRoom1.moving = true;
                                animatorClock.start();
                                sound.play();
                            }
                        }

                        if (intersects[0].object.name == "Key_B") {

                            scene.remove(keyRoom1);
                            scene.remove(door1);
                            Player.key1 = true;
                            keySound.play();
                            loadOpenDoor1();
                            CreateHall1();
                            document.getElementById("KEYS").innerHTML = "KEYS: 1"
                        }

                    }

                }

                else if (Player.room == "3") {

                    var intersects = raycaster.intersectObjects(scene.children, true);

                    if (intersects.length > 0) {

                        if (!intersects[0].object.parent.grab) {

                            intersects[0].object.parent.grab = true;
                        }
                        else {

                            intersects[0].object.parent.grab = false;
                        }

                        if (intersects[0].object.parent.move) {

                            animatorClock.interps[0].target = intersects[0].object.position;
                            animatorClock.start();
                            intersects[0].object.parent.move = false

                        }

                        if (intersects[0].object.name == "Key_B") {

                            scene.remove(keyRoom1);
                            scene.remove(door1);
                            Player.key2 = true;
                            loadOpenDoor3();
                            CreateHall2();
                            keySound.play();
                            document.getElementById("KEYS").innerHTML = "KEYS: 2"
                        }
                    }
                }

                else if (Player.room == "5") {

                    var intersects = raycaster.intersectObjects(scene.children, true);

                    if (intersects.length > 0) {

                        console.log(intersects[0].object)


                        if (intersects[0].object.parent.tag == "gun") {

                            scene.remove(FakeGun)
                            Gun.visible = true;
                            Player.gun = true;

                        }
                        else if (intersects[0].object.name == "Key_B") {

                            console.log("YOU WON");
                            scene.remove(Key_3);
                            CreateSkybox();
                            DeleteRoom3();
                            document.getElementById("KEYS").innerHTML = "KEYS: 3";
                            document.getElementById("youWon").innerHTML = "You Won :D, Press F5";
                            document.getElementById("audio_atm").stop();

                            

                        }
                    }
                }

                break;
        }
    };
    var onKeyUp = function (event) {
        switch (event.keyCode) {
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
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

    var pointLight = new THREE.PointLight(0xffffff, 1, 60);
    pointLight.position.set(15, 20, -60);
    pointLight.castShadow = true;

    hallLight = pointLight;

    scene.add(hallLight);

    CreateRoom1();

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth - 40, window.innerHeight - 40);
    document.body.appendChild(renderer.domElement);
    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //
    window.addEventListener('resize', onWindowResize, false);

    ClockAnimations();
    KeyAnimations();

    camera.add(listener);

    loadClockAudio();
    loadKeyAudio();

    loadhandGun();

}

// Room 1 functions

function CreateRoom1() {

    // Create floor texture map
    var map = new THREE.TextureLoader().load("images/skybox/floor.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 60, 50, 50);
    floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    floor.rotation.x = -Math.PI / 2;

    // Add the mesh to our group
    scene.add(floor);
    floor.castShadow = false;
    floor.receiveShadow = true;

    Cuarto1.push(floor);

    // Create Wall 1 texture map
    var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;


    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.position.z = 30

    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    walls.push(wall)
    Cuarto1.push(wall)

    // Create Wall 2 texture map
    var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.position.z = -30

    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    walls.push(wall)
    Cuarto1.push(wall)

    // Create Wall 3 texture map
    var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.y = -Math.PI / 2;
    wall.position.x = 30

    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    walls.push(wall)
    Cuarto1.push(wall)

    // Create Wall 4 texture map
    var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.y = -Math.PI / 2;
    wall.position.x = -30

    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    walls.push(wall)
    Cuarto1.push(wall);

    // Create riddle 

    var map = new THREE.TextureLoader().load("./images/acertijo.jpg");
    geometry = new THREE.PlaneGeometry(20, 10, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.castShadow = false;
    wall.receiveShadow = true;

    wall.position.y = 14
    wall.position.x = -29.5

    wall.rotation.y = Math.PI / 2

    scene.add(wall);
    Cuarto1.push(wall);

    // Create roof texture map
    var map = new THREE.TextureLoader().load("images/skybox/roof.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 60, 50, 50);
    roof = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    roof.rotation.x = -Math.PI / 2;
    roof.position.y = 25


    // Add the mesh to our group
    scene.add(roof);
    roof.castShadow = false;
    roof.receiveShadow = true;

    Cuarto1.push(roof);


    loadBookCase();
    loadClock();
    loadSofa();
    loadDoor1();
}

function loadDesk() {


    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/deskWorn_OBJ/deskWorn_OBJ.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/deskWorn_OBJ/deskWorn_OBJ.obj',

                function (object) {
                    //var texture = new THREE.TextureLoader().load('models/Tie_Fighter/texture.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            //child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(.2, .2, .2);
                    object.position.z = 0;
                    object.position.x = 25;
                    object.position.y = 0;

                    object.collider = new THREE.Box3().setFromObject(object)

                    deskRoom1 = object;

                    scene.add(deskRoom1);
                    Cuarto1.push(deskRoom1)
                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )
}

function loadClock() {


    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/grandfatherclock/grandfatherclock.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/grandfatherclock/grandfatherclock.obj',

                function (object) {
                    var texture = new THREE.TextureLoader().load('models/grandfatherclock/grandfatherclock_uv.bmp');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(2, 2, 2);
                    object.position.z = 29;
                    object.position.x = 0;
                    object.position.y = 0;
                    object.rotation.y = Math.PI;

                    object.collider = new THREE.Box3().setFromObject(object)

                    clockRoom1 = object;
                    clockRoom1.moving = false;
                    clockGroup.add(clockRoom1)

                    scene.add(clockGroup);
                    Cuarto1.push(clockGroup);

                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )
}

function loadBookCase() {

    if (!objLoader)

        objLoader = new THREE.OBJLoader();

    objLoader.load(
        'models/BOOKCASE_MODEL/BOOKCASE_OBJ/SHELF_OBJ.obj',

        function (object) {
            var texture = new THREE.TextureLoader().load('models/BOOKCASE_MODEL/SHELF_TEXTURE.bmp');
            //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    //child.material.normalMap = normalMap;
                }
            });

            object.scale.set(.15, .15, .15);
            object.position.z = -32;
            object.position.x = 0;
            object.position.y = -2;

            object.collider = new THREE.Box3().setFromObject(object)

            bookCaseRoom1 = object

            scene.add(bookCaseRoom1);
            Cuarto1.push(bookCaseRoom1)
        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            building_loaded = (xhr.loaded / xhr.total * 100)

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        }
    );

}

function loadClockAudio() {

    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('./audio/wood.wav', function (buffer) {

        console.log("playin sound");
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(0.5);
    });

}

function loadKeyAudio() {

    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('./audio/keySound.wav', function (buffer) {


        keySound.setBuffer(buffer);
        keySound.setLoop(false);
        keySound.setVolume(0.5);
    });

}

function loadSofa() {

    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/LuxuryLivingRoomSofaOBJ/LuxuryLivingRoomSofa.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/LuxuryLivingRoomSofaOBJ/LuxuryLivingRoomSofa.obj',

                function (object) {
                    var texture = new THREE.TextureLoader().load('models/LuxuryLivingRoomSofaOBJ/Textures/FabricDiffuse.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(.3, .3, .3);
                    object.position.z = 0;
                    object.position.x = -25;
                    object.position.y = 0;
                    object.rotation.y = Math.PI / 2

                    scene.add(object);
                    Cuarto1.push(object)
                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )
}

function loadKey() {

    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/Key_B/Key_B_02.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/Key_B/Key_B_02.obj',

                function (object) {
                    //var texture = new THREE.TextureLoader().load('models/LuxuryLivingRoomSofaOBJ/Textures/FabricDiffuse.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            //child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(.3, .3, .3);
                    object.position.z = 30;
                    object.position.x = 0;
                    object.position.y = 10;

                    keyRoom1 = object;

                    scene.add(keyRoom1);

                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )

}

function loadDoor1() {
    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/InteriorDoorObj/InteriorDoor.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/InteriorDoorObj/InteriorDoor.obj',

                function (object) {
                    var texture = new THREE.TextureLoader().load('models/InteriorDoorObj/InteriorDoor_Diffuce.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(.17, .17, .17);
                    object.position.z = -30;
                    object.position.x = 15;
                    object.position.y = 0;

                    door1 = object

                    scene.add(door1);
                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )
}

function loadOpenDoor1() {

    var map = new THREE.TextureLoader().load("images/portal2.png");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 20);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(10, 16, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    mesh.position.y = 8;
    mesh.position.z = -29.5;
    mesh.position.x = 15;


    // Add the mesh to our group
    scene.add(mesh);
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    Cuarto1.push(mesh);

}

function ClockAnimations() {


    animatorClock = new KF.KeyFrameAnimator;
    animatorClock.init({
        interps:
            [
                {
                    keys: [0, 1],
                    values: [
                        { x: 0, y: 0 },
                        { x: -5, y: 0 },
                    ],
                },
                {
                    keys: [0, 1],
                    values: [
                        true,
                        false
                    ],
                }
            ],
        loop: loopAnimation,
        duration: duration,
    });

}

function DeleteRoom1() {

    for (i = 0; i < Cuarto1.length; i++) {

        scene.remove(Cuarto1[i]);
    }
}

// Hall 1 functions

function CreateHall1() {

    // Create floor texture map
    var map = new THREE.TextureLoader().load("images/hall1.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(30, 100, 50, 50);
    floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.x = 15;
    floor.position.z = -80;

    // Add the mesh to our group
    scene.add(floor);
    floor.castShadow = false;
    floor.receiveShadow = true;

    Hall1.push(floor);

    // Create roof texture map
    var map = new THREE.TextureLoader().load("images/hall1.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(30, 100, 50, 50);
    roof = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    roof.rotation.x = -Math.PI / 2;
    roof.position.x = 15;
    roof.position.z = -80;
    roof.position.y = 25;

    // Add the mesh to our group
    scene.add(roof);
    roof.castShadow = false;
    roof.receiveShadow = true;

    Hall1.push(roof);

    // Create wall 1 texture map
    var map = new THREE.TextureLoader().load("images/hall1.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(30, 100, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.z = -Math.PI / 2;
    wall.rotation.y = -Math.PI / 2;
    wall.position.x = 30;
    wall.position.z = -80;
    wall.position.y = 12.5;

    // Add the mesh to our group
    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    Hall1.push(wall);

    // Create wall 2 texture map
    var map = new THREE.TextureLoader().load("images/hall1.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(30, 100, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.z = -Math.PI / 2;
    wall.rotation.y = -Math.PI / 2;
    wall.position.x = 0;
    wall.position.z = -80;
    wall.position.y = 12.5;

    // Add the mesh to our group
    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    Hall1.push(wall);

    // Create wall 3 texture map
    var map = new THREE.TextureLoader().load("images/hall1.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.z = -Math.PI / 2;
    wall.position.x = 15;
    wall.position.z = -30.5;
    wall.position.y = 12.5;

    // Add the mesh to our group
    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    Hall1.push(wall);

    // Create wall 4 texture map
    var map = new THREE.TextureLoader().load("images/hall1.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.z = -Math.PI / 2;
    wall.position.x = 15;
    wall.position.z = -129.6;
    wall.position.y = 12.5;

    // Add the mesh to our group
    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    Hall1.push(wall);

    loadScreamAudio();
    loadOpenDoor2();
}

function loadScreamAudio() {

    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('./audio/scream.ogg', function (buffer) {

        ScreamSound.setBuffer(buffer);
        ScreamSound.setLoop(false);
        ScreamSound.setVolume(0.5);
    });

}

function loadJumpScare() {

    var map = new THREE.TextureLoader().load("images/jumpscare.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(1, 1);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(5, 5, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    mesh.position.y = 8;
    mesh.position.z = -60;
    mesh.position.x = 15;


    // Add the mesh to our group
    scene.add(mesh);
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    Hall1.push(mesh);

}

function loadOpenDoor2() {

    var map = new THREE.TextureLoader().load("images/portal2.png");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 20);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(10, 16, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    mesh.position.y = 8;
    mesh.position.z = -129.5;
    mesh.position.x = 15;


    // Add the mesh to our group
    scene.add(mesh);
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    Hall1.push(mesh);

}

function DeleteHall1() {

    for (i = 0; i < Hall1.length; i++) {

        scene.remove(Hall1[i]);
    }
}

// Room 2 functions

function CreateRoom2() {

    // Create floor texture map
    var map = new THREE.TextureLoader().load("images/skybox/floor.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 60, 50, 50);
    floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -160

    // Add the mesh to our group
    scene.add(floor);
    floor.castShadow = false;
    floor.receiveShadow = true;

    Cuarto2.push(floor);

    // Create Wall 1 texture map
    var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;


    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.position.z = -190

    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    Cuarto2.push(wall)

    // Create Wall 2 texture map
    var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.position.z = -130

    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    walls.push(wall)
    Cuarto2.push(wall)

    // Create Wall 3 texture map
    var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.y = -Math.PI / 2;
    wall.position.x = 30
    wall.position.z = -160

    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    walls.push(wall)
    Cuarto2.push(wall)

    // Create Wall 4 texture map
    var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.y = -Math.PI / 2;
    wall.position.x = -30
    wall.position.z = -160

    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    walls.push(wall)
    Cuarto2.push(wall);

    // Create roof texture map

    var map = new THREE.TextureLoader().load("images/skybox/roof.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 60, 50, 50);
    roof = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    roof.rotation.x = -Math.PI / 2;
    roof.position.y = 25


    // Add the mesh to our group
    scene.add(roof);
    roof.castShadow = false;
    roof.receiveShadow = true;

    Cuarto2.push(roof);
    roof.position.z = -160

    loadDoor2();

    LoadBox(0, -2, -185);
    LoadBox(4, -2, -184);
    LoadBox(-3.5, -2, -184);
    LoadBox(-2, -2, -179);
    LoadBox(3, -2, -190);
    LoadBox(1, -2, -180);

    LoadBox(20, -2, -180);
    LoadBox(21, -2, -186);

    LoadBox(-21, -2, -145);
    LoadBox(-11, -2, -150);


    loadSkeleton();
    loadWardobe();
    loadPredator();

}

function LoadBox(x, y, z) {

    if (!objLoader)

        objLoader = new THREE.OBJLoader();

    objLoader.load(
        'models/Box/box_obj.obj',

        function (object) {
            var texture = new THREE.TextureLoader().load('models/box/diffuse.jpg');
            var normalMap = new THREE.TextureLoader().load('models/box/Box_lowNormalsMap.jpg');
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    child.material.normalMap = normalMap;
                }
            });

            object.scale.set(.1, .1, .1);
            object.position.z = z;
            object.position.x = x;
            object.position.y = y;

            object.grab = false;

            scene.add(object);
            Cuarto2.push(object)
            Boxes.push(object)
        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            building_loaded = (xhr.loaded / xhr.total * 100)

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        }
    );

}

function loadDoor2() {


    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/InteriorDoorObj/InteriorDoor.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/InteriorDoorObj/InteriorDoor.obj',

                function (object) {
                    var texture = new THREE.TextureLoader().load('models/InteriorDoorObj/InteriorDoor_Diffuce.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(.17, .17, .17);
                    object.position.z = -130.1;
                    object.position.x = 15;
                    object.position.y = 0;

                    door1 = object

                    scene.add(door1);
                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )

}

function loadSkeleton() {

    if (!objLoader)

        objLoader = new THREE.OBJLoader();

    objLoader.load(
        'models/skeleton/skeleton.obj',

        function (object) {
            var texture = new THREE.TextureLoader().load('models/skeleton/tex_skeleton.jpg');
            //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    //child.material.normalMap = normalMap;
                }
            });

            object.scale.set(.5, .5, .5);
            object.position.z = -160;
            object.position.x = 25;
            object.position.y = 0;

            scene.add(object);
            Cuarto2.push(object);

        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            building_loaded = (xhr.loaded / xhr.total * 100)

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        });
}

function loadWardobe() {

    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/wardobe/Wardrobe.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/wardobe/Wardrobe.obj',

                function (object) {
                    //var texture = new THREE.TextureLoader().load('models/InteriorDoorObj/InteriorDoor_Diffuce.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            //child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(8, 8, 8);
                    object.position.z = -140;
                    object.position.x = 30;
                    object.position.y = 0;

                    //object.rotation.y = Math.PI

                    object.move = true;

                    Cuarto2.push(object)
                    scene.add(object);
                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )
}

function loadPredator() {

    if (!objLoader)

        objLoader = new THREE.OBJLoader();

    objLoader.load(
        'models/Predator_OBJ/Predator_OBJ.OBJ',

        function (object) {
            //var texture = new THREE.TextureLoader().load('models/skeleton/tex_skeleton.jpg');
            //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    //child.material.map = texture;
                    //child.material.normalMap = normalMap;
                }
            });

            object.scale.set(2, 2, 2);
            object.position.z = -160;
            object.position.x = -27;
            object.position.y = 8;

            object.rotation.y = Math.PI / 2

            object.move = true;

            scene.add(object);
            Cuarto2.push(object);

        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            building_loaded = (xhr.loaded / xhr.total * 100)

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        });
}

function loadKey2() {

    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/Key_B/Key_B_02.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/Key_B/Key_B_02.obj',

                function (object) {
                    //var texture = new THREE.TextureLoader().load('models/LuxuryLivingRoomSofaOBJ/Textures/FabricDiffuse.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            //child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(.3, .3, .3);
                    object.position.z = -184;
                    object.position.x = -0.5;
                    object.position.y = 0.5;

                    object.rotation.x = Math.PI / 2;

                    keyRoom1 = object;

                    scene.add(keyRoom1);

                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )

}

function loadOpenDoor3() {

    var map = new THREE.TextureLoader().load("images/portal2.png");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 20);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(10, 16, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    mesh.position.y = 8;
    mesh.position.z = -130.5;
    mesh.position.x = 15;


    // Add the mesh to our group
    scene.add(mesh);
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    Cuarto2.push(mesh);

}

function DeleteRoom2() {

    for (i = 0; i < Cuarto2.length; i++) {

        scene.remove(Cuarto2[i]);
    }
}

// Hall 2 functions

function CreateHall2() {

    // Create floor texture map
    var map = new THREE.TextureLoader().load("images/hall1.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(30, 100, 50, 50);
    floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.x = 15;
    floor.position.z = -80;

    // Add the mesh to our group
    scene.add(floor);
    floor.castShadow = false;
    floor.receiveShadow = true;

    Hall2.push(floor);

    // Create roof texture map
    var map = new THREE.TextureLoader().load("images/hall1.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(30, 100, 50, 50);
    roof = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    roof.rotation.x = -Math.PI / 2;
    roof.position.x = 15;
    roof.position.z = -80;
    roof.position.y = 25;

    // Add the mesh to our group
    scene.add(roof);
    roof.castShadow = false;
    roof.receiveShadow = true;

    Hall2.push(roof);

    // Create wall 1 texture map
    var map = new THREE.TextureLoader().load("images/hall1.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(30, 100, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.z = -Math.PI / 2;
    wall.rotation.y = -Math.PI / 2;
    wall.position.x = 30;
    wall.position.z = -80;
    wall.position.y = 12.5;

    // Add the mesh to our group
    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    Hall2.push(wall);

    // Create wall 2 texture map
    var map = new THREE.TextureLoader().load("images/hall1.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(30, 100, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.z = -Math.PI / 2;
    wall.rotation.y = -Math.PI / 2;
    wall.position.x = 0;
    wall.position.z = -80;
    wall.position.y = 12.5;

    // Add the mesh to our group
    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    Hall2.push(wall);

    // Create wall 3 texture map
    var map = new THREE.TextureLoader().load("images/hall1.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.z = -Math.PI / 2;
    wall.position.x = 15;
    wall.position.z = -30.5;
    wall.position.y = 12.5;

    // Add the mesh to our group
    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    Hall2.push(wall);

    // Create wall 4 texture map
    var map = new THREE.TextureLoader().load("images/hall1.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.z = -Math.PI / 2;
    wall.position.x = 15;
    wall.position.z = -129.6;
    wall.position.y = 12.5;

    // Add the mesh to our group
    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    Hall2.push(wall);

    loadOpenDoor4();
    loadCorpse();

}

function loadOpenDoor4() {

    var map = new THREE.TextureLoader().load("images/portal2.png");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 20);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(10, 16, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    mesh.position.y = 8;
    mesh.position.z = -31;
    mesh.position.x = 15;


    // Add the mesh to our group
    scene.add(mesh);
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    Hall2.push(mesh);

}

function loadCorpse() {


    if (!objLoader)

        objLoader = new THREE.OBJLoader();

    objLoader.load(
        'models/dead_max_obj/dead_body_1.obj',

        function (object) {
            //var texture = new THREE.TextureLoader().load('models/InteriorDoorObj/InteriorDoor_Diffuce.jpg');
            //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    //child.material.map = texture;
                    //child.material.normalMap = normalMap;
                }
            });

            object.scale.set(.1, .1, .1);
            object.position.z = -110;
            object.position.x = 20;
            object.position.y = 0;

            Hall2.push(object)
            scene.add(object);
        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            building_loaded = (xhr.loaded / xhr.total * 100)

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        });

    objLoader.load(
        'models/dead_max_obj/dead_body_2.obj',

        function (object) {
            //var texture = new THREE.TextureLoader().load('models/InteriorDoorObj/InteriorDoor_Diffuce.jpg');
            //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    //child.material.map = texture;
                    //child.material.normalMap = normalMap;
                }
            });

            object.scale.set(.08, .08, .08);
            object.position.z = -80;
            object.position.x = 5;
            object.position.y = 0;

            object.rotation.y = Math.PI / 2

            Hall2.push(object)
            scene.add(object);
        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            building_loaded = (xhr.loaded / xhr.total * 100)

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        });

    objLoader.load(
        'models/dead_max_obj/dead_body_3.obj',

        function (object) {
            //var texture = new THREE.TextureLoader().load('models/InteriorDoorObj/InteriorDoor_Diffuce.jpg');
            //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    //child.material.map = texture;
                    //child.material.normalMap = normalMap;
                }
            });

            object.scale.set(.05, .05, .05);
            object.position.z = -50;
            object.position.x = 20;
            object.position.y = 0;

            Hall2.push(object)
            scene.add(object);
        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            building_loaded = (xhr.loaded / xhr.total * 100)

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        });


}

function DeleteHall2() {

    for (i = 0; i < Hall2.length; i++) {

        scene.remove(Hall2[i]);
    }

}

// Last Room function

function createRoom3() {

    // Create floor texture map
    var map = new THREE.TextureLoader().load("images/skybox/floor.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 60, 50, 50);
    floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    floor.rotation.x = -Math.PI / 2;

    // Add the mesh to our group
    scene.add(floor);
    floor.castShadow = false;
    floor.receiveShadow = true;

    Cuarto3.push(floor);

    // Create Wall 1 texture map
    var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;


    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.position.z = 30

    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    Cuarto3.push(wall)

    // Create Wall 2 texture map
    var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.position.z = -30

    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;
    Cuarto3.push(wall)

    // Create Wall 3 texture map
    var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.y = -Math.PI / 2;
    wall.position.x = 30

    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    Cuarto3.push(wall)

    // Create Wall 4 texture map
    var map = new THREE.TextureLoader().load("images/skybox/wall.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 50, 50, 50);
    wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    wall.rotation.y = -Math.PI / 2;
    wall.position.x = -30

    scene.add(wall);
    wall.castShadow = false;
    wall.receiveShadow = true;

    Cuarto3.push(wall);


    // Create roof texture map
    var map = new THREE.TextureLoader().load("images/skybox/roof.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(60, 60, 50, 50);
    roof = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    roof.rotation.x = -Math.PI / 2;
    roof.position.y = 25


    // Add the mesh to our group
    scene.add(roof);
    roof.castShadow = false;
    roof.receiveShadow = true;

    Cuarto3.push(roof);


    loadTable();
    loadGun();

    loadFan();
    loadKey3();
}

function loadGun() {

    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/double_obj/SSG_double.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/double_obj/SSG_double.obj',

                function (object) {
                    var texture = new THREE.TextureLoader().load('models/double_obj/free-grey-camouflage-vector.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(.1, .1, .1);
                    object.position.z = 0;
                    object.position.x = 27.5;
                    object.position.y = 5.5;

                    object.rotation.y = Math.PI
                    object.rotation.z = Math.PI / 2

                    object.tag = "gun";

                    FakeGun = object

                    scene.add(FakeGun);

                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )

}

function loadhandGun() {

    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/double_obj/SSG_double.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/double_obj/SSG_double.obj',

                function (object) {
                    //var texture = new THREE.TextureLoader().load('models/LuxuryLivingRoomSofaOBJ/Textures/FabricDiffuse.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            //child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(.1, .1, .1);
                    object.position.z = -3;
                    object.position.x = 1;
                    object.position.y = -2;

                    object.rotation.y = Math.PI

                    object.visible = false;

                    Gun = object

                    Player.add(Gun)
                    Cuarto3.push(Gun)
                    //scene.add(object);

                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )

}

function loadTable() {

    if (!objLoader)

        objLoader = new THREE.OBJLoader();

    objLoader.load(
        'models/table/WoodCoffeeTable.obj',

        function (object) {
            var texture = new THREE.TextureLoader().load('models/table/Textures/TeaTable_default_color.png');
            //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    //child.material.normalMap = normalMap;
                }
            });

            object.scale.set(.2, .5, .5);
            object.position.z = 0;
            object.position.x = 28;
            object.position.y = 0;

            Cuarto3.push(object)
            scene.add(object);
        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            building_loaded = (xhr.loaded / xhr.total * 100)

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        });
}

function loadFan() {

    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/fan/ceiling_fan.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/fan/ceiling_fan.obj',

                function (object) {
                    //var texture = new THREE.TextureLoader().load('models/LuxuryLivingRoomSofaOBJ/Textures/FabricDiffuse.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            //child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(10, 10, 10);
                    object.position.z = 0;
                    object.position.x = 0;
                    object.position.y = 23;

                    Fan = object

                    Fan.collider = new THREE.Box3().setFromObject(Fan);

                    Cuarto3.push(Fan)
                    scene.add(Fan);

                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )

}

function loadKey3() {

    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/Key_B/Key_B_02.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/Key_B/Key_B_02.obj',

                function (object) {
                    //var texture = new THREE.TextureLoader().load('models/LuxuryLivingRoomSofaOBJ/Textures/FabricDiffuse.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            //child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(.3, .3, .3);
                    object.position.z = -0.5;
                    object.position.x = -0.5;
                    object.position.y = 24;

                    object.rotation.x = Math.PI / 2;
                    object.drop = false;

                    Key_3 = object;

                    scene.add(Key_3);

                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function loadSofa() {

    if (!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/LuxuryLivingRoomSofaOBJ/LuxuryLivingRoomSofa.mtl',

        function (materials) {

            materials.preload();

            if (!objLoader)

                objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials)

            objLoader.load(
                'models/LuxuryLivingRoomSofaOBJ/LuxuryLivingRoomSofa.obj',

                function (object) {
                    var texture = new THREE.TextureLoader().load('models/LuxuryLivingRoomSofaOBJ/Textures/FabricDiffuse.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    });

                    object.scale.set(.3, .3, .3);
                    object.position.z = 0;
                    object.position.x = -25;
                    object.position.y = 0;
                    object.rotation.y = Math.PI / 2

                    scene.add(object);
                    Cuarto3.push(object)
                },
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    building_loaded = (xhr.loaded / xhr.total * 100)

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                });
        }
    )
}

function ShootBullet() {

    var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    var geometry = new THREE.CubeGeometry(0.5, 0.5, 0.5);
    cube = new THREE.Mesh(geometry, material);

    cube.position.y = controls.getObject().position.y;
    cube.position.z = controls.getObject().position.z;
    cube.position.x = controls.getObject().position.x;

    cube.moveto = camera.getWorldDirection();

    Bullets.push(cube);
    scene.add(cube)

}

function KeyAnimations() {


    animatorKey = new KF.KeyFrameAnimator;
    animatorKey.init({
        interps:
            [
                {
                    keys: [0, 1],
                    values: [
                        { x: 0, y: 24 },
                        { x: 0, y: 0 },
                    ],
                }
            ],
        loop: loopAnimation,
        duration: duration,
    });

}

function DeleteRoom3() {

    for (i = 0; i < Cuarto3.length; i++) {

        scene.remove(Cuarto3[i])
    }
}

// SKYBOX 

function CreateSkybox() {

    ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight)

    var map = new THREE.TextureLoader().load("images/Skybox_out/bot.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    floor.rotation.x = -Math.PI / 2;

    // Add the mesh to our group
    scene.add(floor);
    floor.castShadow = false;
    floor.receiveShadow = true;


    var imagePrefix = "images/Skybox_out/";
    //var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var directions = ["uno", "tres", "top", "bot", "dos", "cuatro"];
    var imageSuffix = ".jpg";
    var skyGeometry = new THREE.CubeGeometry(1000, 1000, 1000);

    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
            side: THREE.BackSide
        }));
    var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyBox);
}

THREE.PointerLockControls = function (Player, domElement) {


    var scope = this;

    this.domElement = domElement || document.body;
    this.isLocked = false;

    Player.rotation.set(0, 0, 0);

    var pitchObject = new THREE.Object3D();
    pitchObject.add(Player);

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 10;
    yawObject.add(pitchObject);

    var PI_2 = Math.PI / 2;

    function onMouseMove(event) {

        if (scope.isLocked === false) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        pitchObject.rotation.x = Math.max(- PI_2, Math.min(PI_2, pitchObject.rotation.x));

    }

    function onPointerlockChange() {

        if (document.pointerLockElement === scope.domElement) {

            scope.dispatchEvent({ type: 'lock' });

            scope.isLocked = true;

        } else {

            scope.dispatchEvent({ type: 'unlock' });

            scope.isLocked = false;

        }

    }

    function onPointerlockError() {

        console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');

    }

    this.connect = function () {

        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('pointerlockchange', onPointerlockChange, false);
        document.addEventListener('pointerlockerror', onPointerlockError, false);

    };

    this.disconnect = function () {

        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('pointerlockchange', onPointerlockChange, false);
        document.removeEventListener('pointerlockerror', onPointerlockError, false);

    };

    this.dispose = function () {

        this.disconnect();

    };

    this.getObject = function () {

        return yawObject;

    };

    this.getDirection = function () {

        // assumes the camera itself is not rotated

        var direction = new THREE.Vector3(0, 0, - 1);
        var rotation = new THREE.Euler(0, 0, 0, 'YXZ');

        return function (v) {

            rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);

            v.copy(direction).applyEuler(rotation);

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

THREE.PointerLockControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.PointerLockControls.prototype.constructor = THREE.PointerLockControls;