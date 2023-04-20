"use strict";
// DOM elements
const grid = document.querySelector("#root");
const startButton = document.querySelector("#start");
const resetButton = document.querySelector("#reset");
const playButton = document.querySelector("#play");
const countDisplay = document.querySelector("#count");
const modal = document.querySelector("#modal-window");
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
    gameboard = [];
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
// function to render grid to DOM
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
// functiont hat will get all values for neighbouring cells of any cell provided
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
// taking in the neighbouring cell values and the cell, return if the cell should live or die based on Conway's rulesr
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
const checkGameHasStopped = (currentBoard, nextBoard) => {
    const flattenCurrent = currentBoard.flat();
    const flattenNext = nextBoard.flat();
    return flattenCurrent.every((value, index) => value === flattenNext[index]);
};
// Main function to play Game of Life
const playTheGameOfLife = async () => {
    const isNotBlankBoard = gameboard.flat().some(Boolean);
    if (!isNotBlankBoard) {
        return;
    }
    // if the game is already active, pause it
    if (activeGame) {
        activeGame = false;
        startButton.textContent = "Start";
        resetButton.disabled = false;
        return;
    }
    // else start the game
    resetButton.disabled = true;
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
        if (checkGameHasStopped(gameboard, dupeboard)) {
            // should pause the game
            activeGame = false;
            startButton.disabled = true;
            startButton.textContent = "Start";
            resetButton.disabled = false;
            return;
        }
        gameboard = dupeboard;
        // print updated gameboard
        printGrid();
        // increase count
        ++count;
        // render count
        countDisplay.textContent = String(count);
        // wait n ms for next cycle
        await delay(300);
    }
};
// Reset all global variables
const reset = () => {
    activeGame = false;
    count = 0;
    countDisplay.textContent = "0";
    startButton.textContent = "Start";
    startButton.disabled = false;
    createGameMatrix();
    printGrid();
};
// Close initial modal
const closeModal = () => {
    modal.style.display = "none";
};
// Assign actions to buttons
startButton.addEventListener("click", playTheGameOfLife);
startButton.addEventListener("click", playTheGameOfLife);
playButton.addEventListener("click", closeModal);
// Initial render
createGameMatrix();
printGrid();
