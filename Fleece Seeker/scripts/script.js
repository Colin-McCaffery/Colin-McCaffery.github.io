const player = document.getElementById("player");
var jumping = true;
var rising = false;
var planted = false;

window.onload = () => {
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
            }, 75);
        }, 75);
    });
}

var keysPressed = {};
var gameStarted = false;

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
        let jumpSpeed = window.innerHeight * 0.015;
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
    const playerStyle = window.getComputedStyle(player);
    const playerPos = parseFloat(playerStyle.left);
    const screenWidth = window.innerWidth;
    const moveDistance = screenWidth * 0.0015;
    if (keysPressed["a"] || keysPressed["ArrowLeft"]) {
        player.style.left = `${playerPos - moveDistance}px`;
    }
    if (keysPressed["d"] || keysPressed["ArrowRight"]) {
        player.style.left = `${playerPos + moveDistance}px`;
    }
    if (keysPressed["w"] || keysPressed[" "] || keysPressed["ArrowUp"]) {
        jump();
    }
    showElements(playerPos);
}

function showElements(playerPos) {
    // farm
    const screenWidth = window.innerWidth;
    if (gameStarted && playerPos >= screenWidth * 0.3 && playerPos <= screenWidth * 0.4) {
        document.getElementById("farm-text").style.display = "inline-block";
        document.getElementById("farm-plant-button-div").style.display = "inline-block";
        document.getElementById("farm-plant-button").style.display = "inline-block";
        document.getElementById("farm-buy-button-div").style.display = "inline-block";
        document.getElementById("farm-buy-button").style.display = "inline-block";
        if (plantedSeeds.includes(0)) {
            document.getElementById("farm-harvest-button-div").style.display = "inline-block";
            document.getElementById("farm-harvest-button").style.display = "inline-block";
        }
        document.getElementById("farm").style.display = "inline-block";
        document.getElementById("wheat-seeds-label-1").style.display = "inline-block";
        document.getElementById("wheat-seeds").style.display = "inline-block";
        document.getElementById("wheat-seeds-label-2").style.display = "inline-block";
        document.getElementById("planted-wheat-seeds-label-1").style.display = "inline-block";
        document.getElementById("planted-wheat-seeds").style.display = "inline-block";
        document.getElementById("planted-wheat-seeds-label-2").style.display = "inline-block";
        document.getElementById("wheat-label-1").style.display = "inline-block";
        document.getElementById("wheat").style.display = "inline-block";
        document.getElementById("wheat-label-2").style.display = "inline-block";
    } else {
        document.getElementById("farm-plant-button-div").style.display = "none";
        document.getElementById("farm-buy-button-div").style.display = "none";
        document.getElementById("farm-harvest-button-div").style.display = "none";
    }
}

function applyGravity() {
    if (!rising) {
        const player = document.getElementById("player");
        const playerStyle = window.getComputedStyle(player);
        const playerBottom = parseFloat(playerStyle.bottom);
        const screenHeight = window.innerHeight;
        const fallSpeed = screenHeight * 0.01;
        const playerRect = player.getBoundingClientRect();
        const groundElements = document.querySelectorAll("body *");
        let isColliding = false;
        let targetBottom = playerBottom - fallSpeed;

        // collision detection with underscores
        groundElements.forEach(element => {
            const elementText = element.textContent;
            const elementRect = element.getBoundingClientRect();
            for (let i = 0; i < elementText.length; i++) {
                if (elementText[i] === "_") {
                    const charX = elementRect.left + (i / elementText.length) * elementRect.width;
                    const charY = elementRect.top + elementRect.height;
                    if (playerRect.bottom >= charY && playerRect.left <= charX + 8 && playerRect.right >= charX) {
                        isColliding = true;
                        jumping = false;
                        targetBottom = screenHeight - charY;
                        break;
                    }
                }
            }
        });

        if (!isColliding) {
            player.style.bottom = `${playerBottom - fallSpeed}px`;
        } else {
            // snap to ground
            const currentBottom = parseFloat(player.style.bottom);
            const step = (targetBottom - currentBottom) * 0.5;
            player.style.bottom = `${currentBottom + step}px`;
        }
    }
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
// move player every 20 milliseconds
setInterval(movePlayer, 20);

// end tutorial and physics

// start actual game

var seedCost = 1;
var plantedSeeds = [];

function start() {
    // set all elements of the money class to inline block display
    gameStarted = true;
    const money = document.getElementsByClassName("money-stats");
    for (var element of money) {
        element.style.display = "inline-block";
    }
    // buy wheat seeds button
    document.getElementById("farm-buy-button").addEventListener("click", () => {
        if (document.getElementById("money").textContent >= seedCost) {
            document.getElementById("money").textContent -= seedCost;
            document.getElementById("wheat-seeds").textContent++;
            seedCost = Math.ceil(seedCost * 1.15);
            document.getElementById("farm-buy-button").textContent = `Buy Wheat Seeds (${seedCost}g)`;
        }
    });
    // plant wheat seeds button
    document.getElementById("farm-plant-button").addEventListener("click", () => {
        if (document.getElementById("wheat-seeds").textContent > 0) {
            document.getElementById("wheat-seeds").textContent--;
            document.getElementById("planted-wheat-seeds").textContent++;
            plantedSeeds.push(Math.random() * 1000);
        }
    });
    setInterval(growPlants, 100);
    // harvest wheat seeds button
    document.getElementById("farm-harvest-button").addEventListener("click", () => {
        for (let i = 0; i < plantedSeeds.length; i++) {
            if (plantedSeeds[i] == 0) {
                plantedSeeds[i] = Math.random() * 1000;
                document.getElementById("wheat").textContent++;
            }
        }
        if (!plantedSeeds.includes(0)) {
            document.getElementById("farm-harvest-button").style.display = "none";
        }
        if (document.getElementById("wheat").textContent > 0) {
            document.getElementById("sell-button").style.display = "inline-block";
        } else {
            document.getElementById("sell-button").style.display = "none";
        }
    });
    document.getElementById("sell-button").addEventListener("click", () => {
        document.getElementById("money").textContent = parseInt(document.getElementById("money").textContent) + parseInt(document.getElementById("wheat").textContent);
        document.getElementById("wheat").textContent = 0;
        if (document.getElementById("wheat").textContent > 0) {
            document.getElementById("sell-button").style.display = "inline-block";
        } else {
            document.getElementById("sell-button").style.display = "none";
        }
    });
}

function growPlants() {
    if (plantedSeeds.length > 0) {
        for (let i = 0; i < plantedSeeds.length; i++) {
            if (plantedSeeds[i] != 0 && Math.random() < 0.25) {
                plantedSeeds[i] -= (Math.random() * 25);
                if (plantedSeeds[i] <= 0) {
                    plantedSeeds[i] = 0;
                }
            }
        }
    }
}
