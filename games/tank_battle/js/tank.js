var canvas = document.createElement('canvas');

var ctx = canvas.getContext('2d');
var BOX_WIDTH = 26;
var BOX_HEIGHT = 26;
var BOX_SIZE = 30;
var TANK_SIZE = 50;
var BOOM_SIZE = 32;
var BULLET_SIZE = 8;
var paused = false;
var width = BOX_SIZE * BOX_WIDTH;
var height = BOX_SIZE * BOX_HEIGHT;

canvas.width = width;
canvas.height = height;
ctx.font = "bold 50px Arial";
ctx.textAlign = "center";

var tick;
var round = 0;
var left;
var audios = {},
  imgs = {};

var GrassArray, WaterArray, WallArray, PlayerArray, EnemyArray, BulletArray, BoomArray, BorderArray, SteelArray;

class Base {
  constructor(x, y, w, h, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
  }
}

class Grass extends Base {
  constructor(x, y) {
    super(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE, imgs.grass)
  }
}

class Water extends Base {
  constructor(x, y) {
    super(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE, imgs.water)
  }
}

class Wall extends Base {
  constructor(x, y, img) {
    super(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE, imgs.wall)
    this.canBeDestoried = true;
    this.fatherArray = WallArray;

  }
}

class Steel extends Base {
  constructor(x, y, img) {
    super(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE, imgs.steel)
  }
}

class Home extends Base {
  constructor(x, y) {
    super(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE * 2, BOX_SIZE * 2, imgs.home)
  }
}

class Move extends Base {
  constructor(x, y, w, h, img) {
    super(x, y, w, h, img)
    this.disables = [];
  }
  left(target, x) {
    var line = target.x + target.w;
    if (this.x > target.x + target.w && x <= target.x + target.w && this.y + this.h >= target.y && this.y <= target.y + target.h) {
      return { next: line + 1 };
    }
  }
  right(target, x) {
    var line = target.x - this.w;
    if (this.x < line && x >= line && this.y + this.h >= target.y && this.y <= target.y + target.h) {
      return { next: line - 1 };
    }
  }
  up(target, y) {
    var line = target.y + target.h;
    if (this.y > line && y <= line && this.x + this.w >= target.x && this.x <= target.x + target.w) {
      return { next: line + 1 };
    }
  }
  down(target, y) {
    var line = target.y - this.h;
    if (this.y < line && y >= line && this.x + this.w >= target.x && this.x <= target.x + target.w) {
      return { next: line - 1 };
    }
  }
  handleObstacle(next, dir, i) {
    var direction = this[this.key];
    var self = this;
    each(this.ObstacleArray, function(arr) {
      each(arr, function(target, index) {
        if (self === target || (self.hasDestoryAbility && target.isMy === self.isMy && (target.name === 'tank' || target.hasDestoryAbility))) {
          return;
        } else {
          var result = self[dir](target, next);
          if (result) {
            self.handlePengzhang(target, self, index, i);
            next = result.next;
          }
        }
      })
    })
    return next;
  }
  handlePengzhang(target, self, index, i) {
    if (self.hasDestoryAbility) {
      self.fatherArray.splice(i, 1);
      BoomArray.push(new Boom(self));
      if (target.canBeDestoried) {
        target.fatherArray.splice(index, 1);
        target.destoryProps && BoomArray.push(new Boom(target));
      }
    }
  }
  move(i) {
    var key = this.key;
    var keys = this.keys;
    var self = this;
    var next;
    switch (key) {
      case keys.left:
        next = this.x - this.baseSpeed;
        this.x = this.handleObstacle(next, 'left', i);
        break;
      case keys.right:
        next = this.x + this.baseSpeed;
        this.x = this.handleObstacle(next, 'right', i);
        break;
      case keys.up:
        next = this.y - this.baseSpeed;
        this.y = this.handleObstacle(next, 'up', i);
        break;
      case keys.down:
        next = this.y + this.baseSpeed;
        this.y = this.handleObstacle(next, 'down', i);
        break;
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2)
    ctx.rotate([this.keys.up, this.keys.right, this.keys.down, this.keys.left].indexOf(this.face) * Math.PI / 2);
    ctx.translate(-this.w / 2, -this.h / 2);
    ctx.drawImage(this.img, 0, 0, this.w, this.h);
    ctx.restore();
  }
}

class Tank extends Move {
  constructor(x, y, img) {
    super(x * BOX_SIZE, y * BOX_SIZE, TANK_SIZE, TANK_SIZE, img);
    this.x += (BOX_SIZE * 2 - TANK_SIZE) / 2;
    this.y += (BOX_SIZE * 2 - TANK_SIZE) / 2;
    this.destoryProps = { img: imgs.destory, frames: [0, 1, 2, 3, 2, 1, 3, 1, 3, 1, 0], interval: 1, size: 66 }
    this.ObstacleArray = [EnemyArray, PlayerArray, WallArray, BorderArray, SteelArray, WaterArray];
    this.canBeDestoried = true;
    this.baseSpeed = 3;
    this.name = 'tank';
  }
}

