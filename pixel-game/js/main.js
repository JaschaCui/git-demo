import { Player } from './player.js';
import { EnemyManager } from './enemy.js';
import { GameMap } from './map.js';
import { AudioManager } from './utils.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.state = 'menu';
        this.cameraX = 0;
        
        this.audioManager = new AudioManager();
        
        this.map = new GameMap();
        this.player = new Player(50, 380);
        this.enemyManager = new EnemyManager();
        
        this.screens = {
            menu: document.getElementById('menu-screen'),
            pause: document.getElementById('pause-screen'),
            gameover: document.getElementById('gameover-screen'),
            win: document.getElementById('win-screen')
        };
        
        this.hud = document.getElementById('hud');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.enemyManager.init(this.map);
        this.gameLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.state === 'playing') {
                this.player.handleInput(e, true);
                if (e.code === 'Escape') {
                    this.pauseGame();
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.state === 'playing') {
                this.player.handleInput(e, false);
            }
        });

        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('resume-btn').addEventListener('click', () => {
            this.resumeGame();
        });

        document.getElementById('quit-btn').addEventListener('click', () => {
            this.returnToMenu();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('menu-btn').addEventListener('click', () => {
            this.returnToMenu();
        });

        document.getElementById('win-restart-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('win-menu-btn').addEventListener('click', () => {
            this.returnToMenu();
        });
    }

    async startGame() {
        await this.audioManager.init();
        
        this.map.reset();
        this.player.reset();
        this.enemyManager.reset();
        this.cameraX = 0;
        
        this.showScreen(null);
        this.hud.classList.add('visible');
        
        this.state = 'playing';
    }

    pauseGame() {
        this.state = 'paused';
        this.showScreen('pause');
    }

    resumeGame() {
        this.state = 'playing';
        this.showScreen(null);
    }

    returnToMenu() {
        this.state = 'menu';
        this.showScreen('menu');
        this.hud.classList.remove('visible');
    }

    gameOver() {
        this.state = 'gameover';
        this.audioManager.playGameOver();
        document.getElementById('final-score').textContent = `得分: ${this.player.score}`;
        this.showScreen('gameover');
        this.hud.classList.remove('visible');
    }

    victory() {
        this.state = 'win';
        this.audioManager.playVictory();
        document.getElementById('win-score').textContent = `得分: ${this.player.score}`;
        this.showScreen('win');
        this.hud.classList.remove('visible');
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        if (screenName && this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
        }
    }

    updateCamera() {
        const targetX = this.player.x - this.canvas.width / 3;
        this.cameraX += (targetX - this.cameraX) * 0.1;
        
        if (this.cameraX < 0) this.cameraX = 0;
        if (this.cameraX > this.map.width - this.canvas.width) {
            this.cameraX = this.map.width - this.canvas.width;
        }
    }

    updateHUD() {
        const hudHTML = `
            <div class="hud-left">
                <div class="hud-item">
                    <svg viewBox="0 0 24 24" fill="#ffd700"><circle cx="12" cy="12" r="10"/></svg>
                    <span>${this.player.score}</span>
                </div>
                <div class="hud-item">
                    <svg viewBox="0 0 24 24" fill="#ffd700"><circle cx="12" cy="12" r="8"/></svg>
                    <span>x${this.player.coins}</span>
                </div>
            </div>
            <div class="hud-right">
                <div class="hud-item">
                    ${this.renderHearts()}
                </div>
            </div>
        `;
        
        let existingHud = document.getElementById('hud');
        if (existingHud) {
            existingHud.innerHTML = hudHTML;
        } else {
            const newHud = document.createElement('div');
            newHud.id = 'hud';
            newHud.className = 'visible';
            newHud.innerHTML = hudHTML;
            document.getElementById('game-container').appendChild(newHud);
        }
    }

    renderHearts() {
        let hearts = '';
        for (let i = 0; i < this.player.maxLives; i++) {
            if (i < this.player.lives) {
                hearts += '<svg viewBox="0 0 24 24" fill="#e74c3c"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
            } else {
                hearts += '<svg viewBox="0 0 24 24" fill="#444"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
            }
        }
        return hearts;
    }

    update() {
        if (this.state !== 'playing') return;

        this.player.update(this.map, this.audioManager);
        this.enemyManager.update(this.map);
        this.map.updateParticles();
        
        this.player.checkCoinCollection(this.map, this.audioManager);
        this.player.checkHeartCollection(this.map, this.audioManager);
        
        if (this.enemyManager.checkCollisions(this.player)) {
            this.player.takeDamage(this.audioManager);
        }

        if (this.player.lives <= 0) {
            this.gameOver();
            return;
        }

        if (this.player.checkGoal(this.map)) {
            this.victory();
            return;
        }

        this.updateCamera();
        this.updateHUD();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.state === 'menu') return;

        this.map.drawBackground(this.ctx, this.cameraX);
        this.map.drawPlatforms(this.ctx, this.cameraX);
        this.map.drawCoins(this.ctx, this.cameraX);
        this.map.drawHearts(this.ctx, this.cameraX);
        this.enemyManager.draw(this.ctx, this.cameraX);
        this.player.draw(this.ctx, this.cameraX);
        this.map.drawParticles(this.ctx, this.cameraX);
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

const game = new Game();
