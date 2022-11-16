import Sketch from "react-p5";

let scl = 20;
let snake;
let food;
let score;
let apple;
let paused;

const SnakeGame = (props) => {
  const preload = (p5) => {
    apple = p5.loadImage("./assets/snake-game/apple.png", (img) => img);
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(500, 620).parent(canvasParentRef);
    snake = new Snake(p5);
    score = 0;
    paused = false;
    p5.frameRate(12);
    pickLocation(p5);
  };

  const draw = (p5) => {
    p5.strokeWeight(1);
    p5.stroke(0);

    p5.background(85);
    snake.death();
    snake.update();
    snake.show();

    if (snake.eat(food)) {
      pickLocation(p5);
      score += 7 + p5.floor(0.2 * snake.total);
    }

    p5.fill(0);
    p5.rect(0, 0, 500, 120);

    p5.noFill();
    p5.noStroke();
    p5.rect(food.x, food.y, scl, scl);
    p5.image(apple, food.x, food.y, 21, 21);

    p5.strokeWeight(3);
    p5.stroke("#ff004b");
    p5.fill("#3211ff");
    p5.rect(180, 20, 140, 80, 20);

    p5.fill("#ff200d");

    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(60);
    p5.text("" + score, 252, 63);

    // if (p5.frameCount < 24) {
    //   p5.fill("#ff200d");
    //   p5.strokeWeight(1);
    //   p5.textAlign(p5.CENTER, p5.CENTER);
    //   p5.textSize(20);
    //   p5.text("Press 'P' to pause or unpause", p5.width / 2, p5.height - 20);
    // }

    // if (paused) {
    //   p5.textSize(40);
    //   p5.text("Paused", p5.width / 2, p5.height / 2);
    //   // pause();
    // }
  };

  const pickLocation = (p5) => {
    let columns = p5.floor(p5.width / scl);
    let rows = p5.floor(p5.height / scl);

    food = p5.createVector(
      p5.floor(p5.random(columns)),
      p5.floor(p5.random(rows - 6) + 6)
    );
    food.mult(scl);

    for (let i = 0; i < snake.tail.length; i++) {
      if (food.x === snake.tail[i].x && food.y === snake.tail[i].y) {
        pickLocation(p5);
      }
    }
  };

  const keyPressed = (p5) => {
    switch (p5.keyCode) {
      case p5.UP_ARROW:
      case 87:
        snake.dir(0, -1);
        break;
      case p5.DOWN_ARROW:
      case 83:
        snake.dir(0, 1);
        break;
      case p5.LEFT_ARROW:
      case 65:
        snake.dir(-1, 0);
        break;
      case p5.RIGHT_ARROW:
      case 68:
        snake.dir(1, 0);
        break;
      case 80:
        paused = !paused;
        if (paused) {
          pause(p5);
        } else {
          unpause(p5);
        }
        break;
      default:
        break;
    }
  };

  const pause = (p5) => {
    p5.noLoop();
  };

  const unpause = (p5) => {
    p5.loop();
    p5.frameRate(12);
  };

  return (
    <Sketch
      keyPressed={keyPressed}
      preload={preload}
      setup={setup}
      draw={draw}
    />
  );
};

class Snake {
  constructor(p5) {
    this.p5 = p5;
    this.x = 0;
    this.y = 120;
    this.xspeed = 1;
    this.yspeed = 0;
    this.total = 0;
    this.tail = [];

    this.update = function () {
      if (this.total === this.tail.length) {
        for (let i = 0; i < this.tail.length; i++) {
          this.tail[i] = this.tail[i + 1];
        }
      }

      this.tail[this.total - 1] = this.p5.createVector(this.x, this.y);

      this.x += this.xspeed * scl;
      this.y += this.yspeed * scl;

      this.x = this.p5.constrain(this.x, 0, this.p5.width - scl);
      this.y = this.p5.constrain(this.y, 120, this.p5.height - scl);
    };

    this.show = function () {
      this.p5.fill(255);
      for (let i = 0; i < this.tail.length; i++) {
        this.p5.rect(this.tail[i].x, this.tail[i].y, scl, scl);
      }

      this.p5.fill(255);
      for (let i = 0; i < this.total; i++) {
        this.p5.rect(this.tail[i].x, this.tail[i].y, scl, scl);
      }

      this.p5.rect(this.x, this.y, scl, scl);
    };

    this.dir = function (x, y) {
      if (this.xspeed !== 0 && x === 0) {
        this.xspeed = x;
        this.yspeed = y;
      } else if (this.yspeed !== 0 && y === 0) {
        this.xspeed = x;
        this.yspeed = y;
      }
    };

    this.eat = function (pos) {
      let distance = this.p5.dist(this.x, this.y, pos.x, pos.y);

      if (distance < 1) {
        this.total++;
        return true;
      } else {
        return false;
      }
    };

    this.death = function () {
      for (let i = 0; i < this.tail.length; i++) {
        let pos = this.tail[i];
        let distance = this.p5.dist(this.x, this.y, pos.x, pos.y);

        if (distance < 1) {
          this.total = 0;
          this.tail = [];
          score = 0;
        }
      }
    };
  }
}

export default SnakeGame;
