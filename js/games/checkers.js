/**
 * Juego de Damas Unicornio: Lógica Completa
 * Reglas: Movimiento diagonal, Capturas, Coronación y Reinas de largo alcance.
 */

let checkersBoard = []; // Estado del tablero (8x8)
let selectedSquare = null; // Cuadro seleccionado actualmente {r, c}
let checkersTurn = 'user'; // 'user' (Helena - Unicornios) o 'cpu' (Dragones)
let possibleMoves = []; // Movimientos posibles para la pieza seleccionada

/**
 * Inicializa el tablero de damas siguiendo las reglas internacionales
 */
function initCheckers() {
  const boardEl = document.getElementById('checkers-board');
  boardEl.innerHTML = '';
  checkersBoard = Array(8).fill(null).map(() => Array(8).fill(null));
  selectedSquare = null;
  checkersTurn = 'user';
  possibleMoves = [];

  applyCheckersTheme(); // Colores según el tema activo

  // Colocar piezas iniciales (CPU arriba, User abajo)
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 !== 0) { // Solo en cuadros oscuros
        if (r < 3) checkersBoard[r][c] = { type: 'cpu', isKing: false };
        if (r > 4) checkersBoard[r][c] = { type: 'user', isKing: false };
      }
    }
  }

  renderCheckers();
}

/**
 * Aplica colores al tablero según el tema de la aplicación
 */
function applyCheckersTheme() {
  const theme = document.body.className;
  const root = document.documentElement;

  if (theme.includes('bluey')) {
    root.style.setProperty('--checkers-dark', '#1e88e5');
    root.style.setProperty('--checkers-light', '#bbdefb');
    root.style.setProperty('--piece-user', '#fff');
    root.style.setProperty('--piece-user-border', '#87cefa');
    root.style.setProperty('--piece-cpu', '#1565c0');
    root.style.setProperty('--piece-cpu-border', '#0d47a1');
  } else if (theme.includes('unicornio')) {
    root.style.setProperty('--checkers-dark', '#d81b60');
    root.style.setProperty('--checkers-light', '#f8bbd0');
    root.style.setProperty('--piece-user', '#fff');
    root.style.setProperty('--piece-user-border', '#ff69b4');
    root.style.setProperty('--piece-cpu', '#4a148c');
    root.style.setProperty('--piece-cpu-border', '#311b92');
  } else if (theme.includes('arte')) {
    root.style.setProperty('--checkers-dark', '#f57c00');
    root.style.setProperty('--checkers-light', '#ffe0b2');
    root.style.setProperty('--piece-user', '#fff');
    root.style.setProperty('--piece-user-border', '#ffcc80');
    root.style.setProperty('--piece-cpu', '#3e2723');
    root.style.setProperty('--piece-cpu-border', '#212121');
  } else {
    root.style.setProperty('--checkers-dark', '#795548');
    root.style.setProperty('--checkers-light', '#ffccbc');
    root.style.setProperty('--piece-user', '#fff');
    root.style.setProperty('--piece-user-border', '#e91e63');
    root.style.setProperty('--piece-cpu', '#212121');
    root.style.setProperty('--piece-cpu-border', '#000');
  }
}

/**
 * Dibuja el tablero y las piezas actualizadas
 */
function renderCheckers() {
  const boardEl = document.getElementById('checkers-board');
  boardEl.innerHTML = '';

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const square = document.createElement('div');
      square.className = 'checkers-square';
      square.style.backgroundColor = (r + c) % 2 === 0 ? 'var(--checkers-light)' : 'var(--checkers-dark)';
      
      const piece = checkersBoard[r][c];
      if (piece) {
        const pieceEl = document.createElement('div');
        pieceEl.className = 'checkers-piece';
        
        // Colores desde variables CSS
        if (piece.type === 'user') {
          pieceEl.style.backgroundColor = 'var(--piece-user)';
          pieceEl.style.border = '3px solid var(--piece-user-border)';
        } else {
          pieceEl.style.backgroundColor = 'var(--piece-cpu)';
          pieceEl.style.border = '3px solid var(--piece-cpu-border)';
        }
        
        // Mostrar icono y corona si es Reina
        let content = piece.type === 'user' ? '🦄' : '🐲';
        if (piece.isKing) content = '👑' + content;
        pieceEl.textContent = content;
        
        // Resaltar si está seleccionada
        if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
          pieceEl.style.boxShadow = '0 0 15px yellow';
        }

        pieceEl.onclick = (e) => {
          e.stopPropagation();
          if (checkersTurn === 'user' && piece.type === 'user') selectPiece(r, c);
        };
        square.appendChild(pieceEl);
      }

      // Resaltar movimientos posibles
      const move = possibleMoves.find(m => m.toR === r && m.toC === c);
      if (move) {
        const hint = document.createElement('div');
        hint.style.width = '20px'; hint.style.height = '20px';
        hint.style.borderRadius = '50%'; hint.style.backgroundColor = 'rgba(0,255,0,0.5)';
        square.appendChild(hint);
        square.style.cursor = 'pointer';
        square.onclick = () => movePiece(move);
      } else if (!piece) {
        square.onclick = null;
      }

      boardEl.appendChild(square);
    }
  }

  document.getElementById('checkers-status').textContent = 
    checkersTurn === 'user' ? `Tu turno, ${userName} 🦄` : 'Turno del dragón 🐲 (Pensando...)';
}

