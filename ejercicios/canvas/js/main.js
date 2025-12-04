import { AudioEngine } from './AudioEngine.js';
import { Player, Base, PowerUp, Projectile, Enemy, Particle } from './Entities.js';

/* ----------------------------------------------------
    CONFIGURACIÓN E INICIALIZACIÓN
   ---------------------------------------------------- */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreEl = document.getElementById('scoreDisplay');
const livesEl = document.getElementById('livesDisplay');
const startModal = document.getElementById('startModal');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreEl = document.getElementById('finalScore');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

/* ----------------------------------------------------
    ESTADO GLOBAL Y TEMPORIZADORES (FIX SETINTERVAL)
   ---------------------------------------------------- */
let player;
let base;
let projectiles = [];
let enemies = [];
let particles = [];
let powerUps = [];

let animationId;
let score = 0;
let lives = 3;
let gameActive = false;

let lastTime = 0;
let enemySpawnTimer = 0;
let enemySpawnInterval = 1000; 
let powerUpSpawnTimer = 0;
let powerUpSpawnInterval = 10000; 

const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
const keys = { w: false, a: false, s: false, d: false };

const audio = new AudioEngine();

/* ----------------------------------------------------
    RENDERIZADO AUXILIAR
   ---------------------------------------------------- */

function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const gridSize = 50;
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
}

function drawLaser() {
    if (!player) return;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = player.powerUpActive ? 'rgba(255, 255, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 15]);
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
    ctx.restore();
    
    // Mirilla
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'var(--accent-color)';
    ctx.stroke();
}

/* ----------------------------------------------------
    LÓGICA DEL JUEGO
   ---------------------------------------------------- */

