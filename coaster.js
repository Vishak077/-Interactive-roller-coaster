// Scene
const scene = new THREE.Scene();

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

// OrbitControls (mouse + touch work by default)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;

// Safe start position
camera.position.set(0, 10, 25);
controls.target.set(0, 0, 0);
controls.update();

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// Debug helper
scene.add(new THREE.AxesHelper(5));

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

// Track
const track = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 400, 0.5, 10, false),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
scene.add(track);

// Cart
const cart = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 1),
    new THREE.MeshStandardMaterial({ color: 0x00ffcc })
);
scene.add(cart);

// Motion
let t = 0;
let speed = 0.001;
let rideMode = true;
let previousTangent = new THREE.Vector3();

// Toggle (used by main.js)
function toggleMode() {
    rideMode = !rideMode;
}

// Animate
function animate() {
    requestAnimationFrame(animate);

    if (rideMode) {
        t += speed;
        if (t > 1) t = 0;

        const pos = curve.getPointAt(t);
        const tan = curve.getTangentAt(t).normalize();

        camera.position.copy(pos.clone().add(new THREE.Vector3(0, 1, 0)));
        camera.lookAt(pos.clone().add(tan));

        cart.position.copy(pos);
        cart.lookAt(pos.clone().add(tan));

        if (previousTangent.length() > 0) {
            const g = (tan.clone().sub(previousTangent).length() * 50).toFixed(2);
            document.getElementById("gforce").innerText = g;
        }
        previousTangent.copy(tan);
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
