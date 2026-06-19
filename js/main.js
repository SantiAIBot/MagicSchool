/**
 * Lógica principal de la aplicación: Matemáticas, Números, Lectura y Gestión de Tiempo
 */

// ---------- VARIABLES GLOBALES Y ESTADO ----------
let userName = localStorage.getItem('userName') || 'Helena'; // Nombre del usuario
let puntosTotales = Number(localStorage.getItem('puntosTotales')) || 0; // Puntos ganados por tareas
let accesoPorContrasena = false; // Indica si se entró a juegos con la clave secreta
let preguntas = []; // Lista de preguntas de matemáticas
let preguntaActual = 0; // Índice de la pregunta actual de matemáticas
let setsCompletos = Number(localStorage.getItem('setsCompletos')) || 0; // Contador de sets de 20 preguntas
let numerosPreguntas = []; // Lista de preguntas de números
let numeroActual = 0; // Índice de la pregunta actual de números
let playMinutes = Number(localStorage.getItem('playMinutes')) || 0; // Minutos acumulados para jugar
let timer = null; // Referencia al intervalo del temporizador de juego
let idxLectura = 0; // Índice de la palabra actual en lectura
let dedoInterval = null; // Intervalo para la animación del dedo 👆

// Lista de palabras para el módulo de lectura
const palabrasLectura = [
  'GATO', 'CASA', 'MÚSICA', 'UNIVERSO', 'UNICORNIO', 'AZUL', 'FAMILIA'
];

// ---------- UTILIDADES ----------

/**
 * Genera un número aleatorio entre min y max (incluidos)
 */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Inicia la aplicación desde la pantalla de bienvenida
 */
function startApp() {
  const nameInput = document.getElementById('user-name-input');
  if (nameInput && nameInput.value.trim() !== "") {
    userName = nameInput.value.trim();
    localStorage.setItem('userName', userName);
  }
  
  updateGreetingNames();
  document.getElementById('welcome-screen').style.display = 'none';
  actualizarPuntosDisplay();
  if (typeof playSound === 'function') playSound("openTab");
}

/**
 * Actualiza todos los elementos que muestran el nombre del usuario
 */
function updateGreetingNames() {
  const elements = document.querySelectorAll('.user-name');
  elements.forEach(el => {
    el.textContent = userName;
  });
}

/**
 * Actualiza el marcador de puntos en la interfaz
 */
function actualizarPuntosDisplay() {
  const el = document.getElementById('puntos-totales');
  if (el) el.textContent = puntosTotales;
}

/**
 * Añade puntos al total y guarda en localStorage
 * @param {number} p - Puntos a sumar
 */
function agregarPuntos(p) {
  puntosTotales += p;
  localStorage.setItem('puntosTotales', puntosTotales);
  actualizarPuntosDisplay();
}

// ---------- TABS Y TEMAS ----------

/**
 * Cambia el tema visual de la aplicación
 * @param {string} tema - Clase CSS del tema
 */
function cambiarTema(tema) {
  document.body.className = tema;
}

/**
 * Cambia entre las pestañas principales
 * @param {string} name - Nombre de la pestaña
 */
function openTab(name) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  if (typeof playSound === 'function') playSound("openTab"); // Sonido al cambiar pestaña
}

/**
 * Lógica especial para abrir la pestaña de juegos (con validación)
 */
function openGamesTab() {
  let minutos = Number(localStorage.getItem('playMinutes')) || 0;

  // Si no hay minutos, pide la contraseña
  if (minutos <= 0) {
    const pass = prompt('Introduce la contraseña para acceder a los juegos:');

    if (pass === '1095') {
      accesoPorContrasena = true;
      openTab('games');
      actualizarMinutos();
      showHelenaGreeting(); // Mostrar saludo personalizado
      if (typeof playSound === 'function') playSound("greeting"); // Saludo al entrar a juegos
      if (typeof initTicTacToe === 'function') initTicTacToe();
      return;
    }

    alert('Acceso denegado. Necesitas minutos o la contraseña.');
    return;
  }

  // Si tiene minutos, entra directamente
  accesoPorContrasena = false;
  openTab('games');
  actualizarMinutos();
  showHelenaGreeting(); // Mostrar saludo personalizado
  if (typeof playSound === 'function') playSound("greeting"); // Saludo al entrar a juegos
  if (typeof initTicTacToe === 'function') initTicTacToe();
}

