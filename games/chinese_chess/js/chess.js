var chess = {};

var cache = {};

var initMap = [
  ['C0', 'M0', 'X0', 'S0', 'J0', 'S1', 'X1', 'M1', 'C1'],
  [],
  [, 'P0', , , , , , 'P1', ],
  ['Z0', , 'Z1', , 'Z2', , 'Z3', , 'Z4'],
  [],
  [],
  ['z0', , 'z1', , 'z2', , 'z3', , 'z4'],
  [, 'p0', , , , , , 'p1', ],
  [],
  ['c0', 'm0', 'x0', 's0', 'j0', 's1', 'x1', 'm1', 'c1']
]

value.C = value.c.slice().reverse();
value.M = value.m.slice().reverse();
value.X = value.x.slice().reverse();
value.S = value.s.slice().reverse();
value.J = value.j.slice().reverse();
value.P = value.p.slice().reverse();
value.Z = value.z.slice().reverse();

var bylaw = {
  c: function(x, y, my) {
    var map = chess.map;
    var d = [];
    for (var i = x - 1; i >= 0; i--) {
      if (map[y][i]) {
        if (chess.mans[map[y][i]].my != my) d.push([i, y]);
        break
      } else {
        d.push([i, y])
      }
    }
    for (var i = x + 1; i <= 8; i++) {
      if (map[y][i]) {
        if (chess.mans[map[y][i]].my != my) d.push([i, y]);
        break
      } else {
        d.push([i, y])
      }
    }
    for (var i = y - 1; i >= 0; i--) {
      if (map[i][x]) {
        if (chess.mans[map[i][x]].my != my) d.push([x, i]);
        break
      } else {
        d.push([x, i])
      }
    }
    for (var i = y + 1; i <= 9; i++) {
      if (map[i][x]) {
        if (chess.mans[map[i][x]].my != my) d.push([x, i]);
        break
      } else {
        d.push([x, i])
      }
    }
    return d
  },
  m: function(x, y, my) {
    var map = chess.map;
    var d = [];
    if (y - 2 >= 0 && x + 1 <= 8 && !chess.map[y - 1][x] && (!chess.mans[map[y - 2][x + 1]] || chess.mans[map[y - 2][x + 1]].my != my)) d.push([x + 1, y - 2]);
    if (y - 1 >= 0 && x + 2 <= 8 && !chess.map[y][x + 1] && (!chess.mans[map[y - 1][x + 2]] || chess.mans[map[y - 1][x + 2]].my != my)) d.push([x + 2, y - 1]);
    if (y + 1 <= 9 && x + 2 <= 8 && !chess.map[y][x + 1] && (!chess.mans[map[y + 1][x + 2]] || chess.mans[map[y + 1][x + 2]].my != my)) d.push([x + 2, y + 1]);
    if (y + 2 <= 9 && x + 1 <= 8 && !chess.map[y + 1][x] && (!chess.mans[map[y + 2][x + 1]] || chess.mans[map[y + 2][x + 1]].my != my)) d.push([x + 1, y + 2]);
    if (y + 2 <= 9 && x - 1 >= 0 && !chess.map[y + 1][x] && (!chess.mans[map[y + 2][x - 1]] || chess.mans[map[y + 2][x - 1]].my != my)) d.push([x - 1, y + 2]);
    if (y + 1 <= 9 && x - 2 >= 0 && !chess.map[y][x - 1] && (!chess.mans[map[y + 1][x - 2]] || chess.mans[map[y + 1][x - 2]].my != my)) d.push([x - 2, y + 1]);
    if (y - 1 >= 0 && x - 2 >= 0 && !chess.map[y][x - 1] && (!chess.mans[map[y - 1][x - 2]] || chess.mans[map[y - 1][x - 2]].my != my)) d.push([x - 2, y - 1]);
    if (y - 2 >= 0 && x - 1 >= 0 && !chess.map[y - 1][x] && (!chess.mans[map[y - 2][x - 1]] || chess.mans[map[y - 2][x - 1]].my != my)) d.push([x - 1, y - 2]);
    return d
  },
  x: function(x, y, my) {
    var map = chess.map;
    var d = [];
    if (my === 1) {
      if (y + 2 <= 9 && x + 2 <= 8 && !chess.map[y + 1][x + 1] && (!chess.mans[map[y + 2][x + 2]] || chess.mans[map[y + 2][x + 2]].my != my)) d.push([x + 2, y + 2]);
      if (y + 2 <= 9 && x - 2 >= 0 && !chess.map[y + 1][x - 1] && (!chess.mans[map[y + 2][x - 2]] || chess.mans[map[y + 2][x - 2]].my != my)) d.push([x - 2, y + 2]);
      if (y - 2 >= 5 && x + 2 <= 8 && !chess.map[y - 1][x + 1] && (!chess.mans[map[y - 2][x + 2]] || chess.mans[map[y - 2][x + 2]].my != my)) d.push([x + 2, y - 2]);
      if (y - 2 >= 5 && x - 2 >= 0 && !chess.map[y - 1][x - 1] && (!chess.mans[map[y - 2][x - 2]] || chess.mans[map[y - 2][x - 2]].my != my)) d.push([x - 2, y - 2])
    } else {
      if (y + 2 <= 4 && x + 2 <= 8 && !chess.map[y + 1][x + 1] && (!chess.mans[map[y + 2][x + 2]] || chess.mans[map[y + 2][x + 2]].my != my)) d.push([x + 2, y + 2]);
      if (y + 2 <= 4 && x - 2 >= 0 && !chess.map[y + 1][x - 1] && (!chess.mans[map[y + 2][x - 2]] || chess.mans[map[y + 2][x - 2]].my != my)) d.push([x - 2, y + 2]);
      if (y - 2 >= 0 && x + 2 <= 8 && !chess.map[y - 1][x + 1] && (!chess.mans[map[y - 2][x + 2]] || chess.mans[map[y - 2][x + 2]].my != my)) d.push([x + 2, y - 2]);
      if (y - 2 >= 0 && x - 2 >= 0 && !chess.map[y - 1][x - 1] && (!chess.mans[map[y - 2][x - 2]] || chess.mans[map[y - 2][x - 2]].my != my)) d.push([x - 2, y - 2])
    }
    return d
  },
  s: function(x, y, my) {
    var map = chess.map;
    var d = [];
    if (my === 1) {
      if (y + 1 <= 9 && x + 1 <= 5 && (!chess.mans[map[y + 1][x + 1]] || chess.mans[map[y + 1][x + 1]].my != my)) d.push([x + 1, y + 1]);
      if (y + 1 <= 9 && x - 1 >= 3 && (!chess.mans[map[y + 1][x - 1]] || chess.mans[map[y + 1][x - 1]].my != my)) d.push([x - 1, y + 1]);
      if (y - 1 >= 7 && x + 1 <= 5 && (!chess.mans[map[y - 1][x + 1]] || chess.mans[map[y - 1][x + 1]].my != my)) d.push([x + 1, y - 1]);
      if (y - 1 >= 7 && x - 1 >= 3 && (!chess.mans[map[y - 1][x - 1]] || chess.mans[map[y - 1][x - 1]].my != my)) d.push([x - 1, y - 1])
    } else {
      if (y + 1 <= 2 && x + 1 <= 5 && (!chess.mans[map[y + 1][x + 1]] || chess.mans[map[y + 1][x + 1]].my != my)) d.push([x + 1, y + 1]);
      if (y + 1 <= 2 && x - 1 >= 3 && (!chess.mans[map[y + 1][x - 1]] || chess.mans[map[y + 1][x - 1]].my != my)) d.push([x - 1, y + 1]);
      if (y - 1 >= 0 && x + 1 <= 5 && (!chess.mans[map[y - 1][x + 1]] || chess.mans[map[y - 1][x + 1]].my != my)) d.push([x + 1, y - 1]);
      if (y - 1 >= 0 && x - 1 >= 3 && (!chess.mans[map[y - 1][x - 1]] || chess.mans[map[y - 1][x - 1]].my != my)) d.push([x - 1, y - 1])
    }
    return d
  },
  j: function(x, y, my) {
    var map = chess.map;
    var d = [];
    var isNull = (function(y1, y2) {
      var y1 = chess.mans["j0"].y;
      var x1 = chess.mans["J0"].x;
      var y2 = chess.mans["J0"].y;
      for (var i = y1 - 1; i > y2; i--) {
        if (map[i][x1]) return false
      }
      return true
    })();
    if (my === 1) {
      if (y + 1 <= 9 && (!chess.mans[map[y + 1][x]] || chess.mans[map[y + 1][x]].my != my)) d.push([x, y + 1]);
      if (y - 1 >= 7 && (!chess.mans[map[y - 1][x]] || chess.mans[map[y - 1][x]].my != my)) d.push([x, y - 1]);
      if (chess.mans["j0"].x == chess.mans["J0"].x && isNull) d.push([chess.mans["J0"].x, chess.mans["J0"].y])
    } else {
      if (y + 1 <= 2 && (!chess.mans[map[y + 1][x]] || chess.mans[map[y + 1][x]].my != my)) d.push([x, y + 1]);
      if (y - 1 >= 0 && (!chess.mans[map[y - 1][x]] || chess.mans[map[y - 1][x]].my != my)) d.push([x, y - 1]);
      if (chess.mans["j0"].x == chess.mans["J0"].x && isNull) d.push([chess.mans["j0"].x, chess.mans["j0"].y])
    }
    if (x + 1 <= 5 && (!chess.mans[map[y][x + 1]] || chess.mans[map[y][x + 1]].my != my)) d.push([x + 1, y]);
    if (x - 1 >= 3 && (!chess.mans[map[y][x - 1]] || chess.mans[map[y][x - 1]].my != my)) d.push([x - 1, y]);
    return d
  },
  p: function(x, y, my) {
    var map = chess.map;
    var d = [];
    var n = 0;
    for (var i = x - 1; i >= 0; i--) {
      if (map[y][i]) {
        if (n == 0) {
          n++;
          continue
        } else {
          if (chess.mans[map[y][i]].my != my) d.push([i, y]);
          break
        }
      } else {
        if (n == 0) d.push([i, y])
      }
    }
    var n = 0;
    for (var i = x + 1; i <= 8; i++) {
      if (map[y][i]) {
        if (n == 0) {
          n++;
          continue
        } else {
          if (chess.mans[map[y][i]].my != my) d.push([i, y]);
          break
        }
      } else {
        if (n == 0) d.push([i, y])
      }
    }
    var n = 0;
    for (var i = y - 1; i >= 0; i--) {
      if (map[i][x]) {
        if (n == 0) {
          n++;
          continue
        } else {
          if (chess.mans[map[i][x]].my != my) d.push([x, i]);
          break
        }
      } else {
        if (n == 0) d.push([x, i])
      }
    }
    var n = 0;
    for (var i = y + 1; i <= 9; i++) {
      if (map[i][x]) {
        if (n == 0) {
          n++;
          continue
        } else {
          if (chess.mans[map[i][x]].my != my) d.push([x, i]);
          break
        }
      } else {
        if (n == 0) d.push([x, i])
      }
    }
    return d
  },
  z: function(x, y, my) {
    var map = chess.map;
    var d = [];
    if (my === 1) {
      if (y - 1 >= 0 && (!chess.mans[map[y - 1][x]] || chess.mans[map[y - 1][x]].my != my)) d.push([x, y - 1]);
      if (x + 1 <= 8 && y <= 4 && (!chess.mans[map[y][x + 1]] || chess.mans[map[y][x + 1]].my != my)) d.push([x + 1, y]);
      if (x - 1 >= 0 && y <= 4 && (!chess.mans[map[y][x - 1]] || chess.mans[map[y][x - 1]].my != my)) d.push([x - 1, y])
    } else {
      if (y + 1 <= 9 && (!chess.mans[map[y + 1][x]] || chess.mans[map[y + 1][x]].my != my)) d.push([x, y + 1]);
      if (x + 1 <= 8 && y >= 6 && (!chess.mans[map[y][x + 1]] || chess.mans[map[y][x + 1]].my != my)) d.push([x + 1, y]);
      if (x - 1 >= 0 && y >= 6 && (!chess.mans[map[y][x - 1]] || chess.mans[map[y][x - 1]].my != my)) d.push([x - 1, y])
    }
    return d
  }
}

