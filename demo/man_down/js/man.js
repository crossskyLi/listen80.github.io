var canvas = document.createElement('canvas');

var ctx = canvas.getContext('2d');
var width = 940;
var height = 800;

canvas.width = width;
canvas.height = height;

var lines = []
var mans = [];
var imgs = {};
var audios = {};
var tick = 0;
var speed = -2;
var pixel = -200;
var interval = pixel / speed;
var jumpSpeed = -10;
var blockWidth = 200;
var blockHeight = 32;
var manSize = 64;
var manSpeed = 7;
var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
grd.addColorStop(0, "#01b9f5");
grd.addColorStop(1, "#9dd9ed");

ctx.strokeStyle = "yellow";
ctx.lineWidth = 2;

class Line {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y || height;
    this.w = w || blockWidth;
    this.h = h || blockHeight;
    this.vy = speed;
    this.audio = audios.block;
  }
  step(tick, flag) {
    this.y += speed;
    if (this.y + this.h > 0) {
      this.draw(tick, flag);
    }
  }
  draw() {
    ctx.drawImage(this.img, 0, 0, 200, 32, this.x, this.y, 200, 32)
  }
}

class BLock extends Line {
  constructor(x, y) {
    super(x, y);
    this.img = imgs.block;
  }
}

class Move extends Line {
  constructor(x, y) {
    super(x, y);
    this.img = imgs.move;
    this.type = 'move';
    this.vx = Math.random() > .5 ? 3 : -3;
  }
  draw(tick, flag) {
    var offset = 0;
    if (this.vx === 3) {
      offset += 2;
    }
    if (flag) {
      offset += 1;
    }
    ctx.drawImage(this.img, 0, 0 + offset * 32, 200, 32, this.x, this.y, 200, 32);
  }
}

class Thorn extends Line {
  constructor(x, y) {
    super(x, y);
    this.img = imgs.thorn;
    this.type = 'thorn';
    this.audio = audios.thorn;
  }
  draw(tick, flag) {
    ctx.drawImage(this.img, 0, 0, 200, 32, this.x, this.y, 200, 32);
  }
}

class Miss extends Line {
  constructor(x, y) {
    super(x, y);
    this.img = imgs.block;
    this.type = 'miss';
    this.time = 80;
    this.mans = [];
    this.audio = audios.miss;
  }
  fade(man) {
    this.remove = true;
    this.mans.push(man);
  }
  draw(tick, flag) {
    if (this.remove) {
      this.time--;
      if (this.time) {
        ctx.globalAlpha = this.time / 100;
        ctx.drawImage(this.img, 0, 32, 200, 32, this.x, this.y, 200, 32);
        ctx.globalAlpha = 1;
      } else {
        var self = this;
        this.mans.forEach(function(man) {
          if (man.line === self) {
            man.toDown();
          }
        })
        lines.splice(lines.indexOf(this), 1);
      }
    } else {
      ctx.drawImage(this.img, 0, 32, 200, 32, this.x, this.y, 200, 32);
    }
  }
}

class Flip extends Line {
  constructor(x, y) {
    super(x, y);
    this.img = imgs.flip;
    this.type = 'flip';
    this.status = 0;
    this.tick = 0;
    this.mans = [];
    this.audio = audios.flip;
  }
  active(man) {
    this.live = 1;
    this.mans.push(man);
  }
  draw(tick, flag) {
    if (this.live) {
      if (++this.tick % 2 === 0) {
        this.status++;
      }
      if (this.status === 4) {
        this.live = 0;
        this.status = 0;
      }
    }

    var status = this.status % 4;
    var startY, height;
    switch (status) {
      case 0:
      case 2:
        startY = 0;
        height = 32;
        break;
      case 1:
        startY = 32;
        height = 23;
        break;
      case 3:
        startY = 56;
        height = 43;
        break;
    }
    ctx.drawImage(this.img, 0, startY, 200, height, this.x, this.y - height + 32, 200, height);
  }
}

