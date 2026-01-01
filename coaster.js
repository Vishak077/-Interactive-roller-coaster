// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 20, 300);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls (mouse + touch)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;


// Lights
scene.add(new THREE.AmbientLight(0x404040));
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(20, 40, 20);
scene.add(light);

// Track curve
const points = [];
for (let i = 0; i < 120; i++) {
    points.push(new THREE.Vector3(
        i - 60,
        Math.sin(i * 0.25) * 8,
        Math.cos(i * 0.25) * 8
    ));
}
const curve = new THREE.CatmullRomCurve3(points);

// Track mesh
const track = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 400, 0.5, 10, false),
    new THREE.MeshStandardMaterial({
        color: 0xff0000,
        metalness: 0.6,
        roughness: 0.3
    })
);
scene.add(track);

// Roller coaster cart
const cart = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 1),
    new THREE.MeshStandardMaterial({ color: 0x00ffcc })
);
scene.add(cart);

// Motion variables
let t = 0;
let speed = 0.001;
let rideMode = true;
let previousTangent = new THREE.Vector3();

// Toggle function (used by main.js)
function toggleMode() {
    rideMode = !rideMode;
}

// Animation
function animate() {
    requestAnimationFrame(animate);

    if (rideMode) {
        t += speed;
        if (t > 1) t = 0;

        const position = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t).normalize();

        camera.position.copy(position);
        camera.lookAt(position.clone().add(tangent));

        cart.position.copy(position);
        cart.lookAt(position.clone().add(tangent));

        // G-force calculation
        if (previousTangent.length() > 0) {
            const delta = tangent.clone().sub(previousTangent).length();
            const g = (delta * 50).toFixed(2);
            document.getElementById("gforce").innerText = g;
        }
        previousTangent.copy(tangent);
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
