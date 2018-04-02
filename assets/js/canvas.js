// Const Variables
const INTERVAL_TIME = 1000,
      GRAVITY = .85,
      FRICTION = .6,
      FLOOR_SIZE = 100,
      STAR_REDUCTION = .6,
      DX_VALUE = 7,
      OBJECTS_ARRAY = [],
      STATIC_OBJECTS_ARRAY = [],
      STATIC_STAR_COUNT = 200,
      STAR_COLOR = "rgba(224, 225, 255, 1)",
      STAR_GLOW = "rgba(224, 225, 255, .09)",
      MOUNT_COLOR_1 = "rgb(64, 67, 75)",
      MOUNT_COLOR_2 = "rgb(44, 47, 55)",
      MOUNT_COLOR_3 = "rgb(24, 27, 35)",
      FLOOR_COLOR = "rgb(30, 35, 38)",
      LOWER_FLOOR_COLOR = "rgb(20, 20, 20)";

// Init Setup
const CANVAS = document.querySelector('canvas');
const CTX = CANVAS.getContext('2d');
let homeElement = document.getElementById('home')
CANVAS.width = innerWidth;
CANVAS.height = innerHeight;

let pause = false;

function togglePause() {
  pause = !pause
}

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function Ball(x, y, dx, dy, radius, OBJECTS_ARRAY) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.OBJECTS_ARRAY = OBJECTS_ARRAY;

  this.update = function() {
    // Hits the floor
    if (this.y + this.radius + this.dy > CANVAS.height - FLOOR_SIZE) {
      this.dy = -this.dy * FRICTION;
      this.radius *= STAR_REDUCTION;
      // Only parent should spawn children
      if (OBJECTS_ARRAY) {
        this.spawnChildren();
      }
    } else {
      this.dy += GRAVITY;
    }

    if (this.x + this.radius + this.dx > CANVAS.width ||
        this.x - this.radius + this.dx < 0) {
      this.dx = -this.dx;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }

  this.draw = function() {
  var gradStar = CTX.createRadialGradient(this.x, this.y, this.radius * .1,
                                        this.x, this.y, this.radius * 2);

  gradStar.addColorStop(0, STAR_GLOW);
  gradStar.addColorStop(1, STAR_GLOW);
  CTX.beginPath();
  CTX.arc(this.x, this.y, this.radius * 1.3, 0, Math.PI * 2, false);
  CTX.fillStyle = STAR_GLOW;
  CTX.fill();
  CTX.closePath();

  gradStar.addColorStop(0, STAR_COLOR);
  gradStar.addColorStop(.5, STAR_GLOW);
  CTX.beginPath();
  CTX.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  CTX.fillStyle = gradStar;
  CTX.fill();
  CTX.closePath();
}

  this.spawnChildren = function() {
    for (let i = 0; i < randomIntFromRange(3, 6); i++) {
      var childRadius = 3
      var dxChild = randomIntFromRange(-DX_VALUE, DX_VALUE);
      var dyChild = randomIntFromRange(this.dy * .3, this.dy * .9);
      OBJECTS_ARRAY.push(new Ball(this.x, this.y, dxChild, dyChild, childRadius, 0));
    }
  }
}

// Static objects
function Floor() {
  this.x = 0;
  this.y = CANVAS.height - FLOOR_SIZE;

  this.draw = function() {
    var gradFloor = CTX.createLinearGradient(0, CANVAS.height, 0, this.y);
    gradFloor.addColorStop(0, LOWER_FLOOR_COLOR);
    gradFloor.addColorStop(1, FLOOR_COLOR)
    CTX.fillStyle = gradFloor;
    CTX.fillRect(this.x, this.y, CANVAS.width, FLOOR_SIZE);
  }
}

