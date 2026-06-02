export function rectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

export class AudioManager {
    constructor() {
        this.context = null;
        this.sounds = {};
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.initialized = true;
    }

    playTone(frequency, duration, type = 'square', volume = 0.3) {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
        
        gainNode.gain.setValueAtTime(volume, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    }

    playJump() {
        if (!this.context) return;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.connect(gain);
        gain.connect(this.context.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.context.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        osc.start();
        osc.stop(this.context.currentTime + 0.1);
    }

    playCoin() {
        if (!this.context) return;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.connect(gain);
        gain.connect(this.context.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(988, this.context.currentTime);
        osc.frequency.setValueAtTime(1319, this.context.currentTime + 0.05);
        gain.gain.setValueAtTime(0.2, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);
        osc.start();
        osc.stop(this.context.currentTime + 0.15);
    }

    playHurt() {
        if (!this.context) return;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.connect(gain);
        gain.connect(this.context.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.context.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
        osc.start();
        osc.stop(this.context.currentTime + 0.3);
    }

    playGameOver() {
        if (!this.context) return;
        const notes = [392, 349, 330, 262];
        notes.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.connect(gain);
            gain.connect(this.context.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, this.context.currentTime + i * 0.2);
            gain.gain.setValueAtTime(0.2, this.context.currentTime + i * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + i * 0.2 + 0.18);
            osc.start(this.context.currentTime + i * 0.2);
            osc.stop(this.context.currentTime + i * 0.2 + 0.2);
        });
    }

    playVictory() {
        if (!this.context) return;
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.connect(gain);
            gain.connect(this.context.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, this.context.currentTime + i * 0.15);
            gain.gain.setValueAtTime(0.15, this.context.currentTime + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + i * 0.15 + 0.3);
            osc.start(this.context.currentTime + i * 0.15);
            osc.stop(this.context.currentTime + i * 0.15 + 0.3);
        });
    }
}

export class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 4;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8 - 3;
        this.gravity = 0.3;
        this.life = 1;
        this.decay = 0.03;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.life -= this.decay;
    }

    draw(ctx, cameraX) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.fillRect(
            Math.floor(this.x - cameraX),
            Math.floor(this.y),
            this.size,
            this.size
        );
        ctx.globalAlpha = 1;
    }

    isDead() {
        return this.life <= 0;
    }
}