/**
 * Muestra el overlay de saludo para Helena
 */
function showHelenaGreeting() {
  const overlay = document.getElementById('helena-overlay');
  if (overlay) overlay.style.display = 'flex';
}

/**
 * Cierra el overlay de saludo
 */
function closeGreeting() {
  const overlay = document.getElementById('helena-overlay');
  if (overlay) overlay.style.display = 'none';
}

/**
 * Muestra el globo de texto del unicornio en las actividades
 * @param {string} type - 'math' o 'numbers'
 * @param {boolean} isCorrect - Si la respuesta fue correcta
 */
function showUnicornFeedback(type, isCorrect) {
  const helper = document.getElementById(type + '-unicorn');
  const bubble = document.getElementById(type + '-bubble');
  
  if (!helper || !bubble) return;

  // Selecciona el mensaje según el resultado
  if (isCorrect) {
    bubble.innerHTML = `¡Buen trabajo <span class="user-name">${userName}</span>, tú puedes! 🌟`;
  } else {
    bubble.innerHTML = `Inténtalo de nuevo <span class="user-name">${userName}</span>, tú puedes. 💪`;
  }

  // Muestra el ayudante
  helper.classList.add('visible');

  // Lo oculta después de 3 segundos
  setTimeout(() => {
    helper.classList.remove('visible');
  }, 3000);
}

// ---------- MATEMÁTICAS ----------

/**
 * Genera un set de 10 preguntas aleatorias del banco de 20
 */
function generarPreguntas() {
  preguntas = [];
  preguntaActual = 0;

  const generadores = [
    () => genSuma(1, 9), () => genSuma(1, 9), () => genResta(5, 15, 1, 5),
    () => genSuma(1, 9), () => genResta(5, 15, 1, 5), () => genSuma(10, 30, 5, 20),
    () => genResta(15, 40, 5, 15), () => genComparacion(10, 50), () => genSecuenciaPar(),
    () => genSumaTriple(), () => genHistoria(), () => genResta(30, 60, 10, 25),
    () => genComparacionMenor(20, 80), () => genSuma(10, 30, 5, 20), () => genResta(15, 40, 5, 15),
    () => genSecuenciaPar(), () => genSumaTriple(), () => genHistoria(),
    () => genSuma(10, 30, 5, 20), () => genResta(30, 60, 10, 25)
  ];

  // Mezclar el banco de generadores para aleatoriedad
  const mezclados = [...generadores].sort(() => Math.random() - 0.5);

  // Seleccionar solo las primeras 10 preguntas
  for (let i = 0; i < 10; i++) {
    preguntas.push(mezclados[i]());
  }

  mostrarPregunta();
}

/**
 * Renderiza la pregunta actual de matemáticas en el HTML
 */
function mostrarPregunta() {
  const cont = document.getElementById('math-questions');
  const q = preguntas[preguntaActual];

  cont.innerHTML = `
    <div class="card" style="text-align: center;">
      <h3>Pregunta ${preguntaActual + 1} de 10</h3>
      <p class="pregunta-gigante">${q.texto}</p>
      <input type="number" id="respuestaMath" class="input-gigante">
      <br>
      <button onclick="verificarRespuesta()" class="btn-gigante">Responder</button>
      <div id="math-feedback" class="resultado" style="font-size: 2rem;"></div>
    </div>
  `;
}

/**
 * Verifica si la respuesta introducida es correcta
 */
