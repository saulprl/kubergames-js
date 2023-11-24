import { ReactP5Wrapper } from "react-p5-wrapper";

const sketch = (p5) => {
  let cols, rows;
  let grid;
  let ant;
  let steps = 0;

  let ANT_UP = 0;
  let ANT_RIGHT = 1;
  let ANT_DOWN = 2;
  let ANT_LEFT = 3;

  p5.setup = () => {
    p5.createCanvas(600, 600);
    cols = 60;
    rows = 60;
    grid = createGrid(cols, rows);
    ant = new LangtonsAnt(p5.floor(cols / 2), p5.floor(rows / 2));
  };

  p5.draw = () => {
    p5.background(255);

    ant.update();
    ant.display();
    displayGrid();
    displaySteps();
  };

  function createGrid(cols, rows) {
    let grid = new Array(cols);
    for (let i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
      for (let j = 0; j < rows; j++) {
        grid[i][j] = 0;
      }
    }

    return grid;
  }

  function displayGrid() {
    let w = p5.width / cols;
    let h = p5.height / rows;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        p5.fill(grid[i][j] === 0 ? "#222222" : "#7145d6");
        p5.rect(i * w, j * h, w, h);
      }
    }
  }

  function displaySteps() {
    p5.fill("#e91e63");
    p5.noStroke();
    p5.rect(8, p5.height - 28, 100, 24);

    p5.fill(255);
    p5.textSize(16);
    p5.text(`${steps} steps`, 10, p5.height - 10);
  }

  class LangtonsAnt {
    constructor(x, y) {
      this.p5 = p5;

      this.x = x;
      this.y = y;
      this.direction = ANT_UP;
    }

    update() {
      let currentColor = grid[this.x][this.y];
      grid[this.x][this.y] = 1 - currentColor;

      if (currentColor === 0) {
        this.direction = (this.direction + 1) % 4;
      } else {
        this.direction = (this.direction + 3) % 4;
      }

      if (this.direction === ANT_UP) {
        this.y--;
      } else if (this.direction === ANT_RIGHT) {
        this.x++;
      } else if (this.direction === ANT_DOWN) {
        this.y++;
      } else if (this.direction === ANT_LEFT) {
        this.x--;
      }

      this.x = (this.x + cols) % cols;
      this.y = (this.y + rows) % rows;

      steps++;
    }

    display() {
      let w = this.p5.width / cols;
      let h = this.p5.height / rows;

      this.p5.fill("#e91e63");
      this.p5.rect(this.x * w, this.y * h, w, h);
    }
  }
};

const LangtonsAnt = () => {
  return <ReactP5Wrapper sketch={sketch} />;
};

export default LangtonsAnt;