var args = {
  'c': {
    text: "车",
    img: 'red_c',
    bl: 'c',
    my: 1,
    value: value.c
  },
  'm': {
    text: "马",
    img: 'red_m',
    bl: 'm',
    my: 1,
    value: value.m
  },
  'x': {
    text: "相",
    img: 'red_x',
    bl: 'x',
    my: 1,
    value: value.x
  },
  's': {
    text: "仕",
    img: 'red_s',
    bl: 's',
    my: 1,
    value: value.s
  },
  'j': {
    text: "帅",
    img: 'red_j',
    bl: 'j',
    my: 1,
    value: value.j
  },
  'p': {
    text: "炮",
    img: 'red_p',
    bl: 'p',
    my: 1,
    value: value.p
  },
  'z': {
    text: "兵",
    img: 'red_z',
    bl: 'z',
    my: 1,
    value: value.z
  },

  'C': {
    text: "車",
    img: 'black_c',
    bl: 'c',
    my: -1,
    value: value.C
  },
  'M': {
    text: "馬",
    img: 'black_m',
    bl: 'm',
    my: -1,
    value: value.M
  },
  'X': {
    text: "象",
    img: 'black_x',
    bl: 'x',
    my: -1,
    value: value.X
  },
  'S': {
    text: "士",
    img: 'black_s',
    bl: 's',
    my: -1,
    value: value.S
  },
  'J': {
    text: "将",
    img: 'black_j',
    bl: 'j',
    my: -1,
    value: value.J
  },
  'P': {
    text: "炮",
    img: 'black_p',
    bl: 'p',
    my: -1,
    value: value.P
  },
  'Z': {
    text: "卒",
    img: 'black_z',
    bl: 'z',
    my: -1,
    value: value.Z
  }
}

