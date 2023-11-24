import { ReactP5Wrapper } from "react-p5-wrapper";

const sketch = (p5) => {
  let cells;
  let current;
  let rows, cols, scl;
  let stack;
  let slider;
  let par;

  p5.setup = () => {
    p5.createCanvas(600, 602);

    slider = p5.createSlider(5, 60, 15, 5);
    par = p5.createP();
    p5.frameRate(slider.value());
    scl = 20;
    rows = p5.floor(p5.height / scl);
    cols = p5.floor(p5.width / scl);
    cells = [];
    stack = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        cells.push(new Cell(i, j, scl));
      }
    }
    current = cells[index(0, 0)];
    current.visit();
  };

  p5.draw = () => {
    p5.background(51);
    p5.frameRate(slider.value());

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        cells[index(i, j)].show();
      }
    }

    p5.fill("#001fff");
    p5.strokeWeight(1);
    p5.rect(current.x, current.y + 1, current.w - 2, current.w - 2);

    let next = current.checkNeighbors();
    if (next) {
      stack.push(current);
      current.knockWallDown(next);
      next.visit();
      current = next;
    } else if (stack.length > 0) {
      current.returned();
      current = stack.pop();
      current.returned();
    }

    par.html("Frame rate: " + p5.floor(p5.frameRate()));
  };

  function index(i, j) {
    if (i < 0 || j < 0 || i > rows - 1 || j > cols - 1) {
      return -1;
    }
    return j + i * rows;
  }

  class Cell {
    constructor(i, j, w) {
      this.p5 = p5;
      this.i = i;
      this.j = j;
      this.w = w;
      this.x = this.j * this.w;
      this.y = this.i * this.w;
      this.visited = false;
      this.walls = [true, true, true, true];
      this.returning = false;
    }

    show() {
      this.p5.noStroke();
      if (this.visited) {
        this.p5.fill("#7145d6");
      } else {
        this.p5.fill("#222222");
      }

      if (this.returning) {
        this.p5.fill("#e91e63");
      }

      this.p5.rect(this.x, this.y, this.w, this.w);

      this.buildWalls();
    }

    buildWalls() {
      this.p5.stroke(0);
      this.p5.strokeWeight(2);

      if (this.walls[0]) {
        this.p5.line(this.x, this.y, this.x + this.w, this.y);
      }

      if (this.walls[1]) {
        this.p5.line(this.x + this.w, this.y, this.x + this.w, this.y + this.w);
      }

      if (this.walls[2]) {
        this.p5.line(this.x + this.w, this.y + this.w, this.x, this.y + this.w);
      }

      if (this.walls[3]) {
        this.p5.line(this.x, this.y + this.w, this.x, this.y);
      }
    }

    checkNeighbors() {
      let neighbors = [];

      let topNeigh = cells[index(this.i - 1, this.j)];
      let rightNeigh = cells[index(this.i, this.j + 1)];
      let bottomNeigh = cells[index(this.i + 1, this.j)];
      let leftNeigh = cells[index(this.i, this.j - 1)];

      if (topNeigh && !topNeigh.visited) {
        neighbors.push(topNeigh);
      }
      if (rightNeigh && !rightNeigh.visited) {
        neighbors.push(rightNeigh);
      }
      if (bottomNeigh && !bottomNeigh.visited) {
        neighbors.push(bottomNeigh);
      }
      if (leftNeigh && !leftNeigh.visited) {
        neighbors.push(leftNeigh);
      }

      if (neighbors.length > 0) {
        let ran = this.p5.floor(this.p5.random(0, neighbors.length));
        return neighbors[ran];
      } else {
        return undefined;
      }
    }

    visit() {
      this.visited = true;
    }

    returned() {
      this.returning = true;
    }

    knockWallDown(next) {
      let yDiff = this.i - next.i;
      let xDiff = this.j - next.j;

      switch (xDiff) {
        case 0:
          switch (yDiff) {
            case -1:
              this.walls[2] = false;
              next.walls[0] = false;
              break;
            case 1:
              this.walls[0] = false;
              next.walls[2] = false;
              break;
            default:
              break;
          }
          break;
        case -1:
          this.walls[1] = false;
          next.walls[3] = false;
          break;
        case 1:
          this.walls[3] = false;
          next.walls[1] = false;
          break;
        default:
          break;
      }
    }
  }
};

const Maze = () => {
  return <ReactP5Wrapper sketch={sketch} />;
};

export default Maze;
