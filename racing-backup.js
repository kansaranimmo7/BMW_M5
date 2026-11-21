import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ===============================
// SCENE
// ===============================

const container = document.getElementById('racing-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02040a);
scene.fog = new THREE.Fog(0x02040a, 15, 100);

// ===============================
// CAMERA
// ===============================

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

camera.position.set(4, 3, 8);

// ===============================
// RENDERER
// ===============================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);

// ===============================
// LIGHTING
// ===============================

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const blueLight = new THREE.PointLight(0x0066ff, 150, 35);
blueLight.position.set(-7, 5, 0);
scene.add(blueLight);

const redLight = new THREE.PointLight(0xff003c, 150, 35);
redLight.position.set(7, 5, 0);
scene.add(redLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 3);
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
scene.add(road);

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

    scene.add(line);
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

    scene.add(leftLight);
    sideLights.push(leftLight);

    const rightLight = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.15, 2),
        new THREE.MeshBasicMaterial({
            color: 0xed1c24
        })
    );

    rightLight.position.set(6.8, 0.2, z);

    scene.add(rightLight);
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
scene.add(leftBarrier);

const rightBarrier = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 1, 500),
    barrierMaterial
);

rightBarrier.position.set(7.2, 0.4, -100);
scene.add(rightBarrier);

// ===============================
// LOAD BMW
// ===============================

const loader = new GLTFLoader();

let car = null;

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

        car.position.z = 0;

        console.log('BMW READY FOR RACING');

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
// ANIMATION
// ===============================

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Moving road lines

    roadLines.forEach(function (line) {

        line.position.z += delta * 30;

        if (line.position.z > 10) {
            line.position.z -= 200;
        }

    });

    // Moving side lights

    sideLights.forEach(function (light) {

        light.position.z += delta * 30;

        if (light.position.z > 10) {
            light.position.z -= 200;
        }

    });

    // Racing light pulse

    blueLight.intensity = 150 + Math.sin(elapsed * 4) * 50;
    redLight.intensity = 150 + Math.cos(elapsed * 4) * 50;

    // Camera follows BMW

    if (car) {

        camera.position.x = 4 + Math.sin(elapsed * 0.3) * 0.5;
        camera.position.y = 2.8 + Math.sin(elapsed * 1.5) * 0.08;

        camera.lookAt(0, 0.8, 0);

    }

    renderer.render(scene, camera);

}

animate();

// ===============================
// RESPONSIVE
// ===============================

window.addEventListener('resize', function () {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});