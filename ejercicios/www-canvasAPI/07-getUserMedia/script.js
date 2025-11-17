// script.js

import { Puntero } from "./Puntero.js";

async function comienzo() {
  try {

    const mediaDevices = window.navigator.mediaDevices;
    const mediaStream = await mediaDevices.getUserMedia({ video: true });

    const video = document.createElement("video");
    video.srcObject = mediaStream;

    video.addEventListener("loadeddata", () => {
      video.play();

      const canvasApp = document.getElementById("canvasApp");
      canvasApp.width = video.videoWidth;
      canvasApp.height = video.videoHeight;
      const ctx = canvasApp.getContext("2d");

      const puntero= new Puntero(canvasApp);

      function animacion() {
          requestAnimationFrame(animacion);

          ctx.clearRect(0, 0, canvasApp.width, canvasApp.height);
          ctx.drawImage(video, 0, 0, canvasApp.width, canvasApp.height);
          puntero.dibuja();
      }

      requestAnimationFrame(animacion);

    });
  } catch (err) {
    alert(err);
  }
}

comienzo();
