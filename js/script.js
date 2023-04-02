const canvas = document.querySelector('#snake');
const context = canvas.getContext('2d');

// Unit
const box = 32;

// Images
const ground = new Image();
ground.src = 'img/ground.png';

const foodImg = new Image();
foodImg.src = 'img/food3.png';

const noScoreImg = document.querySelector('#msg');

// Audio Files
const dead = new Audio();
const eat = new Audio();
const up = new Audio();
const left = new Audio();
const right = new Audio();
const down = new Audio();
const score0 = new Audio();

dead.src = 'audio/dead.mp3';
eat.src = 'audio/eat.mp3';
up.src = 'audio/up.mp3';
left.src = 'audio/left.mp3';
right.src = 'audio/right.mp3';
down.src = 'audio/down.mp3';
score0.src = 'audio/score0.mp3';

// Snake
let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box,
};

// Food
let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box,
};

// Snake Control
let d;

const startGame = () => {
  snake = [];
  snake[0] = {
    x: 9 * box,
    y: 10 * box,
  };
  d = undefined;
  score = 0;
  food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box,
  };
  game = setInterval(draw, 50);
  noScoreImg.innerHTML = '';
  const img = document.querySelector('#img');
  if (document.body.contains(img)) img.style.display = 'none';
  score0.pause();
  dead.pause();
};

document.addEventListener('keydown', direction);

function direction(event) {
  let key = event.keyCode;

  if ((key == 37 && d != 'RIGHT') || (key == 65 && d != 'D')) {
    d = 'LEFT';
    left.play();
  } else if ((key == 38 && d != 'DOWN') || (key == 87 && d != 'S')) {
    d = 'UP';
    up.play();
  } else if ((key == 39 && d != 'LEFT') || (key == 68 && d != 'A')) {
    d = 'RIGHT';
    right.play();
  } else if ((key == 40 && d != 'UP') || (key == 83 && d != 'W')) {
    d = 'DOWN';
    down.play();
  }
}

// Score
let score = 0;

// Collision
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      score0.currentTime = 0;
      score0.play();
      return true;
    }
  }
  return false;
}

// TH Canvas
function draw() {
  context.drawImage(ground, 0, 0);
  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = i == 0 ? '#fff' : '#333';
    context.fillRect(snake[i].x, snake[i].y, box, box);
    context.strokeStyle = 'transparent';
    context.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  context.drawImage(foodImg, food.x, food.y);

  // Head Position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Direction
  if (d == 'LEFT' || d == 'A') snakeX -= box;
  if (d == 'UP' || d == 'W') snakeY -= box;
  if (d == 'RIGHT' || d == 'D') snakeX += box;
  if (d == 'DOWN' || d == 'S') snakeY += box;

  // If The Snake Eats Food
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    eat.play();
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
  } else {
    // Remove Tail
    snake.pop();
  }

  // New Head
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // Game Over
  if (
    snakeX < box ||
    snakeX > 17 * box ||
    snakeY < 3 * box ||
    snakeY > 17 * box ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    if (score == 0) {
      score0.currentTime = 0;
      score0.play();
    }
    if (dead.play() && score != 0) {
      noScoreImg.innerHTML = 'Você perdeu';
    } else {
      noScoreImg.innerHTML = '<img src="../img/noScore.gif">';
    }
    dead.currentTime = 0;
  }

  snake.unshift(newHead);

  context.fillStyle = 'white';
  context.font = '45px Changa one';
  context.fillText(score, 2 * box, 1.6 * box);
}

// Call draw every 100 ms
let game = setInterval(draw, 50);

const playAgain = document.querySelector('.buttonLoser');

playAgain.addEventListener('click', () => {
  clearInterval(game);
  startGame();
});