class Man {
  constructor(x, y, left, right, img, lifeX) {
    this.x = x;
    this.y = 200;
    this.w = manSize;
    this.h = manSize;
    this.vx = 6.5;
    this.miny = -manSize;
    this.maxy = canvas.height - manSize;
    this.toDown();
    this.life = 180;
    this.left = left || 'ArrowLeft';
    this.right = right || 'ArrowRight';
    this.img = img || imgs.man;
    lifeX = lifeX || 40;
    this.lifeX = lifeX;
    var lifeLine = ctx.createLinearGradient(lifeX, 0, lifeX + 180, 0);
    lifeLine.addColorStop(0, "#f21");
    lifeLine.addColorStop(1, "#faa");
    this.lifeLine = lifeLine;
  }
  toDown() {
    this.line = null;
    this.vy = 0;
    this.ay = .35;
  }
  toUp(line) {
    this.line = line;
    this.vy = line.vy;
    this.ay = 0;
  }
  jump() {
    this.line = null;
    this.vy = jumpSpeed;
    this.ay = .3;
  }
  outLine(line) {
    return this.x + this.w < line.x || this.x > line.x + line.w;
  }
  keydown(e) {
    var key = e.key;
    switch (key) {
      case this.left:
        this.key = this.left;
        break;
      case this.right:
        this.key = this.right;
        break;
    }
  }
  keyup(e) {
    var key = e.key;
    switch (key) {
      case this.left:
        if (this.key === this.left) {
          this.key = '';
        }
        break;
      case this.right:
        if (this.key === this.right) {
          this.key = '';
        }
        break;
    }
  }
  step(tick) {

    var key = this.key;
    // x方向移动
    var hurt;
    if (this.life) {

      if (key === this.left) {
        this.x -= this.vx;
      } else if (key === this.right) {
        this.x += this.vx;
      }

      // 不能出界
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x > width - this.w) {
        this.x = width - this.w;
      }

      // y轴分析
      if (this.line) {
        if (this.outLine(this.line)) {
          this.toDown();
        } else if (this.line.type === 'move') {
          this.x += this.line.vx;
        } else if (this.line.type === 'thorn') {
          if (--this.life === 0) {
            this.toDown();
          } else {
            hurt = 1 && this.life % 6 < 3;
          }
        } else if (this.line.type === 'miss') {
          this.line.fade(this);
        } else {
          this.vy = this.line.vy;
        }
        this.vy += this.ay;
        this.y += this.vy;
      } else {
        if (this.life < 180 && tick % 7 === 0) {
          this.life++;
        }
        this.vy += this.ay;
        this.y += this.vy;
        var len = lines.length;
        while (len--) {
          var line = lines[len];
          if (!this.outLine(line)) {
            if (this.y > line.y - this.h && this.y + this.h < line.y + line.h) {
              this.y = line.y - this.h;
              line.audio.play();
              if (line.type === 'flip') {
                this.jump();
                line.active(this);
              } else {
                this.toUp(line)
              }
            }
          }
        }
      }
    } else {
      this.vy += this.ay;
      this.y += this.vy;
    }
    if (this.y < this.miny) {
      this.life = 0;
      this.toDown();
    } else if (this.y > height) {
      mans.splice(mans.indexOf(this), 1);
      this.drawLife();
    } else {
      this.draw(tick, tick % 10 < 5, hurt);
    }
  }
  drawLife() {
    if (this.life) {
      ctx.beginPath();
      ctx.strokeRect(this.lifeX - 1, 20 - 1, 180 + 2, 20 + 2);
      ctx.fillStyle = this.lifeLine;
      ctx.fillRect(this.lifeX, 20, this.life, 20);
      ctx.closePath();
    }
  }
  draw(tick, ani, hurt) {
    this.drawLife();
    var key = this.key;
    var offset = 0;

    if (this.line) {
      if (key === this.right) {
        offset = ani ? 5 : 6;
      } else if (key === this.left) {
        offset = ani ? 3 : 4;
      }
    } else {
      offset = ani ? 1 : 2;
    }

    if (hurt) {
      ctx.globalAlpha = .1;
    }
    ctx.drawImage(this.img, manSize * offset, 0, manSize, manSize, this.x, this.y, manSize, manSize);
    if (hurt) {
      ctx.globalAlpha = 1;
    }
  }
}


function random(max) {
  return Math.random() * max | 0;
}

function render() {

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var len = lines.length;

  if (tick % 24 < 12) {
    var flag = true;
  }
  while (len--) {
    lines[len].step(tick, flag);
  }
  var len = mans.length;

  if (len === 0) {
    // if(confirm('more')) {
    //     startGame();
    // }
    return;
  }
  while (len--) {
    mans[len].step(tick);
  }

  if (tick % interval === 0) {
    var ran = Math.random();
    var line;
    if (ran > .9) {
      line = new Thorn(random(width - blockWidth), height);
    } else if (ran > .7) {
      line = new Move(random(width - blockWidth), height);
    } else if (ran > .5) {
      line = new Miss(random(width - blockWidth), height);
    } else if (ran > .3) {
      line = new Flip(random(width - blockWidth), height);
    } else {
      line = new BLock(random(width - blockWidth), height);
    }
    lines.push(line);
  }

  tick++;
  requestAnimationFrame(render)
}

function loadResource() {
  var list = ['player1', 'player2', 'block', 'flip', 'move', 'thorn'];

  for (var x = 0, len = list.length; x < len; x++) {
    var img = new Image();
    var key = list[x];
    img.onload = function() {
      x--;
      if (!x && !y) {
        initGame();
      }
    };
    img.src = 'images/' + key + '.png';
    imgs[key] = img;
  }

  var audioList = ['block', 'flip', 'miss', 'thorn'];

  for (var y = 0, audioLength = audioList.length; y < audioLength; y++) {
    var audio = document.createElement('audio');
    var key = audioList[y];
    audio.onloadstart = function() {
      y--;
      if (!x && !y) {
        initGame();
      }
    }
    audio.src = 'audio/' + key + '.mp3';
    audios[key] = audio;
  }

}

function initGame() {

  document.body.appendChild(canvas);

  this.onkeydown = function(e) {
    mans.forEach(function(man) {
      man.keydown(e);
    })
  }
  this.onkeyup = function(e) {
    mans.forEach(function(man) {
      man.keyup(e);
    })
  }

  startGame();
}

function startGame() {
  tick = 0;
  mans.push(
    new Man(width / 2 - manSize - 5, height + pixel, 'a', 'd', imgs.player2, 30, audios.player1),
    new Man(width / 2 + 5, height + pixel, 'ArrowLeft', 'ArrowRight', imgs.player1, width - 210, audios.player2)
  )
  lines = [new BLock((width - blockWidth) / 2, height + pixel)];
  requestAnimationFrame(render);

}

loadResource();