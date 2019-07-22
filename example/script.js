class entity {
  constructor() {
    this.type = "example_entity";

    this.x = neo2D.canvas.getWidth() / 2;
    this.y = neo2D.canvas.getHeight() / 2;

    this.speed = 200;

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
    neo2D.draw.style("line", "red");
    neo2D.draw.lineWidth(2);

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