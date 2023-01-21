import { Box, Button, Card, CardContent, TextField } from "@mui/material";
import { useRef, useState } from "react";

import { ReactP5Wrapper } from "react-p5-wrapper";

import Scores from "../../layout/Scores";

let scl = 20;
let snake;
let food;
let score = 0;
let apple;
let paused;

const sketch = (p5) => {
  // p5.preload = () => {
  // };

  p5.setup = () => {
    apple = p5.loadImage("./assets/snake-game/apple.png", (img) => img);
    p5.createCanvas(500, 620);
    snake = new Snake();
    score = 0;
    paused = false;
    p5.frameRate(13);
    pickLocation();
  };

  p5.draw = () => {
    p5.strokeWeight(1);
    p5.stroke(0);

    p5.background(85);
    snake.death();
    snake.update();
    snake.show();

    if (snake.dead) {
      snake.lock();

      p5.fill(255);
      p5.stroke(255, 0, 0);
      p5.strokeWeight(6);
      p5.textSize(40);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text("Game Over", p5.width / 2, p5.height / 2);

      p5.textSize(20);
      p5.text("Press 'Enter' to try again", p5.width / 2, p5.height / 2 + 30);
    }

    if (snake.eat(food)) {
      pickLocation();
      score += 7 + p5.floor(0.2 * snake.total);
    }

    p5.fill(0);
    p5.noStroke();
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
    p5.fill(255);
    p5.stroke(255, 0, 0);
    p5.strokeWeight(4);
    p5.textSize(60);
    p5.text("" + score, 252, 63);

    if (p5.frameCount < 24) {
      p5.fill(255);
      p5.stroke(255, 0, 0);
      p5.textSize(20);
      p5.strokeWeight(3);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text("Press 'P' to pause or unpause", p5.width / 2, p5.height - 42);
      p5.text("Press 'Enter' to reset", p5.width / 2, p5.height - 18);
    }

    if (paused) {
      p5.fill(255);
      p5.stroke(255, 0, 0);
      p5.textSize(40);
      p5.strokeWeight(4);

      p5.text("Paused", p5.width / 2, p5.height / 2);
      // pause();
    }
  };

  p5.keyPressed = () => {
    switch (p5.keyCode) {
      case 13:
        resetSketch();
        break;
      case p5.UP_ARROW:
      case 87:
        if (!snake.dead) snake.dir(0, -1);
        break;
      case p5.DOWN_ARROW:
      case 83:
        if (!snake.dead) snake.dir(0, 1);
        break;
      case p5.LEFT_ARROW:
      case 65:
        if (!snake.dead) snake.dir(-1, 0);
        break;
      case p5.RIGHT_ARROW:
      case 68:
        if (!snake.dead) snake.dir(1, 0);
        break;
      case 80:
        paused = !paused;
        if (paused) {
          pause();
        } else {
          unpause();
        }
        break;
      default:
        break;
    }
  };

  const resetSketch = () => {
    snake = new Snake();
    score = 0;
    paused = false;
    p5.frameRate(13);
    p5.frameCount = 0;
  };

  const pause = () => {
    p5.noLoop();
  };

  const unpause = () => {
    p5.loop();
    p5.frameRate(13);
  };

  const pickLocation = () => {
    let columns = p5.floor(p5.width / scl);
    let rows = p5.floor(p5.height / scl);

    food = p5.createVector(
      p5.floor(p5.random(columns)),
      p5.floor(p5.random(rows - 6) + 6)
    );
    food.mult(scl);

    for (let i = 0; i < snake.tail.length; i++) {
      if (food.x === snake.tail[i].x && food.y === snake.tail[i].y) {
        pickLocation();
      }
    }
  };

  class Snake {
    constructor() {
      this.p5 = p5;
      this.x = 0;
      this.y = 120;
      this.xspeed = 1;
      this.yspeed = 0;
      this.total = 0;
      this.tail = [];
      this.dead = false;

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

        this.p5.fill("#e91e63");
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
            this.dead = true;
            // this.total = 0;
            // this.tail = [];
            // score = 0;
          }
        }
      };

      this.lock = function () {
        this.xspeed = 0;
        this.yspeed = 0;
      };
    }
  }
};

const SnakeGame = () => {
  const nameRef = useRef();
  const [error, setError] = useState("");

  const host = process.env.REACT_APP_API_URL;

  const submitChangeHandler = (event) => {
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (event.target.name.value === "") {
      setError("Ingresa un nombre.");
      return;
    }
    if (!snake.dead) {
      setError("Debes acabar la partida antes de guardar tu puntuación.");
      return;
    }

    const data = {
      name: event.target.name.value,
      score: score,
    };
    await fetch(`${host}/kubergames/snake-game/`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    nameRef.current.value = "";
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <ReactP5Wrapper sketch={sketch} />
      <Card
        className="score-card"
        variant="outlined"
        sx={{
          borderRadius: "12px",
          maxHeight: "38rem",
          width: "35%",
          overflow: "auto",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <TextField
                inputRef={nameRef}
                required
                onChange={submitChangeHandler}
                label="Nombre"
                name="name"
                inputProps={{ maxLength: 4 }}
                error={error !== ""}
                helperText={error !== "" && error}
              />
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Box>
            <Scores game="snake-game" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SnakeGame;