function Mount(startX, startY, width, height, color) {
  this.startX = startX;
  this.startY = startY;
  this.width = width;
  this.height = height;
  this.color = color;

  this.draw = function() {
    CTX.fillStyle = color;
    CTX.beginPath();
    CTX.moveTo(startX, startY);
    CTX.lineTo((this.startX + this.width) / 2, this.height);
    CTX.lineTo(this.width, startY);
    CTX.fill();
    CTX.closePath();
  }
}

function createBackground() {
  for (var i = 0; i < STATIC_STAR_COUNT; i++) {
      var randX = randomIntFromRange(0, CANVAS.width);
      var randY = randomIntFromRange(0, CANVAS.height - FLOOR_SIZE);
      var randRadius = randomIntFromRange(1, 4);
      STATIC_OBJECTS_ARRAY.push(new Ball(randX, randY, 0, 0, randRadius, 0));
  }

  // Yeah this is ugly because i wanted it to look 'good' Design is a fickle beast
  var topOfFloor = CANVAS.height - FLOOR_SIZE;
  STATIC_OBJECTS_ARRAY.push(new Mount(0, topOfFloor, CANVAS.width * 1.15,
                            CANVAS.height * .3, MOUNT_COLOR_1));

  STATIC_OBJECTS_ARRAY.push(new Mount(-(CANVAS.width * 1.2) % CANVAS.width, topOfFloor, CANVAS.width / 2 * 1.3,
                            CANVAS.height * .5, MOUNT_COLOR_2));
  STATIC_OBJECTS_ARRAY.push(new Mount(CANVAS.width / 2 * .8, topOfFloor, CANVAS.width * 1.2,
                            CANVAS.height * .5, MOUNT_COLOR_2));

  var thirdCrt = CANVAS.width / 3 * 1.1
  STATIC_OBJECTS_ARRAY.push(new Mount(-3*thirdCrt % CANVAS.width, topOfFloor, thirdCrt,
                            CANVAS.height * .70, MOUNT_COLOR_3));
  STATIC_OBJECTS_ARRAY.push(new Mount(CANVAS.width / 3 * .7, topOfFloor, 2*thirdCrt,
                            CANVAS.height * .70, MOUNT_COLOR_3));
  STATIC_OBJECTS_ARRAY.push(new Mount(2*CANVAS.width/3 * .9, topOfFloor, 3*thirdCrt,
                            CANVAS.height * .70, MOUNT_COLOR_3));

  STATIC_OBJECTS_ARRAY.push(new Floor());
}

function skyFall() {
  if(pause) {
    return
  }
  var radius = randomIntFromRange(8, 16);
  var x = randomIntFromRange(radius, CANVAS.width - radius);
  var y = radius;
  var dx = randomIntFromRange(-DX_VALUE, DX_VALUE);
  var dy = randomIntFromRange(15, 20);
  OBJECTS_ARRAY.push(new Ball(x, y, dx, dy, radius, OBJECTS_ARRAY));
}

function init() {
  OBJECTS_ARRAY.length = 0;
  STATIC_OBJECTS_ARRAY.length = 0;
  createBackground();
  for (let i = 0; i < randomIntFromRange(2, 4); i++) {
    skyFall()
  }
}

function animate() {
    requestAnimationFrame(animate);
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    for (var i = 0; i < STATIC_OBJECTS_ARRAY.length; i++) {
      STATIC_OBJECTS_ARRAY[i].draw();
    }
    for (var i = 0; i < OBJECTS_ARRAY.length; i++) {
      if (OBJECTS_ARRAY[i].radius < 1) {
        OBJECTS_ARRAY.splice(i, 1);
      }
      if (typeof(OBJECTS_ARRAY[i]) != 'undefined') {
        OBJECTS_ARRAY[i].update();
      }
    }

}

setInterval(skyFall, INTERVAL_TIME);
init();
animate();

window.addEventListener('focus', () => {
  togglePause()
});

 // Inactive
window.addEventListener('blur', () => {
  togglePause()
});

addEventListener('resize', () => {
  CANVAS.width = homeElement.offsetWidth;
  CANVAS.height = homeElement.offsetHeight;
  init();
});
