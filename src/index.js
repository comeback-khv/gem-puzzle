import "./index.scss";
import "./index.html";

const body = document.querySelector(".body");
const container = document.createElement("div");
const buttons = document.createElement("div");
const stats = document.createElement("div");
const tiles = document.createElement("div");
const sizes = document.createElement("div");
const frameSize = document.createElement("div");
const otherSizes = document.createElement("div");
let tilesArrayStarting;
let tilesArrayShuffled;
let size = 4;

buttons.classList.add("buttons");
container.classList.add("container");
body.appendChild(container);
container.appendChild(buttons);
stats.classList.add("stats");
container.appendChild(stats);
tiles.classList.add("tiles");
container.appendChild(tiles);
sizes.classList.add("sizes");
container.appendChild(sizes);

function createButton(name) {
  const button = document.createElement("button");
  button.classList.add("btn");
  button.classList.add(name);
  button.textContent = name;
  buttons.appendChild(button);
}

function createStat(name) {
  const stat = document.createElement("div");
  const statTitle = document.createElement("div");
  const statText = document.createElement("div");
  stat.classList.add(name);
  statTitle.classList.add(`${name}__title`);
  statText.classList.add(`${name}__text`);
  statTitle.textContent = name + ":";
  stats.appendChild(stat);
  stat.appendChild(statTitle);
  stat.appendChild(statText);
}

function createTile() {
  const numberOfTiles = size * size;
  let distanceX = 0;
  let distanceY = 0;
  tilesArrayStarting = [];
  for (let i = 0; i < numberOfTiles; i++) {
    tilesArrayStarting.push(i);
  }
  let tilesArrayStartingCopy = tilesArrayStarting.concat();
  tilesArrayShuffled = tilesArrayStartingCopy.sort(() => Math.random() - 0.5);
  for (let i = 0; i < numberOfTiles; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.textContent = tilesArrayShuffled[i];
    tile.style.top = distanceY + "px";
    tile.style.left = distanceX + "px";
    distanceX +=70;
    if (tile.textContent == 0) {
      tile.style.fontSize = 0;
    }
    tiles.appendChild(tile);
    if ((i + 1) % size == 0 && i !== 0) {
      distanceX = 0;
      distanceY += 70;
    }
  }
}

function createSizePanel() {
  const frameSizeTitle = document.createElement("div");
  const frameSizeText = document.createElement("div");
  const otherSizesTitle = document.createElement("div");
  const otherSizesText = document.createElement("div");
  frameSize.appendChild(frameSizeTitle);
  frameSize.appendChild(frameSizeText);
  otherSizes.appendChild(otherSizesTitle);
  otherSizes.appendChild(otherSizesText);
  frameSizeTitle.textContent = "Frame size:";
  otherSizesTitle.textContent = "Other sizes:";
  frameSize.classList.add("frame-size");
  otherSizes.classList.add("other-size");
  frameSizeTitle.classList.add("frame-size__title");
  otherSizesTitle.classList.add("other-size__title");
  sizes.appendChild(frameSize);
  sizes.appendChild(otherSizes);
}

function createOtherSizes(type) {
  const size = document.createElement("div");
  size.classList.add("other-size__text");
  size.classList.add(type);
  size.textContent = type;
  otherSizes.appendChild(size);
}

function createCurrentSize(current) {
  const size = document.createElement("div");
  size.classList.add("frame-size__text");
  size.textContent = current;
  frameSize.appendChild(size);
}

function createStartPage() {
  createButton("start");
  createButton("stop");
  createButton("save");
  createButton("results");
  createStat("moves");
  createStat("time");
  createTile();
  createSizePanel();
  createOtherSizes("3x3");
  createOtherSizes("4x4");
  createOtherSizes("5x5");
  createOtherSizes("6x6");
  createOtherSizes("7x7");
  createOtherSizes("8x8");
  createCurrentSize("4x4");
}

createStartPage();

