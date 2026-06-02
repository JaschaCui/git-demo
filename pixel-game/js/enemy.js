import { rectCollision } from './utils.js';

export class Enemy {
    constructor(x, y, type = 'patrol') {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.width = 24;
        this.height = 24;
        this.type = type;
        this.direction = 1;
        this.speed = type === 'patrol' ? 2 : 0;
        this.jumpTimer = 0;
        this.jumpInterval = type === 'jumping' ? 60 : 0;
        this.jumpForce = -8;
        this.gravity = 0.4;
        this.velocityY = 0;
        this.patrolRange = 80;
        this.isOnGround = false;
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = 1;
        this.velocityY = 0;
        this.isOnGround = false;
    }

    update(map) {
        if (this.type === 'patrol') {
            this.x += this.speed * this.direction;

            if (this.x <= this.startX - this.patrolRange) {
                this.direction = 1;
            } else if (this.x >= this.startX + this.patrolRange) {
                this.direction = -1;
            }
        } else if (this.type === 'jumping') {
            this.jumpTimer++;
            if (this.jumpTimer >= this.jumpInterval && this.isOnGround) {
                this.velocityY = this.jumpForce;
                this.isOnGround = false;
                this.jumpTimer = 0;
            }
        }

        if (this.type === 'jumping') {
            this.velocityY += this.gravity;
            if (this.velocityY > 10) this.velocityY = 10;
            this.y += this.velocityY;

            for (const platform of map.platforms) {
                if (rectCollision(this, platform)) {
                    if (this.velocityY > 0) {
                        this.y = platform.y - this.height;
                        this.velocityY = 0;
                        this.isOnGround = true;
                    }
                }
            }
        }
    }

    draw(ctx, cameraX) {
        const x = Math.floor(this.x - cameraX);
        const y = Math.floor(this.y);

        if (x + this.width < 0 || x > ctx.canvas.width) return;

        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x + 2, y + 4, 20, 16);
        ctx.fillRect(x + 4, y, 16, 6);

        ctx.fillStyle = '#c0392b';
        ctx.fillRect(x + 2, y + 16, 20, 8);
        
        ctx.fillStyle = '#1a1a2e';
        const eyeOffset = this.direction > 0 ? 4 : 0;
        ctx.fillRect(x + 6 + eyeOffset, y + 6, 4, 4);
        ctx.fillRect(x + 14 + eyeOffset, y + 6, 4, 4);
        
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(x + 7 + eyeOffset, y + 7, 2, 2);
        ctx.fillRect(x + 15 + eyeOffset, y + 7, 2, 2);

        ctx.fillStyle = '#ec7063';
        ctx.fillRect(x + 8, y + 14, 8, 2);

        if (this.type === 'patrol') {
            ctx.fillStyle = '#e74c3c';
            if (this.direction < 0) {
                ctx.fillRect(x, y + 8, 4, 12);
            } else {
                ctx.fillRect(x + 20, y + 8, 4, 12);
            }
        }
    }

    checkCollision(player) {
        return rectCollision(this, player);
    }
}

export class EnemyManager {
    constructor() {
        this.enemies = [];
    }

    init(map) {
        this.enemies = [
            new Enemy(400, 356, 'patrol'),
            new Enemy(750, 356, 'jumping'),
            new Enemy(1100, 326, 'patrol'),
            new Enemy(1350, 256, 'jumping'),
        ];
    }

    reset() {
        this.enemies.forEach(enemy => enemy.reset());
    }

    update(map) {
        this.enemies.forEach(enemy => enemy.update(map));
    }

    draw(ctx, cameraX) {
        this.enemies.forEach(enemy => enemy.draw(ctx, cameraX));
    }

    checkCollisions(player) {
        for (const enemy of this.enemies) {
            if (enemy.checkCollision(player)) {
                return true;
            }
        }
        return false;
    }
}
