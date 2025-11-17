// Cuadrado.js

export class Cuadrado {

    constructor(canvas,lado, color,x, y, dx) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.lado = lado;
        this.color = color;
        this.x = x;  
        this.y = y;
        this.dx =dx;
    }

    dibuja() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.lado, this.lado);        
    }

    actualiza() {
        // Colisiones: Cambia el sentido al alcanzar los bordes
        if (this.x + this.dx + this.lado > this.canvas.width
                || this.x + this.dx < 0) {
            this.dx = -this.dx;
        }    
        this.x += this.dx;
    }
}


