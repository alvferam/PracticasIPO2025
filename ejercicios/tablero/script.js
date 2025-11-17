// script.js

// --- 1. Elementos del DOM ---
const inicioBtn = document.getElementById('inicio');
const selectorModo = document.getElementById('selectorModo');
const tamañoTableroInput = document.getElementById('tamañoTablero');
const tamañoFichaSelect = document.getElementById('tamañoFicha');
const grupoTamañoFicha = document.getElementById('grupoTamañoFicha');
const formaFichaSelect = document.getElementById('formaFicha');
const grupoFormaFicha = document.getElementById('grupoFormaFicha');
const contadorIntercambiosEl = document.getElementById('contadorIntercambios');
const tiempoJuegoEl = document.getElementById('tiempoJuego');
const zonaJuegoEl = document.getElementById('zona-juego');

// Modal
const modalAyudaEl = document.getElementById('modalAyuda');
const btnAyuda = document.getElementById('btnAyuda');
const cerrarModalEl = document.querySelector('.modal__close');

// --- 2. Estado del Juego ---
let fichaArrastrada = null;
let N = 0;
let contadorIntercambios = 0;
let idIntervalo = 0;
let segundos = 0;
let modoActual = 'clasico'; 

// --- 3. Event Listeners ---
inicioBtn.addEventListener('click', iniciarJuego);

selectorModo.addEventListener('change', (e) => {
    modoActual = e.target.value;

    if (modoActual === 'imagen') {
        grupoTamañoFicha.style.display = 'none';
        grupoFormaFicha.style.display = 'none';
        tamañoTableroInput.max = 10;
    } else {
        grupoTamañoFicha.style.display = 'flex';
        grupoFormaFicha.style.display = 'flex';
        tamañoTableroInput.max = 6; 
    }
});

// Listeners Modal
btnAyuda.addEventListener('click', () => modalAyudaEl.classList.remove('modal--hidden'));
cerrarModalEl.addEventListener('click', () => modalAyudaEl.classList.add('modal--hidden'));
window.addEventListener('click', (e) => {
    if (e.target === modalAyudaEl) modalAyudaEl.classList.add('modal--hidden');
});

// --- 4. Función Principal ---
function iniciarJuego() {
    contadorIntercambios = 0;
    segundos = 0;
    contadorIntercambiosEl.textContent = '0';
    tiempoJuegoEl.textContent = '0';
    if (idIntervalo) clearInterval(idIntervalo);
    idIntervalo = setInterval(() => { segundos++; tiempoJuegoEl.textContent = segundos; }, 1000);

    modoActual = selectorModo.value;
    N = parseInt(tamañoTableroInput.value, 10);
    const formaFicha = formaFichaSelect.value;
    
    zonaJuegoEl.innerHTML = '';
    
    if (modoActual !== 'imagen') {
        const tamañoFicha = tamañoFichaSelect.value;
        document.documentElement.style.setProperty('--ficha-size', tamañoFicha);
    }

    if (modoActual === 'imagen') {
        generarTableroImagen();
        zonaJuegoEl.classList.remove('modo-doble-activo');
    } 
    else if (modoActual === 'doble') {
        crearTableroColores('Tablero A');
        crearTableroColores('Tablero B');
        zonaJuegoEl.classList.add('modo-doble-activo');
    } 
    else {
        crearTableroColores(null);
        zonaJuegoEl.classList.remove('modo-doble-activo');
    }
}

// --- 5. Funciones Generadoras ---

function crearTableroColores(titulo) {
    const contenedor = document.createElement('div');
    contenedor.style.display = 'flex';
    contenedor.style.flexDirection = 'column';
    contenedor.style.alignItems = 'center';

    if (titulo) {
        const h3 = document.createElement('h3');
        h3.textContent = titulo;
        h3.style.margin = '0 0 10px 0';
        h3.style.color = '#555';
        contenedor.appendChild(h3);
    }
    
    const grid = document.createElement('div');
    grid.classList.add('tablero');
    grid.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
    
    let fichas = [];
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            fichas.push(i);
        }
    }
    barajarFichas(fichas);
    
    const forma = formaFichaSelect.value;
    fichas.forEach(colorIndex => {
        const ficha = document.createElement('div');
        ficha.classList.add('ficha', `color-${colorIndex}`, `forma-${forma}`);
        ficha.dataset.ficha = colorIndex;
        ficha.setAttribute('draggable', 'true');
        añadirEventListeners(ficha);
        grid.appendChild(ficha);
    });
    
    contenedor.appendChild(grid);
    zonaJuegoEl.appendChild(contenedor);
}

