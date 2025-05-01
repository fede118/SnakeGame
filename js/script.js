import Menu from './menu/menu.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const gameOverScreen = document.getElementById('game-over');
const gameContainer = document.getElementById('game-container');
const menu = document.getElementById('menu');
menu.style.display = 'block';
const pauseScreen = document.getElementById('pause-screen');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let speed;
let isPaused = false;
let pendingDirection = null;

// Difficulty speeds (frames per second)
const difficultySpeeds = {
    easy: 5,   // Slower
    medium: 10, // Current speed (Medium)
    hard: 15   // Faster
};
const difficultyMenu = new Menu(
    [
        { id: 'easy', action: () => startGame('easy') },
        { id: 'medium', action: () => startGame('medium') },
        { id: 'hard', action: () => startGame('hard') }
    ]
);

const gameOverMenu = new Menu(
    [
        { id: 'restart', action: restartGame },
        { id: 'main-menu', action: goToMainMenu }
    ]
);

const pauseMenu = new Menu(
    [
        { id: 'resume', action: resumeGame },
        { id: 'main-menu', action: goToMainMenu }
    ]
);

document.addEventListener('keydown', (event) => {
    if (menu.style.display === 'block') {
        difficultyMenu.handleInput(event);
    } else if (gameOverScreen.style.display === 'block') {
        gameOverMenu.handleInput(event);
    } else if (pauseScreen.style.display === 'block') {
        if (event.key === 'Escape') {
            resumeGame();
        } else {
            pauseMenu.handleInput(event);
        }
    }
});

difficultyMenu.updateMenu();
gameOverMenu.updateMenu();
pauseMenu.updateMenu();

function startGame(difficulty) {
    menu.style.display = 'none';
    gameContainer.style.display = 'block';
    speed = difficultySpeeds[difficulty];
    resetGame();
    gameLoop = setInterval(game, 1000 / speed);
    document.addEventListener('keydown', gameHandler);
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverScreen.style.display = 'none';
    pauseScreen.style.display = 'none'; // Ensure pause screen is hidden on reset
    isPaused = false;
    clearInterval(gameLoop);
}

function restartGame() {
    resetGame();
    gameLoop = setInterval(game, 1000 / speed);
    document.addEventListener('keydown', gameHandler);
}

function goToMainMenu() {
    gameContainer.style.display = 'none';
    menu.style.display = 'block';
    resetGame();
    difficultyMenu.updateMenu();
    document.removeEventListener('keydown', gameHandler);
}

function togglePause() {
    if (!isPaused) {
        isPaused = true;
        clearInterval(gameLoop);
        pauseScreen.style.display = 'block';
        pauseMenu.updateMenu();
        document.removeEventListener('keydown', gameHandler);
    } else {
        resumeGame();
    }
}

function resumeGame() {
    isPaused = false;
    pauseScreen.style.display = 'none';
    gameLoop = setInterval(game, 1000 / speed);
    document.addEventListener('keydown', gameHandler);
}

function game() {
    // Apply pending direction if available
    if (pendingDirection) {
        dx = pendingDirection.dx;
        dy = pendingDirection.dy;
        pendingDirection = null; // Clear the queue
    }

    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check for collisions with the body (excluding the head itself)
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameLoop);
        finalScoreDisplay.textContent = score;
        gameOverScreen.style.display = 'block';
        gameOverMenu.updateMenu();
        document.removeEventListener('keydown', gameHandler);
        return;
    }

    // Check for collisions with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        clearInterval(gameLoop);
        finalScoreDisplay.textContent = score;
        gameOverScreen.style.display = 'block';
        gameOverMenu.updateMenu();
        document.removeEventListener('keydown', gameHandler);
        return;
    }

    // Add the new head to the snake
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        spawnFood();
    } else {
        snake.pop();
    }

    // Draw game
    ctx.fillStyle = '#1a2b1f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff00';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // Ensure food doesn't spawn on snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
    }
}

const gameHandler = (event) => {
    if (event.key === 'Escape') {
        togglePause();
        return;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
    }
    // Queue the new direction
    switch (event.key) {
        case 'ArrowUp':
            if (dy !== 1) { pendingDirection = { dx: 0, dy: -1 }; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { pendingDirection = { dx: 0, dy: 1 }; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { pendingDirection = { dx: -1, dy: 0 }; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { pendingDirection = { dx: 1, dy: 0 }; }
            break;
    }
};