function dragAndDrop() {
  let activeTile;
  let adjacentElements = {};
  const tiles = document.querySelectorAll(".tile");
  const moves = document.querySelector(".moves__text");
  const replaceableTile = Array.from(tiles).find(
    (tile) => tile.textContent == 0
  );
  replaceableTile.style.backgroundImage = "none";
  replaceableTile.style.backgroundColor = "#fff";

  function makeDraggable() {
    tilesArrayShuffled.forEach((tile, i) => {
      if (tile == replaceableTile.textContent) {
        for (const key in adjacentElements) {
          if (adjacentElements[key]) {
            adjacentElements[key].removeAttribute("draggable", "true");
          }
        }
        let isElementOnRightEdge =
          tilesArrayShuffled.findIndex(
            (tile) => tile == tilesArrayShuffled[i - 1]
          ) %
            size ==
          size - 1;
        let isElementOnLeftEdge =
          tilesArrayShuffled.findIndex(
            (tile) => tile == tilesArrayShuffled[i + 1]
          ) %
            size ==
          0;
        if (!isElementOnLeftEdge) {
          adjacentElements.leftElement = Array.from(tiles).find(
            (tile) => tile.textContent == tilesArrayShuffled[i + 1]
          );
        } else adjacentElements.leftElement = null;
        if (!isElementOnRightEdge) {
          adjacentElements.rightElement = Array.from(tiles).find(
            (tile) => tile.textContent == tilesArrayShuffled[i - 1]
          );
        } else adjacentElements.rightElement = null;
        adjacentElements.topElement = Array.from(tiles).find(
          (tile) => tile.textContent == tilesArrayShuffled[i - size]
        );
        adjacentElements.bottomElement = Array.from(tiles).find(
          (tile) => tile.textContent == tilesArrayShuffled[i + size]
        );
        for (const key in adjacentElements) {
          if (adjacentElements[key]) {
            adjacentElements[key].setAttribute("draggable", "true");
          }
        }
      }
    });
  }
  makeDraggable();
  function dragStart() {
    activeTile = this;
    if (!activeTile.hasAttribute("draggable")) {
      return;
    }
    this.classList.add("active");
  }

  function dragOver(e) {
    if (this == replaceableTile) {
      e.preventDefault();
    }
  }

  function drop() {
    if (!activeTile.hasAttribute("draggable")) {
      return;
    }
    count++;
    moves.textContent = count;
    const activeTileX = activeTile.style.left;
    const activeTileY = activeTile.style.top;
    const replaceableTileX = replaceableTile.style.left;
    const replaceableTileY = replaceableTile.style.top;
    const activeTileNumberIndex = tilesArrayShuffled.indexOf(
      Number(activeTile.textContent)
    );
    const replaceableTileIndex = tilesArrayShuffled.indexOf(
      Number(replaceableTile.textContent)
    );
    tilesArrayShuffled.splice(
      activeTileNumberIndex,
      1,
      Number(replaceableTile.textContent)
    );
    tilesArrayShuffled.splice(
      replaceableTileIndex,
      1,
      Number(activeTile.textContent)
    );
    activeTile.style.left = replaceableTileX;
    activeTile.style.top = replaceableTileY;
    replaceableTile.style.left = activeTileX;
    replaceableTile.style.top = activeTileY;
    activeTile.classList.remove("active");
    makeDraggable();
    isFinished();
  }
  tiles.forEach((tile) => {
    tile.addEventListener("dragstart", dragStart);
    tile.addEventListener("dragover", dragOver);
    tile.addEventListener("drop", drop);
    tile.addEventListener("click", dragStart);
    tile.addEventListener("click", drop);
  });
}

dragAndDrop();

function isFinished() {
  if (
    tilesArrayStarting.slice(1).toString() ==
    tilesArrayShuffled.slice(0, -1).toString()
  ) {
    console.log("Game is finished");
  }
}

// moves
const moves = document.querySelector(".moves__text");
let count = 0;
moves.textContent = count;

// time
const time = document.querySelector(".time__text");
let hours = 0;
let minutes = 0;
let seconds = 0;
const zeroTime = `0${hours}:0${minutes}:0${seconds}`;
time.textContent = zeroTime;

function startTime() {
  seconds++;
  seconds = seconds < 10 ? String(seconds).padStart(2, "0") : seconds;
  minutes = minutes < 10 ? String(minutes).padStart(2, "0") : minutes;
  hours = hours < 10 ? String(hours).padStart(2, "0") : hours;
  if (seconds == 60) {
    seconds = 0;
    minutes++;
  }
  if (minutes == 60) {
    minutes = 0;
    hours++;
  }
  time.textContent = `${hours}:${minutes}:${seconds}`;
}

// start
const start = document.querySelector(".start");
let timeStart;

function reset() {
  count = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  const tiles = document.querySelectorAll(".tile");
  moves.textContent = count;
  tiles.forEach((tile) => {
    tile.remove();
  });
}

start.addEventListener("click", () => {
  reset();
  createTile();
  dragAndDrop();
  clearInterval(timeStart);
  time.textContent = zeroTime;
  timeStart = setInterval(startTime, 1000);
});

// stop
const stop = document.querySelector(".stop");
stop.addEventListener("click", () => {
  stop.classList.toggle("resume");
  if (stop.classList.contains("resume")) {
    stop.textContent = "resume";
    clearInterval(timeStart);
  } else {
    stop.textContent = "stop";
    timeStart = setInterval(startTime, 1000);
  }
});

// change size
const currentSize = document.querySelectorAll(".other-size__text");

function changeSize() {
  const tiles = document.querySelector(".tiles");
  size = Number(event.target.textContent[0]);
  tiles.style.width = size * 70 + "px";
  tiles.style.height = size * 70 + "px";
}

currentSize.forEach((size) => {
  size.addEventListener("click", (event) => {
    changeSize();
    reset();
    createTile();
    dragAndDrop();
    clearInterval(timeStart);
    time.textContent = zeroTime;
  });
});
