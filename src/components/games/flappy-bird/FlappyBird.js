import { useEffect } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";

let bird;
let pipes;
let score;
const sketch = (p5) => {
  p5.setup = () => {
    p5.createCanvas(400, 600);
    resetSketch();
  };

  p5.draw = () => {
    p5.background(0);
    bird.update();
    bird.show();

    if (p5.frameCount % 80 === 0 && bird.y !== p5.height) {
      pipes.push(new Pipe());
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].show();
      pipes[i].update();

      if (pipes[i].hits(bird) || bird.y === p5.height) {
        bird.death();
      }

      if (pipes[i].isOffScreen()) {
        pipes.splice(i, 1);
        score += 9 + p5.floor(score * 0.04);
      }
    }

    p5.fill("#5e0eff");
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.rect(275, 13, 120, 27);

    p5.fill(255);
    p5.strokeWeight(3);
    p5.textSize(20);
    p5.textAlign(p5.RIGHT, p5.CENTER);
    p5.text("Score: " + score, 390, 28);
  };

  p5.keyPressed = () => {
    if (p5.keyCode === 32) {
      bird.fly();
    } else if (p5.keyCode === 13) {
      resetSketch();
    }
  };

  function resetSketch() {
    score = 0;
    bird = new Bird();
    pipes = [];
    p5.frameCount = 0;
    pipes.push(new Pipe());
  }

  class Bird {
    constructor() {
      this.p5 = p5;
      this.y = this.p5.height / 2;
      this.x = 70;
      this.r = 16;
      this.gravity = 0.8;
      this.velocity = 0;

      this.show = function () {
        this.p5.fill("#262fff");
        this.p5.ellipse(this.x, this.y, this.r * 2, this.r * 2);
      };

      this.update = function () {
        this.velocity += this.gravity;
        this.velocity *= 0.9;
        this.y += this.velocity;

        this.y = this.p5.constrain(this.y, 0, this.p5.height);
      };

      this.fly = function () {
        this.velocity -= 20;
      };

      this.death = function () {
        //   textFont(goFont);
        this.p5.fill(255);
        this.p5.stroke(255, 0, 0);
        this.p5.strokeWeight(6);
        this.p5.textSize(40);
        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
        this.p5.text("Game Over", this.p5.width / 2, this.p5.height / 2);
        this.p5.textSize(20);
        this.p5.text(
          "Press 'Enter' to try again",
          this.p5.width / 2,
          this.p5.height / 2 + 35
        );
        this.velocity = 200;

        for (let i = pipes.length - 1; i >= 0; i--) {
          pipes[i].speed = 0;
        }
      };
    }
  }

  class Pipe {
    constructor() {
      this.p5 = p5;
      this.emptySpace =
        this.p5.floor(this.p5.random() * (this.p5.height - 150 - 150 + 1)) +
        150;
      this.x = this.p5.width;
      this.w = 20;
      this.speed = 2;
      this.highlight = false;

      this.show = function () {
        this.p5.fill(255);
        this.p5.noStroke();

        if (this.highlight) {
          this.p5.fill(255, 0, 0);
        }

        this.p5.rect(this.x, 0, this.w, this.emptySpace);
        this.p5.rect(
          this.x,
          this.p5.height - (this.p5.height - this.emptySpace - 125),
          this.w,
          this.p5.height - this.emptySpace
        );
      };

      this.update = function () {
        this.x -= this.speed;
      };

      this.isOffScreen = function () {
        return this.x < -this.w;
      };

      this.hits = function (bird) {
        let distance = this.p5.dist(this.x, this.emptySpace, bird.x, bird.y);
        let _distance = this.p5.dist(
          this.x,
          this.emptySpace + 125,
          bird.x,
          bird.y
        );

        if (distance < bird.r || _distance < bird.r) {
          this.highlight = true;
          return true;
        }

        distance = this.p5.dist(
          this.x + this.w,
          this.emptySpace,
          bird.x,
          bird.y
        );
        _distance = this.p5.dist(
          this.x + this.w,
          this.emptySpace + 125,
          bird.x,
          bird.y
        );

        if (distance < bird.r || _distance < bird.r) {
          this.highlight = true;
          return true;
        }

        if (bird.x + bird.r >= this.x && bird.x + bird.r <= this.x + this.w) {
          if (bird.y < this.emptySpace || bird.y > this.emptySpace + 125) {
            this.highlight = true;
            return true;
          }
        }

        if (this.highlight) {
          this.highlight = false;
          return false;
        }
      };
    }
  }
};

const FlappyBird = () => {
  useEffect(() => {
    fetch("http://api.kubergames.io/kubergames/flappy-bird").then((res) => {
      console.log(res);
      res.json().then((data) => console.log(data));
    });
  }, []);

  return <ReactP5Wrapper sketch={sketch} />;
};

export default FlappyBird;
