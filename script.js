const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 670,
    y: 184
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/wizard/idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 210
  },
  sprites: {
    idle: {
      imageSrc: './img/wizard/idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/wizard/run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/wizard/jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/wizard/fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/wizard/attack1.png',
      framesMax: 8
    },
    takeHit: {
      imageSrc: './img/wizard/takehit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/wizard/death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/kenji/idle.png',
  framesMax: 6,
  scale: 1.6,
  offset: {
    x: 100,
    y: 20
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/idle.png',
      framesMax: 6
    },
    run: {
      imageSrc: './img/kenji/run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/attack1.png',
      framesMax: 8
    },
    takeHit: {
      imageSrc: './img/kenji/takehit.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/kenji/death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -200,
      y: 50
    },
    width: 170,
    height: 50
  }
})

console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // Player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    if (player.position.x > 0) { // Ensure player stays within the left boundary
      player.velocity.x = -3;
      player.switchSprite('run');
    }
  } else if (keys.d.pressed && player.lastKey === 'd') {
    if (player.position.x + player.width < canvas.width) { // Ensure player stays within the right boundary
      player.velocity.x = 3;
      player.switchSprite('run');
    }
  } else {
    player.switchSprite('idle');
  }

  // Update player position within canvas boundaries
  player.position.x += player.velocity.x;
  player.position.x = Math.max(0, Math.min(player.position.x, canvas.width - player.height));

  // Player jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    if (enemy.position.x > 0) { // Ensure enemy stays within the left boundary
      enemy.velocity.x = -3;
      enemy.switchSprite('run');
    }
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    if (enemy.position.x + enemy.width < canvas.width) { // Ensure enemy stays within the right boundary
      enemy.velocity.x = 3;
      enemy.switchSprite('run');
    }
  } else {
    enemy.switchSprite('idle');
  }

  // Update enemy position within canvas boundaries
  enemy.position.x += enemy.velocity.x;
  enemy.position.x = Math.max(0, Math.min(enemy.position.x, canvas.width - enemy.height));

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'w':
        if (!player.isJumping) {
          player.velocity.y = -20;
          player.isJumping = true;
        }
        break;
      case ' ':
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        if (!enemy.isJumping) {
          enemy.velocity.y = -20;
          enemy.isJumping = true;
        }
        break;
      case 'ArrowDown':
        enemy.attack();
        break;
    }
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});

// New game 
window.addEventListener('keydown', (event) => {
  if (event.key === 'n' || event.key === 'N') {
    // Reload the page
    location.reload();
  }
});



