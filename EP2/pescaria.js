
window.onload = main;

// ==================================================================
// Global Variables
var ctx;
var width, height;

var gFishes;

const SAND_HEIGHT = 0.3;

const MIN_FISH = 10;
const MAX_FISH = 16;

const MIN_FISH_POLY = 4;
const MAX_FISH_POLY = 18;

const MIN_FISH_SIZE = 10;
const MAX_FISH_SIZE = 35;

const MIN_FISH_X_VEL = 1;
const MAX_FISH_X_VEL = 3;
const MIN_FISH_Y_VEL = 1;
const MAX_FISH_Y_VEL = 3;

const NUM_FISH = getRandomInt(MIN_FISH, MAX_FISH);

//==================================================================
/**
 * Classes
 */

class Fish {
    constructor(n, R, cx, cy, vx, vy) {
        this.n = n;
        this.R = R;
        this.cx = cx;
        this.cy = cy;
        this.vx = vx;
        this.vy = vy;

        this.color = getRandomColor();
        this.poly = getCircleVertices(n, R);
    }

    bounceX() { this.vx *= -1; }
    bounceY() { this.vy *= -1; }
}

//==================================================================
/**
 * Main function
 */
function main() {

    const canvas = document.getElementById('meucanvas');
    ctx = canvas.getContext('2d');
    if (!ctx) alert("Não consegui abrir o contexto 2d :-( ");

    width = canvas.width;
    height = canvas.height;

    initializeFish();

    for (const fish of gFishes)
        moveFish(fish);
}

function initializeFish() {
    gFishes = new Array(NUM_FISH);

    for (let i = 0; i < NUM_FISH; i++) {
        let n = getRandomInt(MIN_FISH_POLY, MAX_FISH_POLY);
        let R = getRandomInt(MIN_FISH_SIZE, MAX_FISH_SIZE);
        let cx = getRandomInt(R, width - R);
        let cy = getRandomInt(R, height - R);
        let vx = getRandomInt(MIN_FISH_X_VEL, MAX_FISH_X_VEL);
        let vy = getRandomInt(MIN_FISH_Y_VEL, MAX_FISH_Y_VEL);

        gFishes[i] = new Fish(n, R, cx, cy, vx, vy);
    }
}

function drawFishes() {
    for (const fish of gFishes) {

        let fishDrawing = new Path2D();
        fishDrawing.moveTo(fish.cx + fish.poly[0][0], fish.cy - fish.poly[0][1]);
        for (let j = 1; j < fish.n; j++) {
            let fishPosX = fish.cx + fish.poly[j][0];
            let fishPosY = fish.cy - fish.poly[j][1];
            fishDrawing.lineTo(fishPosX, fishPosY);
        }
        fishDrawing.closePath();

        ctx.fillStyle = fish.color;
        ctx.fill(fishDrawing);
    }
}

/**
 * Gets the verticies of a circumscribed circle of a polygon
 * @param {number} n Number of polygon sides
 * @param {number} R Radius of circumscribed circle
 * @returns
 */
function getCircleVertices(n, R) {
    let vertices = new Array(n);

    for (let i = 0; i < n; i++) {
        let angle = (2 * Math.PI) / n * i;
        let x = Math.cos(angle) * R;
        let y = Math.sin(angle) * R;
        vertices[i] = [x, y];
    }
    return vertices;
}

//==================================================================
/**
 * Moves a fish based on its current position and velocity
 * @param {Fish} fish
 */
function moveFish(fish) {
    fish.cx += fish.vx;
    fish.cy += fish.vy;

    let outsideLeftBorder = (fish.cx <= fish.R);
    let outsideRightBorder = (fish.cx + fish.R >= width);
    let outsideTopBorder = (fish.cy <= fish.R);
    let outsideBottomBorder = (fish.cy + fish.R >= height);

    if (outsideLeftBorder || outsideRightBorder)
        fish.bounceX();
    if (outsideTopBorder || outsideBottomBorder)
        fish.bounceY();

    ctx.clearRect(0, 0, width, height);
    drawFishes();
    requestAnimationFrame(() => { moveFish(fish) });
};

//==================================================================
/**
 * Returns a random integer between min and max
 * @param {number} min
 * @param {number} max
 * @returns
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
    var red = getRandomInt(0, 255);
    var green = getRandomInt(0, 255);
    var blue = getRandomInt(0, 255);
    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
}
