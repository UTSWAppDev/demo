let birdX = 50;
let birdY = 200;
let isGameStarted = false;
const birdRadius = 10;
const gravity = 0.5;
let velocity = 0;
let pipes = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function drawBird() {
  ctx.beginPath();
  ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.closePath();
}

function updateBirdPosition() {
  velocity += gravity;
  birdY += velocity;
}

function init() {
  if (isGameStarted) {
    return;
  }
  isGameStarted = true;
  setInterval(gameLoop, 20);
  pipes.push(new Pipe(canvas.width, Math.random() * (canvas.height - 200)));
}

function gameLoop() {
  updateBirdPosition();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  pipes.forEach((pipe) => {
    pipe.updatePosition();
    pipe.draw();
    if (pipe.checkCollision()) {
      endGame();
    }
    if (pipe.isOffscreen()) {
      pipes.splice(pipes.indexOf(pipe), 1);
      pipes.push(new Pipe(canvas.width, Math.random() * (canvas.height - 200)));
      score += 1;
      updateScore();
    }
  });
  if (birdY + birdRadius >= canvas.height) {
    endGame();
  }
}

function endGame() {
  clearInterval(gameLoop);
  alert('Game Over');
}

document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    velocity = -10;
    init();
  }
});

class Pipe {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 200;
    this.speed = 5;
  }

  updatePosition() {
    this.x -= this.speed;
  }

  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, 0, this.width, this.y);
    ctx.fillRect(this.x, this.y + this.height, this.width, canvas.height - this.y - this.height);
  }

  checkCollision() {
    if (birdX + birdRadius > this.x && birdX - birdRadius < this.x + this.width) {
      if (birdY - birdRadius < this.y || birdY + birdRadius > this.y + this.height) {
        return true;
      }
    }
    return false;
  }

  isOffscreen() {
    return this.x + this.width < 0;
  }
}
