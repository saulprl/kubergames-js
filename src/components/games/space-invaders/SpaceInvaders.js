import { useEffect } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { Box, Grid, Skeleton, Button, TextField } from "@mui/material";

let ship;
let aliens = [];
let bullets = [];
let shifted;
let paused;
let score;
let leftArrow;
let rightArrow;
let alien;
let spacebar;
let shipIcon;
let bolt;

const sketch = (p5) => {
  // p5.preload = () => {
  // alien = p5.loadImage("./assets/space-invaders/alien.png", (img) => img);
  // leftArrow = p5.loadImage(
  //   "./assets/space-invaders/left-arrow.png",
  //   (img) => img
  // );
  // rightArrow = p5.loadImage(
  //   "./assets/space-invaders/right-arrow.png",
  //   (img) => img
  // );
  // spacebar = p5.loadImage(
  //   "./assets/space-invaders/spacebar.png",
  //   (img) => img
  // );
  // shipIcon = p5.loadImage("./assets/space-invaders/ship.png", (img) => img);
  // bolt = p5.loadImage("./assets/space-invaders/bolt.png", (img) => img);
  // };
  p5.setup = () => {
    alien = p5.loadImage("./assets/space-invaders/alien.png", (img) => img);
    leftArrow = p5.loadImage(
      "./assets/space-invaders/left-arrow.png",
      (img) => img
    );
    rightArrow = p5.loadImage(
      "./assets/space-invaders/right-arrow.png",
      (img) => img
    );
    spacebar = p5.loadImage(
      "./assets/space-invaders/spacebar.png",
      (img) => img
    );
    shipIcon = p5.loadImage("./assets/space-invaders/ship.png", (img) => img);
    bolt = p5.loadImage("./assets/space-invaders/bolt.png", (img) => img);
    p5.createCanvas(540, 600);
    resetSketch();
  };

  p5.draw = () => {
    p5.background(51);
    ship.show();

    if (shifted && !ship.dead) {
      if (p5.frameCount < 1000) {
        createAliens(1);
      } else if (p5.frameCount < 2500) {
        createAliens(2);
      } else {
        createAliens(3);
      }
      shifted = false;
    }

    if (aliens.length !== 0) {
      for (let i = 0; i < aliens.length; i++) {
        aliens[i].show();
        aliens[i].move();

        if (!aliens[i].edge()) {
          continue;
        }
        for (let j = 0; j < aliens.length; j++) {
          if (aliens[j].verticalLimit()) {
            ship.hit = true;
            if (ship.lives > 1) {
              clearAliens();
            }
            break;
          }

          if (p5.frameCount < 1000) {
            aliens[j].bringCloser(1);
          } else if (p5.frameCount < 2500) {
            aliens[j].bringCloser(2);
          } else if (p5.frameCount >= 2500) {
            aliens[j].bringCloser(3);
          }

          aliens[j].dir *= -1;
        }
        shifted = true;
      }
    } else {
      shifted = true;
    }

    if (ship.dead) {
      ship.lock();

      for (let i = 0; i < aliens.length; i++) {
        aliens[i].dir = 0;
      }

      p5.fill(255);
      p5.stroke(255, 0, 0);
      p5.strokeWeight(4);
      p5.textSize(40);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text("Game Over", (p5.width - 120) / 2, p5.height / 2);

      p5.textSize(20);
      p5.text(
        "Press 'Enter' to try again",
        (p5.width - 120) / 2,
        p5.height / 2 + 30
      );
    } else if (ship.hit) {
      ship.death();
      ship.hit = false;
    }

    for (let i = 0; i < bullets.length; i++) {
      bullets[i].show();
      bullets[i].move();

      for (let j = 0; j < aliens.length; j++) {
        if (bullets[i].hits(aliens[j])) {
          score += p5.floor(7 + aliens.length * 0.2);
          aliens[j].destroy();
          bullets[i].destroy();
        } else if (bullets[i].offScreen()) {
          bullets[i].destroy();
        }
      }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
      if (bullets[i].toDestroy) {
        bullets.splice(i, 1);
      }
    }

    for (let i = aliens.length - 1; i >= 0; i--) {
      if (aliens[i].toDestroy) {
        aliens.splice(i, 1);
      }
    }

    if (p5.frameCount < 120) {
      p5.fill(255);
      p5.stroke(255, 0, 0);
      p5.strokeWeight(3);
      p5.textSize(20);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(
        "Press 'P' to pause or unpause",
        (p5.width - 120) / 2,
        p5.height / 2
      );
      p5.text("Press 'Enter' to reset", (p5.width - 120) / 2, 350);
    }

    if (paused) {
      p5.fill(255);
      p5.stroke(255, 0, 0);
      p5.textSize(40);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text("Paused", (p5.width - 120) / 2, p5.height / 2);
      pauseGame();
    }

    ship.move();
    showScoreboard();
  };

  const clearAliens = () => {
    aliens = [];
  };

  const createAliens = (multiplier) => {
    let direction = 1;
    for (let i = 0; i < 6; i++) {
      switch (multiplier) {
        case 1:
          aliens.push(new Alien(i * 60 + 30, 40, direction));
          break;
        case 2:
          aliens.push(new Alien(-i * 60 + 390, 40, -direction));
          aliens.push(new Alien(i * 60 + 30, 88, direction));
          break;
        case 3:
          aliens.push(new Alien(i * 60 + 30, 40, direction));
          aliens.push(new Alien(-i * 60 + 390, 88, -direction));
          aliens.push(new Alien(i * 60 + 30, 136, direction));
          break;
        default:
          aliens.push(new Alien(i * 60 + 30, 40, direction));
          multiplier--;
      }
    }
  };

  const showScoreboard = () => {
    p5.noStroke();

    p5.fill(0, 255, 0, 40);
    p5.rect(420, 0, 120, 600);

    p5.fill(255);
    p5.stroke(255, 0, 0);
    p5.strokeWeight(4);
    p5.textSize(20);
    p5.textAlign(p5.RIGHT, p5.CENTER);
    p5.text("Score", 530, 20);

    p5.noStroke();
    p5.fill(0);
    p5.rect(425, 31, 110, 22);

    p5.fill(255);
    p5.stroke(255, 0, 0);
    p5.textSize(20);
    p5.textAlign(p5.RIGHT, p5.CENTER);
    p5.text("" + score, 530, 44);

    p5.text("Lives", 530, 70);

    for (let i = 0; i < ship.lives; i++) {
      p5.image(shipIcon, i * 34 + 446, 98, 32, 32);
    }

    p5.noStroke();
    p5.imageMode(p5.CENTER);
    p5.image(leftArrow, 464, 500, 32, 32);
    p5.image(rightArrow, 498, 500, 32, 32);

    p5.fill(0);
    p5.textSize(20);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text("Move", 480, 470);

    p5.imageMode(p5.CENTER);
    p5.image(spacebar, 480, 560, 48, 48);

    p5.text("Fire", 480, 540);
  };

  p5.keyReleased = () => {
    switch (p5.keyCode) {
      case 37:
      case 39:
        ship.dir = 0;
        break;
      default:
        break;
    }
  };

  p5.keyPressed = () => {
    switch (p5.keyCode) {
      case 13:
        resetSketch();
        break;
      case 32:
        if (!ship.dead) {
          // let bullet = new Bullet(ship.x, p5.height - 30);
          bullets.push(new Bullet(ship.x, p5.height - 30));
        }
        break;
      case 37:
        ship.dir = -1;
        break;
      case 39:
        ship.dir = 1;
        break;
      case 80:
        paused = !paused;
        if (paused) {
          pauseGame();
        } else {
          unpauseGame();
        }
        break;
      default:
        break;
    }
  };

  const resetSketch = () => {
    ship = new Ship();
    bullets = [];
    aliens = [];

    p5.frameRate(60);
    p5.frameCount = 0;

    shifted = false;
    paused = false;
    score = 0;

    p5.constrain(ship.x, 20, 400);

    createAliens(3);
  };

  const pauseGame = () => {
    p5.noLoop();
  };

  const unpauseGame = () => {
    p5.loop();
  };

  class Bullet {
    constructor(x, y) {
      this.p5 = p5;
      this.x = x;
      this.y = y;
      this.r = 8;
      this.toDestroy = false;

      this.show = function () {
        this.p5.noFill();
        this.p5.noStroke();
        this.p5.ellipse(this.x, this.y, this.r * 2, this.r * 2);
        this.p5.image(bolt, this.x, this.y, 14, 14);
      };

      this.move = function () {
        this.y += -10;
      };

      this.offScreen = function () {
        return this.y <= -this.r;
      };

      this.hits = function (alien) {
        let distance = this.p5.dist(this.x, this.y, alien.x, alien.y);

        return distance <= this.r + alien.r;
      };

      this.destroy = function () {
        this.toDestroy = true;
      };
    }
  }

  class Alien {
    constructor(x, y, dir) {
      this.p5 = p5;
      this.x = x;
      this.y = y;
      this.r = 16;
      this.dir = dir;
      this.toDestroy = false;

      this.show = function () {
        this.p5.noFill();
        this.p5.noStroke();
        this.p5.ellipse(this.x, this.y, this.r * 2, this.r * 2);
        this.p5.image(alien, this.x, this.y, 32, 32);
      };

      this.move = function () {
        this.x += this.dir * 0.3;
      };

      this.bringCloser = function (times) {
        this.y += 48 * times;
      };

      this.edge = function () {
        if (this.x < 30) {
          this.x = 30;
          return true;
        } else if (this.x > 390) {
          this.x = 390;
          return true;
        }
        return false;
      };

      this.destroy = function () {
        this.toDestroy = true;
      };

      this.verticalLimit = function () {
        return this.y > 460;
      };
    }
  }

  class Ship {
    constructor() {
      this.p5 = p5;
      this.x = (this.p5.width - 120) / 2;
      this.dir = 0;
      this.lives = 3;
      this.dead = false;
      this.hit = false;

      this.show = function () {
        this.p5.noFill();
        this.p5.noStroke();
        this.p5.triangle(
          this.x,
          this.p5.height - 30,
          this.x + 20,
          this.p5.height - 10,
          this.x - 20,
          this.p5.height - 10
        );
        this.p5.image(shipIcon, this.x, this.p5.height - 30, 40, 40);
      };

      this.move = function () {
        this.x += this.dir * 5;

        this.x = this.p5.constrain(this.x, 20, 400);
      };

      this.death = function () {
        if (this.lives === 1) {
          this.dead = true;
          this.lives--;
        } else {
          this.lives--;
        }
      };

      this.lock = function () {
        if (this.dead) {
          this.x = (this.p5.width - 120) / 2;
          this.x = this.p5.constrain(
            this.x,
            (this.p5.width - 120) / 2,
            (this.p5.width - 120) / 2
          );
        }
      };
    }
  }
};

