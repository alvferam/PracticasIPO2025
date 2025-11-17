// ===========================
// Configuración y Constantes
// ===========================
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const BASE_A4_FREQ = 440; 
const A4_INDEX_OFFSET = 57; 

let audioCtx = null;

// ===========================
// Audio Engine
// ===========================

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function getFrequency(semitonesFromA4) {
  return BASE_A4_FREQ * Math.pow(2, semitonesFromA4 / 12);
}

function playNote(frequency, waveform, volume) {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = waveform;
  osc.frequency.setValueAtTime(frequency, now);

  const gainNode = ctx.createGain();
  const peakGain = 0.5 * volume;

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(peakGain, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2); 

  // Conexión directa (Sonido original)
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  // --- Lógica de Retraso (Delay/Eco) ---
  const delayToggle = document.getElementById("delay-toggle");
  if (delayToggle && delayToggle.checked) {

    const delayNode = ctx.createDelay();
    delayNode.delayTime.value = 0.3; 

    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.4; 

    gainNode.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(ctx.destination);
  }


  osc.start(now);
  osc.stop(now + 1.2);

  osc.onended = () => {
    osc.disconnect();
    gainNode.disconnect();
  };
}

// ===========================
// Renderizado del Piano 
// ===========================

function renderPiano(numOctaves) {
  const whiteKeysContainer = document.getElementById("white-keys-container");
  const blackKeysContainer = document.getElementById("black-keys-container");

  whiteKeysContainer.innerHTML = "";
  blackKeysContainer.innerHTML = "";

  const startOctave = 4; 
  let totalWhiteKeys = 0; 

  for (let i = 0; i < numOctaves; i++) {
    const currentOctave = startOctave + i;

    NOTES.forEach((note, index) => {
      const isBlack = note.includes("#");
      const noteName = `${note}${currentOctave}`;
      
      const absIndex = (currentOctave * 12) + index;
      const semitonesFromA4 = absIndex - 57; 
      const freq = getFrequency(semitonesFromA4);

      const btn = document.createElement("button");
      btn.classList.add("piano__key");
      btn.dataset.freq = freq;
      btn.dataset.note = noteName;

      if (isBlack) {
        btn.classList.add("piano__key--black");
        btn.setAttribute("aria-label", noteName);

        const whiteWidth = 3.5; 
        const gap = 0.1;
        const blackWidth = 2; 
        
        const leftPos = (totalWhiteKeys * (whiteWidth + gap)) - (blackWidth / 2) - (gap / 2);
        btn.style.left = `${leftPos}rem`;
        
        blackKeysContainer.appendChild(btn);
      } else {
        btn.classList.add("piano__key--white");
        btn.textContent = noteName; 
        whiteKeysContainer.appendChild(btn);
        totalWhiteKeys++; 
      }
    });
  }

  const finalOctave = startOctave + numOctaves;
  const finalFreq = getFrequency((finalOctave * 12) - 57);
  
  const lastKey = document.createElement("button");
  lastKey.classList.add("piano__key", "piano__key--white");
  lastKey.dataset.freq = finalFreq;
  lastKey.dataset.note = `C${finalOctave}`;
  lastKey.textContent = `C${finalOctave}`;
  whiteKeysContainer.appendChild(lastKey);

  attachEvents();
}

// ===========================
// Gestión de Eventos
// ===========================

function attachEvents() {
  const keys = document.querySelectorAll(".piano__key");
  const waveformSelect = document.getElementById("waveform-select");
  const volumeControl = document.getElementById("volume-control");

  function handleInteraction(key) {
    const freq = Number(key.dataset.freq);
    const waveform = waveformSelect.value;
    const volume = Number(volumeControl.value);

    if (freq) {
      playNote(freq, waveform, volume);
      key.classList.add("piano__key--active");
      setTimeout(() => key.classList.remove("piano__key--active"), 200);
    }
  }

  keys.forEach((key) => {
    key.onmousedown = (e) => { e.preventDefault(); handleInteraction(key); };
    key.ontouchstart = (e) => { e.preventDefault(); handleInteraction(key); };
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const octavesSelect = document.getElementById("octaves-select");
  
  renderPiano(Number(octavesSelect.value));

  octavesSelect.addEventListener("change", (e) => {
    renderPiano(Number(e.target.value));
  });
});