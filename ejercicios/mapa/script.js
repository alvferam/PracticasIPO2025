/* ===============================
    Lógica del Proyecto Mapa
=================================*/

// 1. Almacén de datos (Store)
const store = [
  { id: '1', x: 20, y: 30, type: 'restaurante', title: 'Casa Paco', desc: 'Las mejores tapas.' },
  { id: '2', x: 50, y: 50, type: 'parque',      title: 'Parque Central', desc: 'Zona verde y relax.' },
  { id: '3', x: 75, y: 20, type: 'museo',       title: 'Museo Historia', desc: 'Entrada gratuita domingos.' },
  { id: '4', x: 35, y: 70, type: 'cafe',        title: 'Café Aroma', desc: 'Café de especialidad.' },
];

const MAP_TYPES = ['restaurante', 'cafe', 'parque', 'museo'];

// 2. Referencias al DOM 
const map = document.getElementById('map');
const sideArea = document.getElementById('side-area');
const togglePanelBtn = document.getElementById('toggle-panel');
const filtersContainer = document.getElementById('filters');
const addModeCheck = document.getElementById('add-mode');
const mapSizeInput = document.getElementById('map-size');
const poiSizeInput = document.getElementById('poi-size');
const labelsToggle = document.getElementById('labels-toggle');

/* --- Inicialización --- */
function init() {
  loadMapBackground();
  renderFilters();
  renderPOIs();
  setupListeners();
}

function loadMapBackground() {
  const bg = map.getAttribute('data-bg');
  if (bg) {
    map.style.setProperty('--map-img', `url('${bg}')`);
  }
}

/* --- Renderizado de Filtros --- */
function renderFilters() {
  filtersContainer.innerHTML = '';
  MAP_TYPES.forEach(type => {
    const label = document.createElement('label');
    // Capitalizar primera letra
    const typeName = type.charAt(0).toUpperCase() + type.slice(1);
    label.innerHTML = `
      <input type="checkbox" value="${type}" checked> ${typeName}
    `;
    filtersContainer.appendChild(label);
  });
}

/* --- Renderizado de Puntos (POIs) --- */
function renderPOIs() {
  document.querySelectorAll('.poi').forEach(el => el.remove());

  const activeTypes = Array.from(filtersContainer.querySelectorAll('input:checked'))
                          .map(input => input.value);

  store.forEach(item => {
    if (activeTypes.includes(item.type)) {
      createPoiElement(item);
    }
  });
}

function createPoiElement(item) {
  const el = document.createElement('div');
  el.className = 'poi';
  el.dataset.type = item.type; 
  
  el.style.left = item.x + '%';
  el.style.top = item.y + '%';
  
  el.innerHTML = `
    <div class="legend">
      <strong>${item.title}</strong><br>
      <small>${item.desc}</small>
    </div>
  `;

  enableDrag(el, item);

  map.appendChild(el);
}

/* --- Drag and Drop --- */
function enableDrag(element, itemData) {
  let isDragging = false;
  
  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.stopPropagation(); 
    element.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const mapRect = map.getBoundingClientRect();
    
    let newX = ((e.clientX - mapRect.left) / mapRect.width) * 100;
    let newY = ((e.clientY - mapRect.top) / mapRect.height) * 100;

    newX = Math.max(0, Math.min(100, newX));
    newY = Math.max(0, Math.min(100, newY));

    element.style.left = newX + '%';
    element.style.top = newY + '%';
    itemData.x = newX;
    itemData.y = newY;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      element.style.cursor = 'grab';
    }
  });
}

/* --- Event Listeners --- */
function setupListeners() {
  
  // 1. Alternar Panel/Leyenda
  togglePanelBtn.addEventListener('click', () => {
    sideArea.classList.toggle('show-options');
    const showingOptions = sideArea.classList.contains('show-options');
    togglePanelBtn.textContent = showingOptions ? ' Ver Leyenda' : ' Opciones';
  });

  // 2. Filtros
  filtersContainer.addEventListener('change', renderPOIs);

  // 3. Añadir nuevo punto 
  map.addEventListener('click', (e) => {
    if (!addModeCheck.checked) return;
    if (e.target.closest('.poi')) return; 

    const mapRect = map.getBoundingClientRect();
    const x = ((e.clientX - mapRect.left) / mapRect.width) * 100;
    const y = ((e.clientY - mapRect.top) / mapRect.height) * 100;

    const title = prompt("Nombre del lugar:");
    if (title) {
      const type = prompt("Tipo (restaurante, cafe, parque, museo):", "restaurante");
      const cleanType = MAP_TYPES.includes(type) ? type : 'restaurante';
      
      const newItem = {
        id: Date.now().toString(),
        x: x, y: y,
        type: cleanType,
        title: title,
        desc: 'Nuevo punto añadido'
      };
      store.push(newItem);
      renderPOIs();
      addModeCheck.checked = false;
    }
  });

  // 4. Controles de apariencia
  mapSizeInput.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--map-height', e.target.value + 'vh');
  });

  poiSizeInput.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--poi-size', e.target.value + 'px');
  });

  // 5. Toggle Tooltips
  labelsToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      map.classList.remove('hide-legends');
    } else {
      map.classList.add('hide-legends');
    }
  });
}

// Iniciar aplicación
init();s