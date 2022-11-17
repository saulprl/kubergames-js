import { ReactP5Wrapper } from "react-p5-wrapper";

let scl;
let grid;
let remaining;
let mines;
let cols, rows;
let finished;
let blownUp;
let displayed;

const sketch = (p5) => {
  p5.setup = () => {
    window.oncontextmenu = () => {
      return false;
    };

    p5.createCanvas(640.5, 640.5);
    resetSketch();
  };

  p5.draw = () => {
    p5.background(51);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j].show();
      }
    }

    let remains = 0;
    let minesLeft = mines;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (!grid[i][j].mine) {
          if (!grid[i][j].revealed) {
            remains++;
          }
        } else if (grid[i][j].flagged) {
          minesLeft--;
        }
      }
    }
    remaining = remains;

    if (remaining === 0 || minesLeft === 0) {
      finished = true;
    }

    if (displayed) {
      p5.noLoop();
    }

    if (finished) {
      if ((remaining === 0 || minesLeft === 0) && !blownUp) {
        gameOver(1);
      } else {
        gameOver(0);
      }
    }
  };

  const makeGrid = (cols, rows) => {
    let gridCols = new Array(cols);

    for (let i = 0; i < gridCols.length; i++) {
      gridCols[i] = new Array(rows);
    }

    return gridCols;
  };

  p5.mousePressed = (event) => {
    switch (event.button) {
      case 0:
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            if (grid[i][j].contains(p5.mouseX, p5.mouseY)) {
              if (grid[i][j].revealed) {
                grid[i][j].revealAround();
              } else {
                grid[i][j].reveal();
              }

              if (grid[i][j].mine && !grid[i][j].flagged) {
                finished = true;
                blownUp = true;
              }
            }
          }
        }
        break;
      case 2:
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            if (grid[i][j].contains(p5.mouseX, p5.mouseY)) {
              grid[i][j].flag();
            }
          }
        }
        break;
      default:
        break;
    }
  };

  p5.keyPressed = () => {
    switch (p5.keyCode) {
      case 13:
        displayed = false;
        p5.loop();
        resetSketch();
        break;
      default:
        break;
    }
  };

  const gameOver = (state) => {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j].reveal();
      }
    }

    switch (state) {
      case 0:
        p5.fill(255, 0, 0);
        p5.textSize(40);
        p5.strokeWeight(4);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text("Game Over", p5.width / 2, p5.height / 2);

        p5.textSize(27);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.strokeWeight(3);
        p5.text("Press 'Enter' to try again", p5.width / 2, p5.height / 2 + 30);
        displayed = true;
        break;
      case 1:
        p5.textSize(40);
        p5.fill(0, 0, 255);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.strokeWeight(4);
        p5.text("You won!", p5.width / 2, p5.height / 2);

        p5.textSize(27);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.strokeWeight(3);
        p5.text(
          "Press 'Enter' to play again!",
          p5.width / 2,
          p5.height / 2 + 30
        );
        break;
      default:
        break;
    }
  };

  const resetSketch = () => {
    scl = 40;
    cols = p5.floor(p5.width / scl);
    rows = p5.floor(p5.height / scl);
    grid = makeGrid(cols, rows);
    mines = 0;
    remaining = 0;
    finished = false;
    blownUp = false;
    displayed = false;
    p5.frameCount = 0;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = new Cell(i, j, scl);
      }
    }

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j].countMinesAround();

        if (grid[i][j].mine) {
          mines++;
        }
      }
    }
  };

  class Cell {
    constructor(i, j, scl) {
      this.p5 = p5;
      this.i = i;
      this.j = j;
      this.scl = scl;
      this.x = this.i * scl;
      this.y = this.j * scl;
      this.mine = this.p5.random(1) > 0.85;
      this.minesAround = 0;
      this.toReveal = false;
      this.revealed = false;
      this.flagged = false;

      this.show = function () {
        this.p5.stroke(2);
        this.p5.strokeWeight(2);
        if (this.flagged && !this.revealed) {
          this.p5.fill(225, 20, 0);
        } else if (!this.revealed) {
          this.p5.fill(155);
        }

        this.p5.rect(this.x, this.y, scl, scl);

        if (this.toReveal && !this.flagged) {
          this.p5.fill(200);
          this.p5.rect(this.x, this.y, scl, scl);
          this.revealed = true;

          if (this.mine) {
            this.p5.noStroke();
            this.p5.fill(25);
            this.p5.ellipse(
              this.x + this.scl / 2,
              this.y + this.scl / 2,
              scl / 2
            );
          } else {
            if (this.minesAround !== 0) {
              this.p5.fill(0);
              this.p5.textSize(17);
              this.p5.strokeWeight(1);
              this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
              this.p5.text(
                this.minesAround,
                this.x + scl / 2,
                this.y + scl / 2 + 2
              );
            } else {
              for (let xOff = -1; xOff <= 1; xOff++) {
                for (let yOff = -1; yOff <= 1; yOff++) {
                  let k = this.i + xOff;
                  let l = this.j + yOff;

                  if (k > -1 && k < cols && l > -1 && l < rows) {
                    grid[k][l].reveal();
                  }
                }
              }
            }
          }
        } else {
          this.toReveal = false;
        }
      };

      this.contains = function (x, y) {
        return (
          x > this.x &&
          x < this.x + this.scl &&
          y > this.y &&
          y < this.y + this.scl
        );
      };

      this.reveal = function () {
        this.toReveal = true;
      };

      this.countMinesAround = function () {
        if (this.mine) {
          return -1;
        }

        let total = 0;
        for (let xOff = -1; xOff <= 1; xOff++) {
          for (let yOff = -1; yOff <= 1; yOff++) {
            let k = this.i + xOff;
            let l = this.j + yOff;

            if (k > -1 && k < cols && l > -1 && l < rows) {
              let neighbor = grid[k][l];
              if (neighbor.mine) {
                total++;
              }
            }
          }
        }

        this.minesAround = total;
      };

      this.flag = function () {
        this.flagged = !this.flagged;
      };

      this.revealAround = function () {
        if (this.revealed) {
          let flaggedAround = 0;

          for (let xOff = -1; xOff <= 1; xOff++) {
            for (let yOff = -1; yOff <= 1; yOff++) {
              let k = this.i + xOff;
              let l = this.j + yOff;

              if (k > -1 && k < cols && l > -1 && l < rows) {
                if (grid[k][l].flagged) {
                  flaggedAround++;
                }
              }
            }
          }

          if (flaggedAround === this.minesAround) {
            for (let xOff = -1; xOff <= 1; xOff++) {
              for (let yOff = -1; yOff <= 1; yOff++) {
                let k = this.i + xOff;
                let l = this.j + yOff;

                if (k > -1 && k < cols && l > -1 && l < rows) {
                  if (!grid[k][l].flagged) {
                    grid[k][l].reveal();
                  }
                }
              }
            }
          }
        }
      };
    }
  }
};

const Minesweeper = () => {
  return <ReactP5Wrapper sketch={sketch} />;
};

export default Minesweeper;
