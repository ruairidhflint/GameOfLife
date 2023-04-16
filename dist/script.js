"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// DOM elements
const grid = document.querySelector("#root");
const startButton = document.querySelector("#start");
const resetButton = document.querySelector("#reset");
const countDisplay = document.querySelector("#count");
// Global state
let activeGame = false;
let count = 0;
let gameboard = [];
// Get width and height of current window
const width = window.innerWidth;
const height = window.innerHeight;
// Grid squares are 12px x 12px - get number of rows and columns based on the screen size
const rows = Math.ceil(height / 12);
const cols = Math.ceil(width / 12);
// Using rows and cols, push 0s into 2D array to create gameboard state
const createGameMatrix = () => {
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(0);
        }
        gameboard.push(row);
    }
};
// Set minimum height and width for grid to be rendered
grid.style.minHeight = `${height}px`;
grid.style.minWidth = `${width}px`;
const printGrid = () => {
    grid.innerHTML = "";
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
            cell.addEventListener("mousedown", () => {
                if (activeGame)
                    return;
                const [a, b] = cell.id.split("-");
                const x = Number(a);
                const y = Number(b);
                if (cell.classList.contains("alive")) {
                    cell.classList.remove("alive");
                    gameboard[x][y] = 0;
                }
                else {
                    cell.classList.add("alive");
                    gameboard[x][y] = 1;
                }
            });
            row.appendChild(cell);
        }
        grid.appendChild(row);
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
// Set delay between each iteration
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
// Main function to play Game of Life
const playTheGameOfLife = () => __awaiter(void 0, void 0, void 0, function* () {
    // if the game is already active, pause it
    if (activeGame) {
        activeGame = false;
        startButton.textContent = "Start";
        return;
    }
    // else start the game
    activeGame = true;
    startButton.textContent = "Pause";
    // whilst game is active, create a duplicate gameboard,
    // loop through every cell in the dupe, get it's neightbours and apply the ruleset
    // once finished, replace real gameboard with duplicate
    while (activeGame) {
        const dupeboard = [...gameboard.map((a) => [...a])];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const neighbours = getNeighbours(i, j);
                const cell = gameboard[i][j];
                dupeboard[i][j] = applyRules(neighbours, cell);
            }
        }
        gameboard = dupeboard;
        // print updated gameboard
        printGrid();
        // increase count
        ++count;
        // render count
        countDisplay.textContent = String(count);
        // wait n ms for next cycle
        yield delay(300);
    }
});
// Reset all global variables
const reset = () => {
    activeGame = false;
    count = 0;
    countDisplay.textContent = "0";
    startButton.textContent = "Start";
    createGameMatrix();
    printGrid();
};
// Assign actions to buttons
startButton.addEventListener("click", playTheGameOfLife);
resetButton.addEventListener("click", reset);
// Initial render
createGameMatrix();
printGrid();
