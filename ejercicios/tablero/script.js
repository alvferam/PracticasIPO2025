// script.js (Unificado)

// --- 1. Elementos del DOM ---
const inicioBtn = document.getElementById('inicio');
const tamañoTableroInput = document.getElementById('tamañoTablero');
const tamañoFichaSelect = document.getElementById('tamañoFicha');
const formaFichaSelect = document.getElementById('formaFicha');
const contadorIntercambiosEl = document.getElementById('contadorIntercambios');
const tiempoJuegoEl = document.getElementById('tiempoJuego');
const modalAyudaEl = document.getElementById('modalAyuda');
const btnAyuda = document.getElementById('btnAyuda');
const cerrarModalEl = document.querySelector('.modal__close');

// --- Elementos Específicos ---
const tableroSimpleEl = document.getElementById('tablero');
const tableroA_El = document.getElementById('tablero-A');
const tableroB_El = document.getElementById('tablero-B');

// --- 2. Estado del Juego ---
let fichaArrastrada = null;
let N = 0;
let contadorIntercambios = 0;
let idIntervalo = 0;
let segundos = 0;

// --- Detección de Modo ---
// Detecta en qué página estamos al cargar
const modoJuego = tableroA_El ? 'doble' : 'simple';

// --- 3. Event Listeners ---
inicioBtn.addEventListener('click', iniciarJuego);
// Listeners Modal
btnAyuda.addEventListener('click', () => modalAyudaEl.classList.remove('modal--hidden'));
cerrarModalEl.addEventListener('click', () => modalAyudaEl.classList.add('modal--hidden'));
window.addEventListener('click', (e) => {
    if (e.target === modalAyudaEl) modalAyudaEl.classList.add('modal--hidden');
});

// --- 4. Función Principal ---
function iniciarJuego() {
    // 4.1. Leer valores comunes
    N = parseInt(tamañoTableroInput.value);
    const tamañoFicha = tamañoFichaSelect.value;
    const formaFicha = formaFichaSelect.value;
    document.documentElement.style.setProperty('--ficha-size', tamañoFicha);

    // 4.2. Generar y barajar fichas
    let fichas = [];
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            fichas.push(i);
        }
    }
    barajarFichas(fichas);

    // 4.3. Lógica de creación
    if (modoJuego === 'doble') {
        // --- INICIO LÓGICA DOBLE ---
        tableroA_El.innerHTML = '';
        tableroB_El.innerHTML = '';
        tableroA_El.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
        tableroB_El.style.gridTemplateColumns = `repeat(${N}, 1fr)`;

        // Generar segundo mazo de fichas
        let fichasB = [];
        for (let i = 0; i < N; i++) { for (let j = 0; j < N; j++) { fichasB.push(i); } }
        barajarFichas(fichasB);

        fichas.forEach(colorIndex => crearFicha(tableroA_El, colorIndex, formaFicha));
        fichasB.forEach(colorIndex => crearFicha(tableroB_El, colorIndex, formaFicha));
    } else {
        // --- INICIO LÓGICA SIMPLE ---
        tableroSimpleEl.innerHTML = '';
        tableroSimpleEl.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
        fichas.forEach(colorIndex => crearFicha(tableroSimpleEl, colorIndex, formaFicha));
    }

    // 4.4. Reiniciar contadores
    contadorIntercambios = 0;
    contadorIntercambiosEl.textContent = '0';
    segundos = 0;
    tiempoJuegoEl.textContent = '0';
    if (idIntervalo) clearInterval(idIntervalo); 
    idIntervalo = setInterval(() => {
        segundos++;
        tiempoJuegoEl.textContent = segundos;
    }, 1000);
}

// --- 5. Funciones de Creación ---
function crearFicha(tablero, colorIndex, formaFicha) {
    const ficha = document.createElement('div');
    ficha.classList.add('ficha', `color-${colorIndex}`, `forma-${formaFicha}`);
    ficha.dataset.ficha = colorIndex; 
    ficha.setAttribute('draggable', 'true');
    añadirEventListeners(ficha);
    tablero.appendChild(ficha);
}

