const root = document.querySelector(".root");
const startButton = document.querySelector("#start");

const rows = 50;
const cols = 50;
let gameboard = [];

const createGameMatrix = () => {
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(0);
    }
    gameboard.push(row);
  }
};

const printGrid = () => {
  root.innerHTML = "";
  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `${i}-${j}`;
      if (gameboard[i][j]) {
        cell.classList.add("alive");
      }
      cell.addEventListener("click", () => {
        const [x, y] = cell.id.split("-");
        if (cell.classList.contains("alive")) {
          cell.classList.remove("alive");
          gameboard[x][y] = 0;
        } else {
          cell.classList.add("alive");
          gameboard[x][y] = 1;
        }
      });
      row.appendChild(cell);
    }
    root.appendChild(row);
  }
};

function getNeighbours(x, y) {
  const maxRows = gameboard.length;
  const maxCols = gameboard[0].length;
  const neighbors = [];

  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i >= 0 && j >= 0 && i < maxRows && j < maxCols) {
        if (!(i === x && j === y)) {
          neighbors.push(gameboard[i][j]);
        }
      }
    }
  }

  return neighbors;
}

const applyRules = (neighbours, cell) => {
  const livingNeighbours = neighbours.filter(Boolean).length;
  if (cell && (livingNeighbours === 2 || livingNeighbours === 3)) {
    return 1;
  }

  if (!cell && livingNeighbours === 3) {
    return 1;
  }

  return 0;
};
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const playTheGameOfLife = async () => {
  const iterations = 100;
  for (let it = 0; it < iterations; it++) {
    console.log("fired");
    const dupeboard = [...gameboard.map((a) => [...a])];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const neighbours = getNeighbours(i, j);
        const cell = gameboard[i][j];
        dupeboard[i][j] = applyRules(neighbours, cell);
      }
    }
    gameboard = dupeboard;
    printGrid();
    await delay(500);
  }
};

startButton.addEventListener("click", playTheGameOfLife);

createGameMatrix();
printGrid();