var skin = {
  space: {
    x: 80,
    y: 80
  },
  offset: {
    x: 5,
    y: 4
  },
  size: {
    x: 72,
    y: 72
  }
}

chess.clearKey = [];
chess.move = function(oldX, oldY, newX, newY, my) {

  var oldKey = chess.map[oldY][oldX];
  var man = chess.mans[oldKey];
  chess.createMove(oldX, oldY, newX, newY);
  chess.pace.push("" + oldX + oldY + newX + newY);
  var key = chess.map[newY][newX];
  chess.clearKey.push(key);
  if (key) {
    chess.mans[key].hide();
  }
  delete chess.map[oldY][oldX];
  chess.map[newY][newX] = oldKey;
  man.move(newX, newY);
  if (key == 'j0') {
    chess.lose();
  } else if (key == 'J0') {
    chess.win();
  }
  if (chess.check(my)) {
    audio.check.play();
  } else if (key) {
    audio.eat.play();
  } else {
    audio.move.play();
  }
}

function setMsg(win) {
  setTimeout(function() {
    document.querySelector('#win').className = 'hide';
  }, 3333);
  document.querySelector('#win').style.display = 'table';
  document.querySelector('#result').src = 'images/' + (win ? 'win.jpg' : 'lose.jpg');
}

document.querySelector('#win').addEventListener("transitionend", function() {
  this.removeAttribute('style');
  this.removeAttribute('class');
})