// --- 6. Lógica de Drag & Drop ---
function añadirEventListeners(ficha) {
    ficha.addEventListener('dragstart', handleDragStart);
    ficha.addEventListener('dragover', handleDragOver);
    ficha.addEventListener('dragleave', handleDragLeave);
    ficha.addEventListener('dragend', handleDragEnd);

    if (modoJuego === 'doble') {
        // --- INICIO LÓGICA DOBLE ---
        ficha.addEventListener('dragenter', handleDragEnter_Doble);
        ficha.addEventListener('drop', handleDrop_Doble);
    } else {
        // --- INICIO LÓGICA SIMPLE ---
        ficha.addEventListener('dragenter', handleDragEnter_Simple);
        ficha.addEventListener('drop', handleDrop_Simple);
    }
}

// --- Handlers Comunes ---
function handleDragStart(e) {
    fichaArrastrada = this; 
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.ficha);
}
function handleDragOver(e) { e.preventDefault(); }
function handleDragLeave() { this.classList.remove('over'); }
function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.ficha').forEach(f => f.classList.remove('over'));
    fichaArrastrada = null;
}

// --- Handlers Modo Simple ---
function handleDragEnter_Simple(e) {
    e.preventDefault();
    if (this !== fichaArrastrada) { this.classList.add('over'); }
}
function handleDrop_Simple(e) {
    e.stopPropagation(); 
    if (fichaArrastrada && this !== fichaArrastrada) {
        intercambiarFichas(this, fichaArrastrada);
        comprobarVictoria();
    }
    return false;
}

// --- Handlers Modo Doble ---
function handleDragEnter_Doble(e) {
    e.preventDefault();
    if (fichaArrastrada && this.parentElement !== fichaArrastrada.parentElement) {
        this.classList.add('over');
    }
}
function handleDrop_Doble(e) {
    e.stopPropagation(); 
    if (fichaArrastrada && this.parentElement !== fichaArrastrada.parentElement) {
        intercambiarFichas(this, fichaArrastrada);
        comprobarVictoria();
    }
    return false;
}

// --- 7. Funciones Auxiliares ---

// Función de intercambio
function intercambiarFichas(fichaA, fichaB) {
    const colorA = fichaA.dataset.ficha;
    const colorB = fichaB.dataset.ficha;

    fichaA.classList.remove(`color-${colorA}`);
    fichaA.classList.add(`color-${colorB}`);
    fichaA.dataset.ficha = colorB;

    fichaB.classList.remove(`color-${colorB}`);
    fichaB.classList.add(`color-${colorA}`);
    fichaB.dataset.ficha = colorA;

    contadorIntercambios++;
    contadorIntercambiosEl.textContent = contadorIntercambios;
}

function barajarFichas(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Función de comprobación
function comprobarVictoria() {
    let victoria = false;
    
    if (modoJuego === 'doble') {
        // --- INICIO LÓGICA DOBLE ---
        const ganoA = tableroEstaResuelto(tableroA_El);
        const ganoB = tableroEstaResuelto(tableroB_El);
        if (ganoA && ganoB) {
            victoria = true;
            alert(`¡INCREÍBLE! ¡Has resuelto AMBOS tableros! 
                \nTiempo: ${segundos}s \nIntercambios: ${contadorIntercambios}`);
        }
    } else {
        // --- INICIO LÓGICA SIMPLE ---
        if (tableroEstaResuelto(tableroSimpleEl)) {
            victoria = true;
            alert(`¡Felicidades, has ganado!
                \nTiempo: ${segundos}s \nIntercambios: ${contadorIntercambios}`);
        }
    }

    if (victoria) {
        clearInterval(idIntervalo); 
        idIntervalo = 0; 
    }
}

// Función auxiliar de comprobación
function tableroEstaResuelto(tablero) {
    const todasFichas = Array.from(tablero.children);
    for (let i = 0; i < N; i++) { 
        const primerColor = todasFichas[i * N].dataset.ficha;
        for (let j = 1; j < N; j++) {
            if (todasFichas[i * N + j].dataset.ficha !== primerColor) {
                return false; 
            }
        }
    }
    return true; 
}