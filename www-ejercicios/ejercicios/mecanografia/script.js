// script.js
import { 
    recuperaElementoAleatorio, 
    PALABRAS_FACILES, 
    PALABRAS_NORMALES, 
    PALABRAS_DIFICILES,
    DICCIONARIO_BILINGUE
} from './utils.js';

// --- Constantes de Configuración ---

const LIMITE_PALABRAS = 15;
const LIMITE_TIEMPO = 60;

// --- Elementos del DOM ---

const palabraDeMuestraEl = document.getElementById('palabraDeMuestra');
const entradaEl = document.getElementById('entrada');
const btnComienzoEl = document.getElementById('btnComienzo');
const btnPausaEl = document.getElementById('btnPausa');
const tiempoEl = document.getElementById('tiempo');
const palabrasCorrectasEl = document.getElementById('palabrasCorrectas');
const limiteTiempoEl = document.getElementById('limiteTiempo');
const limitePalabrasEl = document.getElementById('limitePalabras');

const selectModoEl = document.getElementById('selectModo');
const selectJuegoEl = document.getElementById('selectJuego');

const btnModalEl = document.getElementById('btnModal');
const modalVentanaEl = document.getElementById('modalVentana');
const cerrarModalEl = document.querySelector('.cerrar-modal');

// --- Variables de Estado ---

let identificadorIntervalo = 0;
let tiempoTranscurrido = 0;
let palabrasCorrectas = 0;
let isPaused = false;
let modoActivo = selectModoEl.value; 
let palabrasActivas = PALABRAS_NORMALES; 
let palabraBilingue = null; 

// --- Funciones del Temporizador ---

function actualizaTiempo() {
    tiempoTranscurrido++;
    tiempoEl.textContent = tiempoTranscurrido;
    
    // VARIANTE: Fijar un tiempo máximo
    if (modoActivo === 'tiempo' && tiempoTranscurrido >= LIMITE_TIEMPO) {
        finalizarTest();
    }
}

function iniciarTemporizador() {
    if (identificadorIntervalo === 0) {
        identificadorIntervalo = setInterval(actualizaTiempo, 1000);
    }
}

function detenerTemporizador() {
    if (identificadorIntervalo !== 0) {
        clearInterval(identificadorIntervalo);
        identificadorIntervalo = 0;
    }
}

// --- Lógica de Control ---

function comenzarTest() {
    // 1. Resetear el estado
    tiempoTranscurrido = 0;
    palabrasCorrectas = 0;
    tiempoEl.textContent = '0';
    palabrasCorrectasEl.textContent = '0';
    entradaEl.value = '';
    isPaused = false;
    palabraBilingue = null;

    // 2. Habilitar interfaz y DESHABILITAR CONFIGURACIÓN
    entradaEl.disabled = false;
    entradaEl.focus();
    btnComienzoEl.disabled = true;
    btnPausaEl.disabled = false;
    btnPausaEl.textContent = "Pausar";
    selectModoEl.disabled = true;
    selectJuegoEl.disabled = true; 

    iniciarTemporizador();

    establecerNuevaPalabra();
}

function finalizarTest() {
    detenerTemporizador();

    entradaEl.disabled = true;
    btnComienzoEl.disabled = false;
    btnPausaEl.disabled = true;
    btnPausaEl.textContent = "Pausar";
    selectModoEl.disabled = false; 
    selectJuegoEl.disabled = false;
    isPaused = false; 

    const ppm = palabrasCorrectas > 0 ? ((palabrasCorrectas / tiempoTranscurrido) * 60).toFixed(2) : 0;
    const modoTexto = modoActivo === 'palabras' ? `las ${LIMITE_PALABRAS} palabras` : `${LIMITE_TIEMPO} segundos`;
    
    alert(`¡Test finalizado! Completaste ${modoTexto}. Palabras correctas: ${palabrasCorrectas}. Velocidad: ${ppm} PPM.`);
    palabraDeMuestraEl.textContent = "¡Test Terminado! Pulsa 'Comenzar' de nuevo.";
}

// --- VARIANTE: Lógica Bilingüe y de Dificultad ---

