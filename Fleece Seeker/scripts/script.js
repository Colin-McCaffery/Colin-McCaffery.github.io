window.onload = () => {
    updateGround();
    greeting();
    setInterval(applyGravity, 20);
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
    const moveDistance = screenWidth * 0.0015; // 1% of the screen width

    if (keysPressed["a"] || keysPressed["ArrowLeft"]) {
        player.style.left = `${playerLeft - moveDistance}px`;
    }
    if (keysPressed["d"] || keysPressed["ArrowRight"]) {
        player.style.left = `${playerLeft + moveDistance}px`;
    }
}

function getElementsWithUnderscore() {
    const elements = document.body.getElementsByTagName("*");
    const underscoreElements = [];
    for (let element of elements) {
        if (element.textContent.includes("_")) {
            underscoreElements.push(element);
        }
    }
    return underscoreElements;
}

function applyGravity() {
    const player = document.getElementById("player");
    const playerStyle = window.getComputedStyle(player);
    const playerBottom = parseFloat(playerStyle.bottom);
    const screenHeight = window.innerHeight;
    const fallSpeed = screenHeight * 0.005;
    const playerRect = player.getBoundingClientRect();
    const underscoreElements = getElementsWithUnderscore();
    let isColliding = false;
    // collision detection to stop gravity
    for (var element of underscoreElements) {
        const elementRect = element.getBoundingClientRect();
        if (playerRect.bottom >= elementRect.bottom && playerRect.bottom <= elementRect.bottom &&
            playerRect.right >= elementRect.left && playerRect.left <= elementRect.right) {
            isColliding = true;
            console.log("colliding");
        }
    }
    if (!isColliding) {
        player.style.bottom = `${playerBottom - fallSpeed}px`;
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
// move player every 20 milliseconds
setInterval(movePlayer, 20);