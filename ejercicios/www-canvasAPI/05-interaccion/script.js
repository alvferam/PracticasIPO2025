// script.js

import { Cuadrado } from "./Cuadrado.js";

const canvas = document.getElementById("appCanvas");
const ctx = canvas.getContext("2d");

const cuadro= new Cuadrado(canvas, 50, 50, 50, 'blue', 2);
cuadro.dibuja();

window.addEventListener('keydown', mueveCuadrado)

function mueveCuadrado(event) {
    const key = event.key;
    switch (key) {
        case 'ArrowUp':
        cuadro.sube()
        break
    case 'ArrowDown':
        cuadro.baja()
        break;
    default:
        return; 
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cuadro.dibuja();
}




