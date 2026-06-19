// ---------- AUDIO ENGINE ----------
// Objeto que centraliza todos los sonidos de la aplicación
const sounds = {
  click: new Audio("sounds/ui/click.mp3"), // Sonido para clicks de botones
  openTab: new Audio("sounds/ui/open_tab.mp3"), // Sonido al cambiar de pestaña

  unicornJump: new Audio("sounds/unicorn/jump.wav"), // Salto del unicornio
  unicornCoin: new Audio("sounds/unicorn/coin.wav"), // Recoger moneda
  unicornHit: new Audio("sounds/unicorn/hit.wav"), // Golpe con obstáculo
  unicornMusic: new Audio("sounds/unicorn/bg_music.mp3"), // Música de fondo del juego

  tttPlace: new Audio("sounds/tic_tac_toe/place.wav"), // Colocar pieza en Tic-Tac-Toe
  tttWin: new Audio("sounds/tic_tac_toe/win.wav"), // Victoria en Tic-Tac-Toe
  tttLose: new Audio("sounds/tic_tac_toe/lose.wav"), // Derrota en Tic-Tac-Toe

  greeting: new Audio("sounds/voices/greeting1.mp3") // Saludo de voz al entrar a juegos
};

/**
 * Función global para reproducir sonidos por nombre
 * @param {string} name - Nombre de la propiedad en el objeto sounds
 */
function playSound(name) {
  if (sounds[name]) { // Verifica si el sonido existe
    sounds[name].currentTime = 0; // Reinicia el audio al inicio
    sounds[name].play().catch(e => console.log("Audio play blocked", e)); // Reproduce y captura bloqueos del navegador
  }
}
