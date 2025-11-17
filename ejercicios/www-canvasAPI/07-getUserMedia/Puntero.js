// Puntero.js

import { semejanzaCromática, puntoCentral } from "./utils.js";

const __COLOR_MARCADOR= { r: 255, g: 0, b: 0 }
const __COLOR_FORMA= "rgb(0,255,0)"

export class Puntero {
  
  constructor(canvas, 
              colorMarcador=__COLOR_MARCADOR, 
              colorForma=__COLOR_FORMA) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.colorMarcador = colorMarcador;
    this.colorForma = colorForma;
  }

  dibuja() {

    // Localiza en el canvas los puntos cuyo color se asemeja al color del marcador
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const puntos = this.#localizaPuntosSegunColor(imageData, this.colorMarcador);

    // Si detecta el marcador
    if (puntos.length > 0) {
      // Calcula un punto central representativo de todos los puntos localizados
      const centro = puntoCentral(puntos);

      // Dibuja un círculo en el centro
      this.ctx.beginPath();
      this.ctx.fillStyle = this.colorForma;
      this.ctx.arc(centro.x, centro.y, 10, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.closePath();
    }
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