function verificarRespuesta() {
  const val = Number(document.getElementById('respuestaMath').value);
  const correcto = preguntas[preguntaActual].resp;
  const fb = document.getElementById('math-feedback');

  if (val === correcto) {
    fb.textContent = "✔ ¡Correcto!";
    fb.style.color = "green";
    agregarPuntos(10); // Gana 10 puntos por acierto
    showUnicornFeedback('math', true); // Feedback positivo del unicornio

    setTimeout(() => {
      preguntaActual++;
      if (preguntaActual >= 10) {
        setsCompletos++;
        localStorage.setItem('setsCompletos', setsCompletos);
        agregarMinutos(15);
        document.getElementById('math-status').textContent =
          "🎉 ¡Completaste las 10 preguntas! Ganaste 15 minutos de juego.";
        setTimeout(generarPreguntas, 1500);
        return;
      }
      mostrarPregunta();
    }, 600);
  } else {
    fb.textContent = "✘ Intenta otra vez";
    fb.style.color = "red";
    // Si la función showUnicornFeedback existe, la llamamos para dar ánimo
    if (typeof showUnicornFeedback === 'function') {
       const type = fb.id.includes('math') ? 'math' : 'numbers';
       showUnicornFeedback(type, false);
    }
  }
}

// Generadores de ejercicios matemáticos
function genSuma(a1, a2, b1 = a1, b2 = a2) {
  const a = rand(a1, a2), b = rand(b1, b2);
  return { texto: `¿Cuánto es ${a} + ${b}?`, resp: a + b };
}
function genResta(a1, a2, b1, b2) {
  const a = rand(a1, a2), b = rand(b1, b2);
  return { texto: `¿Cuánto es ${a} - ${b}?`, resp: a - b };
}
function genComparacion(min, max) {
  const a = rand(min, max), b = rand(min, max);
  return { texto: `¿Qué número es mayor: ${a} o ${b}?`, resp: Math.max(a, b) };
}
function genComparacionMenor(min, max) {
  const a = rand(min, max), b = rand(min, max);
  return { texto: `¿Qué número es menor: ${a} o ${b}?`, resp: Math.min(a, b) };
}
function genSecuenciaPar() {
  const start = rand(2, 10);
  return { texto: `Secuencia: ${start}, ${start+2}, ${start+4}, ${start+6}, ___`, resp: start + 8 };
}
function genSumaTriple() {
  const a = rand(1, 10), b = rand(1, 10), c = rand(1, 10);
  return { texto: `¿Cuánto es ${a} + ${b} + ${c}?`, resp: a + b + c };
}
function genHistoria() {
  const a = rand(5, 15), b = rand(3, 10), c = rand(1, 5);
  return { texto: `Pintas ${a} flores, luego ${b} más, pero borras ${c}. ¿Quedan?`, resp: a + b - c };
}

// ---------- NÚMEROS ----------

/**
 * Genera 10 ejercicios rápidos de números
 */
function generarNumeros() {
  numerosPreguntas = [];
  numeroActual = 0;
  for (let i = 0; i < 10; i++) {
    const a = rand(1, 20), b = rand(1, 20);
    const tipo = Math.random() < 0.5 ? 'suma' : 'resta';
    let texto, resp;
    if (tipo === 'suma') {
      texto = `¿Cuánto es ${a} + ${b}?`; resp = a + b;
    } else {
      const max = Math.max(a, b), min = Math.min(a, b);
      texto = `¿Cuánto es ${max} - ${min}?`; resp = max - min;
    }
    numerosPreguntas.push({ texto, resp });
  }
  mostrarNumeroPregunta();
}

/**
 * Muestra la pregunta actual del módulo de números
 */
