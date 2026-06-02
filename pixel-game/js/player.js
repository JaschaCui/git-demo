import { rectCollision, Particle } from './utils.js';

export class Player {
    constructor(x, y) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 32;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = -12;
        this.gravity = 0.5;
        this.isJumping = false;
        this.isOnGround = false;
        this.lives = 3;
        this.maxLives = 3;
        this.score = 0;
        this.coins = 0;
        this.direction = 1;
        this.isHurt = false;
        this.hurtTimer = 0;
        this.invincible = false;
        this.invincibleTimer = 0;
        
        this.keys = {
            left: false,
            right: false,
            jump: false
        };
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isOnGround = false;
        this.lives = this.maxLives;
        this.score = 0;
        this.coins = 0;
        this.direction = 1;
        this.isHurt = false;
        this.hurtTimer = 0;
        this.invincible = false;
        this.invincibleTimer = 0;
    }

    handleInput(e, isKeyDown) {
        switch(e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = isKeyDown;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keys.right = isKeyDown;
                break;
            case 'Space':
            case 'KeyW':
            case 'ArrowUp':
                this.keys.jump = isKeyDown;
                break;
        }
    }

    update(map, audioManager) {
        if (this.keys.left) {
            this.velocityX = -this.speed;
            this.direction = -1;
        } else if (this.keys.right) {
            this.velocityX = this.speed;
            this.direction = 1;
        } else {
            this.velocityX *= 0.8;
            if (Math.abs(this.velocityX) < 0.1) this.velocityX = 0;
        }

        if (this.keys.jump && this.isOnGround && !this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
            this.isOnGround = false;
            if (audioManager) audioManager.playJump();
        }

        this.velocityY += this.gravity;
        if (this.velocityY > 15) this.velocityY = 15;

        this.x += this.velocityX;
        this.handlePlatformCollision(map, 'x');

        this.y += this.velocityY;
        this.handlePlatformCollision(map, 'y');

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > map.width) this.x = map.width - this.width;

        if (this.y > map.height) {
            this.takeDamage(audioManager);
            this.respawn();
        }

        if (this.isHurt) {
            this.hurtTimer--;
            if (this.hurtTimer <= 0) {
                this.isHurt = false;
            }
        }

        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }
    }

    handlePlatformCollision(map, axis) {
        this.isOnGround = false;

        for (const platform of map.platforms) {
            if (rectCollision(this, platform)) {
                if (axis === 'y') {
                    if (this.velocityY > 0) {
                        this.y = platform.y - this.height;
                        this.velocityY = 0;
                        this.isOnGround = true;
                        this.isJumping = false;
                    } else if (this.velocityY < 0) {
                        this.y = platform.y + platform.height;
                        this.velocityY = 0;
                    }
                } else {
                    if (this.velocityX > 0) {
                        this.x = platform.x - this.width;
                    } else if (this.velocityX < 0) {
                        this.x = platform.x + platform.width;
                    }
                }
            }
        }
    }

    checkCoinCollection(map, audioManager) {
        for (const coin of map.coins) {
            if (!coin.collected && rectCollision(this, coin)) {
                coin.collected = true;
                this.score += 100;
                this.coins++;
                if (audioManager) audioManager.playCoin();
                
                for (let i = 0; i < 8; i++) {
                    map.addParticle(new Particle(
                        coin.x + 8,
                        coin.y + 8,
                        '#ffd700'
                    ));
                }
            }
        }
    }

    checkHeartCollection(map, audioManager) {
        for (const heart of map.hearts) {
            if (!heart.collected && rectCollision(this, heart)) {
                heart.collected = true;
                if (this.lives < this.maxLives) {
                    this.lives++;
                }
                if (audioManager) audioManager.playCoin();
            }
        }
    }

    checkGoal(map) {
        return this.x + this.width > map.goalX && 
               this.x < map.goalX + 40 &&
               this.y + this.height > map.goalY;
    }

    takeDamage(audioManager) {
        if (this.invincible) return;
        
        this.lives--;
        this.isHurt = true;
        this.hurtTimer = 30;
        this.invincible = true;
        this.invincibleTimer = 90;
        
        if (audioManager) audioManager.playHurt();
    }

    respawn() {
        this.x = this.startX;
        this.y = this.startY;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }

        const x = Math.floor(this.x - cameraX);
        const y = Math.floor(this.y);

        if (this.isHurt) {
            ctx.fillStyle = '#ff6b6b';
        } else {
            ctx.fillStyle = '#3498db';
        }

        ctx.fillRect(x + 4, y + 8, 16, 16);
        ctx.fillRect(x + 6, y + 4, 12, 6);

        ctx.fillStyle = '#2980b9';
        ctx.fillRect(x + 4, y + 20, 16, 12);
        
        ctx.fillStyle = '#1a1a2e';
        const eyeOffset = this.direction > 0 ? 4 : 0;
        ctx.fillRect(x + 8 + eyeOffset, y + 8, 3, 3);
        ctx.fillRect(x + 14 + eyeOffset, y + 8, 3, 3);

        if (this.direction < 0) {
            ctx.fillStyle = '#5dade2';
            ctx.fillRect(x + 4, y + 22, 4, 8);
        } else {
            ctx.fillStyle = '#5dade2';
            ctx.fillRect(x + 16, y + 22, 4, 8);
        }

        ctx.strokeStyle = '#2070a0';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 4, y + 8, 16, 16);
    }
}