/*
// Constants
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.9;

// Background
const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: './img/background.png'
});

// Shop
const shop = new Sprite({
  position: { x: 670, y: 184 },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
});

// Player
const player = new Fighter({
  position: { x: 50, y: 50 },
  velocity: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  imageSrc: './img/Evil Wizard 2/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: { x: 215, y: 210 },
  sprites: {
    idle: { imageSrc: './img/Evil Wizard 2/Idle.png', framesMax: 8 },
    run: { imageSrc: './img/Evil Wizard 2/Run.png', framesMax: 8 },
    jump: { imageSrc: './img/Evil Wizard 2/Jump.png', framesMax: 2 },
    fall: { imageSrc: './img/Evil Wizard 2/Fall.png', framesMax: 2 },
    attack1: { imageSrc: './img/Evil Wizard 2/Attack1.png', framesMax: 8 },
    takeHit: { imageSrc: './img/Evil Wizard 2/Take Hit.png', framesMax: 3 },
    death: { imageSrc: './img/Evil Wizard 2/Death.png', framesMax: 7 }
  },
  attackBox: { offset: { x: 100, y: 50 }, width: 160, height: 50 }
});

// Enemy
const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  color: 'blue',
  offset: { x: -50, y: 0 },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 6,
  scale: 1.6,
  offset: { x: 100, y: 20 },
  sprites: {
    idle: { imageSrc: './img/kenji/Idle.png', framesMax: 6 },
    run: { imageSrc: './img/kenji/Run.png', framesMax: 8 },
    jump: { imageSrc: './img/kenji/Jump.png', framesMax: 2 },
    fall: { imageSrc: './img/kenji/Fall.png', framesMax: 2 },
    attack1: { imageSrc: './img/kenji/Attack1.png', framesMax: 8 },
    takeHit: { imageSrc: './img/kenji/Take hit.png', framesMax: 4 },
    death: { imageSrc: './img/kenji/Death.png', framesMax: 7 }
  },
  attackBox: { offset: { x: -200, y: 50 }, width: 170, height: 50 }
});

// Keys
const keys = {
  a: { pressed: false },
  d: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false }
};

// Decrease timer
decreaseTimer();

// Animate function
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    if (player.position.x > 0) { // Ensure player stays within the left boundary
      player.velocity.x = -3;
      player.switchSprite('run');
    }
  } else if (keys.d.pressed && player.lastKey === 'd') {
    if (player.position.x + player.width < canvas.width) { // Ensure player stays within the right boundary
      player.velocity.x = 3;
      player.switchSprite('run');
    }
  } else {
    player.switchSprite('idle');
  }

  // Update player position within canvas boundaries
  player.position.x += player.velocity.x;
  player.position.x = Math.max(0, Math.min(player.position.x, canvas.width - player.height));

  // Player jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    if (enemy.position.x > 0) { // Ensure enemy stays within the left boundary
      enemy.velocity.x = -3;
      enemy.switchSprite('run');
    }
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    if (enemy.position.x + enemy.width < canvas.width) { // Ensure enemy stays within the right boundary
      enemy.velocity.x = 3;
      enemy.switchSprite('run');
    }
  } else {
    enemy.switchSprite('idle');
  }

  // Update enemy position within canvas boundaries
  enemy.position.x += enemy.velocity.x;
  enemy.position.x = Math.max(0, Math.min(enemy.position.x, canvas.width - enemy.height));

  // Enemy jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  // Collision detection & attack handling
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    });
  }

    if (
      player.isAttacking &&
      player.framesCurrent === 4
    ) {
      player.isAttacking = false;
    }
  
    // Enemy attack detection
    if (
      rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
      enemy.isAttacking &&
      enemy.framesCurrent === 2
    ) {
      player.takeHit();
      enemy.isAttacking = false;
  
      gsap.to('#playerHealth', {
        width: player.health + '%'
      });
    }
  
    // If enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
      enemy.isAttacking = false;
    }
  
    // End game based on health
    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({ player, enemy, timerId });
    }
  }
  
  animate();
  
  // Event listeners for key presses
  window.addEventListener('keydown', (event) => {
    if (!player.dead) {
      switch (event.key) {
        case 'd':
          keys.d.pressed = true;
          player.lastKey = 'd';
          break;
        case 'a':
          keys.a.pressed = true;
          player.lastKey = 'a';
          break;
        case 'w':
          player.velocity.y = -20;
          break;
        case ' ':
          player.attack();
          break;
      }
    }
  
    if (!enemy.dead) {
      switch (event.key) {
        case 'ArrowRight':
          keys.ArrowRight.pressed = true;
          enemy.lastKey = 'ArrowRight';
          break;
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = true;
          enemy.lastKey = 'ArrowLeft';
          break;
        case 'ArrowUp':
          enemy.velocity.y = -20;
          break;
        case 'ArrowDown':
          enemy.attack();
          break;
      }
    }
  });
  
  // Event listener for key releases
  window.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'd':
        keys.d.pressed = false;
        break;
      case 'a':
        keys.a.pressed = false;
        break;
    }
  
    // Enemy keys
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = false;
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false;
        break;
    }
  });
  
  // New game event listener
  window.addEventListener('keydown', (event) => {
    if (event.key === 'n' || event.key === 'N') {
      // Reload the page
      location.reload();
    }
  });
  

*/