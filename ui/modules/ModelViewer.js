import * as THREE from '../lib/three/three.module.js';
import { GLTFLoader } from '../lib/three/addons/loaders/GLTFLoader.js';

// renderer
const wrap = document.getElementById('stats-container');
const canvas = document.getElementById('rx7-model');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));

// scene & camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

// isometric view
camera.position.set(3, 3, 3);
camera.lookAt(0, 1.3, 0.4);
camera.up.set(0, 1, 0);

// loader
const loader = new GLTFLoader();

// animation mixer
let mixer = null;

// headlight animation state
const headlightAnim = {
    name: 'headlightAction',
    deployed: false,
    playingHalf: null,
    playSpeed: 2,
};

// roof animation state
const roofAnim = {
    name: 'roofAction',
    deployed: false,
    playingHalf: null,
    playSpeed: 3,
};

// window animation state
const windowAnim = {
    name: 'windowAction',
    deployed: false,
    playingHalf: null,
    playSpeed: 3,
}

// animations
const animations = [headlightAnim, roofAnim, windowAnim];

// keep renderer sized to wrapper
new ResizeObserver(fitToWrap).observe(wrap);

function initialize() {
    // set initial size/aspect
    fitToWrap();

    const MODEL_URL = new URL('../assets/models/RX7-VERT-NA-V3.glb', import.meta.url).href;
    loader.load(MODEL_URL, (gltf) => {
    const bg = 0x000000;
    const ln = 0xff9a00;

    gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
            // hidden-line look: solid front faces (bg color) + edge overlay
            obj.material = new THREE.MeshBasicMaterial({
                color: bg,
                side: THREE.FrontSide,
                depthWrite: true,
                depthTest: true,
                polygonOffset: true,
                polygonOffsetFactor: 1,
                polygonOffsetUnits: 1
        });

        const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(obj.geometry, 20),
            new THREE.LineBasicMaterial({ color: ln })
        );
        obj.add(edges);
        }
    });

        scene.add(gltf.scene);

        // create mixer
        mixer = new THREE.AnimationMixer(gltf.scene);

        // initializing animation clips
        for (let i = 0; i < animations.length; i++) {
            const animation = animations[i];
            const clip = gltf.animations.find(c => c.name === animation.name);
        
            if (clip) {
                const action = mixer.clipAction(clip);
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;

                // assume up at halfway
                animation.midpoint = clip.duration * 0.5;

                // start undeployed
                action.paused = true;
                action.time = 0; // starting pose
                animation.action = action;
            }
            
        }
    });
}

// size to wrapper
function fitToWrap() {
    const rect = wrap.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
    renderer.setSize(rect.width, rect.height, false); // buffer only
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
}

// main loop
function update(dt) {
    if (mixer) mixer.update(dt);

    for (let i = 0; i < animations.length; i++) {
        const animation = animations[i];
        const action = animation.action;
        // stop precisely at bounds for half-plays
        if (action && animation.playingHalf == 1) {
            if (action.time >= animation.midpoint) {
                action.paused = true;
                action.time = animation.midpoint;
                animation.playingHalf = null;
                animation.deployed = true;
            }
        } else if (action && animation.playingHalf == 2) {
            if (action.time <= 0) {
                action.paused = true;
                action.time = 0;
                animation.playingHalf = null;
                animation.deployed = false;
            }
        }
    }
}

function render() {
    fitToWrap();
    renderer.render(scene, camera);
}

// change state of animation
// if forceState is left undefined, will toggle current state
function toggleAnimationState(animationName, forceState) {
    const animation = findAnimation(animationName);
    const action = animation.action;
    
    if (!action || animation.midpoint == null) return;
    if (animation.playingHalf) return; // ignore while currently playing
    

    let wantDeploy = typeof forceState === 'boolean' ? forceState : !animation.deployed;

    if (wantDeploy && !animation.deployed) {
        // play first half of animation
        action.timeScale = animation.playSpeed;
        action.paused = false;
        action.reset();
        action.time = 0;
        action.play();
        animation.playingHalf = 1;
    } else if (!wantDeploy && animation.deployed) {
        // play latter half of animation
        action.timeScale = -1 * animation.playSpeed;
        action.paused = false;
        action.play();
        action.time = animation.midpoint;
        animation.playingHalf = 2;
    }
}

// look up an animation by action name
function findAnimation(name) {
    for (let i = 0; i < animations.length; i++) {
        if (animations[i].name == name) {
            return animations[i];
        }
    }
    return null;
}

export const ModelViewer = { initialize, update, render, fitToWrap, toggleAnimationState };