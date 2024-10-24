const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20; // Size of each box in the game
let score = 0;
let baseSpeed = 200; // Starting speed
let speedIncrease = 20; // Decrease the timeout by this value for each score increase
let minSpeed = 50; // Minimum speed lim
let gameOver = false; // Initialize game over status
let foodImageLoaded = false; // Initialize food image loaded status
let foodImage = new Image(); // Create a new image for food


// Snake initial settings
let snake = [{ x: box * 5, y: box * 5 }];
let direction = null;

// Food position
let food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
};

// Start game function
function startGame() {
    document.addEventListener('keydown', changeDirection);
    score = 0;
    snake = [{ x: box * 5, y: box * 5 }];
    direction = 'RIGHT'; // Start moving to the right
    gameOver = false; // Reset game over status
    placeFood();
    draw();
}

// Change direction based on key press
function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Check if the game is over
    if (gameOver) {
        endGame(); // Call endGame to display the game over message
        return; // Stop further drawing and exit the function
    }

    // Draw food
    ctx.fillStyle = 'red'; // Color for the food
    ctx.fillRect(food.x, food.y, box, box); // Draw the food rectangle

    // Move snake
    const head = { x: snake[0].x, y: snake[0].y };

    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    // Check for collisions with food
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
        
        // Increase speed based on score
        baseSpeed = Math.max(minSpeed, baseSpeed - speedIncrease * Math.floor(score / 5)); // Decrease timeout for every 5 points scored
    } else {
        snake.pop(); // Remove the tail if not eating food
    }
    //Collision with walls
    if (head.x < 0) {
        head.x = 0; // Keep head at wall position
        direction = 'UP'; // Change direction to up
    } else if (head.x >= canvas.width) {
        head.x = canvas.width - box; // Keep head at wall position
        direction = 'DOWN'; // Change direction to down
    } else if (head.y < 0) {
        head.y = 0; // Keep head at wall position
        direction = 'RIGHT'; // Change direction to right
    } else if (head.y >= canvas.height) {
        head.y = canvas.height - box; // Keep head at wall position
        direction = 'LEFT'; // Change direction to left
    }

    // Check for collisions with itself
    if (collision(head)) {
        endGame(); // Call endGame function if the snake collides with itself
        return; // Stop further drawing
    }

    snake.unshift(head); // Add the new head to the snake
    drawSnake();
    document.getElementById('score').innerText = 'Score: ' + score;

    setTimeout(draw, baseSpeed); // Use the current speed
}


function endGame() {
    gameOver = true; // Set game over status
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for game over screen
    ctx.fillStyle = 'white'; // Set text color to white
    ctx.font = '40px Arial';
    ctx.fillText('Game Over!', canvas.width / 4, canvas.height / 2 - 20); // Center "Game Over!" text
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, canvas.width / 2.8, canvas.height / 2 + 20); // Center score text below "Game Over!"
    //document.getElementById('playAgainButton').style.display = 'block'; // Show play again button
}


// Place food in a random position
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / box)) * box;
    food.y = Math.floor(Math.random() * (canvas.height / box)) * box;
}
// Draw the snake
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'blue' : 'yellow'; 
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'black'; // Outline for each box
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
}

// Check for collisions with itself
function collision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true; // Collision detected
        }
    }
    return false;
}

// Call startGame() to begin the game
startGame();