chess.win = function() {
  chess.continuation = false;
  setMsg(1);
}

chess.lose = function() {
  chess.continuation = false;
  setMsg();
}

chess.regret = function() {
  if (chess.selected) {
    chess.selected.click();
    chess.selected = null;
  }
  var lastpace = chess.pace.pop();
  if (!lastpace) return;
  var pace = lastpace.split('');
  var key = chess.map[pace[3]][pace[2]];
  var man = chess.mans[key];
  chess.map[pace[1]][pace[0]] = key;
  man.move(Number(pace[0]), Number(pace[1]));
  var clearKey = chess.clearKey.pop();
  chess.map[pace[3]][pace[2]] = clearKey;
  if (clearKey) {
    chess.mans[clearKey].show();
  }
  chess.continuation = true;
  chess.delMove();
}

chess.continuation = true;

document.all.regret.onclick = function() {
  chess.regret();
  if (chess.turn) {
    chess.regret();
  }
  chess.turn = true;
}

document.all.restart.onclick = function() {
  document.all.chess.innerHTML = '';
  document.all.moves.innerHTML = '';
  chess.init();
  chess.turn = true;
}

document.all.chess.onclick = function(event) {
  if (!chess.turn || !chess.continuation) return;
  var get = chess.getPosition();
  if (get) {
    var key = chess.map[get.y][get.x];
    if (key && chess.mans[key].my == 1) {
      chess.selected && chess.selected.click();
      chess.selected = chess.mans[key];
      chess.selected.ps = chess.selected.bl();
      chess.selected.click();
      audio.move.play();
    } else if (chess.selected) {
      if (chess.indexOfPs(chess.selected.ps, [get.x, get.y])) {
        chess.move(chess.selected.x, chess.selected.y, get.x, get.y, 1);
        chess.selected.click();
        chess.selected = null;
        chess.turn = false;
        if (chess.continuation)
          setTimeout(function() {
            AI.play(-1);
          }, 222);
      } else {
        audio.fail.play();
      }
    }
  }
}

