// script.js

const canvas = document.getElementById("appCanvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = 'red'; 
ctx.fillRect(10, 10, 200, 100); 

ctx.strokeStyle = 'blue';
ctx.lineWidth = 2;
ctx.strokeRect(30, 30, 50, 100);

ctx.clearRect(20, 20, 50, 50);