function establecerNuevaPalabra() {
    if (selectJuegoEl.value === 'bilingue') {
        const palabrasIngles = Object.keys(DICCIONARIO_BILINGUE);
        const palabraIngles = recuperaElementoAleatorio(palabrasIngles);
        
        palabraBilingue = DICCIONARIO_BILINGUE[palabraIngles]; 

        palabraDeMuestraEl.textContent = palabraIngles;
    } else {
        palabraBilingue = null;
        const palabra = recuperaElementoAleatorio(palabrasActivas);
        palabraDeMuestraEl.textContent = palabra;
    }
}
// --- VARIANTE: Lógica de Pausa/Reanudar ---

function manejarPausa() {
    if (identificadorIntervalo !== 0) {
        if (isPaused) {
            // REANUDAR
            iniciarTemporizador(); 
            entradaEl.disabled = false;
            entradaEl.focus();
            btnPausaEl.textContent = "Pausar";
            isPaused = false;
            palabraDeMuestraEl.textContent = "¡Reanudado! Sigue tecleando...";
        } else {
            // PAUSAR
            detenerTemporizador();
            entradaEl.disabled = true; 
            btnPausaEl.textContent = "Reanudar";
            isPaused = true;
            palabraDeMuestraEl.textContent = "PAUSADO";
        }
    }
}

/**
 * Maneja el evento de entrada de texto del usuario y la validación.
 */

function manejarEntrada(e) {
    if (identificadorIntervalo === 0 || isPaused) {
        return;
    }

    const palabraTecleada = entradaEl.value.trim().toLowerCase(); 
    
    const palabraRequerida = palabraBilingue !== null 
                           ? palabraBilingue 
                           : palabraDeMuestraEl.textContent;

    const palabraRequeridaMin = palabraRequerida.toLowerCase();

    if (palabraTecleada === palabraRequeridaMin) {
        palabrasCorrectas++;
        palabrasCorrectasEl.textContent = `${palabrasCorrectas}`;

        entradaEl.value = '';
        
        if (modoActivo === 'palabras' && palabrasCorrectas >= LIMITE_PALABRAS) {
            finalizarTest();
            return;
        }

        establecerNuevaPalabra();
    }
}

// --- VARIANTE: Lógica de Teclado Numérico ---

function manejarTeclasNumericas(e) {
    // VARIANTE: Solo permitir cambio si NO hay un test activo
    if (identificadorIntervalo === 0) { 
        let dificultad = '';

        if (e.key === '1') dificultad = 'facil';
        if (e.key === '2') dificultad = 'normal';
        if (e.key === '3') dificultad = 'dificil';
        if (e.key === '4') dificultad = 'bilingue'; 
        
        if (dificultad) {
            selectJuegoEl.value = dificultad;
            actualizarConfiguracion();
        }
    }
}

function actualizarConfiguracion() {
    if (identificadorIntervalo !== 0) {
        return;
    }

    switch (selectJuegoEl.value) {
        case 'facil':
            palabrasActivas = PALABRAS_FACILES;
            break;
        case 'normal':
            palabrasActivas = PALABRAS_NORMALES;
            break;
        case 'dificil':
            palabrasActivas = PALABRAS_DIFICILES;
            break;
        case 'bilingue':
            palabrasActivas = PALABRAS_NORMALES; 
            break;
    }

    modoActivo = selectModoEl.value;

    const modoTexto = modoActivo === 'palabras' ? `de ${LIMITE_PALABRAS} palabras` : `de ${LIMITE_TIEMPO} segundos`;
    palabraDeMuestraEl.textContent = `¡Modo ${selectJuegoEl.value.toUpperCase()} ${modoTexto} listo! Pulsa "Comenzar".`;
}

// --- VARIANTE: Lógica del Modal, mensaje ---

function abrirModal() {
    modalVentanaEl.style.display = "block";
}

function cerrarModal() {
    modalVentanaEl.style.display = "none";
}

// --- Event Listeners ---

btnComienzoEl.addEventListener('click', comenzarTest);
btnPausaEl.addEventListener('click', manejarPausa);
entradaEl.addEventListener('input', manejarEntrada);

// Listeners para la configuración 
selectModoEl.addEventListener('change', actualizarConfiguracion);
selectJuegoEl.addEventListener('change', actualizarConfiguracion);

// Listener para el Modal
btnModalEl.addEventListener('click', abrirModal);
cerrarModalEl.addEventListener('click', cerrarModal);
window.addEventListener('click', (e) => {
    if (e.target === modalVentanaEl) {
        cerrarModal();
    }
});

// VARIENTE: Listener para las teclas numéricas
document.addEventListener('keydown', manejarTeclasNumericas);

// Inicialización de la configuración al cargar
actualizarConfiguracion();