chess.createMove = function(x, y, newX, newY) {
  var text = "";
  var man = chess.mans[chess.map[y][x]];
  text += man.text;
  if (man.my === 1) {
    var mumTo = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
    newX = 8 - newX;
    text += mumTo[8 - x];
    if (newY > y) {
      text += "退";
      if (man.pater == "m" || man.pater == "s" || man.pater == "x") {
        text += mumTo[newX];
      } else {
        text += mumTo[newY - y - 1];
      }
    } else if (newY < y) {
      text += "进";
      if (man.pater == "m" || man.pater == "s" || man.pater == "x") {
        text += mumTo[newX];
      } else {
        text += mumTo[y - newY - 1];
      }
    } else {
      text += "平";
      text += mumTo[newX];
    }
  } else {
    var mumTo = ["１", "２", "３", "４", "５", "６", "７", "８", "９"];
    text += mumTo[x];
    if (newY > y) {
      text += "进";
      if (man.pater == "M" || man.pater == "S" || man.pater == "X") {
        text += mumTo[newX];
      } else {
        text += mumTo[newY - y - 1];
      }
    } else if (newY < y) {
      text += "退";
      if (man.pater == "M" || man.pater == "S" || man.pater == "X") {
        text += mumTo[newX];
      } else {
        text += mumTo[y - newY - 1];
      }
    } else {
      text += "平";
      text += mumTo[newX];
    }
  }
  var li = document.createElement('li');
  li.className = chess.turn ? 'red' : 'black';
  li.appendChild(document.createTextNode(text));
  document.all.moves.appendChild(li);
}

chess.delMove = function() {
  var parent = document.all.moves;
  parent.removeChild(parent.lastChild);
}

chess.check = function(my) {
  var map = chess.clone(chess.map);
  var moves = AI.getMoves(map, my);
  for (var i = 0; i < moves.length; i++) {
    var move = moves[i];
    var newX = move[2];
    var newY = move[3];
    var clearKey = map[newY][newX];
    if (clearKey == "j0" || clearKey == "J0") {
      return true;
    }
  }
  return false;
}

chess.cheat = false;

