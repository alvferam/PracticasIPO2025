// Clase base
class Entity {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.markedForDeletion = false;
    }
}

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, 'var(--accent-color)');
        this.radius = 15;
        this.angle = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // 1. PROPULSOR
        if (Math.random() < 0.8) {
            ctx.beginPath();
            ctx.moveTo(-10, 5);
            ctx.lineTo(-25, 0); // Punta 
            ctx.lineTo(-10, -5);
            ctx.fillStyle = 'red'; 
            ctx.fill();
        }

        // 2. NAVE 
        ctx.beginPath();
        ctx.moveTo(20, 0);   
        ctx.lineTo(-15, 15); 
        ctx.lineTo(-5, 0);   
        ctx.lineTo(-15, -15);
        ctx.closePath();
        
        ctx.fillStyle = this.color; 
        ctx.fill();
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 3. CABINA 
        ctx.beginPath();
        ctx.arc(-2, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'lightblue'; 
        ctx.fill();

        ctx.restore();
    }

    update(mouse) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        this.angle = Math.atan2(dy, dx);
    }
}

// PROYECTILES
export class Projectile extends Entity {
    constructor(x, y, velocity) {
        super(x, y, 'white');
        this.velocity = velocity;
        this.radius = 3;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // Trazado curvo 
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// ENEMIGOS
export class Enemy extends Entity {
    constructor(x, y, radius, color, velocity) {
        super(x, y, color);
        this.radius = radius;
        this.velocity = velocity;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// PARTÍCULAS
export class Particle extends Entity {
    constructor(x, y, radius, color, velocity) {
        super(x, y, color);
        this.radius = radius;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.02;
    }
}