
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector('#displayText').style.display = 'flex';
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie';
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
  }
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

// New game
function resetGame() {
  // Reset player properties
  player.position = { x: 50, y: 50 }; // Set initial player position within canvas boundaries
  player.velocity = { x: 0, y: 0 };
  player.health = 100;
  player.dead = false;
  player.switchSprite('idle');

  // Reset enemy properties
  enemy.position = { x: 400, y: 100 }; // Set initial enemy position within canvas boundaries
  enemy.velocity = { x: 0, y: 0 };
  enemy.health = 100;
  enemy.dead = false;
  enemy.switchSprite('idle');

  // Reset timer and UI elements
  timer = 60;
  document.querySelector('#timer').innerHTML = timer;
  document.querySelector('#playerHealth').style.width = player.health + '%';
  document.querySelector('#enemyHealth').style.width = enemy.health + '%';
  document.querySelector('#displayText').style.display = 'none';

  // Restart timer
  decreaseTimer();
}