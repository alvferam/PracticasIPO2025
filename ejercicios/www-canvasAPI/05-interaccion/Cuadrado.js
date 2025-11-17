// Cuadrado.js

export class Cuadrado {

    constructor(canvas,x,y,lado,color,dy) {
        this.canvas = canvas;
        this.lado = lado;
        this.x = x;  
        this.y = y;
        this.color = color;
        this.dy = dy;

        this.ctx = this.canvas.getContext("2d");
    }

    dibuja() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.lado, this.lado);        
    }

    sube() {
        if (this.y - this.dy >= 0) 
            this.y -= this.dy; 
    }
    
    baja() {
        if (this.y + this.dy + this.lado <= this.canvas.height) 
            this.y += this.dy;
    }

}


