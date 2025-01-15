var jumping = true;
var rising = false;

window.onload = () => {
    updateGround();
    greeting();
    setInterval(applyGravity, 20);
}

// begin tutorial and physics

function greeting() {
    const greeting = document.getElementById("greeting");
    document.getElementById("greeting-next").addEventListener("click", () => {
        greeting.textContent = "By the way, that's you. Move with A/D or the left/right arrow keys.";
        document.getElementById("greeting-next").style.display = "none";
        setTimeout(() => {
            greeting.textContent = "Also, you can use W, Space, or the up arrow key to jump.";
            setTimeout(() => {
                greeting.textContent = "Alright, are you ready to play the game?";
                document.getElementById("start-game").style.display = "inline-block";
                document.getElementById("start-game").addEventListener("click", () => {
                    greeting.style.display = "none";
                    document.getElementById("start-game").style.display = "none";
                    start();
                });
            }, 7500);
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

function jump() {
    if (!jumping) {
        jumping = true;
        rising = true;
        const player = document.getElementById("player");
        let jumpSpeed = window.innerHeight * 0.025;
        const jumpInterval = setInterval(() => {
            if (rising) {
                const playerStyle = window.getComputedStyle(player);
                const playerBottom = parseFloat(playerStyle.bottom);
                player.style.bottom = `${playerBottom + jumpSpeed}px`;
                jumpSpeed *= 0.75;
                if (jumpSpeed < window.innerHeight * 0.001) {
                    rising = false;
                }
            } else {
                clearInterval(jumpInterval);
            }
        }, 20);
    }
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
    if (keysPressed["w"] || keysPressed[" "] || keysPressed["ArrowUp"]) {
        jump();
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
    console.log(jumping);
    if (!rising) {
        const player = document.getElementById("player");
        const playerStyle = window.getComputedStyle(player);
        const playerBottom = parseFloat(playerStyle.bottom);
        const screenHeight = window.innerHeight;
        const fallSpeed = screenHeight * 0.01;
        const playerRect = player.getBoundingClientRect();
        const underscoreElements = getElementsWithUnderscore();
        let isColliding = false;
        let targetBottom = playerBottom - fallSpeed;
        // collision detection to stop gravity
        for (var element of underscoreElements) {
            const elementRect = element.getBoundingClientRect();
            if (playerRect.bottom >= elementRect.top && playerRect.bottom <= elementRect.bottom &&
                playerRect.right >= elementRect.left && playerRect.left <= elementRect.right) {
                isColliding = true;
                jumping = false;
                targetBottom = screenHeight - elementRect.bottom;
                break;
            }
        }
        if (!isColliding) {
            player.style.bottom = `${playerBottom - fallSpeed}px`;
        } else {
            // snap to ground
            const currentBottom = parseFloat(player.style.bottom);
            // step for rate of snapping
            const step = (targetBottom - currentBottom) * 0.5;
            player.style.bottom = `${currentBottom + step}px`;
        }
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

// end tutorial and physics

// start actual game

function start() {
    // set all elements of the money class to inline block display
    const money = document.getElementsByClassName("money");
    for (var element of money) {
        element.style.display = "inline-block";
    }
}