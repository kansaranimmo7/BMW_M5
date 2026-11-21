import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ===============================
// SCENE
// ===============================

const container = document.getElementById('car-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050914);

const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.set(5, 3, 7);

// ===============================
// RENDERER
// ===============================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.domElement.style.display = 'block';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.touchAction = 'none';
renderer.domElement.style.pointerEvents = 'auto';

container.appendChild(renderer.domElement);

// ===============================
// ORBIT CONTROLS
// ===============================

const controls = new OrbitControls(camera, renderer.domElement);

controls.enabled = true;
controls.enableDamping = true;
controls.dampingFactor = 0.06;

controls.enableRotate = true;
controls.enableZoom = true;
controls.enablePan = false;

controls.minDistance = 2;
controls.maxDistance = 15;

controls.minPolarAngle = 0.3;
controls.maxPolarAngle = Math.PI / 2;

controls.autoRotate = false;
controls.target.set(0, 0.8, 0);

// ===============================
// LIGHTING
// ===============================

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const blueLight = new THREE.PointLight(0x0066ff, 100, 20);
blueLight.position.set(-5, 4, 3);
scene.add(blueLight);

const redLight = new THREE.PointLight(0xff003c, 100, 20);
redLight.position.set(5, 3, -3);
scene.add(redLight);

const whiteLight = new THREE.DirectionalLight(0xffffff, 3);
whiteLight.position.set(3, 8, 5);
scene.add(whiteLight);

// ===============================
// SHOWROOM FLOOR
// ===============================

const floorGeometry = new THREE.PlaneGeometry(200, 200);

const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x080d19,
    roughness: 0.5,
    metalness: 0.5
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.05;

scene.add(floor);

// ===============================
// RACING MODE BUTTON
// ===============================

const racingButton = document.getElementById('racingModeBtn');

racingButton.addEventListener('click', function () {

    window.location.href = 'racing.html';

});

// ===============================
// LOAD BMW MODEL
// ===============================

const loader = new GLTFLoader();

let car;

loader.load(
    './assets/blender_bmw_2.glb',

    function (gltf) {

        car = gltf.scene;

        scene.add(car);

        const box = new THREE.Box3().setFromObject(car);
        const center = box.getCenter(new THREE.Vector3());

        car.position.x -= center.x;
        car.position.z -= center.z;
        car.position.y -= box.min.y;

        controls.target.set(0, 0.8, 0);
        controls.update();

        console.log('BMW MODEL LOADED SUCCESSFULLY');

        startCameraTour();

    },

    function (xhr) {

        if (xhr.total) {
            console.log(
                Math.round((xhr.loaded / xhr.total) * 100) + '% loaded'
            );
        }

    },

    function (error) {

        console.error('BMW MODEL ERROR:', error);

    }
);

// ===============================
// CINEMATIC CAMERA TOUR
// ===============================

function startCameraTour() {

    const cameraPositions = [
        new THREE.Vector3(5, 2.5, 6),
        new THREE.Vector3(3, 1.5, 4),
        new THREE.Vector3(-5, 2, 3),
        new THREE.Vector3(-4, 2, -5),
        new THREE.Vector3(5, 3, 7)
    ];

    let currentPosition = 0;

    function moveCamera() {

        if (currentPosition >= cameraPositions.length) {
            controls.autoRotate = true;
            return;
        }

        const targetPosition = cameraPositions[currentPosition];

        camera.position.copy(targetPosition);
        camera.lookAt(controls.target);

        currentPosition++;

        setTimeout(moveCamera, 2000);

    }

    controls.autoRotate = false;

    moveCamera();

}

// ===============================
// ANIMATION
// ===============================

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);

}

animate();

// ===============================
// RESPONSIVE
// ===============================

window.addEventListener('resize', function () {

    camera.aspect = container.clientWidth / container.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

});