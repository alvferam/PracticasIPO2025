// script.js

import { Cuadrado } from "./Cuadrado.js";

const canvas = document.getElementById("appCanvas");
const ctx = canvas.getContext("2d");

const cuadrado = new Cuadrado(canvas, 20, 'red', 50, 50, 2);

function animaCuadrado() {
    requestAnimationFrame(animaCuadrado);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cuadrado.dibuja();
    cuadrado.actualiza();
}

requestAnimationFrame(animaCuadrado);
