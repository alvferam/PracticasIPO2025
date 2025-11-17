// script.js

const canvas = document.getElementById("appCanvas");
const ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.arc(20, 20, 10, Math.PI, 2 * Math.PI);
ctx.rect(30, 30, 50, 50);
ctx.strokeStyle = "red";
ctx.stroke();

ctx.beginPath();
ctx.moveTo(100, 30);
ctx.arc(120, 30, 10, 0, 2 * Math.PI);
ctx.fillStyle = "blue";
ctx.fill();
