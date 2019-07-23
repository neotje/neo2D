if ($) {
  console.log("jquery is loaded");
} else {
  console.log("jquery not loaded");
}

const neo2D = new function() {
  var canvas;
  var ctx;

  var version = "2019.1";

  var keys = {};
  var keysPress = {};
  var clicks = {
    left: [],
    middle: [],
    right: []
  };
  var mouseDownAndUp = {
    left: false,
    middle: false,
    right: false
  }

  var beginTime;
  var endTime;
  var deltaTime;
  var fps;

  var run;
  var pause = false;
  var running;

  var entities = {};

  $(document).ready(function() {
    refresh(document.getElementsByTagName("canvas")[0]);
  });

  function refresh(elem) {
    if (!canvas) {
      canvas = elem;
    }

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    canvas.removeEventListener("mousemove", mouseUpdate);

    if (running) {
      pause = true;

      canvas.removeEventListener("click", mouseClick);
      canvas.removeEventListener("mousedown", mouseDownListener);
      canvas.removeEventListener("mouseup", mouseUpListener);

      window.removeEventListener("keypress", keyPressListener);
      window.removeEventListener("keydown", keyDownListener);
      window.removeEventListener("keyup", keyUpListener);
    }

    canvas = elem;
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousemove", mouseUpdate);

    if (running) {
      canvas.addEventListener("click", mouseClick);
      canvas.addEventListener("mousedown", mouseDownListener);
      canvas.addEventListener("mouseup", mouseUpListener);

      window.addEventListener("keypress", keyPressListener);
      window.addEventListener("keydown", keyDownListener);
      window.addEventListener("keyup", keyUpListener);

      pause = false;
    }
  }

  function mouseUpdate(evt) {
    var rect = canvas.getBoundingClientRect();
    neo2D.mouse.x = evt.clientX - rect.left
    neo2D.mouse.y = evt.clientY - rect.top
  }

  function mouseClick(evt) {
    if (evt.button == 0) {
      for (let listener of clicks.left) {
        listener();
      }
    }
    if (evt.button == 1) {
      for (let listener of clicks.middle) {
        listener();
      }
    }
    if (evt.button == 2) {
      for (let listener of clicks.right) {
        listener();
      }
    }
  }

  function mouseDownListener(evt) {
    if (evt.button == 0) {
      mouseDownAndUp.left = true;
    }
    if (evt.button == 1) {
      mouseDownAndUp.middle = true;
    }
    if (evt.button == 2) {
      mouseDownAndUp.right = true;
    }
  }

  function mouseUpListener(evt) {
    if (evt.button == 0) {
      mouseDownAndUp.left = false;
    }
    if (evt.button == 1) {
      mouseDownAndUp.middle = false;
    }
    if (evt.button == 2) {
      mouseDownAndUp.right = false;
    }
  }

  function keyDownListener(evt) {
    var downKey = evt.key.toLowerCase();

    for (let action in keys) {
      if (keys[action].key == downKey) {
        keys[action].isDown = true;
      }
    }
  }

  function keyPressListener(evt) {
    var pressedKey = evt.key.toLowerCase();

    for (let action in keysPress) {
      if (keysPress[action].key == pressedKey) {
        keysPress[action].listener();
      }
    }
  }

  function keyUpListener(evt) {
    var upKey = evt.key.toLowerCase();

    for (let action in keys) {
      if (keys[action].key == upKey) {
        keys[action].isDown = false;
      }
    }
  }

  function strInStr(str1, str2) {
    if (typeof(str2) == "object") {
      for (subStr of str2) {
        if (subStr.indexOf(str1) != -1) {
          return true;
        }
      }
      return false;
    }
    if (typeof(str2) == "string") {
      if (str2.indexOf(str1) != -1) {
        return true;
      } else {
        return false;
      }
    }
  }

  function loop() {
    while (pause == true) {

    }

    if (run == false) {
      running = false;
      return;
    }
    running = true;

    // calculate fps and delta time.
    endTime = performance.now();
    deltaTime = (endTime - beginTime) / 1000;
    beginTime = performance.now();
    fps = 1 / deltaTime;

    //console.log(deltaTime, fps);

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // update loop
    for (let id in entities) {
      var entity = entities[id];

      entity.update(deltaTime);
    }

    // draw loop
    for (let id in entities) {
      var entity = entities[id];

      if (entity.draw) {
        entity.draw();
      }
    }

    window.requestAnimationFrame(loop);
  }

  this.getVersion = function() {
    return version;
  }

  this.get2Dcontext = function() {
    return ctx;
  }

  this.start = function() {
    canvas.addEventListener("click", mouseClick);
    canvas.addEventListener("mousedown", mouseDownListener);
    canvas.addEventListener("mouseup", mouseUpListener);

    window.addEventListener("keypress", keyPressListener);
    window.addEventListener("keydown", keyDownListener);
    window.addEventListener("keyup", keyUpListener);

    beginTime = performance.now();
    run = true;
    loop();
  }

  this.pause = function() {
    if (pause == true) {
      pause = false;
      return
    }

    if (pause == false) {
      pause = true;
      return
    }
  }

  this.stop = function() {
    run = false;

    canvas.removeEventListener("click", mouseClick);
    canvas.removeEventListener("mousedown", mouseDownListener);
    canvas.removeEventListener("mouseup", mouseUpListener);

    window.removeEventListener("keypress", keyPressListener);
    window.removeEventListener("keydown", keyDownListener);
    window.removeEventListener("keyup", keyUpListener);
  }


  this.performance = new function() {
    this.fps = function() {
      return fps;
    }

    this.deltaTime = function() {
      return deltaTime;
    }
  }


  this.canvas = new function() {
    this.set = function(elem) {
      if (typeof(elem) == "string") {
        refresh(document.getElementById(elem.replace("#", "")));
      } else {
        refresh(elem);
      }
    }

    this.getWidth = function() {
      return canvas.width;
    }

    this.getHeight = function() {
      return canvas.height;
    }
  }


  this.keyboard = new function() {
    this.add = function(key, action) {
      if (action) {
        keys[action] = {
          key: key.toLowerCase(),
          isDown: false
        }
      } else {
        keys[key] = {
          key: key.toLowerCase(),
          isDown: false
        }
      }
    }

    this.update = function(action, newkey) {
      keys[action].key = newkey;
    }

    this.remove = function(action) {
      delete keys[action];
    }

    this.press = function(key, action, listener) {
      keysPress[action] = {
        key: key,
        listener: listener
      };
    }

    this.isDown = function(action) {
      return keys[action].isDown;
    }
  }


  this.mouse = new function() {
    this.x = 0;
    this.y = 0;

    this.click = function(button, callback) {
      clicks[button].push(callback);
    }

    this.removeClick = function(button, callback) {
      for (var i = 0; i < keys[button].length; i++) {
        if (keys[button][i] == callback) {
          keys[button].splice(i, 1);
        }
      }
    }

    this.isDown = function(button) {
      return mouseDownAndUp[button];
    }
  }

  this.font = new function() {
    this.set = function(font) {
      ctx.font = font;
    }

    this.get = function() {
      return ctx.font
    }
  }


  this.draw = new function() {
    function setDrawMode(mode) {
      if (mode == "fill") {
        ctx.fill();
      }
      if (mode == "line") {
        ctx.stroke();
      }
    }

    this.style = function(mode, style) {
      if (mode == "fill") {
        ctx.fillStyle = style;
      }
      if (mode == "line") {
        ctx.strokeStyle = style
      }
    }

    this.lineCap = function(val) {
      if (val) {
        ctx.lineCap = val;
      } else {
        return ctx.lineCap;
      }
    }

    this.lineDashOffset = function(val) {
      if (val) {
        ctx.lineDashOffset = val;
      } else {
        return ctx.lineDashOffset;
      }
    }

    this.lineJoin = function(val) {
      if (val) {
        ctx.lineJoin = val;
      } else {
        return ctx.lineJoin;
      }
    }

    this.lineWidth = function(val) {
      if (val) {
        ctx.lineWidth = val;
      } else {
        return ctx.lineWidth;
      }
    }

    this.miterLimit = function(val) {
      if (val) {
        ctx.miterLimit = val;
      } else {
        return ctx.miterLimit;
      }
    }

    this.textAlign = function(val) {
      if (val) {
        ctx.textAlign = val;
      } else {
        return ctx.textAlign;
      }
    }

    this.textBaseline = function(val) {
      if (val) {
        ctx.textBaseline = val;
      } else {
        return ctx.textBaseline;
      }
    }

    this.arc = function(drawMode, x, y, radius, startAngle, endAngle) {
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle);
      setDrawMode(drawMode);
      ctx.closePath();
    }

    this.circle = function(drawMode, x, y, radius, segments = 100, angle = 0) {
      ctx.beginPath();

      var sRadius = (Math.PI * 2) / segments;

      ctx.moveTo(x + (Math.cos(0 + angle) * radius), y + (Math.sin(0 + angle) * radius));
      for (var i = 1; i <= segments + 1; i++) {
        ctx.lineTo(x + (Math.cos(i * sRadius + angle) * radius), y + (Math.sin(i * sRadius + angle) * radius));
      }
      setDrawMode(drawMode);

      ctx.closePath();
    }

    this.line = function(x1, y1, x2, y2, segments) {
      ctx.beginPath();

      if (segments) {
        ctx.setLineDash(segments);
      }

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    }

    this.rect = function(drawMode, x, y, w, h) {
      ctx.beginPath();

      ctx.rect(x, y, w, h);

      setDrawMode(drawMode);

      ctx.closePath();
    }

    this.text = function(drawMode, text, x, y, maxWidth) {
      ctx.beginPath();

      if (maxWidth) {
        if (drawMode == "fill") {
          ctx.fillText(text, x, y, maxWidth);
        }
        if (drawMode == "line") {
          ctx.strokeText(text, x, y, maxWidth);
        }
      } else {
        if (drawMode == "fill") {
          ctx.fillText(text, x, y);
        }
        if (drawMode == "line") {
          ctx.strokeText(text, x, y);
        }
      }

      ctx.closePath();

      return ctx.measureText(text);
    }

    this.image = function(img, x, y, w, h) {
      if (w && h) {
        ctx.drawImage(img, x, y, w, h);
      } else {
        ctx.drawImage(img, x, y);
      }
    }

    this.partOfImage = function(img, sx, sy, sw, sh, x, y, w, h) {
      if (w && h) {
        ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
      } else {
        ctx.drawImage(img, sx, sy, sw, sh, x, y);
      }
    }
  }


  this.math = new function() {
    this.distance = function(x1, y1, x2, y2) {
      var a = x1 - x2;
      var b = y1 - y2;

      return Math.sqrt(a * a + b * b);
    }

    this.randomNumber = function(min, max) {
      return Math.round(Math.random() * (max - min) + min);
    }
  }


  this.entities = new function() {
    function generateEntityId() {
      var generate = true;
      var newId;
      var i = 0;

      while (generate && i < 100) {
        newId = Math.round(Math.random() * 1000000);

        if (!entities[newId]) {
          generate = false;
        }

        i++
      }

      return newId
    }

    this.add = function(object) {
      var newId;

      if (object.update && object.type) {
        newId = generateEntityId();
        entities[newId] = object;
        entities[newId].id = newId;

        return newId
      } else {
        console.error("entity doesn't contain a update function and/or a type variable");
        return false;
      }

    }

    this.get = function(id) {
      return entities[id];
    }

    this.remove = function(entity) {
      if (typeof(id) == "object") {
        var id = entity.id;
      } else {
        var id = entity;
      }

      if (entities[id].destroy) {
        entities[id].destroy();
      }
      delete entities[id];
    }
  }
}