function generarTableroImagen() {
    const grid = document.createElement('div');
    grid.classList.add('tablero', 'tablero-con-imagen');
    grid.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
    
    let fichas = [];
    for (let i = 0; i < N * N; i++) { fichas.push(i); }
    barajarFichas(fichas);

    fichas.forEach((posicionOriginal, i) => {
        const ficha = document.createElement('div');
        ficha.classList.add('ficha'); 
        ficha.dataset.ficha = posicionOriginal;
        ficha.setAttribute('draggable', 'true');
        
        const px = (posicionOriginal % N) * 100 / (N - 1);
        const py = Math.floor(posicionOriginal / N) * 100 / (N - 1);
        ficha.style.backgroundPosition = `${px}% ${py}%`;
        
        añadirEventListeners(ficha);
        grid.appendChild(ficha);
    });
    zonaJuegoEl.appendChild(grid);
}

// --- 6. Drag & Drop ---
function añadirEventListeners(ficha) {
    ficha.addEventListener('dragstart', handleDragStart);
    ficha.addEventListener('dragover', (e) => e.preventDefault());
    ficha.addEventListener('dragenter', handleDragEnter);
    ficha.addEventListener('dragleave', handleDragLeave);
    ficha.addEventListener('drop', handleDrop);
    ficha.addEventListener('dragend', handleDragEnd);
}

function handleDragStart(e) {
    fichaArrastrada = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    if (this !== fichaArrastrada) this.classList.add('over');
}

function handleDragLeave() {
    this.classList.remove('over');
}

function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.ficha').forEach(f => f.classList.remove('over'));
    fichaArrastrada = null;
}

function handleDrop(e) {
    e.stopPropagation();

    if (fichaArrastrada && this !== fichaArrastrada) {
        intercambiarFichas(this, fichaArrastrada);
        comprobarVictoria();
    }
    return false;
}

// --- 7. Lógica de Juego e Intercambio ---

function intercambiarFichas(fichaA, fichaB) {
    const dataA = fichaA.dataset.ficha;
    const dataB = fichaB.dataset.ficha;
    
    fichaA.dataset.ficha = dataB;
    fichaB.dataset.ficha = dataA;

    if (modoActual === 'imagen') {
        const bgA = fichaA.style.backgroundPosition;
        fichaA.style.backgroundPosition = fichaB.style.backgroundPosition;
        fichaB.style.backgroundPosition = bgA;
    } else {
        fichaA.classList.remove(`color-${dataA}`);
        fichaB.classList.remove(`color-${dataB}`);
        
        fichaA.classList.add(`color-${dataB}`);
        fichaB.classList.add(`color-${dataA}`);
    }

    contadorIntercambios++;
    contadorIntercambiosEl.textContent = contadorIntercambios;
}

function comprobarVictoria() {
    const tableros = document.querySelectorAll('.tablero');
    let victoriaTotal = true;

    tableros.forEach(tablero => {
        if (!tableroEstaResuelto(tablero)) {
            victoriaTotal = false;
        }
    });

    if (victoriaTotal && tableros.length > 0) {
        setTimeout(() => {
            alert(`¡HAS GANADO EL MODO ${modoActual.toUpperCase()}!\nTiempo: ${segundos}s\nIntercambios: ${contadorIntercambios}`);
            clearInterval(idIntervalo);
        }, 100);
    }
}

function tableroEstaResuelto(tablero) {
    const fichas = Array.from(tablero.children);
    
    if (modoActual === 'imagen') {
        for (let i = 0; i < fichas.length; i++) {
            if (parseInt(fichas[i].dataset.ficha) !== i) return false;
        }
        return true;
    } else {
        for (let i = 0; i < N; i++) {
            const colorFila = fichas[i * N].dataset.ficha;
            
            for (let j = 1; j < N; j++) {
                if (fichas[i * N + j].dataset.ficha !== colorFila) return false;
            }
        }
        return true;
    }
}

function barajarFichas(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}