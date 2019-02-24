var speakers = new Speakers
var canvas = document.getElementById('canvas')
var canvasContext = canvas.getContext('2d')
var width = 256,
  height = 240,
  total = width * height;
canvasContext.fillRect(0, 0, width, height)

var imageData = canvasContext.getImageData(0, 0, 256, 240)

function loading() {
  cancelAnimationFrame(id)
  canvasContext.fillStyle = 'black'
  canvasContext.fillRect(0, 0, width, height)
  canvasContext.font = "30px";
  canvasContext.textAlign = 'center'
  canvasContext.fillStyle = 'white'
  canvasContext.fillText("正在载入", 128, 100)
}

var nes = new jsnes.NES({
  onFrame: function(frameBuffer) {
    var pixel, i, j;
    var data = imageData.data;
    for (var i = 0; i < total; i++) {
      pixel = frameBuffer[i];
      j = i * 4;
      data[j] = pixel & 0xFF;
      data[j + 1] = (pixel >> 8) & 0xFF;
      data[j + 2] = (pixel >> 16) & 0xFF;
    }
    canvasContext.putImageData(imageData, 0, 0);
  },
  onAudioSample: function(left, right) {
    speakers.writeSample(left, right)
  }
});

var xhr 
function ajax(url, binary) {

  xhr && xhr.abort()
  return new Promise(function(resolve, reject) {
    xhr = new XMLHttpRequest
    if (binary) {
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
    }

    xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve(xhr.responseText)
      }
    }
    xhr.open('GET', url, true)
    xhr.send();
  })
}

var id

ajax('roms.json').then((data) => {
  var roms = document.getElementById('roms')
  JSON.parse(data).roms.forEach(function(v, i) {
    var li = document.createElement('li')
    li.innerHTML = v.replace('.nes', '');
    li.onclick = function () {
      loading()

      ajax('roms/' + v, true).then((rom) => {

        nes.loadROM(rom)
        frame()
      })
    }
    !i && li.onclick()
    roms.appendChild(li)
  })
  roms.style.display = 'block'
})


function frame() {
  nes.frame()
  id = requestAnimationFrame(frame)
}

var keys = {
  'w': jsnes.Controller.BUTTON_UP,
  's': jsnes.Controller.BUTTON_DOWN,
  'a': jsnes.Controller.BUTTON_LEFT,
  'd': jsnes.Controller.BUTTON_RIGHT,
  'j': jsnes.Controller.BUTTON_B,
  'k': jsnes.Controller.BUTTON_A,
  'Enter': jsnes.Controller.BUTTON_START,
  'Shift': jsnes.Controller.BUTTON_SELECT,
}

var keys2 = {
  'ArrowUp': jsnes.Controller.BUTTON_UP,
  'ArrowDown': jsnes.Controller.BUTTON_DOWN,
  'ArrowLeft': jsnes.Controller.BUTTON_LEFT,
  'ArrowRight': jsnes.Controller.BUTTON_RIGHT,
  '1': jsnes.Controller.BUTTON_B,
  '2': jsnes.Controller.BUTTON_A,
  // 'Enter': jsnes.Controller.BUTTON_START,
  // 'Shift': jsnes.Controller.BUTTON_SELECT,
}

document.addEventListener('keydown', function(e) {
  nes.buttonDown(1, keys[e.key]);
  nes.buttonDown(2, keys2[e.key]);
})

document.addEventListener('keyup', function(e) {
  nes.buttonUp(1, keys[e.key]);
  nes.buttonUp(2, keys2[e.key]);
})

document.addEventListener('drop', function(e) {
  e.preventDefault()

  loading()

  var reader = new FileReader();
  reader.readAsBinaryString(e.dataTransfer.files[0])
  reader.onload = function() {
    nes.loadROM(this.result)
    frame()
  }
})

document.addEventListener('dragover', function(e) {
  e.preventDefault()
})