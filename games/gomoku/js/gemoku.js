var lines = 15;
var rect = 50;
var width = (lines + 1) * rect;
var height = (lines + 1) * rect;

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');
ctx.lineWidth = 2;
canvas.width = width, canvas.height = height;

function draw(ctx) {
    ctx.fillStyle = "#dec7a5";
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(rect, rect);
    for (var i = 0; i < lines; i++) {
        ctx.beginPath();
        ctx.moveTo(0, rect * i);
        ctx.lineTo(rect * (lines - 1), rect * i);
        ctx.stroke();

        ctx.moveTo(rect * i, 0);
        ctx.lineTo(rect * i, rect * (lines - 1));
        ctx.stroke();
        ctx.closePath();
    }

    for (var z in chess) {
        if (chess[z]) {
            ctx.beginPath();
            x = z % lines;
            y = z / lines | 0;
            var grd = ctx.createRadialGradient(x * rect - 3, y * rect - 3, 0, x * rect - 3, y * rect - 3, 20);
            var isMy = chess[z] === 1;
            grd.addColorStop(0, isMy ? '#666' : '#ddd');
            grd.addColorStop(1, isMy ? '#111' : '#fff');
            ctx.fillStyle = grd;
            ctx.arc(x * rect, y * rect, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    if (last) {
        ctx.beginPath();
        ctx.strokeStyle = "#1091ff";
        ctx.lineWidth = 3;
        x = last[0], y = last[1]
        ctx.arc(x * rect, y * rect, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}

var chess = {};
var over = false;
var last = null;
canvas.addEventListener('click', function (e) {
    if (over) {
        return;
    }
    var x = (e.offsetX - rect / 2) / rect | 0;
    var y = (e.offsetY - rect / 2) / rect | 0;

    if (x >= 0 && x < lines && y >= 0 && y < lines && !chess[y * lines + x]) {
        chess[y * lines + x] = 1;
        last = [x, y];
        draw(ctx);
        for (var k = 0; k < count; k++) {
            if (wins[y][x][k]) {
                myWin[k]++;
                computerWin[k] = 6; //这个位置对方不可能赢了
                if (myWin[k] == 5) {
                    alert('你赢了');
                    over = true;
                    break;
                }
            }
        }

        if (!over) {
            requestAnimationFrame(AI)
        }
    }
})

var myWin = [];
var computerWin = [];

//赢法数组
var wins = [];
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = {};
    }
}

var count = 0; //赢法总数
//横线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

//竖线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}

//正斜线赢法
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}

//反斜线赢法
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}

function AI() {
    if (Object.keys(chess).length === lines * lines) {
        alert('not enough space')
        return;
    }

    var myScore = [];
    var computerScore = [];
    var max = 0;
    var u = 0,
        v = 0;
    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (!chess[i * lines + j]) {
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200;
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400;
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000;
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 10000;
                        }

                        if (computerWin[k] == 1) {
                            computerScore[i][j] += 220;
                        } else if (computerWin[k] == 2) {
                            computerScore[i][j] += 420;
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 2100;
                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += 20000;
                        }
                    }
                }

                if (myScore[i][j] > max) {
                    max = myScore[i][j];
                    u = i;
                    v = j;
                } else if (myScore[i][j] == max) {
                    if (computerScore[i][j] > computerScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }

                if (computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                } else if (computerScore[i][j] == max) {
                    if (myScore[i][j] > myScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }

            }
        }
    }
    chess[u * lines + v] = -1;
    last = [v, u]
    draw(ctx);
    for (var k = 0; k < count; k++) {
        if (wins[u][v][k]) {
            computerWin[k]++;
            myWin[k] = 6; //这个位置对方不可能赢了
            if (computerWin[k] == 5) {
                requestAnimationFrame(function () {
                    alert('计算机赢了');
                })
                over = true;
                break;
            }
        }
    }
}
draw(ctx);