// Función de spawn controlada por Delta Time 
function handleSpawns(deltaTime) {
    enemySpawnTimer += deltaTime;
    if (enemySpawnTimer > enemySpawnInterval) {
        const radius = Math.random() * (30 - 10) + 10;
        let x, y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        
        const color = `hsl(${Math.random() * 40}, 100%, 50%)`;
        
        const angle = Math.atan2(base.y - y, base.x - x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
        
        enemies.push(new Enemy(x, y, radius, color, velocity));
        enemySpawnTimer = 0;
    }

    // 2. Spawn PowerUps (Triple Disparo)
    powerUpSpawnTimer += deltaTime;
    if (powerUpSpawnTimer > powerUpSpawnInterval) {
        const x = Math.random() * (canvas.width - 100) + 50;
        const y = Math.random() * (canvas.height - 100) + 50;
        powerUps.push(new PowerUp(x, y));
        powerUpSpawnTimer = 0;
    }
}

function createExplosion(x, y, color) {
    audio.playSound('explosion');
    for (let i = 0; i < 8; i++) {
        particles.push(new Particle(x, y, Math.random() * 3, color, {
            x: (Math.random() - 0.5) * (Math.random() * 6),
            y: (Math.random() - 0.5) * (Math.random() * 6)
        }));
    }
}

function checkGameOver() {
    lives--;
    livesEl.innerText = `VIDAS: ${lives}`;
    document.body.style.backgroundColor = 'rgba(255,0,0,0.2)';
    setTimeout(() => {
        const computedStyle = getComputedStyle(document.documentElement);
        document.body.style.backgroundColor = computedStyle.getPropertyValue('--bg-color');
    }, 100);

    if (lives <= 0) {
        gameActive = false;
        cancelAnimationFrame(animationId);
        finalScoreEl.innerText = score;
        gameOverModal.classList.remove('hidden');
        document.body.style.cursor = 'default';
    }
}

function initGame() {
    base = new Base(canvas.width / 2, canvas.height / 2);
    player = new Player(canvas.width / 2, canvas.height / 2 + 100);
    
    projectiles = [];
    enemies = [];
    particles = [];
    powerUps = [];
    
    score = 0;
    lives = 3;
    gameActive = true;
    lastTime = 0; 

    scoreEl.innerText = `PUNTOS: ${score}`;
    livesEl.innerText = `VIDAS: ${lives}`;
    startModal.classList.add('hidden');
    gameOverModal.classList.add('hidden');
    document.body.style.cursor = 'none';

    audio.init();
    animate(0); 
}

/* ----------------------------------------------------
    BUCLE PRINCIPAL 
   ---------------------------------------------------- */
function animate(timeStamp) {
    if (!gameActive) return;
    
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    animationId = requestAnimationFrame(animate);
    
    ctx.fillStyle = 'rgba(10, 5, 20, 0.2)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    base.draw(ctx);
    drawLaser();

    handleSpawns(deltaTime);

    // Actualizar Jugador
    const speed = 4;
    if (keys.w && player.y > player.radius) player.y -= speed;
    if (keys.s && player.y < canvas.height - player.radius) player.y += speed;
    if (keys.a && player.x > player.radius) player.x -= speed;
    if (keys.d && player.x < canvas.width - player.radius) player.x += speed;

    player.update(mouse, deltaTime);
    player.draw(ctx);

    // Actualizar PowerUps
    powerUps.forEach((powerUp, index) => {
        powerUp.update();
        powerUp.draw(ctx);
        const dist = Math.hypot(player.x - powerUp.x, player.y - powerUp.y);
        if (dist - player.radius - powerUp.radius < 1) {
            player.powerUpActive = true;
            player.powerUpTimer = 5000; 
            powerUps.splice(index, 1);
            score += 500; 
            scoreEl.innerText = `PUNTOS: ${score}`;
        }
    });

    // Actualizar Partículas
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
            particle.draw(ctx);
        }
    });

    // Actualizar Proyectiles
    projectiles.forEach((projectile, index) => {
        projectile.update();
        projectile.draw(ctx);
        if (
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => { projectiles.splice(index, 1); }, 0);
        }
    });

    // Actualizar Enemigos
    enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw(ctx);

        // 1. COLISIÓN ENEMIGO -> BASE 
        const distBase = Math.hypot(base.x - enemy.x, base.y - enemy.y);
        if (distBase - base.radius - enemy.radius < 1) {
            createExplosion(base.x, base.y, 'cyan'); 
            enemies.splice(index, 1); 
            checkGameOver(); 
        }

        // 2. COLISIÓN ENEMIGO -> JUGADOR 
        const distPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        
        if (distPlayer - player.radius - enemy.radius < 1) {
            createExplosion(player.x, player.y, 'white'); 
            enemies.splice(index, 1); 
            checkGameOver(); 
        }

        // 3. COLISIÓN ENEMIGO -> PROYECTIL
        projectiles.forEach((projectile, pIndex) => {
            const distProjectile = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (distProjectile - enemy.radius - projectile.radius < 1) {
                createExplosion(projectile.x, projectile.y, enemy.color);
                score += 100;
                scoreEl.innerText = `PUNTOS: ${score}`;
                setTimeout(() => {
                    enemies.splice(index, 1);
                    projectiles.splice(pIndex, 1);
                }, 0);
            }
        });
    });
}

/* ----------------------------------------------------
    EVENTOS
   ---------------------------------------------------- */

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if(base) {
        base.x = canvas.width / 2;
        base.y = canvas.height / 2;
    }
});

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('click', () => {
    if (!gameActive) return;

    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    const velocity = 8;

    // Lógica de disparo
    if (player.powerUpActive) {
        // TRIPLE DISPARO
        const angles = [angle, angle - 0.2, angle + 0.2]; // Centro, izquierda, derecha (radianes)
        
        angles.forEach(a => {
            projectiles.push(new Projectile(player.x, player.y, {
                x: Math.cos(a) * velocity,
                y: Math.sin(a) * velocity
            }));
        });
    } else {
        // DISPARO NORMAL
        projectiles.push(new Projectile(player.x, player.y, {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity
        }));
    }
    
    audio.playSound('shoot');
});

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if(keys.hasOwnProperty(key)) keys[key] = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if(keys.hasOwnProperty(key)) keys[key] = false;
});

startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);