class Player extends Tank {
  constructor(x, y, img, keys, name) {
    super(x, y, img);

    this.keys = keys;
    this.face = this.keys.up;
    this.fatherArray = PlayerArray;
    this.isMy = true;
    this.name = name;
  }
  keydown(e) {
    var keys = this.keys;
    var key = e.key;
    switch (key) {
      case keys.left:
      case keys.right:
      case keys.up:
      case keys.down:
        this.key = key;
        this.face = key;
        break;
      case keys.fire:
        this.fire = true;
        break;
    }
  }
  keyup(e) {
    var keys = this.keys;
    var key = e.key;
    switch (key) {
      case keys.left:
      case keys.right:
      case keys.up:
      case keys.down:
        if (this.key === key) {
          this.key = null;
        }

    }
  }
  step(i) {
    if (this.fire) {
      this.fire = false;
      if (!this.cold) {
        this.cold = 1 * 30;
        BulletArray.push(new Bullet(this))
        audios.attack.play();
      }
    }
    if (this.cold) {
      this.cold--;
    }
    this.move(i);
    this.draw();
  }
}

class Enemy extends Tank {
  constructor(x, y) {
    super(x, y, imgs.enemy)
    this.keys = {
      left: 'left',
      right: 'right',
      up: 'up',
      down: 'down'
    }
    this.face = this.key = this.keys.down;
    this.randomKey = Object.keys(this.keys);
    this.tick = 0;
    this.interval = (Math.random() * 30 + 30) | 0;
    this.fatherArray = EnemyArray;
    this.isMy = false;
  }
  changeDirection() {
    this.face = this.key = this.randomKey[Math.random() * 4 | 0];
  }
  step(i) {
    this.tick++;
    if (this.tick % this.interval === 0) {
      Math.random() > .5 && this.changeDirection();
      this.fire = 1;
    }
    if (this.fire) {
      this.fire = false;
      if (!this.cold) {
        this.cold = 1 * 30;
        BulletArray.push(new Bullet(this))
        audios.attack.play();
      }
    }
    if (this.cold) {
      this.cold--;
    }
    this.move(i);
    this.draw();
  }
}

class Boom extends Base {
  constructor(props) {
    var destoryProps = props.destoryProps;
    super(props.x, props.y, destoryProps.size, destoryProps.size, destoryProps.img);
    this.tick = 0;
    this.frame = 0;
    this.fatherArray = BoomArray;
    this.frames = destoryProps.frames;
    this.interval = destoryProps.interval;
    this.x += (props.w - this.w) / 2;
    this.y += (props.h - this.h) / 2;
  }
  step(i) {
    this.tick++;
    if (this.tick % this.interval === 0) {
      this.frame++;
      if (this.frame === this.frames.length) {
        this.fatherArray.splice(i, 1)
      }
    }
    ctx.drawImage(this.img, this.frames[this.frame] * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
  }
}

class Bullet extends Move {
  constructor(props) {
    super(props.x, props.y, BULLET_SIZE, BULLET_SIZE, imgs.bullet);
    this.baseSpeed = props.baseSpeed * 4;
    this.canBeDestoried = true;
    this.hasDestoryAbility = true;
    this.destoryProps = { img: imgs.blast, frames: [1, 2, 1, 0], interval: 1, size: 32 }
    this.fatherArray = BulletArray;
    this.isMy = props.isMy;
    var face = this.face = this.key = props.face;
    var keys = this.keys = props.keys;
    var offset = TANK_SIZE - BULLET_SIZE;
    this.ObstacleArray = [EnemyArray, PlayerArray, WallArray, BorderArray, SteelArray, BulletArray];
    switch (face) {
      case keys.left:
        this.y += offset / 2;
        break;
      case keys.right:
        this.x += offset;
        this.y += offset / 2;
        break;
      case keys.up:
        this.x += offset / 2;
        break;
      case keys.down:
        this.x += offset / 2;
        this.y += offset;
        break;
    }
  }
  step(i) {
    this.move(i);
    this.draw();
  }
}

function each(arr, fn) {
  var i = 0;
  while (arr[i]) {
    fn(arr[i], i);
    i++;
  }
}

function render() {
  if (paused) {
    return;
  }

  if (EnemyArray.length === 0 && !left) {
    round++;
    startGame();
  }
  tick++;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (tick > 60) {
    if (EnemyArray.length < 5 && left && tick > 180) {
      var rand = Math.random();
      EnemyArray.push(rand < .3 ? new Enemy(0, 0) : rand < .7 ? new Enemy(12, 0) : new Enemy(24, 0));
      left--;
    }
    each(WallArray, function(back) {
      back.draw();
    });
    each(WaterArray, function(water) {
      water.draw();
    });
    each(SteelArray, function(steel, i) {
      steel.draw();
    });
    each(BulletArray, function(bullet, i) {
      bullet.step(i);
    });
    each(EnemyArray, function(enemy, i) {
      enemy.step(i);
    });
    each(PlayerArray, function(player, i) {
      player.step(i);
    });
    each(BoomArray, function(boom, i) {
      boom.step(i);
    });
    each(GrassArray, function(grass) {
      grass.draw();
    });
  } else {
    ctx.fillStyle = 'white';
    ctx.fillText('第' + (round + 1) + '关', width / 2, 200);
  }
  if (tick === 60) {
    audios.start.play();
  }
  requestAnimationFrame(render);
}

function createBoard() {
  var map = maps[round];
  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      switch (map[y][x]) {
        case 1:
          WallArray.push(new Wall(x, y));
          break;
        case 2:
          SteelArray.push(new Steel(x, y));
          break;
        case 3:
          GrassArray.push(new Grass(x, y))
          break;
        case 4:
          WaterArray.push(new Water(x, y));
          break;
        case 5:
          GrassArray.push(new Grass(x, y));
          break;
        case 9:
          WallArray.push(new Home(x, y));
          break;
        default:
          break;
      }
    }
  }
}