const SpaceInvaders = () => {
  let content = <Skeleton animation="wave" variant="rounded" height={60} width="100%"></Skeleton>
  useEffect(() => {
    fetch("http://api.kubergames.io/kubergames/space-invaders").then((res) => {
      console.log(res);
      content = res.json().then((data) => data).map((row) => 
      <>
      <Grid item xs={6}>{row['name_si']}</Grid>
      <Grid item xs={6}>{row['score_si']}</Grid>
      </>);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      name: event.target.name.value,
      score: score,
    }
    await fetch("http://api.kubergames.io/kubergames/space-invaders", {
      method: "POST",
      body: JSON.stringify(data),
    });
    fetch("http://api.kubergames.io/kubergames/space-invaders").then((res) => {
      console.log(res);
      content = res.json().then((data) => data).map((row) => 
      <>
      <Grid item xs={6}>{row['name_si']}</Grid>
      <Grid item xs={6}>{row['score_si']}</Grid>
      </>);
    });
  };

  return (
    <Box sx={{display:"flex", justifyContent:"space-between"}}>
    <ReactP5Wrapper sketch={sketch} />
    <Box>
      <form onSubmit={handleSubmit}>
    <TextField label="Nombre" name="name" inputProps={{maxlength:4}}></TextField>
    <Button type="submit">Submit</Button>
    </form>
    <Grid container>{content}</Grid>
    </Box>
    </Box>);
};

export default SpaceInvaders;
