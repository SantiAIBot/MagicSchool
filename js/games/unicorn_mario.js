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

  // Ajustar tamaño del canvas dinámicamente según la pantalla
  const containerWidth = unicornCanvas.parentElement.clientWidth;
  unicornCanvas.width = Math.min(containerWidth, 800);
  unicornCanvas.height = unicornCanvas.width / 2; // Mantener ratio 2:1
  
  unicornY = unicornCanvas.height - 100;
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
    // Escalar salto según altura del canvas
    unicornVY = -(unicornCanvas.height * 0.045); 
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

  const groundY = unicornCanvas.height - 100;
  unicornVY += gravity;
  unicornY += unicornVY;

  if (unicornY > groundY) {
    unicornY = groundY;
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
      showSpeech(`¡Bien hecho, ${userName}!`);
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
  ctx.font = "bold 20px Comic Sans MS";
  ctx.fillText("Monedas: " + score, 20, 40);
}

/**
 * Fondo
 */
function drawBackground() {
  ctx.fillStyle = "#a0eaff";
  ctx.fillRect(0, 0, unicornCanvas.width, unicornCanvas.height);

  const horizon = unicornCanvas.height * 0.9;

  if (rainbowImg.complete && rainbowImg.naturalWidth !== 0) {
    ctx.drawImage(rainbowImg, 0, 0, unicornCanvas.width, horizon);
  } else {
    const colors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#8b00ff"];
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < colors.length; i++) {
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = unicornCanvas.height * 0.03;
      ctx.beginPath();
      ctx.arc(unicornCanvas.width / 2, unicornCanvas.height * 1.1, (unicornCanvas.height * 1.05) - (i * 15), Math.PI, 0);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }

  ctx.fillStyle = "#7cfc00";
  ctx.fillRect(0, horizon, unicornCanvas.width, unicornCanvas.height - horizon);
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
  const groundY = unicornCanvas.height - 100;
  obstacles.push({
    x: unicornCanvas.width,
    y: groundY + 70,
    w: 20,
    h: 30
  });
}

/**
 * Monedas
 */
function spawnCoin() {
  const groundY = unicornCanvas.height - 100;
  coins.push({
    x: unicornCanvas.width,
    y: Math.random() * (groundY - 100) + 100
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
  ctx.roundRect(x, y, 160, 35, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.font = "bold 14px Arial";
  ctx.fillText(text, x + 10, y + 22);
}

/**
 * Fin del juego
 */
function gameOver() {
  gameActive = false;
  clearInterval(gameLoopId);
  if (typeof playSound === 'function') playSound("unicornHit");
  if (typeof sounds !== 'undefined' && sounds.unicornMusic) sounds.unicornMusic.pause();
  alert(`¡Ups, ${userName}! Monedas: ${score}`);
}
