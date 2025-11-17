// Theremin.js

import { semejanzaCromática, puntoCentral } from "./utils.js";

const COLOR_MARCADOR= { r: 255, g: 0, b: 0 };
const COLOR_FORMA= "rgb(0,0,255)";

export class Theremin {
  
  constructor(canvas, colorMarcador = COLOR_MARCADOR, colorForma = COLOR_FORMA) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d");

    this.colorMarcador = colorMarcador;
    this.colorForma = colorForma;

    const audioCtx = new AudioContext();
    this.osc= new OscillatorNode(audioCtx, {
      type: 'sine',
      frequency: 0
    });

    this.gainNode = new GainNode(audioCtx, { gain: 0.1 });
    this.osc.connect(this.gainNode);
    this.gainNode.connect(audioCtx.destination);
    this.osc.start();
  }

  reproduce() {


    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const puntos = this.#localizaPuntosSegunColor(imageData, this.colorMarcador);

  

    if (puntos.length > 0) {
      // Calcula un punto central representativo de todos los puntos localizados
      const centro = puntoCentral(puntos);

      // Asociación de la altura a la que se encuentra el marcador
      // con la frecuencia del sonido que se emitirá
      const p = 1 - centro.y / this.canvas.height;
      const newFreq = 200 + 500 * p;
      this.osc.frequency.value = newFreq;
      this.gainNode.gain.value = 0.2;

      // Dibuja una línea horizontal a la altura del centro calculado
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.colorForma;
      this.ctx.lineWidth = 5;
      this.ctx.moveTo(0, centro.y);
      this.ctx.lineTo(this.canvas.width, centro.y);
      this.ctx.stroke();
      this.ctx.closePath();

    } else {
      // Si no se detecta el marcador, no se emitirá sonido
      this.gainNode.gain.value = 0;
    }

    // Acceso a la leyenda para mostrar por pantalla la frecuencia emitida
    const freqNode = document.getElementById("freq");
    const freq = this.osc.frequency.value;
    const valorFreq = Math.floor(freq);
    freqNode.innerText = valorFreq.toString();

  }

  #localizaPuntosSegunColor(imageData, color) {
    const puntos = [];

    // imageData.data es un array de bytes en formato RGBA de cada pixel
    for (let i = 0; i < imageData.data.length; i += 4) {
      // Se ignora el canal Alfa
      
      const pixel = {
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
      };

      // Se comprueba si el pixel es semejante al color deseado
      if (semejanzaCromática(pixel, color)) {
        // Calcula la localización punto (x,y) del pixel en el mapa de bits
        const pixelIndex = i / 4;
        const localizacionPixel = {
          x: pixelIndex % imageData.width,
          y: Math.floor(pixelIndex / imageData.width),
        };

        puntos.push(localizacionPixel);
      }
    }
    return puntos;
  }

}
