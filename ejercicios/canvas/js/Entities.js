import { AudioEngine } from './AudioEngine.js';

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
        this.powerUpActive = false;
        this.powerUpTimer = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Visual del PowerUp (Halo brillante)
        if (this.powerUpActive) {
            ctx.beginPath();
            ctx.arc(0, 0, 25, 0, Math.PI * 2);
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
        }

        // Propulsor
        if (Math.random() < 0.8) {
            ctx.beginPath();
            ctx.moveTo(-10, 5);
            ctx.lineTo(-25, 0); 
            ctx.lineTo(-10, -5);
            ctx.fillStyle = 'orange'; 
            ctx.fill();
        }

        // Nave
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

        ctx.beginPath();
        ctx.arc(-2, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#00f7ff'; 
        ctx.fill();

        ctx.restore();
    }

    update(mouse, deltaTime) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        this.angle = Math.atan2(dy, dx);

        // Gestionar tiempo del PowerUp
        if (this.powerUpActive) {
            this.powerUpTimer -= deltaTime;
            if (this.powerUpTimer <= 0) {
                this.powerUpActive = false;
            }
        }
    }
}

export class Base extends Entity {
    constructor(x, y) {
        super(x, y, '#00f7ff');
        this.radius = 40;
        this.health = 100; 
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Efecto de escudo pulsante
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + Math.sin(Date.now() / 200) * 5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 247, 255, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Núcleo
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Estructura externa
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }
}

export class PowerUp extends Entity {
    constructor(x, y) {
        super(x, y, 'yellow');
        this.radius = 10;
        this.velocity = { x: (Math.random() - 0.5) * 1, y: (Math.random() - 0.5) * 1 };
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(this.radius, 0);
        ctx.lineTo(0, this.radius);
        ctx.lineTo(-this.radius, 0);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        // Texto "3x"
        ctx.fillStyle = 'black';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("3X", 0, 0);
        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

export class Projectile extends Entity {
    constructor(x, y, velocity) {
        super(x, y, 'white');
        this.velocity = velocity;
        this.radius = 3;
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
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.stroke();
    }
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

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