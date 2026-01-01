// Speed control
document.getElementById("speed").addEventListener("input", e => {
    speed = parseFloat(e.target.value);
});

// Ride / Free mode toggle
const modeBtn = document.getElementById("modeBtn");
modeBtn.addEventListener("click", () => {
    toggleMode();
    modeBtn.innerText = rideMode
        ? "Switch to Free Mode"
        : "Switch to Ride Mode";
});

// Geometry facts
const facts = [
    "Clothoid loops reduce sudden G-forces.",
    "Real roller coasters never use perfect circles.",
    "Banked curves reduce lateral acceleration.",
    "Spline curves ensure smooth motion."
];

document.getElementById("factBtn").addEventListener("click", () => {
    const f = facts[Math.floor(Math.random() * facts.length)];
    document.getElementById("fact").innerText = f;
});