function man(key, x, y) {
  this.pater = key.slice(0, 1);
  var o = args[this.pater];
  this.key = key;
  this.my = key.toUpperCase() === key ? -1 : 1;
  this.text = o.text;
  this.value = o.value;
  this.ps = [];
  this.img = new Image();
  this.img.src = './images/' + args[this.pater].img + '.png';
  this.click = function() {
    this.img.className = this.img.className ? '' : 'selected';
  }
  this.move = function(x, y) {
    this.x = x;
    this.y = y;
    this.img.style.left = skin.offset.x + x * skin.space.x + 'px';
    this.img.style.top = skin.offset.y + y * skin.space.y + 'px';
  }
  this.draw = function() {
    var x = this.x,
      y = this.y;
    ctx.drawImage(this.img, skin.offset.x + x * skin.space.x, skin.offset.y + y * skin.space.y)
  }

  this.hide = function() {
    this.img.style.display = 'none';
  }
  this.show = function() {
    this.img.style.display = 'block';
  }
  this.bl = function() {
    return bylaw[o.bl](this.x, this.y, this.my)
  }
  this.move(x, y);
  document.all.chess.appendChild(this.img);
}

function createMans() {
  var map = chess.map;
  chess.mans = {};
  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      var key = map[y][x];
      if (key) {
        chess.mans[key] = new man(key, x, y);
      }
    }
  }
}

chess.pic = function() {
  var map = chess.map;
  var log = "";
  for (var y = 0; y < 10; y++) {
    for (var x = 0; x < 9; x++) {
      log += (map[y][x] || "  ") + " ";
    }
    log += "\n";
  }
  console.log(log);
}

chess.shadow = function() {
  for (var y = 0; y < 10; y++) {
    for (var x = 0; x < 9; x++) {
      var div = document.createElement('div');
      div.style.height = skin.size.y + 'px';
      div.style.width = skin.size.x + 'px';
      div.style.position = "absolute";
      div.style.left = skin.offset.x + skin.space.x * x + 'px';
      div.style.top = skin.offset.y + skin.space.y * y + 'px';
      div.style.backgroundColor = "rgba(222,22,222,.2)";
      document.all.chess.appendChild(div);
    }
  }
}

chess.createPosition = function() {
  chess.position = {
    x: [],
    y: []
  };
  for (var y = 0; y < 10; y++) {
    chess.position.y.push([skin.offset.y + skin.space.y * y, skin.offset.y + skin.space.y * y + skin.size.y]);
  }
  for (var x = 0; x < 9; x++) {
    chess.position.x.push([skin.offset.x + skin.space.x * x, skin.offset.x + skin.space.x * x + skin.size.x]);
  }
}

chess.getPosition = function() {
  var arr = {};
  var x = event.offsetX
  var y = event.offsetY;
  for (i in chess.position.x) {
    var _i = chess.position.x[i];
    if (x > _i[0] && x < _i[1]) {
      arr.x = i;
      for (i in chess.position.y) {
        var _i = chess.position.y[i];
        if (y > _i[0] && y < _i[1]) {
          arr.y = i;
          return arr;
        }
      }
    }
  }
}

chess.clone = function(arr) {
  var r = [];
  for (x in arr) {
    r.push(arr[x].slice());
  }
  return r;
}

chess.indexOfPs = function(ps, xy) {
  for (var i = 0; i < ps.length; i++) {
    if (ps[i][0] == xy[0] && ps[i][1] == xy[1]) return true;
  }
  return false;
}

chess.init = function() {
  chess.selected = null;
  chess.map = chess.clone(initMap);
  chess.pace = [];
  // chess.shadow();
  createMans();
  chess.createPosition();
  chess.turn = true;
  chess.continuation = true;
}

chess.init();

var AI = {};
AI.treeDepth = 4;
AI.play = function(my) {
  var p = AI.best(my);
  if (!p) {
    chess.chesswin();
  } else {
    if (p.value <= -9999) {
      chess.win();
      return;
    }
    var man = chess.mans[p.key];
    chess.move(man.x, man.y, p.x, p.y, my);
    chess.turn = true;
  }

}

AI.best = function(my) {
  var pace = chess.pace.join('');
  AI.number = 0;
  var initTime = new Date().getTime();
  var val = AI.getAlphaBeta(-Infinity, Infinity, AI.treeDepth, chess.map, my);
  var nowTime = new Date().getTime();
  AI.time = nowTime - initTime;
  return val;
}

