// script.js

const canvas = document.getElementById("appCanvas");
const ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(30, 50);
ctx.lineTo(40, 30);
ctx.closePath();
ctx.strokeStyle = "red";
ctx.lineWidth = 4;
ctx.stroke();

ctx.beginPath();
ctx.moveTo(60, 10);
ctx.lineTo(80, 50);
ctx.lineTo(90, 30);
ctx.fillStyle = "orange";
ctx.fill();