function mostrarNumeroPregunta() {
  const cont = document.getElementById('numbers-questions');
  const q = numerosPreguntas[numeroActual];
  cont.innerHTML = `
    <div class="card" style="text-align: center;">
      <h3>Pregunta ${numeroActual + 1} de 10</h3>
      <p class="pregunta-gigante">${q.texto}</p>
      <input type="number" id="respuestaNumero" class="input-gigante">
      <br>
      <button onclick="verificarNumero()" class="btn-gigante">Responder</button>
      <div id="numbers-feedback" class="resultado" style="font-size: 2rem;"></div>
    </div>
  `;
}

/**
 * Verifica la respuesta del módulo de números
 */
function verificarNumero() {
  const val = Number(document.getElementById('respuestaNumero').value);
  const correcto = numerosPreguntas[numeroActual].resp;
  const fb = document.getElementById('numbers-feedback');

  if (val === correcto) {
    fb.textContent = "✔ ¡Correcto!";
    fb.style.color = "green";
    agregarPuntos(5); // Gana 5 puntos por acierto en números
    showUnicornFeedback('numbers', true); // Feedback positivo del unicornio
    setTimeout(() => {
      numeroActual++;
      if (numeroActual >= 10) {
        document.getElementById('numbers-status').textContent = "🎉 ¡Genial! Generando más...";
        setTimeout(generarNumeros, 1200);
        return;
      }
      mostrarNumeroPregunta();
    }, 600);
  } else {
    fb.textContent = "✘ Intenta otra vez";
    fb.style.color = "red";
    // Si la función showUnicornFeedback existe, la llamamos para dar ánimo
    if (typeof showUnicornFeedback === 'function') {
       const type = fb.id.includes('math') ? 'math' : 'numbers';
       showUnicornFeedback(type, false);
    }
  }
}

// ---------- LECTURA ----------

/**
 * Muestra la palabra actual para leer con contenedores individuales para alineación
 */
function mostrarPalabra() {
  const palabra = palabrasLectura[idxLectura];
  const wordEl = document.getElementById('reading-word');
  const arrowEl = document.getElementById('reading-arrow');
  
  wordEl.innerHTML = '';
  arrowEl.innerHTML = '';

  palabra.split('').forEach(letra => {
    // Crear contenedor para la letra
    const span = document.createElement('div');
    span.className = 'reading-letter';
    span.textContent = letra;
    wordEl.appendChild(span);

    // Crear contenedor para el dedo (inicialmente oculto)
    const finger = document.createElement('div');
    finger.className = 'reading-finger';
    finger.textContent = '👆';
    arrowEl.appendChild(finger);
  });
}

/**
 * Pasa a la siguiente palabra de lectura
 */
function nextReadingWord() {
  idxLectura = (idxLectura + 1) % palabrasLectura.length;
  mostrarPalabra();
  if (typeof playSound === 'function') playSound("click");
}

/**
 * Inicia la animación del dedo letra por letra
 */
function playReading() {
  const arrowEl = document.getElementById('reading-arrow');
  const fingers = arrowEl.querySelectorAll('.reading-finger');
  const total = fingers.length;
  
  if (dedoInterval) clearInterval(dedoInterval);
  
  // Limpiar estados previos
  fingers.forEach(f => f.classList.remove('active'));
  
  let pos = -1; // Empezamos antes de la primera letra para un inicio limpio

  dedoInterval = setInterval(() => {
    pos++;
    
    // Quitar activo del anterior si existe
    if (pos > 0) fingers[pos-1].classList.remove('active');

    // Si terminamos, parar
    if (pos >= total) {
      clearInterval(dedoInterval);
      return;
    }

    // Activar el dedo actual
    fingers[pos].classList.add('active');
  }, 900); // Velocidad adaptada para lectura infantil
}

// ---------- GESTIÓN DE TIEMPO Y SESIÓN ----------

/**
 * Actualiza el contador visual de minutos disponibles
 */
function actualizarMinutos() {
  playMinutes = Number(localStorage.getItem('playMinutes')) || 0;
  document.getElementById('play-minutes').textContent = playMinutes;
}

