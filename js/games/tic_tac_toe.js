/**
 * Lógica del juego Tic-Tac-Toe con CPU inteligente (Minimax)
 */

// Estado del tablero
let tttBoard = []; // Array para las 9 casillas
let tttTurn = '❤️'; // Turno actual (❤️ siempre empieza)
let tttGameOver = false; // Bandera para indicar si el juego terminó

/**
 * Inicializa o reinicia el tablero de juego
 */
function initTicTacToe() {
  const boardDiv = document.getElementById('ttt-board'); // Obtiene el contenedor del tablero
  boardDiv.innerHTML = ''; // Limpia el contenido anterior
  tttBoard = Array(9).fill(''); // Crea un array de 9 espacios vacíos
  tttTurn = '❤️'; // Reinicia el turno a ❤️
  tttGameOver = false; // Reinicia el estado de fin de juego
  document.getElementById('ttt-status').textContent = 'Tu turno (❤️)'; // Actualiza el mensaje de estado

  // Crea los 9 botones del tablero
  for (let i = 0; i < 9; i++) {
    const btn = document.createElement('button'); // Crea un elemento botón
    btn.onclick = () => tttClick(i, btn); // Asigna el evento click
    boardDiv.appendChild(btn); // Añade el botón al contenedor
  }
}

/**
 * Maneja el click del jugador en una casilla
 * @param {number} i - Índice de la casilla (0-8)
 * @param {HTMLElement} btn - Elemento del botón clickeado
 */
function tttClick(i, btn) {
  if (tttGameOver || tttBoard[i] !== '') return; // Si terminó o la casilla está ocupada, no hace nada

  // Movimiento del jugador
  tttBoard[i] = '❤️'; // Marca la casilla con ❤️ en el estado
  btn.textContent = '❤️'; // Muestra ❤️ en el botón
  
  if (typeof playSound === 'function') playSound("tttPlace"); // Sonido de colocar pieza

  // Verifica si el jugador ganó
  if (checkWin('❤️')) {
    document.getElementById('ttt-status').textContent = 'Ganaste 🎉'; // Muestra mensaje de victoria
    tttGameOver = true; // Marca fin de juego
    if (typeof playSound === 'function') playSound("tttWin"); // Sonido de victoria
    return;
  }

  // Verifica si hay empate
  if (tttBoard.every(c => c !== '')) {
    document.getElementById('ttt-status').textContent = 'Empate 🤝'; // Muestra mensaje de empate
    tttGameOver = true; // Marca fin de juego
    return;
  }

  // Turno de la CPU
  document.getElementById('ttt-status').textContent = 'Pensando... 🤖'; // Muestra estado de espera

  // Retraso artificial para que parezca que la CPU piensa
  setTimeout(() => {
    cpuMove(); // Ejecuta el movimiento de la máquina
  }, 300);
}

/**
 * Realiza el movimiento de la CPU usando el algoritmo Minimax
 */
function cpuMove() {
  let bestScore = -Infinity; // Inicializa la mejor puntuación como muy baja
  let move = -1; // Almacenará la mejor posición

  // Evalúa todas las casillas disponibles
  for (let i = 0; i < 9; i++) {
    if (tttBoard[i] === '') { // Si la casilla está vacía
      tttBoard[i] = '⭐'; // Simula movimiento de la CPU (⭐)
      let score = minimax(tttBoard, 0, false); // Calcula puntuación con minimax
      tttBoard[i] = ''; // Deshace la simulación

      if (score > bestScore) { // Si la puntuación es mejor que la actual
        bestScore = score; // Actualiza mejor puntuación
        move = i; // Guarda la posición
      }
    }
  }

  // Ejecuta el mejor movimiento encontrado
  tttBoard[move] = '⭐'; // Marca el estado
  const boardDiv = document.getElementById('ttt-board'); // Obtiene el tablero
  boardDiv.children[move].textContent = '⭐'; // Muestra ⭐ en el botón correspondiente
  
  if (typeof playSound === 'function') playSound("tttPlace"); // Sonido de colocar pieza CPU

  // Verifica si la CPU ganó
  if (checkWin('⭐')) {
    document.getElementById('ttt-status').textContent = 'La máquina ganó 🤖'; // Mensaje de derrota
    tttGameOver = true; // Marca fin de juego
    if (typeof playSound === 'function') playSound("tttLose"); // Sonido de derrota
    return;
  }

  // Verifica empate
  if (tttBoard.every(c => c !== '')) {
    document.getElementById('ttt-status').textContent = 'Empate 🤝'; // Mensaje de empate
    tttGameOver = true; // Marca fin de juego
    return;
  }

  document.getElementById('ttt-status').textContent = 'Tu turno (❤️)'; // Devuelve el turno al jugador
}

/**
 * Algoritmo recursivo para determinar la mejor jugada
 * @param {Array} board - Estado actual del tablero
 * @param {number} depth - Profundidad de la recursión
 * @param {boolean} isMaximizing - Si el turno es para maximizar o minimizar
 */
function minimax(board, depth, isMaximizing) {
  if (checkWin('⭐')) return 10 - depth; // Puntuación positiva para victoria de CPU
  if (checkWin('❤️')) return depth - 10; // Puntuación negativa para victoria de Jugador
  if (board.every(c => c !== '')) return 0; // Puntuación neutra para empate

  if (isMaximizing) { // Turno de la CPU
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = '⭐';
        let score = minimax(board, depth + 1, false); // Llamada recursiva
        board[i] = '';
        bestScore = Math.max(score, bestScore); // Busca el máximo
      }
    }
    return bestScore;
  } else { // Turno del Jugador
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = '❤️';
        let score = minimax(board, depth + 1, true); // Llamada recursiva
        board[i] = '';
        bestScore = Math.min(score, bestScore); // Busca el mínimo
      }
    }
    return bestScore;
  }
}

/**
 * Comprueba si hay una línea ganadora para un jugador
 * @param {string} p - El jugador a comprobar ('❤️' o '⭐')
 */
function checkWin(p) {
  const w = [
    [0,1,2],[3,4,5],[6,7,8], // Horizontales
    [0,3,6],[1,4,7],[2,5,8], // Verticales
    [0,4,8],[2,4,6]           // Diagonales
  ];
  // Comprueba si alguna combinación ganadora coincide con las marcas del jugador
  return w.some(([a,b,c]) => tttBoard[a] === p && tttBoard[b] === p && tttBoard[c] === p);
}

/**
 * Reinicia el juego de Tic-Tac-Toe
 */
function resetTicTacToe() {
  initTicTacToe(); // Llama a la función de inicialización
}
