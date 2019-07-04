const pathPositions = [[11, 1], [10, 1], [10, 2], [10, 3], [10, 4], [10, 5], [10, 6], [9, 6], [8, 6],
                     [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [7, 1], [6, 1], [6, 2], [6, 3], [6, 4],
                     [6, 5], [6, 6], [5, 6], [4, 6], [4, 5], [4, 4], [4, 3], [4, 2], [4, 1], [3, 1],
                     [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [1, 6], [0, 6], [0, 5], [0, 4],
                     [0, 3], [0, 2]];
const pathVectors = [];

const assets = {};

let towersManager;
let waveHandler;

const w = 50;
const l = 12;
const h = 8;

let health = 100;
let cash = 200;

function restart() {
  health = 100;
  cash = 200;
  waveHandler = new WaveSender(3, pathVectors, assets.enemy);
}

function drawDeath() {
  background(0, 200);
  fill(0, 150);
  strokeWeight(0);
  push();
  rectMode(CENTER);
  rect(width * 0.5, height * 0.45, width * 0.5, height * 0.4)
  pop();

  fill(255);

  textSize(50);
  text("You Lose", width / 2, height * 0.4);

  textSize(20);
  text("Cash: " + cash + "          Wave: " + waveHandler.wave, width / 2, height * 0.55);

  textSize(15);
  text("Press Space to Restart", width / 2, height * 0.8);
}

function drawStats() {
  stroke(0);
  strokeWeight(1);
  fill(255);
  rect(0, 0, width - 1, 20);

  // Health
  fill(200);
  rect(width * 0.2, 0, width * 0.6, 20);
  fill(0, 200, 0);
  rect(width * 0.2, 0, (width * 0.6) * (health / 100), 20);
  strokeWeight(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text("Health", width / 2, 11);

  // Stats
  fill(0);
  text("Cash: " + cash, width * 0.9, 11);
  text("Wave: " + waveHandler.wave, width * 0.1, 11);
}

function mousePressed() {
  waveHandler.checkButton();
  towersManager.handleClick(pathVectors, w, cash);
}

function keyPressed() {
  if (keyCode == 32) {
    if (health <= 0) restart();
    if (towersManager.iconSelected != -1) towersManager.cancel();
  }
}

function preload() {
  assets.castle = loadImage('assets/castle.png');
  assets.enemy = [loadImage('assets/enemy1.png'), loadImage('assets/enemy2.png')];
  assets.tower = [loadImage('assets/gun1.png'), loadImage('assets/gun2.png')];
}

function mainUpdate() {
  waveHandler.update();
  health -= waveHandler.getDamage();
  cash += waveHandler.getPoints();
  cash += towersManager.getCash();

  if (waveHandler.active) towersManager.update(waveHandler.current.enemies);
}

function mainDraw() {
  background(130, 180, 40);

  pathPositions.forEach(p => {
    fill(245, 245, 220);
    strokeWeight(0);
    rect(p[0] * w, 20 + p[1] * w, w, w);
  });

  image(assets.castle, 0, 20 + w, w, w);

  waveHandler.showEnemies();
  towersManager.show(pathVectors, w);

  drawStats();
  waveHandler.showButton();
}

function setup() {
  createCanvas(w * l + 40, 20 + w * h);

  pathVectors.push(createVector(width, 20 + w * 1.5));
  for (let i = 0; i < pathPositions.length; i++) {
    let v = createVector(pathPositions[i][0] * w + w / 2, 20 + pathPositions[i][1] * w + w / 2);
    pathVectors.push(v);
  }
  pathVectors.push(createVector(w / 2, 20 + w * 2));

  waveHandler = new WaveSender(pathVectors, assets.enemy);
  towersManager = new TowerManager(assets.tower);
}

function draw() {
  cursor(ARROW);
  if (health <= 0) {
    mainDraw();
    drawDeath();
    return;
  }
  mainUpdate();
  mainDraw();
}
