/*
JSNES, based on Jamie Sanders' vNES
Copyright (C) 2010 Ben Firshman

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

JSNES.DummyUI = function(nes) {
  this.nes = nes;
  this.enable = function() {};
  this.updateStatus = function() {};
  this.writeAudio = function() {};
  this.writeFrame = function() {};
};

if (typeof jQuery !== 'undefined') {
    $.fn.JSNESUI = function(roms) {
      var parent = this;
      var clicked = null;
      var UI = function(nes) {
        var self = this;

        self.nes = nes;

        /*
         * Create UI
         */
        self.root = $('<div></div>');
        self.screen = $('<canvas class="nes-screen" width="256" height="240"></canvas>').appendTo(self.root);

        if (!self.screen[0].getContext) {
          parent.html("请使用支持html5 canves的浏览器打开本页面！");
          return;
        }

        self.romContainer = $('<div class="nes-roms"></div>').appendTo(self.root);
        self.romUlList = $('<ol></ol>').appendTo(self.romContainer).on('click', 'li', function() {
          clicked = this
          $(this).addClass('active').siblings().removeClass('active')
          self.loadROM();
        })

        self.controls = $('<div class="nes-controls"></div>').appendTo(self.root);
        self.buttons = {
          pause: $('<input type="button" value="暂停" class="nes-pause" disabled="disabled" />').appendTo(self.controls),
          restart: $('<input type="button" value="重置" class="nes-restart" disabled="disabled" />').appendTo(self.controls),
          sound: $('<input type="button" value="打开声音" class="nes-enablesound" />').appendTo(self.controls),
          zoom: $('<input type="button" value="放大" class="nes-zoom" />').appendTo(self.controls)
        };
        self.status = $('<p class="nes-status">启动中...</p>').appendTo(self.root);
        self.root.appendTo(parent);

        /*
         * ROM loading
         */


        /*
         * Buttons
         */
        self.buttons.pause.click(function() {
          if (self.nes.isRunning) {
            self.nes.stop();
            self.updateStatus("暂停中...");
            self.buttons.pause.attr("value", "继续");
          } else {
            self.nes.start();
            self.buttons.pause.attr("value", "暂停");
          }
        });

        self.buttons.restart.click(function() {
          self.nes.reloadRom();
          self.nes.start();
        });

        self.buttons.sound.click(function() {
          if (self.nes.opts.emulateSound) {
            self.nes.opts.emulateSound = false;
            self.buttons.sound.attr("value", "开启声音");
          } else {
            self.nes.opts.emulateSound = true;
            self.buttons.sound.attr("value", "关闭声音");
          }
        });

        self.zoomed = false;
        self.buttons.zoom.click(function() {
          if (self.zoomed) {
            self.screen.css({
              width: '256px',
              height: '240px'
            });
            self.buttons.zoom.attr("value", "放大");
            self.zoomed = false;
          } else {
            self.screen.css({
              width: '512px',
              height: '480px'
            });
            self.buttons.zoom.attr("value", "缩小");
            self.zoomed = true;
          }
        }).trigger('click')

        /*
         * Lightgun experiments with mouse
         * (Requires jquery.dimensions.js)
         */
        if ($.offset) {
          self.screen.mousedown(function(e) {
            if (self.nes.mmap) {
              self.nes.mmap.mousePressed = true;
              // FIXME: does not take into account zoom
              self.nes.mmap.mouseX = e.pageX - self.screen.offset().left;
              self.nes.mmap.mouseY = e.pageY - self.screen.offset().top;
            }
          }).mouseup(function() {
            setTimeout(function() {
              if (self.nes.mmap) {
                self.nes.mmap.mousePressed = false;
                self.nes.mmap.mouseX = 0;
                self.nes.mmap.mouseY = 0;
              }
            }, 500);
          });
        }

        if (typeof roms != 'undefined') {
          self.setRoms(roms);
        }

        /*
         * Canvas
         */
        self.canvasContext = self.screen[0].getContext('2d');

        if (!self.canvasContext.getImageData) {
          parent.html("请使用支持html5 canves的浏览器打开本页面！");
          return;
        }

        self.canvasImageData = self.canvasContext.getImageData(0, 0, 256, 240);
        self.resetCanvas();

        /*
         * Keyboard
         */
        $(document).
        bind('keydown', function(evt) {
          self.nes.keyboard.keyDown(evt);
        }).
        bind('keyup', function(evt) {
          self.nes.keyboard.keyUp(evt);
        }).
        bind('keypress', function(evt) {
          self.nes.keyboard.keyPress(evt);
        });

        /*
         * Sound
         */
        self.dynamicaudio = new DynamicAudio({
          swf: nes.opts.swfPath + 'dynamicaudio.swf'
        });
      };

      UI.prototype = {
        loadROM: function() {
          var self = this;
          self.updateStatus("正在载入中...");
          $.ajax({
            url: (clicked.getAttribute('index')),
            xhr: function() {
              var xhr = $.ajaxSettings.xhr();
              if (typeof xhr.overrideMimeType !== 'undefined') {
                // Download as binary
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
              }
              self.xhr = xhr;
              return xhr;
            },
            complete: function(xhr, status) {
              var i, data;
              if (JSNES.Utils.isIE()) {
                var charCodes = JSNESBinaryToArray(
                  xhr.responseBody
                ).toArray();
                data = String.fromCharCode.apply(
                  undefined,
                  charCodes
                );
              } else {
                data = xhr.responseText;
              }
              self.nes.loadRom(data);
              self.nes.start();
              self.enable();
            }
          });
        },

        resetCanvas: function() {
          this.canvasContext.fillStyle = 'black';
          // set alpha to opaque
          this.canvasContext.fillRect(0, 0, 256, 240);

          // Set alpha
          for (var i = 3; i < this.canvasImageData.data.length - 3; i += 4) {
            this.canvasImageData.data[i] = 0xFF;
          }
        },

        /*
         *
         * nes.ui.screenshot() --> return <img> element :)
         */
        screenshot: function() {
          var data = this.screen[0].toDataURL("image/png"),
            img = new Image();
          img.src = data;
          return img;
        },

        /*
         * Enable and reset UI elements
         */
        enable: function() {
          this.buttons.pause.attr("disabled", null);
          if (this.nes.isRunning) {
            this.buttons.pause.attr("value", "暂停");
          } else {
            this.buttons.pause.attr("value", "继续");
          }
          this.buttons.restart.attr("disabled", null);
          if (this.nes.opts.emulateSound) {
            this.buttons.sound.attr("value", "关闭声音");
          } else {
            this.buttons.sound.attr("value", "开启声音");
          }
        },

        updateStatus: function(s) {
          this.status.text(s);
        },

        setRoms: function(roms) {
          this.romUlList.children().remove();
          for (var i = 0; i < roms.length; i++) {
            $('<li>' + roms[i][0] + '</li>').attr("index", roms[i][1]).appendTo(this.romUlList);
          }
        },

        writeAudio: function(samples) {
          return this.dynamicaudio.writeInt(samples);
        },

        writeFrame: function(buffer, prevBuffer) {
          var imageData = this.canvasImageData.data;
          var pixel, i, j;

          for (i = 0; i < 256 * 240; i++) {
            pixel = buffer[i];

            if (pixel != prevBuffer[i]) {
              j = i * 4;
              imageData[j] = pixel & 0xFF;
              imageData[j + 1] = (pixel >> 8) & 0xFF;
              imageData[j + 2] = (pixel >> 16) & 0xFF;
              prevBuffer[i] = pixel;
            }
          }

          this.canvasContext.putImageData(this.canvasImageData, 0, 0);
        }
      };
      return UI;
    };
}