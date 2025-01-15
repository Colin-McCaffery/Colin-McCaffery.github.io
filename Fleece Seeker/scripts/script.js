window.onload = () => {
    updateGround();
    greeting();
}

function greeting() {
    document.getElementById("greeting-next").addEventListener("click", () => {
        document.getElementById("greeting").textContent = "By the way, that's you. Move with A/D or the left/right arrow keys.";
        document.getElementById("greeting-next").style.display = "none";
        setTimeout(() => {
            document.getElementById("greeting").textContent = "Also, you can use W, Space, or the up arrow key to jump.";
        }, 7500);
    });
}

var keysPressed = {};

function handleKeyDown(event) {
    keysPressed[event.key] = true;
    movePlayer();
}

function handleKeyUp(event) {
    keysPressed[event.key] = false;
}

function movePlayer() {
    const player = document.getElementById("player");
    const playerStyle = window.getComputedStyle(player);
    const playerLeft = parseFloat(playerStyle.left);
    const screenWidth = window.innerWidth;
    const moveDistance = screenWidth * 0.0015;

    if (keysPressed["a"] || keysPressed["ArrowLeft"]) {
        player.style.left = `${playerLeft - moveDistance}px`;
    }
    if (keysPressed["d"] || keysPressed["ArrowRight"]) {
        player.style.left = `${playerLeft + moveDistance}px`;
    }
}

function updateGround() {
    const measurement = document.createElement("span");
    measurement.style.position = "absolute";
    measurement.style.whiteSpace = "nowrap";
    measurement.style.visibility = "hidden";
    measurement.style.fontFamily = "monospace";
    measurement.style.fontSize = "16px";
    measurement.textContent = "_";
    document.body.appendChild(measurement);
    const charWidth = measurement.offsetWidth;
    document.body.removeChild(measurement);
    const groundWidth = Math.ceil(window.innerWidth / charWidth) + Math.ceil(window.innerWidth / 1000);
    const ground = "_".repeat(groundWidth);
    document.getElementById("ground").textContent = ground;
    document.getElementById("ground").style.fontFamily = "monospace";
    document.getElementById("ground").style.fontSize = "16px";
    document.getElementById("ground").style.whiteSpace = "pre";
}

window.addEventListener("resize", updateGround);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
setInterval(movePlayer, 20);