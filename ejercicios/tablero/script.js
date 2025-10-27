// script.js

// --- 1. Elementos del DOM ---
const tableroEl = document.getElementById('tablero');
const inicioBtn = document.getElementById('inicio');
const tamañoTableroInput = document.getElementById('tamañoTablero');
const tamañoFichaSelect = document.getElementById('tamañoFicha');

// --- 2. Estado del Juego ---
let fichaArrastrada = null; // Almacena el elemento DIV de la ficha que se arrastra
let N = 0; // Tamaño del tablero (NxN)

// --- 3. Event Listeners de Controles ---
inicioBtn.addEventListener('click', iniciarJuego);

// Cargar el juego inicial al cargar la página
document.addEventListener('DOMContentLoaded', iniciarJuego);


// --- 4. Función Principal: Iniciar Juego ---
function iniciarJuego() {
    // Leer valores de los controles
    N = parseInt(tamañoTableroInput.value);
    const tamañoFicha = tamañoFichaSelect.value;

    // 4.1. Limpiar tablero anterior
    tableroEl.innerHTML = '';

    // 4.2. Aplicar estilos al tablero (Grid y tamaño de fichas)
    // El enunciado pide modificar la estructura del tablero
    tableroEl.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
    tableroEl.style.width = `calc(${N} * ${tamañoFicha} + ${N} * 0.5rem + 1rem)`; // N*ficha + N*gap + padding
    document.documentElement.style.setProperty('--ficha-size', tamañoFicha);

    // 4.3. Generar array de fichas (coherente)
    // Para N=3, necesitamos [0,0,0, 1,1,1, 2,2,2]
    let fichas = [];
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            fichas.push(i); // i representa el color
        }
    }

    // 4.4. Barajar las fichas
    barajarFichas(fichas);

    // 4.5. Crear y añadir fichas al DOM
    fichas.forEach(colorIndex => {
        const ficha = document.createElement('div');
        ficha.classList.add('ficha', `color-${colorIndex}`);
        
        // El enunciado pide usar data-ficha para facilitar acceso
        ficha.dataset.ficha = colorIndex; 
        
        ficha.setAttribute('draggable', 'true');
        
        // Añadir listeners de Drag & Drop
        añadirEventListeners(ficha);
        
        tableroEl.appendChild(ficha);
    });
}

// --- 5. Lógica de Drag & Drop ---

function añadirEventListeners(ficha) {
    ficha.addEventListener('dragstart', handleDragStart);
    ficha.addEventListener('dragover', handleDragOver);
    ficha.addEventListener('dragenter', handleDragEnter);
    ficha.addEventListener('dragleave', handleDragLeave);
    ficha.addEventListener('dragend', handleDragEnd);
    ficha.addEventListener('drop', handleDrop);
}

function handleDragStart(e) {
    fichaArrastrada = this; // 'this' es la ficha que se empieza a arrastrar
    this.classList.add('dragging');
    
    // API dataTransfer (requisito del enunciado)
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.ficha);
}

function handleDragOver(e) {
    e.preventDefault(); // Necesario para permitir el 'drop'
}

function handleDragEnter(e) {
    e.preventDefault();
    // Apoyo visual
    if (this !== fichaArrastrada) {
        this.classList.add('over');
    }
}

function handleDragLeave() {
    this.classList.remove('over');
}

function handleDragEnd() {
    // Limpiar estilos visuales
    this.classList.remove('dragging');
    document.querySelectorAll('.ficha').forEach(f => f.classList.remove('over'));
    fichaArrastrada = null;
}

function handleDrop(e) {
    e.stopPropagation(); // Evitar propagación
    
    // Solo intercambiar si no es la misma ficha
    if (fichaArrastrada !== this) {
        // --- Lógica de Intercambio ---
        
        // 1. Obtener datos (color/id) de ambas fichas
        const colorOrigen = fichaArrastrada.dataset.ficha;
        const colorDestino = this.dataset.ficha;

        // 2. Intercambiar las clases de color
        fichaArrastrada.classList.remove(`color-${colorOrigen}`);
        fichaArrastrada.classList.add(`color-${colorDestino}`);
        
        this.classList.remove(`color-${colorDestino}`);
        this.classList.add(`color-${colorOrigen}`);

        // 3. Intercambiar los atributos data-ficha
        fichaArrastrada.dataset.ficha = colorDestino;
        this.dataset.ficha = colorOrigen;

        // 4. Comprobar si se ha ganado
        comprobarVictoria();
    }
    
    return false;
}


// --- 6. Funciones Auxiliares y Variantes ---

/**
 * Algoritmo Fisher-Yates para barajar un array.
 */
function barajarFichas(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambio
    }
}

/**
 * Comprobar que el tablero ha sido completado con éxito.
 */
function comprobarVictoria() {
    const todasFichas = Array.from(tableroEl.children);
    
    for (let i = 0; i < N; i++) { // Iterar por filas
        const primerColorDeLaFila = todasFichas[i * N].dataset.ficha;
        
        for (let j = 1; j < N; j++) { // Iterar por columnas
            const fichaActual = todasFichas[i * N + j];
            if (fichaActual.dataset.ficha !== primerColorDeLaFila) {
                // Si una ficha no coincide, el juego no ha terminado
                return; 
            }
        }
    }

    // Si todas las filas se comprueban, el jugador ha ganado
    setTimeout(() => {
        alert('¡Felicidades, has ganado!');
    }, 100); // Pequeño delay para que se vea el último movimiento
}