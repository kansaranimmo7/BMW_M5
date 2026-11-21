import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ===============================
// SCENE
// ===============================

const container = document.getElementById('racing-container');

const scene = new THREE.Scene();

const normalBackground = new THREE.Color(0x02040a);

scene.background = normalBackground;
scene.fog = new THREE.Fog(0x02040a, 20, 150);

// Main environment
const racingWorld = new THREE.Group();
scene.add(racingWorld);

// Track separately
const trackGroup = new THREE.Group();
racingWorld.add(trackGroup);

// ===============================
// CAMERA
// ===============================

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(4, 3, 9);

// ===============================
// RENDERER
// ===============================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;

container.appendChild(renderer.domElement);

// ===============================
// CAMERA CONTROLS
// ===============================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.06;

controls.enableRotate = true;
controls.enableZoom = true;
controls.enablePan = false;

controls.rotateSpeed = 0.8;
controls.zoomSpeed = 1.2;

controls.minDistance = 4;
controls.maxDistance = 30;

controls.minPolarAngle = 0.15;
controls.maxPolarAngle = Math.PI / 2;

controls.target.set(0, 0.8, 0);
controls.update();

// ===============================
// CAR ONLY BUTTON
// ===============================

const carOnlyButton = document.createElement('button');

carOnlyButton.innerText = 'CAR ONLY VIEW';

carOnlyButton.style.cssText = `
    position: fixed;
    top: 30px;
    right: 35px;
    z-index: 100;
    padding: 14px 22px;
    color: white;
    background: rgba(0, 10, 25, 0.85);
    border: 1px solid #087cff;
    font-family: Arial, sans-serif;
    font-size: 11px;
    font-weight: bold;
    letter-spacing: 2px;
    cursor: pointer;
    backdrop-filter: blur(12px);
    transition: 0.3s ease;
`;

document.body.appendChild(carOnlyButton);

let carOnlyMode = false;

carOnlyButton.addEventListener('mouseenter', () => {
    carOnlyButton.style.background = '#087cff';
    carOnlyButton.style.boxShadow = '0 0 25px #087cff';
});

carOnlyButton.addEventListener('mouseleave', () => {
    carOnlyButton.style.background = 'rgba(0, 10, 25, 0.85)';
    carOnlyButton.style.boxShadow = 'none';
});

carOnlyButton.addEventListener('click', () => {

    carOnlyMode = !carOnlyMode;

    if (carOnlyMode) {

        // Hide complete racing track
        trackGroup.visible = false;

        // Remove fog and show transparent background
        scene.background = null;
        scene.fog = null;

        // Change button
        carOnlyButton.innerText = 'RACING TRACK MODE';

        // Cinematic car view
        controls.target.set(2, 0.8, 0);
        camera.position.set(6, 3, 9);

    } else {

        // Show racing track again
        trackGroup.visible = true;

        scene.background = normalBackground;
        scene.fog = new THREE.Fog(0x02040a, 20, 150);

        // Restore camera
        controls.target.set(0, 0.8, 0);
        camera.position.set(4, 3, 9);

        // Change button
        carOnlyButton.innerText = 'CAR ONLY VIEW';

    }

    controls.update();

});

// ===============================
// LIGHTING
// ===============================

scene.add(
    new THREE.AmbientLight(0xffffff, 1.5)
);

const blueLight = new THREE.PointLight(
    0x0066ff,
    150,
    40
);

blueLight.position.set(-7, 5, 0);
scene.add(blueLight);

const redLight = new THREE.PointLight(
    0xff003c,
    150,
    40
);

redLight.position.set(7, 5, 0);
scene.add(redLight);

const mainLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

mainLight.position.set(0, 10, 5);
scene.add(mainLight);

// ===============================
// ROAD
// ===============================

const road = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 500),

    new THREE.MeshStandardMaterial({
        color: 0x11151d,
        roughness: 0.8
    })
);

road.rotation.x = -Math.PI / 2;
road.position.y = -0.06;

trackGroup.add(road);

// ===============================
// ROAD LINES
// ===============================

const roadLines = [];

const lineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
});

for (let i = 0; i < 20; i++) {

    const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.025, 3),
        lineMaterial
    );

    line.position.set(0, 0.01, -i * 10);

    trackGroup.add(line);
    roadLines.push(line);

}

// ===============================
// ROAD SIDE LIGHTS
// ===============================

const sideLights = [];

for (let i = 0; i < 20; i++) {

    const z = -i * 10;

    const leftLight = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.15, 2),
        new THREE.MeshBasicMaterial({
            color: 0x087cff
        })
    );

    leftLight.position.set(-6.8, 0.2, z);

    trackGroup.add(leftLight);
    sideLights.push(leftLight);

    const rightLight = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.15, 2),
        new THREE.MeshBasicMaterial({
            color: 0xed1c24
        })
    );

    rightLight.position.set(6.8, 0.2, z);

    trackGroup.add(rightLight);
    sideLights.push(rightLight);

}

// ===============================
// ROAD BARRIERS
// ===============================

const barrierMaterial = new THREE.MeshStandardMaterial({
    color: 0x202b3b,
    metalness: 0.7,
    roughness: 0.4
});

const leftBarrier = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 1, 500),
    barrierMaterial
);

leftBarrier.position.set(-7.2, 0.4, -100);
trackGroup.add(leftBarrier);

const rightBarrier = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 1, 500),
    barrierMaterial
);

rightBarrier.position.set(7.2, 0.4, -100);
trackGroup.add(rightBarrier);

// ===============================
// LOAD BMW
// ===============================

const loader = new GLTFLoader();

let car = null;

loader.load(

    './assets/blender_bmw_2.glb',

    function (gltf) {

        car = gltf.scene;

        // BMW direction
        car.rotation.set(0, Math.PI, 0);

        // Car stays separate from track
        racingWorld.add(car);

        const box = new THREE.Box3().setFromObject(car);

        const center = box.getCenter(
            new THREE.Vector3()
        );

        car.position.x -= center.x;
        car.position.z -= center.z;
        car.position.y -= box.min.y;

        // BMW position
        car.position.x += 2;
        car.position.z = 0;

        console.log('BMW MODEL LOADED SUCCESSFULLY');

    },

    function (xhr) {

        if (xhr.total) {

            console.log(
                Math.round(
                    (xhr.loaded / xhr.total) * 100
                ) + '% loaded'
            );

        }

    },

    function (error) {

        console.error('BMW MODEL ERROR:', error);

    }

);

// ===============================
// ANIMATION
// ===============================

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Move road lines only when track is visible
    if (!carOnlyMode) {

        roadLines.forEach(function (line) {

            line.position.z += delta * 30;

            if (line.position.z > 10) {
                line.position.z -= 200;
            }

        });

        sideLights.forEach(function (light) {

            light.position.z += delta * 30;

            if (light.position.z > 10) {
                light.position.z -= 200;
            }

        });

    }

    // Racing lights
    blueLight.intensity =
        150 + Math.sin(elapsed * 4) * 50;

    redLight.intensity =
        150 + Math.cos(elapsed * 4) * 50;

    controls.update();

    renderer.render(scene, camera);

}

animate();

// ===============================
// RESPONSIVE
// ===============================

window.addEventListener('resize', function () {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// Mobile button adjustment
if (window.innerWidth <= 600) {

    carOnlyButton.style.top = '18px';
    carOnlyButton.style.right = '18px';
    carOnlyButton.style.padding = '11px 13px';
    carOnlyButton.style.fontSize = '9px';

}