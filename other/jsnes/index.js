function RingBuffer(capacity, evictedCb) {
  this._elements = new Array(capacity || 50);
  this._first = 0;
  this._last = 0;
  this._size = 0;
  this._evictedCb = evictedCb;
}

RingBuffer.prototype.capacity = function() {
  return this._elements.length;
};

RingBuffer.prototype.isFull = function() {
  return this.size() === this.capacity();
};


RingBuffer.prototype.peek = function() {
  if (this.size() === 0) throw new Error('RingBuffer is empty');

  return this._elements[this._first];
};

RingBuffer.prototype.peekN = function(count) {
  if (count > this._size) throw new Error('Not enough elements in RingBuffer');

  var end = Math.min(this._first + count, this.capacity());
  var firstHalf = this._elements.slice(this._first, end);
  if (end < this.capacity()) {
    return firstHalf;
  }
  var secondHalf = this._elements.slice(0, count - firstHalf.length);
  return firstHalf.concat(secondHalf);
};

RingBuffer.prototype.deq = function() {
  var element = this.peek();

  this._size--;
  this._first = (this._first + 1) % this.capacity();

  return element;
};

RingBuffer.prototype.deqN = function(count) {
  var elements = this.peekN(count);

  this._size -= count;
  this._first = (this._first + count) % this.capacity();

  return elements;
};

RingBuffer.prototype.enq = function(element) {
  this._end = (this._first + this.size()) % this.capacity();
  var full = this.isFull()
  if (full && this._evictedCb) {
    this._evictedCb(this._elements[this._end]);
  }
  this._elements[this._end] = element;

  if (full) {
    this._first = (this._first + 1) % this.capacity();
  } else {
    this._size++;
  }

  return this.size();
};

RingBuffer.prototype.size = function() {
  return this._size;
};


class Speakers {
  constructor() {
    this.bufferSize = 8192;
    this.buffer = new RingBuffer(this.bufferSize * 2);
    this.start()
  }

  start() {
    // Audio is not supported
    if (!window.AudioContext) {
      return;
    }
    this.audioCtx = new window.AudioContext();
    this.scriptNode = this.audioCtx.createScriptProcessor(1024, 0, 2);
    this.scriptNode.onaudioprocess = this.onaudioprocess.bind(this);
    this.scriptNode.connect(this.audioCtx.destination);
  }

  stop() {
    if (this.scriptNode) {
      this.scriptNode.disconnect(this.audioCtx.destination);
      this.scriptNode.onaudioprocess = null;
      this.scriptNode = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch((e) => {});
      this.audioCtx = null;
    }
  }

  writeSample(left, right) {
    if (this.buffer.size() / 2 >= this.bufferSize) {
      // console.log(`Buffer overrun`);
    }
    this.buffer.enq(left);
    this.buffer.enq(right);
  };

  onaudioprocess(e) {
    var left = e.outputBuffer.getChannelData(0);
    var right = e.outputBuffer.getChannelData(1);
    var size = left.length;

    // We're going to buffer underrun. Attempt to fill the buffer.
    if (this.buffer.size() < size * 2 && this.onBufferUnderrun) {
      this.onBufferUnderrun(this.buffer.size(), size * 2);
    }

    try {
      var samples = this.buffer.deqN(size * 2);
    } catch (e) {
      var bufferSize = this.buffer.size() / 2;
      if (bufferSize > 0) {
        // console.log(`Buffer underrun (needed ${size}, got ${bufferSize})`);
      }
      for (var j = 0; j < size; j++) {
        left[j] = 0;
        right[j] = 0;
      }
      return;
    }
    for (var i = 0; i < size; i++) {
      left[i] = samples[i * 2];
      right[i] = samples[i * 2 + 1];
    }
  };
}

var speakers = new Speakers
var canvas = document.getElementById('canvas')
var canvasContext = canvas.getContext('2d')
var width = 256,
  height = 240,
  total = width * height;
canvasContext.fillRect(0, 0, width, height)

var imageData = canvasContext.getImageData(0, 0, 256, 240)

function loading(argument) {
  canvasContext.fillStyle = 'black'
  canvasContext.fillRect(0, 0, width, height)
  canvasContext.font = "30px";
  canvasContext.textAlign = 'center'
  canvasContext.fillStyle = 'white'
  canvasContext.fillText("正在载入", 128, 100)
  cancelAnimationFrame(id)
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

function ajax(url, binary) {

  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest
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
  JSON.parse(data).roms.forEach(function(v, i) {
    var roms = document.getElementById('roms')
    var li = document.createElement('li')
    li.innerHTML = v.replace('.nes', '');
    li.onclick = function() {
      loading()

      ajax('roms/' + v, true).then((rom) => {

        nes.loadROM(rom)
        frame()
      })
    }!i && li.onclick()
    roms.appendChild(li)
  })
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