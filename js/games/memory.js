/**
 * Juego de Memoria Mágica: Lógica Progresiva
 */

let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryDifficulty = 6; // Empieza con 6 cartas (3 parejas)
let lockBoard = false;

// Banco de iconos para las cartas
const memoryIcons = [
  '🐶', '🦄', '🌈', '🦋', '⭐', '❤️', '🍦', '🍩', '🎂', '🏖️',
  '🦁', '🐼', '🐘', '🍕', '🎈', '🎨', '🚀', '🎁', '🍭', '🌸'
];

/**
 * Inicializa el juego de memoria con la dificultad actual
 */
function initMemoryGame() {
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  flippedCards = [];
  matchedPairs = 0;
  lockBoard = false;

  // Ajustar columnas según dificultad
  let cols = 3;
  if (memoryDifficulty > 6) cols = 4;
  if (memoryDifficulty > 12) cols = 5;
  grid.style.gridTemplateColumns = `repeat(${cols}, 80px)`;

  // Seleccionar iconos aleatorios para las parejas
  const numPairs = memoryDifficulty / 2;
  const selectedIcons = memoryIcons.sort(() => 0.5 - Math.random()).slice(0, numPairs);
  const deck = [...selectedIcons, ...selectedIcons].sort(() => 0.5 - Math.random());

  deck.forEach((icon, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.icon = icon;
    card.dataset.index = index;
    card.innerHTML = `
      <div class="memory-card-inner">
        <div class="memory-card-front">❓</div>
        <div class="memory-card-back">${icon}</div>
      </div>
    `;
    card.onclick = () => flipCard(card);
    grid.appendChild(card);
  });

  document.getElementById('memory-status').textContent = `Dificultad: ${memoryDifficulty} cartas`;
}

/**
 * Voltea una carta
 */
function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (typeof playSound === 'function') playSound("click");

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

/**
 * Comprueba si las dos cartas volteadas coinciden
 */
function checkMatch() {
  lockBoard = true;
  const [c1, c2] = flippedCards;
  const isMatch = c1.dataset.icon === c2.dataset.icon;

  if (isMatch) {
    matchedPairs++;
    c1.classList.add('matched');
    c2.classList.add('matched');
    flippedCards = [];
    lockBoard = false;

    if (typeof playSound === 'function') playSound("unicornCoin");

    if (matchedPairs === memoryDifficulty / 2) {
      setTimeout(winMemory, 500);
    }
  } else {
    setTimeout(() => {
      c1.classList.remove('flipped');
      c2.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

/**
 * Lógica de victoria y progresión
 */
function winMemory() {
  alert(`¡Muy bien Helena! Has completado ${memoryDifficulty} cartas.`);
  if (typeof agregarPuntos === 'function') agregarPuntos(memoryDifficulty * 2);

  // Aumentar dificultad
  if (memoryDifficulty < 20) {
    memoryDifficulty += 2;
  } else {
    memoryDifficulty = 6; // Reiniciar si llega al máximo
  }

  initMemoryGame();
}
