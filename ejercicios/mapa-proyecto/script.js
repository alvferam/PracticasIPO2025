/* ===============================
   Proyecto "Mapa" (vanilla JS)
   - Renderiza un mapa adaptable al viewport
   - Coloca ítems (POIs) en posiciones % relativas
   - Leyenda visible al pasar el cursor (CSS)
   - Filtros por tipo + panel lateral
   - Modo añadir punto sobre clic
   - Arrastrar para reubicar un ítem
=================================*/

// ---- Almacén de ítems (puedes cargarlo de un JSON si lo prefieres) ----
const store = [
  { id: 'a1', x: 20, y: 15, type: 'restaurante', title: 'La Plaza', desc: 'Tapas y cocina andaluza.' },
  { id: 'b2', x: 42, y: 22, type: 'cafe',        title: 'Café Nube', desc: 'Especialidad en espresso.' },
  { id: 'c3', x: 70, y: 62, type: 'parque',      title: 'Parque Central', desc: 'Zonas verdes y juegos.' },
  { id: 'd4', x: 82, y: 44, type: 'museo',       title: 'Museo de Arte', desc: 'Colección moderna.' },
];

const MAP_TYPES = ['restaurante','cafe','parque','museo'];

const map = document.getElementById('map');
const panel = document.getElementById('side-panel');
const togglePanelBtn = document.getElementById('toggle-panel');
const addModeCheckbox = document.getElementById('add-mode');
const poiSizeRange = document.getElementById('poi-size');
const mapSizeRange = document.getElementById('map-size');
const filtersWrap = document.getElementById('filters');
const labelsToggle = document.getElementById('labels-toggle');

/* ---------- Utilidades ---------- */
function percentToPx(v, total){ return (v/100) * total; }
function clamp(n, min, max){ return Math.max(min, Math.min(n, max)); }

/* ---------- Carga imagen de fondo si existe atributo data-bg ---------- */
(function initBackground(){
  const bg = map.getAttribute('data-bg');
  if(bg){
    map.style.setProperty('--map-img', `url('${bg}')`);
  }
})();

/* ---------- Render de filtros ---------- */
function renderFilters(){
  filtersWrap.innerHTML = '';
  MAP_TYPES.forEach(type => {
    const id = 'filter_' + type;
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" id="${id}" data-type="${type}" checked> ${type}`;
    filtersWrap.appendChild(label);
  });
}
renderFilters();

/* ---------- Render de puntos ---------- */
function renderPOIs(){
  map.querySelectorAll('.poi').forEach(n => n.remove());
  const activeTypes = getActiveTypes();
  store.forEach(item => {
    if(!activeTypes.has(item.type)) return;
    const el = document.createElement('button');
    el.className = 'poi';
    el.type = 'button';
    el.dataset.id = item.id;
    el.dataset.type = item.type;
    el.style.left = item.x + '%';
    el.style.top  = item.y + '%';
    el.style.setProperty('--poi-size', poiSizeRange.value + 'px');
    el.setAttribute('aria-label', `${item.title}: ${item.desc}`);

    el.innerHTML = `
      <span class="legend" role="tooltip">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </span>
    `;

    // Drag & drop manual
    enableDrag(el, item);

    map.appendChild(el);
  });
}

/* ---------- Tipos activos desde filtros ---------- */
function getActiveTypes(){
  const boxes = filtersWrap.querySelectorAll('input[type="checkbox"]');
  const active = new Set();
  boxes.forEach(b => { if(b.checked) active.add(b.dataset.type); });
  return active;
}

/* ---------- Eventos del panel ---------- */
const mapLegend = document.getElementById('map-legend');

togglePanelBtn.addEventListener('click', () => {
  const isHidden = panel.classList.toggle('is-hidden');
  togglePanelBtn.setAttribute('aria-expanded', String(!isHidden));

  // Mostrar leyenda solo cuando el panel está oculto
  if (mapLegend) {
    if (isHidden) {
      mapLegend.style.display = 'block';
    } else {
      mapLegend.style.display = 'none';
    }
  }
});



poiSizeRange.addEventListener('input', () => {
  map.style.setProperty('--poi-size', poiSizeRange.value + 'px');
  renderPOIs();
});

mapSizeRange.addEventListener('input', () => {
  const v = clamp(+mapSizeRange.value, 50, 100);
  document.documentElement.style.setProperty('--map-height', v + 'vh');
});

labelsToggle.addEventListener('change', () => {
  map.classList.toggle('hide-legends', !labelsToggle.checked);
});

filtersWrap.addEventListener('change', renderPOIs);

/* ---------- Añadir punto ---------- */
map.addEventListener('click', (ev) => {
  if(!addModeCheckbox.checked) return;
  if(ev.target.closest('.poi')) return; // no al click sobre un poi

  const rect = map.getBoundingClientRect();
  const x = ((ev.clientX - rect.left) / rect.width) * 100;
  const y = ((ev.clientY - rect.top)  / rect.height) * 100;

  const title = prompt('Título del punto:');
  if(!title) return;
  const desc  = prompt('Descripción:' ) || '';
  const type  = prompt(`Tipo (${MAP_TYPES.join(', ')}):`, MAP_TYPES[0]) || MAP_TYPES[0];

  const newItem = {
    id: crypto.randomUUID(),
    x: clamp(x, 0, 100),
    y: clamp(y, 0, 100),
    type: MAP_TYPES.includes(type) ? type : MAP_TYPES[0],
    title, desc
  };
  store.push(newItem);
  renderPOIs();
});

/* ---------- Arrastrar para reubicar ---------- */
function enableDrag(el, item){
  let dragging = false;
  let start = null;

  const onDown = (e) => {
    dragging = true;
    el.classList.add('dragging');
    start = getPoint(e);
    e.preventDefault();
  };

  const onMove = (e) => {
    if(!dragging) return;
    const p = getPoint(e);
    const dx = p.x - start.x;
    const dy = p.y - start.y;
    start = p;

    // convertir desplazamiento en % relativo al tamaño actual
    const rect = map.getBoundingClientRect();
    const dxp = (dx / rect.width) * 100;
    const dyp = (dy / rect.height) * 100;

    item.x = clamp(item.x + dxp, 0, 100);
    item.y = clamp(item.y + dyp, 0, 100);
    el.style.left = item.x + '%';
    el.style.top  = item.y + '%';
  };

  const onUp = () => {
    dragging = false;
    el.classList.remove('dragging');
  };

  el.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  el.addEventListener('touchstart', onDown, {passive:false});
  window.addEventListener('touchmove', onMove, {passive:false});
  window.addEventListener('touchend', onUp);

  function getPoint(e){
    if(e.touches && e.touches[0]){
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }
}

/* ---------- Inicio ---------- */
renderPOIs();

// Exponer store en consola para depuración
window._store = store;
