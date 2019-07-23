class entity {
  constructor() {
    this.type = "example_entity";

    this.x = neo2D.canvas.getWidth() / 2;
    this.y = neo2D.canvas.getHeight() / 2;

    this.speed = 100;

    this.canvas = 1;

    // get image
    this.img = new Image();
    this.img.src = "./image.jpeg"

    neo2D.keyboard.add("w", "up");
    neo2D.keyboard.add("s", "down");
    neo2D.keyboard.add("a", "left");
    neo2D.keyboard.add("d", "right");
  }

  update(dt) {
    if (neo2D.keyboard.isDown("up")) {
      this.y -= this.speed * dt;
    }
    if (neo2D.keyboard.isDown("down")) {
      this.y += this.speed * dt;
    }
    if (neo2D.keyboard.isDown("left")) {
      this.x -= this.speed * dt;
    }
    if (neo2D.keyboard.isDown("right")) {
      this.x += this.speed * dt;
    }
  }

  draw() {
    neo2D.draw.style("fill", "black"); // set fill color
    var fpsText = neo2D.draw.text("fill", "fps: " + Math.round(neo2D.performance.fps()), 250, 50, 50);
    neo2D.draw.text("fill", "Dt: " + Math.round(neo2D.performance.deltaTime() * 1000), 250, 70, 50);

    // set lineWidth
    neo2D.draw.lineWidth(2);

    // set line color
    neo2D.draw.style("line", "green");

    // draw arc
    neo2D.draw.arc("line", 250, 250, 15, 0, 3);

    // draw line
    neo2D.draw.style("line", "blue");
    neo2D.draw.line(neo2D.math.randomNumber(0, 300), neo2D.math.randomNumber(0, 300), 150, 150);

    // draw rectangle
    neo2D.draw.style("fill", "yellow") // set fill color;
    neo2D.draw.rect("fill", 50, 200, 50, 25, 1);

    // draw image
    neo2D.draw.image(this.img, 10, 75, 100, 100);

    // draw part of image
    neo2D.draw.partOfImage(this.img, 85, 0, 50, 60, 190, 75, 100, 120);

    // draw simple red circle
    neo2D.draw.style("line", "red");
    neo2D.draw.circle("line", this.x, this.y, 20);
  }
}

$(document).ready(function() {
  neo2D.entities.add(new entity());

  neo2D.keyboard.press("1", "switchCanvas1", function() {
    neo2D.canvas.set("neo1");
    console.log("neo1");
  });

  neo2D.keyboard.press("2", "switchCanvas2", function() {
    neo2D.canvas.set("neo2");
    console.log("neo2");
  });

  neo2D.start();
});