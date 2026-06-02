export class GameMap {
    constructor(width = 1600, height = 480) {
        this.width = width;
        this.height = height;
        this.platforms = [];
        this.coins = [];
        this.hearts = [];
        this.goalX = width - 80;
        this.goalY = height - 100;
        this.particles = [];
        
        this.initLevel();
    }

    initLevel() {
        this.platforms = [
            { x: 0, y: 440, width: 300, height: 40 },
            { x: 350, y: 380, width: 120, height: 20 },
            { x: 520, y: 320, width: 100, height: 20 },
            { x: 680, y: 380, width: 150, height: 20 },
            { x: 880, y: 300, width: 120, height: 20 },
            { x: 1050, y: 350, width: 180, height: 20 },
            { x: 1280, y: 280, width: 100, height: 20 },
            { x: 1420, y: 380, width: 180, height: 100 },
        ];

        this.coins = [
            { x: 150, y: 400, width: 16, height: 16, collected: false },
            { x: 200, y: 400, width: 16, height: 16, collected: false },
            { x: 390, y: 340, width: 16, height: 16, collected: false },
            { x: 550, y: 280, width: 16, height: 16, collected: false },
            { x: 730, y: 340, width: 16, height: 16, collected: false },
            { x: 780, y: 340, width: 16, height: 16, collected: false },
            { x: 920, y: 260, width: 16, height: 16, collected: false },
            { x: 1100, y: 310, width: 16, height: 16, collected: false },
            { x: 1150, y: 310, width: 16, height: 16, collected: false },
            { x: 1300, y: 240, width: 16, height: 16, collected: false },
            { x: 1480, y: 340, width: 16, height: 16, collected: false },
        ];

        this.hearts = [
            { x: 600, y: 280, width: 16, height: 16, collected: false },
            { x: 1200, y: 310, width: 16, height: 16, collected: false },
        ];
    }

    addParticle(particle) {
        this.particles.push(particle);
    }

    updateParticles() {
        this.particles = this.particles.filter(p => {
            p.update();
            return !p.isDead();
        });
    }

    drawParticles(ctx, cameraX) {
        this.particles.forEach(p => p.draw(ctx, cameraX));
    }

    drawBackground(ctx, cameraX) {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, this.height);

        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const x = ((i * 73) % this.width - cameraX * 0.3) % ctx.canvas.width;
            const y = (i * 47) % (this.height * 0.6);
            const size = (i % 3) + 1;
            ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
        }

        const cloudPositions = [
            { x: 100, y: 60, w: 60 },
            { x: 400, y: 40, w: 80 },
            { x: 700, y: 70, w: 50 },
            { x: 1000, y: 50, w: 70 },
            { x: 1300, y: 80, w: 55 },
        ];
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        cloudPositions.forEach(cloud => {
            const cx = ((cloud.x - cameraX * 0.2) % (ctx.canvas.width + 100)) - 50;
            ctx.fillRect(Math.floor(cx), cloud.y, cloud.w, 20);
            ctx.fillRect(Math.floor(cx + 10), cloud.y - 10, cloud.w - 20, 10);
        });
    }

    drawPlatforms(ctx, cameraX) {
        ctx.fillStyle = '#4a7c59';
        ctx.strokeStyle = '#2d4a35';
        ctx.lineWidth = 2;

        this.platforms.forEach(platform => {
            const x = Math.floor(platform.x - cameraX);
            const y = Math.floor(platform.y);
            const w = platform.width;
            const h = platform.height;

            if (x + w < 0 || x > ctx.canvas.width) return;

            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);

            ctx.fillStyle = '#5a9c69';
            ctx.fillRect(x, y, w, 8);
            
            ctx.fillStyle = '#3a6c49';
            for (let i = 0; i < w; i += 16) {
                ctx.fillRect(x + i + 4, y + h - 8, 8, 4);
            }
            
            ctx.fillStyle = '#4a7c59';
        });

        this.drawGoal(ctx, cameraX);
    }

    drawGoal(ctx, cameraX) {
        const x = Math.floor(this.goalX - cameraX);
        const y = Math.floor(this.goalY);

        if (x < -50 || x > ctx.canvas.width + 50) return;

        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x + 10, y, 20, 60);
        
        ctx.fillStyle = '#a0522d';
        ctx.fillRect(x + 10, y, 20, 8);

        ctx.fillStyle = '#ffd700';
        const flagWave = Math.sin(Date.now() / 200) * 2;
        ctx.beginPath();
        ctx.moveTo(x + 30, y);
        ctx.lineTo(x + 60 + flagWave, y + 15);
        ctx.lineTo(x + 30, y + 30);
        ctx.closePath();
        ctx.fill();
    }

    drawCoins(ctx, cameraX) {
        const time = Date.now();
        
        this.coins.forEach(coin => {
            if (coin.collected) return;
            
            const x = Math.floor(coin.x - cameraX);
            const y = Math.floor(coin.y + Math.sin(time / 200 + coin.x) * 3);
            
            if (x + coin.width < 0 || x > ctx.canvas.width) return;

            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(x + 8, y + 8, 6, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ffed4a';
            ctx.beginPath();
            ctx.arc(x + 6, y + 6, 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#b8860b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x + 8, y + 8, 6, 0, Math.PI * 2);
            ctx.stroke();
        });
    }

    drawHearts(ctx, cameraX) {
        const time = Date.now();
        
        this.hearts.forEach(heart => {
            if (heart.collected) return;
            
            const x = Math.floor(heart.x - cameraX);
            const y = Math.floor(heart.y + Math.sin(time / 300 + heart.x) * 2);
            
            if (x + heart.width < 0 || x > ctx.canvas.width) return;

            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            const hx = x + 8;
            const hy = y + 5;
            ctx.moveTo(hx, hy + 3);
            ctx.bezierCurveTo(hx, hy, hx - 4, hy, hx - 4, hy + 3);
            ctx.bezierCurveTo(hx - 4, hy + 6, hx, hy + 10, hx, hy + 12);
            ctx.bezierCurveTo(hx, hy + 10, hx + 4, hy + 6, hx + 4, hy + 3);
            ctx.bezierCurveTo(hx + 4, hy, hx, hy, hx, hy + 3);
            ctx.fill();

            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(x + 5, y + 5, 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    reset() {
        this.coins.forEach(coin => coin.collected = false);
        this.hearts.forEach(heart => heart.collected = false);
        this.particles = [];
    }
}
