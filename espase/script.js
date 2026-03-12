/**
 * SPACE DEFENDER - Version Ultimate
 * + Power-ups + Combo + Boss + Effets améliorés
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const scoreEl = document.getElementById('scoreEl');
const livesEl = document.getElementById('livesEl');
const enemyCountEl = document.getElementById('enemyCountEl');
const menuScreen = document.getElementById('menu-screen');
const victoryScreen = document.getElementById('victory-screen');
const finalScoreEl = document.getElementById('finalScore');
const gamepadIndicator = document.getElementById('gamepad-indicator');
const comboEl = document.getElementById('comboEl');

// Game State
let gameState = 'MENU';
let score = 0;
let lives = 3;  // ❤️ 3 vies
let enemyPoolTotal = 100;
let enemiesDestroyed = 0;
let endlessMode = false;
let baseSpeed = 1;
let speedMultiplier = 1;
let victoryShown = false;
let lastLifeBonusScore = 0;

// Combo System
let combo = 0;
let comboTimer = 0;
const COMBO_MAX = 10;
const COMBO_WINDOW = 180; // frames (~3 secondes)

// Entities
let player;
let bullets = [];
let enemies = [];
let asteroids = [];
let particles = [];
let stars = [];
let powerups = [];
let trails = [];
let boss = null;
let bossSpawned = false;

// Images
const playerImg = new Image();
playerImg.onload = () => console.log('Image chargée: player');
playerImg.onerror = () => console.warn('Image player non trouvée');
try { playerImg.src = encodeURI('assets/vaisseau.png') + '?_=' + Date.now(); } catch(e) { playerImg.src = 'assets/vaisseau.png'; }

const enemyImg = new Image();
enemyImg.onload = () => console.log('Image chargée: enemy');
enemyImg.onerror = () => console.warn('Image enemy non trouvée');
try { enemyImg.src = encodeURI('assets/vaisseau 1.png') + '?_=' + Date.now(); } catch(e) { enemyImg.src = 'assets/vaisseau 1.png'; }

const enemySpecialImg = new Image();
enemySpecialImg.onload = () => console.log('Image chargée: enemySpecial');
enemySpecialImg.onerror = () => console.warn('Image enemySpecial non trouvée');
try { enemySpecialImg.src = encodeURI('assets/vaisseau 3.png') + '?_=' + Date.now(); } catch(e) { enemySpecialImg.src = 'assets/vaisseau 3.png'; }

const asteroidImg = new Image();
asteroidImg.onload = () => console.log('Image chargée: asteroid');
asteroidImg.onerror = () => console.warn('Image asteroid non trouvée');
try { asteroidImg.src = encodeURI('assets/asteroid 6.png') + '?_=' + Date.now(); } catch(e) { asteroidImg.src = 'assets/asteroid 6.png'; }

const missileImg = new Image();
missileImg.onload = () => console.log('Image chargée: missile');
missileImg.onerror = () => console.warn('Image missile non trouvée');
try { missileImg.src = encodeURI('assets/missile 8.png') + '?_=' + Date.now(); } catch(e) { missileImg.src = 'assets/missile 8.png'; }

const sunImg = new Image();
sunImg.onload = () => console.log('Image chargée: sun');
sunImg.onerror = () => console.warn('Image sun non trouvée');
try { sunImg.src = encodeURI('assets/soleil 55.png') + '?_=' + Date.now(); } catch(e) { sunImg.src = 'assets/soleil 55.png'; }

// Powerup images
const powerupImages = {};
['triple', 'shield', 'speed', 'heart'].forEach(type => {
    powerupImages[type] = new Image();
    powerupImages[type].src = `assets/powerup-${type}.png`;
});

// Configuration
let enemyShootChance = 0.005;
let enemySpawnTimer = 0;
let asteroidSpawnTimer = 0;
let powerupSpawnTimer = 0;
let bossSpawnThreshold = 80; // % d'ennemis détruits avant spawn du boss

// Input
const keys = {};
const mouse = { x: 0, y: 0, down: false };
let gamepadConnected = false;
let gamepadIndex = null;

// Audio
let audioCtx;
let bgmOscillators = [];
let bgmGain = null;

// ==================== INITIALISATION ====================

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
}
window.addEventListener('resize', resize);
resize();

// ==================== MANETTE ====================

window.addEventListener("gamepadconnected", (e) => {
    gamepadIndex = e.gamepad.index;
    gamepadConnected = true;
    gamepadIndicator.classList.add('active');
    console.log("🎮 Manette connectée");
});

window.addEventListener("gamepaddisconnected", (e) => {
    if (gamepadIndex === e.gamepad.index) {
        gamepadIndex = null;
        gamepadConnected = false;
        gamepadIndicator.classList.remove('active');
    }
});

function getGamepad() {
    if (!gamepadConnected) return null;
    const gamepads = navigator.getGamepads();
    return gamepads[gamepadIndex] || null;
}

// ==================== FOND SPATIAL ====================

function initStars() {
    stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2.5 + 0.5,
            speed: Math.random() * 0.8 + 0.2,
            brightness: Math.random(),
            layer: Math.floor(Math.random() * 3) // Parallaxe
        });
    }
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a2e');
    gradient.addColorStop(0.5, '#1a0a3e');
    gradient.addColorStop(1, '#2a0a4e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.y += star.speed * speedMultiplier * (star.layer + 1) * 0.5;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
        const flicker = 0.5 + Math.sin(Date.now() * 0.005 + star.x) * 0.5;
        ctx.fillStyle = `rgba(255,255,255,${star.brightness * flicker})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ==================== AUDIO ====================

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    startBGM();
}

function startBGM() {
    if (!audioCtx || bgmGain) return;
    bgmGain = audioCtx.createGain();
    bgmGain.connect(audioCtx.destination);
    bgmGain.gain.value = 0.03;
    
    // Drone spatial ambient
    const freqs = [55, 110, 165];
    freqs.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = 0.1 / (i + 1);
        
        // LFO modulation
        const lfo = audioCtx.createOscillator();
        lfo.frequency.value = 0.1 + i * 0.05;
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 20;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        
        osc.connect(gain);
        gain.connect(bgmGain);
        osc.start();
        bgmOscillators.push({ osc, gain, lfo, lfoGain });
    });
}

function stopBGM() {
    bgmOscillators.forEach(({ osc, lfo }) => {
        try { osc.stop(); lfo.stop(); } catch(e) {}
    });
    bgmOscillators = [];
    if (bgmGain) {
        bgmGain.disconnect();
        bgmGain = null;
    }
}

function playSound(type) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        switch(type) {
            case 'shoot':
                osc.type = 'square';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
                
            case 'tripleShoot':
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
                
            case 'explosion':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(20, now + 0.4);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                break;
                
            case 'bigExplosion':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(10, now + 0.8);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
                osc.start(now);
                osc.stop(now + 0.8);
                break;
                
            case 'bonus':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.1);
                osc.frequency.setValueAtTime(784, now + 0.2);
                osc.frequency.setValueAtTime(1047, now + 0.3);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                break;
                
            case 'powerup':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.linearRampToValueAtTime(880, now + 0.15);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
                
            case 'hit':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
                
            case 'bossSpawn':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(80, now);
                osc.frequency.linearRampToValueAtTime(40, now + 1);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0, now + 1);
                osc.start(now);
                osc.stop(now + 1);
                break;
                
            case 'combo':
                osc.type = 'square';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.setValueAtTime(1175, now + 0.08);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.16);
                osc.start(now);
                osc.stop(now + 0.16);
                break;
        }
    } catch(e) {}
}

// ==================== CONTRÔLES ====================

window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'KeyP' && gameState === 'PLAY') togglePause();
});
window.addEventListener('keyup', e => keys[e.code] = false);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mousedown', () => mouse.down = true);
window.addEventListener('mouseup', () => mouse.down = false);

// ==================== POWER-UPS ====================

class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 30;
        this.h = 30;
        this.vy = 2;
        // Power-ups avec coeurs (10%)
        const types = ['triple', 'shield', 'speed', 'heart'];
        const weights = [0.40, 0.30, 0.20, 0.10];
        const rand = Math.random();
        let cumulative = 0;
        for (let i = 0; i < types.length; i++) {
            cumulative += weights[i];
            if (rand <= cumulative) {
                this.type = types[i];
                break;
            }
        }
        this.colors = {
            triple: '#0ff',
            shield: '#00f',
            speed: '#ff0',
            heart: '#f0f'
        };
        this.markedForDeletion = false;
        this.angle = 0;
    }

    update() {
        this.y += this.vy;
        this.angle += 0.05;
        if (this.y > canvas.height) this.markedForDeletion = true;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        const color = this.colors[this.type];
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        
        // Diamant
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(12, 0);
        ctx.lineTo(0, 15);
        ctx.lineTo(-12, 0);
        ctx.closePath();
        ctx.fill();
        
        // Icône
        ctx.rotate(-this.angle);
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 0;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const icons = { triple: '⚡', shield: '🛡️', speed: '💨', heart: '❤️' };
        ctx.fillText(icons[this.type], 0, 0);

        ctx.restore();
    }
}

// ==================== JOUEUR ====================

class Player {
    constructor() {
        this.w = 40;
        this.h = 40;
        this.x = canvas.width / 2;
        this.y = canvas.height - 100;
        this.speed = 7;
        this.baseSpeed = 7;
        this.cooldown = 0;
        this.invulnerable = 0;
        this.powerup = null;
        this.powerupTimer = 0;
        this.shield = false;
    }

    update() {
        const gp = getGamepad();
        let moved = false;

        if (gp && gamepadConnected) {
            const deadzone = 0.15;
            const axisX = Math.abs(gp.axes[0]) > deadzone ? gp.axes[0] : 0;
            const axisY = Math.abs(gp.axes[1]) > deadzone ? gp.axes[1] : 0;

            if (axisX !== 0 || axisY !== 0) {
                this.x += axisX * this.speed * speedMultiplier;
                this.y += axisY * this.speed * speedMultiplier;
                moved = true;
            }

            if (gp.buttons[0].pressed || gp.buttons[7].pressed) {
                this.shoot();
            }
        }

        if (!moved) {
            if (keys['ArrowLeft'] || keys['KeyQ']) { this.x -= this.speed * speedMultiplier; moved = true; }
            if (keys['ArrowRight'] || keys['KeyD']) { this.x += this.speed * speedMultiplier; moved = true; }
            if (keys['ArrowUp'] || keys['KeyZ']) { this.y -= this.speed * speedMultiplier; moved = true; }
            if (keys['ArrowDown'] || keys['KeyS']) { this.y += this.speed * speedMultiplier; moved = true; }

            if (!moved && !gamepadConnected) {
                this.x += (mouse.x - this.x) * 0.1;
                this.y += (mouse.y - this.y) * 0.1;
            }

            if (keys['Space'] || mouse.down) this.shoot();
        }

        // Limites
        if (this.x < this.w/2) this.x = this.w/2;
        if (this.x > canvas.width - this.w/2) this.x = canvas.width - this.w/2;
        if (this.y < this.h/2) this.y = this.h/2;
        if (this.y > canvas.height - this.h/2) this.y = canvas.height - this.h/2;

        if (this.cooldown > 0) this.cooldown--;
        if (this.invulnerable > 0) this.invulnerable--;
        
        // Powerup timer
        if (this.powerupTimer > 0) {
            this.powerupTimer--;
            if (this.powerupTimer <= 0) {
                this.deactivatePowerup();
            }
        }
    }

    draw() {
        let alpha = 1.0;
        if (this.invulnerable > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
            alpha = 0.5;
        }
        if (this.shield) {
            alpha = 0.8;
        }
        
        ctx.globalAlpha = alpha;
        
        // Image du joueur
        if (playerImg && playerImg.complete && playerImg.naturalWidth > 0) {
            ctx.drawImage(playerImg, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
        } else {
            ctx.fillStyle = this.powerup === 'triple' ? '#0ff' : '#0ff';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.h/2);
            ctx.lineTo(this.x - this.w/2, this.y + this.h/2);
            ctx.lineTo(this.x + this.w/2, this.y + this.h/2);
            ctx.closePath();
            ctx.fill();
        }

        // Bouclier visuel
        if (this.shield) {
            ctx.globalAlpha = 0.4;
            ctx.strokeStyle = '#00f';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00f';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.w, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Effet speed powerup
        if (this.powerup === 'speed') {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.moveTo(this.x - 5, this.y + this.h/2 + 5);
            ctx.lineTo(this.x + 5, this.y + this.h/2 + 5);
            ctx.lineTo(this.x, this.y + this.h/2 + 25);
            ctx.closePath();
            ctx.fill();
        }

        ctx.globalAlpha = 1.0;
    }

    shoot() {
        if (this.cooldown <= 0) {
            if (this.powerup === 'triple') {
                bullets.push(new Bullet(this.x, this.y - this.h/2, -14, '#0ff', true));
                bullets.push(new Bullet(this.x - 15, this.y - this.h/2, -12, '#0ff', true));
                bullets.push(new Bullet(this.x + 15, this.y - this.h/2, -12, '#0ff', true));
                playSound('tripleShoot');
                this.cooldown = 25;
            } else {
                bullets.push(new Bullet(this.x, this.y - this.h/2, -14, '#ff0', true));
                playSound('shoot');
                this.cooldown = 20;
            }

            const gp = getGamepad();
            if (gp && gp.vibrationActuator) {
                gp.vibrationActuator.playEffect("dual-rumble", {
                    startDuration: 30,
                    endDuration: 30,
                    weakMagnitude: 0.3,
                    strongMagnitude: 0.6
                });
            }
        }
    }

    activatePowerup(type) {
        this.powerup = type;
        this.powerupTimer = 600; // 10 secondes à 60fps
        
        if (type === 'shield') {
            this.shield = true;
        } else if (type === 'speed') {
            this.speed = this.baseSpeed * 1.5;
        }
        
        playSound('powerup');
    }

    deactivatePowerup() {
        this.powerup = null;
        this.shield = false;
        this.speed = this.baseSpeed;
    }

    takeDamage() {
        if (this.invulnerable > 0) return;
        
        if (this.shield) {
            this.shield = false;
            this.invulnerable = 60;
            playSound('hit');
            createExplosion(this.x, this.y, '#00f', 20);
            return;
        }
        
        lives--;
        this.deactivatePowerup();
        this.invulnerable = 120;
        createExplosion(this.x, this.y, '#f00', 30);
        playSound('explosion');
        updateHUD();
        if (lives <= 0) gameOver();
    }
}

// ==================== ENNEMI ====================

class Enemy {
    constructor(isSpecial) {
        this.isSpecial = isSpecial;
        this.w = isSpecial ? 45 : 35;
        this.h = isSpecial ? 45 : 35;
        this.x = Math.random() * (canvas.width - this.w) + this.w/2;
        this.y = -50;
        this.speedY = (Math.random() * 2 + 1) * baseSpeed;
        this.color = isSpecial ? '#f0f' : '#f00';
        this.hp = isSpecial ? 3 : 1;
        this.markedForDeletion = false;
    }

    update() {
        this.y += this.speedY * speedMultiplier;
        this.x += Math.sin(this.y * 0.05) * 2;
        
        if (Math.random() < enemyShootChance * speedMultiplier) {
            bullets.push(new Bullet(this.x, this.y + this.h/2, 6, '#f55', false));
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        if (this.isSpecial) {
            if (enemySpecialImg && enemySpecialImg.complete && enemySpecialImg.naturalWidth > 0) {
                ctx.drawImage(enemySpecialImg, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
            } else {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.h/2);
                ctx.lineTo(this.x + this.w/2, this.y);
                ctx.lineTo(this.x, this.y + this.h/2);
                ctx.lineTo(this.x - this.w/2, this.y);
                ctx.closePath();
                ctx.fill();
            }
        } else {
            if (enemyImg && enemyImg.complete && enemyImg.naturalWidth > 0) {
                ctx.drawImage(enemyImg, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
            } else {
                ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
            }
        }
    }
}

// ==================== SUN ENEMY ====================

class SunEnemy {
    constructor() {
        this.isSun = true;
        this.w = 80;
        this.h = 80;
        this.x = Math.random() * (canvas.width - this.w) + this.w / 2;
        this.y = -100;
        this.speedY = 0.5 * baseSpeed;
        this.hp = 10;
        this.color = '#ffcc00';
        this.markedForDeletion = false;
    }

    update() {
        this.y += this.speedY * speedMultiplier;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 30;
        if (sunImg && sunImg.complete && sunImg.naturalWidth > 0) {
            ctx.drawImage(sunImg, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.w / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    }
}

// ==================== BOSS ====================

class Boss {
    constructor() {
        this.w = 150;
        this.h = 100;
        this.x = canvas.width / 2;
        this.y = -150;
        this.targetY = 100;
        this.hp = 50;
        this.maxHp = 50;
        this.speedX = 3;
        this.speedY = 2;
        this.phase = 'entering'; // entering, fighting
        this.attackTimer = 0;
        this.attackPattern = 0;
        this.color = '#f00';
        this.markedForDeletion = false;
        this.glowPhase = 0;
    }

    update() {
        if (this.phase === 'entering') {
            this.y += this.speedY;
            if (this.y >= this.targetY) {
                this.y = this.targetY;
                this.phase = 'fighting';
            }
        } else if (this.phase === 'fighting') {
            this.x += this.speedX;
            if (this.x <= this.w/2 || this.x >= canvas.width - this.w/2) {
                this.speedX *= -1;
            }
            
            this.attackTimer++;
            if (this.attackTimer >= 60) {
                this.attack();
                this.attackTimer = 0;
                this.attackPattern = (this.attackPattern + 1) % 3;
            }
        }
        
        this.glowPhase += 0.1;
    }

    attack() {
        const patterns = [
            // Pattern 1: Spread shot
            () => {
                for (let i = -2; i <= 2; i++) {
                    bullets.push(new Bullet(this.x, this.y + this.h/2, 5, '#f55', false, i * 2));
                }
            },
            // Pattern 2: Aimed shot
            () => {
                const angle = Math.atan2(player.y - this.y, player.x - this.x);
                const vx = Math.cos(angle) * 7;
                const vy = Math.sin(angle) * 7;
                bullets.push(new Bullet(this.x, this.y + this.h/2, vy, '#f80', false, vx));
            },
            // Pattern 3: Circle burst
            () => {
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    const vx = Math.cos(angle) * 5;
                    const vy = Math.sin(angle) * 5;
                    bullets.push(new Bullet(this.x, this.y, vy, '#f0f', false, vx));
                }
            }
        ];
        patterns[this.attackPattern]();
    }

    draw() {
        ctx.save();
        
        // Glow effect
        const glow = 20 + Math.sin(this.glowPhase) * 10;
        ctx.shadowColor = '#f00';
        ctx.shadowBlur = glow;
        
        // Corps du boss
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.w/2, this.h/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Yeux
        ctx.fillStyle = '#ff0';
        ctx.shadowColor = '#ff0';
        ctx.shadowBlur = 10;
        const eyeOffset = Math.sin(this.glowPhase * 2) * 5;
        ctx.beginPath();
        ctx.arc(this.x - 30, this.y + eyeOffset, 15, 0, Math.PI * 2);
        ctx.arc(this.x + 30, this.y + eyeOffset, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Barre de vie
        ctx.shadowBlur = 0;
        const barWidth = this.w;
        const barHeight = 10;
        const barX = this.x - barWidth/2;
        const barY = this.y - this.h/2 - 20;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = '#f00';
        ctx.fillRect(barX, barY, barWidth * (this.hp / this.maxHp), barHeight);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        ctx.restore();
    }
}

// ==================== ASTÉROÏDE ====================

class Asteroid {
    constructor(x, y, radius, level = 1) {
        this.x = x || Math.random() * (canvas.width - 100) + 50;
        this.y = y || -50;
        this.radius = radius || (60 - level * 15);
        this.level = level;
        this.w = this.radius * 2;
        this.h = this.radius * 2;
        this.speed = (Math.random() * 2 + 1) * baseSpeed * 0.8;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.color = `hsl(${Math.random() * 30 + 20}, 50%, ${Math.random() * 20 + 40}%)`;
        this.hp = 4 - level;
        this.markedForDeletion = false;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = this.speed;
    }

    update() {
        if (player) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist > 0) {
                this.x += (dx/dist) * this.speed * 0.02 * this.level * speedMultiplier;
            }
        }
        this.x += this.vx * speedMultiplier;
        this.y += this.vy * speedMultiplier;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (asteroidImg && asteroidImg.complete && asteroidImg.naturalWidth > 0) {
            ctx.drawImage(asteroidImg, -this.w/2, -this.h/2, this.w, this.h);
            ctx.restore();
            return;
        }

        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r = this.radius * (0.7 + Math.sin(Date.now() * 0.001 + i) * 0.3);
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    breakApart() {
        const pieces = [];
        for (let i = 0; i < 2; i++) {
            const newLevel = this.level + 1;
            if (newLevel <= 3) {
                const angle = (i / 2) * Math.PI * 2;
                const newAst = new Asteroid(this.x, this.y, null, newLevel);
                newAst.vx = Math.cos(angle) * 3;
                newAst.vy = Math.sin(angle) * 3 + this.speed;
                pieces.push(newAst);
            }
        }
        return pieces;
    }
}

// ==================== BULLET & PARTICLE & TRAIL ====================

class Bullet {
    constructor(x, y, vy, color, isPlayer, vx = 0) {
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.vx = vx;
        this.color = color;
        this.isPlayer = isPlayer;
        // Rayon plus gros pour les tirs ennemis
        this.r = isPlayer ? 5 : 8;
        this.markedForDeletion = false;
    }
    
    update() {
        this.y += this.vy * speedMultiplier;
        this.x += this.vx * speedMultiplier;
        
        // Créer une traînée
        if (this.isPlayer) {
            trails.push(new Trail(this.x, this.y, this.color, -this.vy * 0.5));
        }
        
        if (this.y < -50 || this.y > canvas.height + 50) this.markedForDeletion = true;
    }
    
    draw() {
        if (!this.isPlayer && this.vy > 0 && missileImg && missileImg.complete && missileImg.naturalWidth > 0) {
            const mw = 14;
            const mh = 24;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(Math.atan2(this.vy, this.vx || 0) - Math.PI/2);
            ctx.drawImage(missileImg, -mw/2, -mh/2, mw, mh);
            ctx.restore();
            return;
        }

        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

class Trail {
    constructor(x, y, color, speed) {
        this.x = x + (Math.random() - 0.5) * 6;
        this.y = y;
        this.vy = speed;
        this.life = 1.0;
        this.color = color;
        this.size = Math.random() * 4 + 2;
    }
    
    update() {
        this.y += this.vy;
        this.life -= 0.08;
        this.size *= 0.9;
    }
    
    draw() {
        ctx.globalAlpha = this.life * 0.6;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

class Particle {
    constructor(x, y, color, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type;
        
        if (type === 'spark') {
            this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 0.5) * 10;
            this.size = Math.random() * 3 + 1;
        } else {
            this.vx = (Math.random() - 0.5) * 5;
            this.vy = (Math.random() - 0.5) * 5;
            this.size = Math.random() * 4 + 2;
        }
        
        this.life = 1.0;
        this.decay = type === 'spark' ? 0.03 : 0.02;
        this.color = color;
        this.gravity = type === 'spark' ? 0.2 : 0;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= this.decay;
    }
    
    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        
        if (this.type === 'spark') {
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
    }
}

// ==================== GAME LOGIC ====================

function startGame(diff) {
    initAudio();
    // Vitesses réduites pour chaque difficulté
    if (diff === 'easy') baseSpeed = 0.6;    // Réduit de 0.8 → 0.6
    if (diff === 'medium') baseSpeed = 0.9;  // Réduit de 1.2 → 0.9
    if (diff === 'hard') baseSpeed = 1.2;    // Réduit de 1.5 → 1.2

    resetVariables();
    gameState = 'PLAY';
    menuScreen.classList.remove('active');
    victoryScreen.classList.remove('active');
    victoryShown = false;

    player = new Player();
    loop();
}

function resetVariables() {
    score = 0;
    lives = 3;  // ❤️ 3 vies
    enemiesDestroyed = 0;
    endlessMode = false;
    speedMultiplier = 1;
    lastLifeBonusScore = 0;
    combo = 0;
    comboTimer = 0;
    boss = null;
    bossSpawned = false;

    bullets = [];
    enemies = [];
    asteroids = [];
    particles = [];
    powerups = [];
    trails = [];

    enemySpawnTimer = 0;
    asteroidSpawnTimer = 0;
    powerupSpawnTimer = 0;

    updateHUD();
}

function resetGame() {
    stopBGM();
    // Recharger la page pour un état complètement propre
    location.reload();
}

// Nouvelle fonction pour redémarrer directement une partie
function restartGame() {
    initAudio();
    victoryScreen.classList.remove('active');
    menuScreen.classList.remove('active');
    
    resetVariables();
    gameState = 'PLAY';
    victoryShown = false;
    
    player = new Player();
    loop();
}

function togglePause() {
    if (gameState === 'PLAY') {
        gameState = 'PAUSE';
    } else if (gameState === 'PAUSE') {
        gameState = 'PLAY';
        loop();
    }
}

function closeOverlay() {
    victoryScreen.classList.remove('active');
    gameState = 'PLAY';
    endlessMode = true;
    loop();
}

function updateHUD() {
    scoreEl.innerText = score;
    livesEl.innerText = lives;
    enemyCountEl.innerText = endlessMode ? "∞" : Math.max(0, enemyPoolTotal - enemiesDestroyed);
    
    // Combo display
    if (comboEl) {
        if (combo > 1) {
            comboEl.style.display = 'block';
            comboEl.innerHTML = `COMBO x${combo} <span style="color: ${getComboColor(combo)}">+${getComboMultiplier(combo)}x</span>`;
        } else {
            comboEl.style.display = 'none';
        }
    }
}

function getComboMultiplier() {
    return Math.min(combo, COMBO_MAX);
}

function getComboColor(combo) {
    if (combo >= 10) return '#f0f';
    if (combo >= 5) return '#f80';
    if (combo >= 3) return '#ff0';
    return '#0ff';
}

function checkLifeBonus() {
    if (score >= lastLifeBonusScore + 5000) {
        lives++;
        lastLifeBonusScore = score;
        playSound('bonus');
        console.log('❤️ +1 VIE ! Score:', score, '| Vies:', lives);
    }
}

function checkVictoryCondition() {
    if (!endlessMode && enemiesDestroyed >= enemyPoolTotal && !boss && !bossSpawned) {
        // Spawn le boss
        bossSpawned = true;
        boss = new Boss();
        playSound('bossSpawn');
    } else if (!endlessMode && boss && boss.markedForDeletion && !victoryShown) {
        endlessMode = true;
        victoryShown = true;
        victoryScreen.classList.add('active');
        playSound('bonus');
    }
}

function createExplosion(x, y, color, count, type = 'normal') {
    for (let i = 0; i < count; i++) {
        const pType = type === 'big' && i % 3 === 0 ? 'spark' : 'normal';
        particles.push(new Particle(x, y, color, pType));
    }
}

function checkCollisions() {
    // Player bullets
    bullets.forEach(b => {
        if (b.isPlayer && b.vy < 0) {
            // vs Ennemis
            enemies.forEach(e => {
                if (!b.markedForDeletion && !e.markedForDeletion &&
                    b.x > e.x - e.w/2 && b.x < e.x + e.w/2 &&
                    b.y > e.y - e.h/2 && b.y < e.y + e.h/2) {
                    b.markedForDeletion = true;
                    e.hp--;
                    if (e.hp <= 0) {
                        e.markedForDeletion = true;
                        createExplosion(e.x, e.y, e.color, 20);
                        playSound('explosion');
                        addScore(e.isSpecial ? 500 : 100);
                        enemiesDestroyed++;
                        checkLifeBonus();
                        checkVictoryCondition();

                        // Chance de drop powerup (10% dont 10% de coeurs)
                        if (Math.random() < 0.10) {
                            powerups.push(new PowerUp(e.x, e.y));
                        }
                    }
                }
            });

            // vs Boss
            if (boss && !boss.markedForDeletion &&
                b.x > boss.x - boss.w/2 && b.x < boss.x + boss.w/2 &&
                b.y > boss.y - boss.h/2 && b.y < boss.y + boss.h/2) {
                b.markedForDeletion = true;
                boss.hp--;
                createExplosion(b.x, b.y, '#f80', 5);
                playSound('hit');
                if (boss.hp <= 0) {
                    boss.markedForDeletion = true;
                    createExplosion(boss.x, boss.y, '#f00', 100, 'big');
                    playSound('bigExplosion');
                    addScore(5000);
                    lives++;  // ❤️ +1 vie après le Boss
                    playSound('bonus');
                    console.log('👑 BOSS VAINCU ! +1 vie | Vies:', lives);
                    checkVictoryCondition();
                }
            }

            // vs Astéroïdes
            asteroids.forEach(a => {
                if (!b.markedForDeletion && !a.markedForDeletion) {
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < a.radius + b.r) {
                        b.markedForDeletion = true;
                        a.hp--;
                        if (a.hp <= 0) {
                            a.markedForDeletion = true;
                            createExplosion(a.x, a.y, '#888', 20);
                            playSound('explosion');
                            a.breakApart().forEach(p => asteroids.push(p));
                            addScore(50 * a.level);
                            checkLifeBonus();
                        }
                    }
                }
            });
        } else if (!b.isPlayer && b.vy > 0) {
            // Tir ennemi vs Joueur
            if (!b.markedForDeletion &&
                b.x > player.x - player.w/2 && b.x < player.x + player.w/2 &&
                b.y > player.y - player.h/2 && b.y < player.y + player.h/2) {
                b.markedForDeletion = true;
                player.takeDamage();
            }
        }
    });

    // Ennemi vs Joueur
    enemies.forEach(e => {
        if (!e.markedForDeletion &&
            player.x > e.x - e.w/2 - 10 && player.x < e.x + e.w/2 + 10 &&
            player.y > e.y - e.h/2 - 10 && player.y < e.y + e.h/2 + 10) {
        e.markedForDeletion = true;
            player.takeDamage();
        }
    });

    // Boss vs Joueur
    if (boss && !boss.markedForDeletion &&
        player.x > boss.x - boss.w/2 && player.x < boss.x + boss.w/2 &&
        player.y > boss.y - boss.h/2 && player.y < boss.y + boss.h/2) {
        player.takeDamage();
    }

    // Astéroïde vs Joueur
    asteroids.forEach(a => {
        if (!a.markedForDeletion) {
            const dx = player.x - a.x;
            const dy = player.y - a.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < a.radius + player.w/2) {
                a.markedForDeletion = true;
                createExplosion(a.x, a.y, '#888', 20);
                playSound('explosion');
                player.takeDamage();
            }
        }
    });

    // Powerups vs Joueur
    powerups.forEach(p => {
        if (!p.markedForDeletion &&
            player.x > p.x - p.w/2 && player.x < p.x + p.w/2 &&
            player.y > p.y - p.h/2 && player.y < p.y + p.h/2) {
            p.markedForDeletion = true;
            player.activatePowerup(p.type);
            addScore(50);
        }
    });
}

function addScore(points) {
    combo++;
    comboTimer = COMBO_WINDOW;
    const multiplier = getComboMultiplier();
    score += points * multiplier;
    
    if (multiplier >= 5) {
        playSound('combo');
    }
    
    updateHUD();
}

function gameOver() {
    stopBGM();
    resetGame();
}

function loop() {
    if (gameState !== 'PLAY') return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    // Gestion du combo
    if (comboTimer > 0) {
        comboTimer--;
        if (comboTimer <= 0) {
            combo = 0;
        }
    }

    // Spawn Ennemis
    if (!endlessMode && enemiesDestroyed >= enemyPoolTotal && !boss) {
        // Attendre le boss
    } else if (!boss || boss.markedForDeletion) {
        enemySpawnTimer++;
        if (enemySpawnTimer > 60 / speedMultiplier) {
            if (Math.random() < 0.05) {
                enemies.push(new SunEnemy());
            } else {
                enemies.push(new Enemy(Math.random() < 0.1));
            }
            enemySpawnTimer = 0;
        }
    }

    // Spawn Astéroïdes
    asteroidSpawnTimer++;
    if (asteroidSpawnTimer > 180 / speedMultiplier) {
        asteroids.push(new Asteroid());
        asteroidSpawnTimer = 0;
    }

    // Spawn Powerups
    powerupSpawnTimer++;
    if (powerupSpawnTimer > 600 / speedMultiplier) {
        if (Math.random() < 0.3) {
            powerups.push(new PowerUp(Math.random() * canvas.width, -30));
        }
        powerupSpawnTimer = 0;
    }

    // Update & Draw
    player.update();
    player.draw();

    trails.forEach((t, i) => { t.update(); t.draw(); if (t.life <= 0) trails.splice(i, 1); });
    bullets.forEach((b, i) => { b.update(); b.draw(); if (b.markedForDeletion) bullets.splice(i, 1); });
    enemies.forEach((e, i) => { e.update(); e.draw(); if (e.y > canvas.height || e.markedForDeletion) enemies.splice(i, 1); });
    
    if (boss) {
        boss.update();
        boss.draw();
        if (boss.markedForDeletion) boss = null;
    }
    
    asteroids.forEach((a, i) => { a.update(); a.draw(); if (a.y > canvas.height + a.radius || a.markedForDeletion) asteroids.splice(i, 1); });
    particles.forEach((p, i) => { p.update(); p.draw(); if (p.life <= 0) particles.splice(i, 1); });
    powerups.forEach((p, i) => { p.update(); p.draw(); if (p.markedForDeletion) powerups.splice(i, 1); });

    checkCollisions();
    updateHUD();
    requestAnimationFrame(loop);
}

// ==================== START ====================

resize();
initStars();
console.log('🚀 Space Defender Ultimate prêt !');
console.log('❤️ +1 vie tous les 2000 points');
console.log('⚡ Power-ups disponibles: Triple, Bouclier, Vitesse, Coeur');
console.log('👑 Détruisez 80 ennemis pour affronter le BOSS !');