function resetGame() {
  audios.start.pause();
  audios.start.currentTime = 0;
  if (round < 0) {
    round += maps.length;
  } else {
    round %= maps.length
  }
  left = 7, tick = 0, GrassArray = [], WallArray = [], WaterArray = [], BoomArray = [], BulletArray = [], EnemyArray = [], SteelArray = [], PlayerArray = [];
}

function AddPlayer1() {
  !PlayerArray.filter(function(p) {
    return p.name === '1p'
  }).length && PlayerArray.push(new Player(8, 24, imgs.p1, {
    up: 'w',
    right: 'd',
    down: 's',
    left: 'a',
    fire: ' '
  }, '1p'))
}

function AddPlayer2() {
  !PlayerArray.filter(function(p) {
    return p.name === '2p'
  }).length && PlayerArray.push(new Player(16, 24, imgs.p2, {
    up: 'ArrowUp',
    right: 'ArrowRight',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    fire: '0'
  }, '2p'));
}

function AddEnemy() {
  EnemyArray.push(new Enemy(0, 0), new Enemy(12, 0), new Enemy(24, 0));
}

function startGame() {
  resetGame();
  AddPlayer1();
  AddPlayer2();
  AddEnemy();
  createBoard();
}

function initGame() {
  document.body.appendChild(canvas);
  this.onkeydown = function(e) {
    switch (e.key) {
      case 'n':
        round++;
        startGame();
        break;
      case 'b':
        round--;
        startGame();
        break;
      case 'p':
        paused = !paused;
        if (paused) {
          audios.start.pause();
        } else {
          render();
        }
        break;
      case 'q':
        AddPlayer1();
        break
      case '.':
        AddPlayer2();
        break;
      case '+':
        AddEnemy();
        break;
      default:
        PlayerArray.forEach(function(tank) {
          tank.keydown(e);
        });
    }

  }
  this.onkeyup = function(e) {
    PlayerArray.forEach(function(tank) {
      tank.keyup(e);
    });
  }
  BorderArray = [new Base(0, 0, width, 0), new Base(0, 0, 0, height), new Base(width, 0, 0, height), new Base(0, height, width, 0)]
  startGame();
  render();
}

function loadResource(fn) {
  var audioList = ['attack', 'boom', 'start'];
  for (var i = 0, audioLength = audioList.length; i < audioLength; i++) {
    var audio = document.createElement('audio');
    var key = audioList[i];
    audio.onloadstart = function() {
      i--;
      if (!i && !j) {
        fn()
      }
    }
    audio.src = 'audio/' + key + '.mp3';
    audios[key] = audio;
  }

  var imgList = ['p1', 'p2', 'enemy', 'wall', 'steel', 'grass', 'water', 'home', 'bullet', 'blast', 'destory'];
  for (var j = 0, imgsLength = imgList.length; j < imgsLength; j++) {
    var img = new Image();
    var key = imgList[j];
    img.onload = function() {
      j--;
      if (!i && !j) {
        fn()
      }
    }
    img.src = 'images/' + key + '.gif';
    imgs[key] = img;
  }
}

loadResource(initGame);