var s = []
AI.getAlphaBeta = function(A, B, depth, map, my) {
  if (depth === 1) {
    var base = AI.evaluate(map, my);
  }

  var moves = AI.getMoves(map, my);
  for (var i = 0, len = moves.length; i < len; i++) {
    var move = moves[i];
    var key = move[4];
    var oldX = move[0];
    var oldY = move[1];
    var newX = move[2];
    var newY = move[3];
    var clearKey = map[newY][newX] || "";
    map[newY][newX] = key;
    delete map[oldY][oldX];
    chess.mans[key].x = newX;
    chess.mans[key].y = newY;
    if (clearKey == "j0" || clearKey == "J0") {
      chess.mans[key].x = oldX;
      chess.mans[key].y = oldY;
      map[oldY][oldX] = key;
      delete map[newY][newX];
      if (clearKey) {
        map[newY][newX] = clearKey;
      }
      return {
        "key": key,
        "x": move[2],
        "y": move[3],
        "value": 9999
      };
    } else {
      if (depth === 1) {
        // var temp = {"value": AI.evaluate(map, -my)}
        var temp = {};
        var val = base + chess.mans[key].value[newY][newX] * (chess.mans[key].my) - chess.mans[key].value[oldY][oldX] * (chess.mans[key].my)
        if (clearKey) {
          val += chess.mans[clearKey].value[newY][newX] * (chess.mans[key].my);
        }
        temp.value = -val;
      } else {
        var temp = AI.getAlphaBeta(-B, -A, depth - 1, map, -my);
      }
      if (temp) {
        var val = -temp.value;
      } else {
        val = 9999;
      }
      chess.mans[key].x = oldX;
      chess.mans[key].y = oldY;
      map[oldY][oldX] = key;
      delete map[newY][newX];
      if (clearKey) {
        map[newY][newX] = clearKey;
      }
      if (val >= B) {
        // 已经比要求的上限大, 会对上一层造成更大损失地,肯定不是最优解, =的话必要遍历了
        return {
          "key": key,
          "x": newX,
          "y": newY,
          "value": B
        };
      }
      if (val > A) {　　　　
        A = val;
        var rootKey = {
          "key": key,
          "x": newX,
          "y": newY,
          "value": A
        }
      }

    }　
  }
  return rootKey;
}

AI.evaluate = function(map, my) {
  var val = 0;
  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      var key = map[y][x];
      if (key) {
        val += chess.mans[key].value[y][x] * chess.mans[key].my;
      }
    }
  }
  AI.number++;
  return val * my;
}

AI.getMoves = function(map, my) {
  var sssss = Date.now()

  var manArr = AI.getMapAllMan(map, my);
  var moves = [];
  for (var i = 0; i < manArr.length; i++) {
    var man = manArr[i];
    var val = man.bl(map);
    for (var n = 0; n < val.length; n++) {
      var x = man.x;
      var y = man.y;
      var newX = val[n][0];
      var newY = val[n][1];
      moves.push([x, y, newX, newY, man.key])
    }
  }
  s.push(Date.now() - sssss)
  return moves;
}

AI.getMapAllMan = function(map, my) {
  var mans = [];
  for (var y = 0; y < map.length; y++) {
    for (var n = 0; n < map[y].length; n++) {
      var key = map[y][n];
      if (key && chess.mans[key].my == my) {
        chess.mans[key].x = n;
        chess.mans[key].y = y;
        mans.push(chess.mans[key])
      }
    }
  }
  return mans;
}

var audio = {};
audio.check = document.all.check;
audio.eat = document.all.eat;
audio.fail = document.all.fail;
audio.move = document.all.move;

document.onselectstart = function() {
  return false;
}

document.ondragstart = function() {
  return false;
}

var show = false;
document.oncontextmenu = function() {
  show = !show;
  if(show) {
    document.getElementById('sideBar').style.display = 'block'; 
  } else {
    document.getElementById('sideBar').style.display = 'none';
  }
  
  return false;
}

window.onload = function() {
  document.all.loading.style.display = 'none';
}