/**
 * Selecciona una pieza y calcula sus movimientos legales
 */
function selectPiece(r, c) {
  selectedSquare = { r, c };
  possibleMoves = getLegalMoves(r, c);
  renderCheckers();
}

/**
 * Calcula los movimientos legales para una pieza específica
 */
function getLegalMoves(r, c) {
  const piece = checkersBoard[r][c];
  if (!piece) return [];
  
  let moves = [];
  const directions = piece.isKing ? [[1,1], [1,-1], [-1,1], [-1,-1]] : 
                     (piece.type === 'user' ? [[-1,1], [-1,-1]] : [[1,1], [1,-1]]);

  directions.forEach(([dr, dc]) => {
    if (piece.isKing) {
      // Movimiento REINA: Largo alcance
      let nr = r + dr;
      let nc = c + dc;
      let opponentFound = false;

      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const target = checkersBoard[nr][nc];
        if (!target) {
          if (!opponentFound) moves.push({ toR: nr, toC: nc });
          else {
            // Si ya encontramos un oponente, el primer espacio vacío después es el destino de captura
            moves.push({ toR: nr, toC: nc, capture: opponentFound });
            break; // Solo puede comer una y aterrizar
          }
        } else if (target.type !== piece.type && !opponentFound) {
          opponentFound = { r: nr, c: nc }; // Marcamos oponente para saltar
        } else {
          break; // Bloqueado por pieza propia o segundo oponente
        }
        nr += dr;
        nc += dc;
      }
    } else {
      // Movimiento SIMPLE
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const target = checkersBoard[nr][nc];
        if (!target) {
          moves.push({ toR: nr, toC: nc });
        } else if (target.type !== piece.type) {
          // Intento de captura simple
          const sr = nr + dr;
          const sc = nc + dc;
          if (sr >= 0 && sr < 8 && sc >= 0 && sc < 8 && !checkersBoard[sr][sc]) {
            moves.push({ toR: sr, toC: sc, capture: { r: nr, c: nc } });
          }
        }
      }
    }
  });

  return moves;
}

/**
 * Ejecuta el movimiento de una pieza
 */
function movePiece(move) {
  const fromR = selectedSquare.r;
  const fromC = selectedSquare.c;
  const piece = checkersBoard[fromR][fromC];

  // Ejecutar movimiento
  checkersBoard[move.toR][move.toC] = piece;
  checkersBoard[fromR][fromC] = null;

  // Si hubo captura, eliminar pieza enemiga
  if (move.capture) {
    checkersBoard[move.capture.r][move.capture.c] = null;
    if (typeof playSound === 'function') playSound("unicornCoin");
  }

  // Coronación
  if (piece.type === 'user' && move.toR === 0) piece.isKing = true;
  if (piece.type === 'cpu' && move.toR === 7) piece.isKing = true;

  selectedSquare = null;
  possibleMoves = [];
  checkersTurn = (checkersTurn === 'user' ? 'cpu' : 'user');
  
  renderCheckers();

  if (checkersTurn === 'cpu') {
    setTimeout(cpuCheckersMove, 1000);
  }
}

/**
 * Inteligencia Artificial para el Dragón
 */
function cpuCheckersMove() {
  let allMoves = [];
  // Buscar todos los movimientos de todas las piezas de la CPU
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (checkersBoard[r][c] && checkersBoard[r][c].type === 'cpu') {
        const moves = getLegalMoves(r, c);
        moves.forEach(m => allMoves.push({ from: {r, c}, ...m }));
      }
    }
  }

  if (allMoves.length > 0) {
    // Priorizar capturas
    const captures = allMoves.filter(m => m.capture);
    const chosenMove = captures.length > 0 ? captures[Math.floor(Math.random() * captures.length)] : 
                                            allMoves[Math.floor(Math.random() * allMoves.length)];
    
    selectedSquare = chosenMove.from;
    movePiece(chosenMove);
  } else {
    alert(`¡Felicidades ${userName}! Has ganado a los dragones.`);
    initCheckers();
  }
}
