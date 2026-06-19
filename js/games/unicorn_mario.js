/**
 * Juego Unicorn-Mario: Un runner lateral simple
 */

// Variables de estado del juego
let unicornCanvas, ctx;
let unicornX = 100, unicornY = 300;
let unicornVY = 0;
let gravity = 0.5;
let isJumping = false;
let obstacles = [];
let coins = [];
let gameActive = false;
let score = 0;
let gameLoopId;
let speechBubbleTimer = 0;
let speechText = "";

// ===============================
// IMAGEN DEL UNICORNIO
// ===============================
const unicornImg = new Image();
unicornImg.src = "D:/recon/Pictures/unicorn vector.png";

// Fondo arcoíris
const rainbowImg = new Image();
rainbowImg.src = "C:/Users/User/Pictures/Unicorn walking cartoon colored clipart _ Premium Vector_files/unicorn-walking-rainbow-colored-cartoon_576561-1455.jpg";

/**
 * Inicia o reinicia el juego
 */
function startUnicornGame() {
  unicornCanvas = document.getElementById('unicorn-game');
  ctx = unicornCanvas.getContext('2d');
  
  unicornY = 300;
  unicornVY = 0;
  obstacles = [];
  coins = [];
  score = 0;
  gameActive = true;

  if (typeof sounds !== 'undefined' && sounds.unicornMusic) {
    sounds.unicornMusic.loop = true;
    sounds.unicornMusic.volume = 0.4;
    sounds.unicornMusic.play().catch(e => console.log("Music blocked", e));
  }

  if (gameLoopId) clearInterval(gameLoopId);
  gameLoopId = setInterval(gameUpdate, 20);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') unicornJump();
  });
  unicornCanvas.addEventListener('mousedown', unicornJump);
  unicornCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    unicornJump();
  });
}

/**
 * Acción de saltar
 */
function unicornJump() {
  if (!isJumping && gameActive) {
    unicornVY = -18;
    isJumping = true;
    if (typeof playSound === 'function') playSound("unicornJump");
  }
}

/**
 * Bucle principal
 */
function gameUpdate() {
  if (!gameActive) return;

  drawBackground();

  unicornVY += gravity;
  unicornY += unicornVY;

  if (unicornY > 300) {
    unicornY = 300;
    unicornVY = 0;
    isJumping = false;
  }

  if (Math.random() < 0.015) spawnObstacle();
  if (Math.random() < 0.02) spawnCoin();

  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
    o.x -= 6;

    ctx.fillStyle = "#555";
    ctx.fillRect(o.x, o.y, o.w, o.h);

    if (checkCollision(unicornX + 25, unicornY + 25, 50, 50, o.x, o.y, o.w, o.h)) {
      gameOver();
    }

    if (o.x < -o.w) obstacles.splice(i, 1);
  }

  for (let i = coins.length - 1; i >= 0; i--) {
    let c = coins[i];
    c.x -= 6;

    ctx.fillStyle = "gold";
    ctx.beginPath();
    ctx.arc(c.x, c.y, 15, 0, Math.PI * 2);
    ctx.fill();

    if (checkCollision(unicornX + 25, unicornY + 25, 50, 50, c.x - 15, c.y - 15, 30, 30)) {
      score++;
      coins.splice(i, 1);
      showSpeech("¡Bien hecho, Helena!");
      if (typeof playSound === 'function') playSound("unicornCoin");
    }

    if (c.x < -30) coins.splice(i, 1);
  }

  // ===============================
  // UNICORNIO ANIMADO
  // ===============================
  drawUnicorn(unicornX, unicornY);

  if (speechBubbleTimer > 0) {
    drawSpeechBubble(unicornX + 70, unicornY - 40, speechText);
    speechBubbleTimer--;
  }

  ctx.fillStyle = "#333";
  ctx.font = "bold 24px Comic Sans MS";
  ctx.fillText("Monedas: " + score, 20, 40);
}

/**
 * Fondo
 */
function drawBackground() {
  ctx.fillStyle = "#a0eaff";
  ctx.fillRect(0, 0, unicornCanvas.width, unicornCanvas.height);

  if (rainbowImg.complete && rainbowImg.naturalWidth !== 0) {
    ctx.drawImage(rainbowImg, 0, 0, unicornCanvas.width, 360);
  } else {
    const colors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#8b00ff"];
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < colors.length; i++) {
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(400, 450, 420 - (i * 15), Math.PI, 0);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }

  ctx.fillStyle = "#7cfc00";
  ctx.fillRect(0, 360, unicornCanvas.width, 40);
  ctx.fillStyle = "#228b22";
  ctx.fillRect(0, 390, unicornCanvas.width, 10);
}

/**
 * Dibuja al unicornio
 */
function drawUnicorn(x, y) {
  ctx.drawImage(unicornImg, x, y, 100, 100);
}

/**
 * Obstáculos
 */
function spawnObstacle() {
  obstacles.push({
    x: unicornCanvas.width,
    y: 150,
    w: 20,
    h: 30
  });
}

/**
 * Monedas
 */
function spawnCoin() {
  coins.push({
    x: unicornCanvas.width,
    y: Math.random() * 150 + 100
  });
}

/**
 * Colisión
 */
function checkCollision(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

/**
 * Globo de texto
 */
function showSpeech(txt) {
  speechText = txt;
  speechBubbleTimer = 50;
}

function drawSpeechBubble(x, y, text) {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(x, y, 140, 30, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.font = "12px Arial";
  ctx.fillText(text, x + 10, y + 20);
}

/**
 * Fin del juego
 */
function gameOver() {
  gameActive = false;
  clearInterval(gameLoopId);
  if (typeof playSound === 'function') playSound("unicornHit");
  if (typeof sounds !== 'undefined' && sounds.unicornMusic) sounds.unicornMusic.pause();
  alert("¡Ups, Helena! Monedas: " + score);
}
