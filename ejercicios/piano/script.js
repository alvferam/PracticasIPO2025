// ===========================
// Audio
// ===========================

let audioCtx = null;

/**
 * Devuelve un AudioContext reutilizable.
 */
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  if (audioCtx.state === "suspended") {
    // En algunos navegadores el contexto empieza en suspended
    audioCtx.resume();
  }

  return audioCtx;
}

/**
 * Reproduce una nota con la frecuencia indicada (Hz) y la forma de onda seleccionada.
 */
function playNote(frequency, waveform) {
  const ctx = getAudioContext();

  const osc = new OscillatorNode(ctx, {
    type: waveform,
    frequency: frequency,
  });

  // GainNode para controlar volumen y aplicar un pequeño envelope
  const gainNode = new GainNode(ctx, {
    gain: 0,
  });

  osc.connect(gainNode).connect(ctx.destination);

  const now = ctx.currentTime;
  const attackTime = 0.02;
  const releaseTime = 0.4;

  // Envelope: subida rápida y bajada suave
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.8, now + attackTime);
  gainNode.gain.linearRampToValueAtTime(0, now + attackTime + releaseTime);

  osc.start(now);
  osc.stop(now + attackTime + releaseTime + 0.05);
}

// ===========================
// Interacción con el DOM
// ===========================

document.addEventListener("DOMContentLoaded", () => {
  const keys = document.querySelectorAll(".piano__key");
  const waveformSelect = document.getElementById("waveform-select");

  function handleKeyPress(keyEl) {
    const freq = Number(keyEl.dataset.freq);
    const waveform = waveformSelect.value;

    if (!freq || Number.isNaN(freq)) return;

    // Estado visual
    keyEl.classList.add("piano__key--active");

    // Reproducir nota
    playNote(freq, waveform);

    // Quitar la clase cuando acabe un poquito después del sonido
    setTimeout(() => {
      keyEl.classList.remove("piano__key--active");
    }, 200);
  }

  keys.forEach((key) => {
    key.addEventListener("click", () => {
      handleKeyPress(key);
    });
  });
});