/**
 * Añade minutos al almacenamiento local
 * @param {number} min - Minutos a añadir
 */
function agregarMinutos(min) {
  let current = Number(localStorage.getItem('playMinutes')) || 0;
  current += min;
  localStorage.setItem('playMinutes', current);
  actualizarMinutos();
}

/**
 * Inicia el cronómetro de juego
 */
function startGameSession() {
  actualizarMinutos();
  let minutos = Number(localStorage.getItem('playMinutes')) || 0;

  if (minutos <= 0 && !accesoPorContrasena) {
    document.getElementById('games-locked-msg').textContent = 'Necesitas ganar minutos en Matemáticas.';
    document.getElementById('game-selection').style.display = 'none';
    return;
  }

  if (accesoPorContrasena) {
    document.getElementById('games-locked-msg').textContent = '';
    document.getElementById('game-selection').style.display = 'block';
    document.getElementById('timer-display').textContent = 'Modo libre activado.';
    return;
  }

  document.getElementById('games-locked-msg').textContent = '';
  document.getElementById('game-selection').style.display = 'block';
  let remainingSeconds = minutos * 60;
  localStorage.setItem('playMinutes', 0);
  actualizarMinutos();

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    remainingSeconds--;
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    document.getElementById('timer-display').textContent = `Tiempo: ${m}m ${s}s`;

    if (remainingSeconds <= 0) {
      clearInterval(timer);
      document.getElementById('timer-display').textContent = 'Se acabó el tiempo.';
      document.getElementById('game-selection').style.display = 'none';
      document.querySelectorAll('.game-container').forEach(c => c.style.display = 'none');
    }
  }, 1000);
}

/**
 * Muestra un juego específico y oculta el menú
 * @param {string} gameId - ID del juego (tictactoe, unicorn, memory, checkers)
 */
function showGame(gameId) {
  // Ocultar el menú y todos los contenedores de juegos previos
  document.getElementById('game-selection').style.display = 'none';
  document.querySelectorAll('.game-container').forEach(c => c.style.display = 'none');
  
  // Mostrar el juego seleccionado
  const container = document.getElementById('container-' + gameId);
  if (container) {
    container.style.display = 'block';
  }
  
  // Inicializar lógica del juego
  if (gameId === 'tictactoe' && typeof initTicTacToe === 'function') initTicTacToe();
  if (gameId === 'memory' && typeof initMemoryGame === 'function') initMemoryGame();
  if (gameId === 'checkers' && typeof initCheckers === 'function') initCheckers();
}

/**
 * Vuelve al menú de selección de juegos
 */
function backToGamesMenu() {
  // Ocultar todos los contenedores de juegos
  document.querySelectorAll('.game-container').forEach(c => c.style.display = 'none');
  // Mostrar el menú de selección
  document.getElementById('game-selection').style.display = 'block';
  
  // Detener música o bucles si es necesario
  if (typeof gameActive !== 'undefined') {
    gameActive = false;
    if (typeof sounds !== 'undefined' && sounds.unicornMusic) sounds.unicornMusic.pause();
  }
}

// ---------- INICIALIZACIÓN ----------
window.onload = () => {
  generarPreguntas();
  generarNumeros();
  mostrarPalabra();
  actualizarMinutos();
  actualizarPuntosDisplay();
  
  // Si ya tenemos un nombre guardado, actualizamos la UI y el saludo inicial
  if (localStorage.getItem('userName')) {
    userName = localStorage.getItem('userName');
    updateGreetingNames();
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) welcomeTitle.textContent = `¡Hola ${userName}!`;
    const nameInput = document.getElementById('user-name-input');
    if (nameInput) nameInput.value = userName;
  }
};

// ---------- UI CLICK SOUNDS ----------
// Agrega el sonido de click a todos los botones de la página
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    if (typeof playSound === 'function') playSound("click");
  });
});
