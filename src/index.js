import "./index.scss";
import "./index.html";

const body = document.querySelector(".body");
const buttons = document.createElement("div");
const stats = document.createElement("div");
const tiles = document.createElement("div");
const sizes = document.createElement("div");
const frameSize = document.createElement("div");
const otherSizes = document.createElement("div");
let tilesArrayStarting;
let tilesArrayShuffled;

buttons.classList.add("buttons");
body.appendChild(buttons);
stats.classList.add("stats");
body.appendChild(stats);
tiles.classList.add("tiles");
body.appendChild(tiles);
sizes.classList.add("sizes");
body.appendChild(sizes);

function createButton(name) {
  const button = document.createElement("button");
  button.classList.add("btn");
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
  statTitle.textContent = name;
  stats.appendChild(stat);
  stat.appendChild(statTitle);
  stat.appendChild(statText);
}

function createTile(size) {
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
    distanceX += 100;
    if (tile.textContent == 0) {
      tile.style.fontSize = 0;
    }
    tiles.appendChild(tile);
    if ((i + 1) % size == 0 && i !== 0) {
      distanceX = 0;
      distanceY += 100;
    }
  }
}

function createSizePanel() {
  frameSize.textContent = "Frame size";
  otherSizes.textContent = "Other sizes";
  frameSize.classList.add("frame-size");
  otherSizes.classList.add("other-size");
  sizes.appendChild(frameSize);
  sizes.appendChild(otherSizes);
}

function createOtherSizes(type) {
  const size = document.createElement("div");
  size.classList.add(type);
  size.textContent = type;
  otherSizes.appendChild(size);
}

function createCurrentSize(current) {
  const size = document.createElement("div");
  size.classList.add("current-size");
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
  createTile(4);
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
  const replaceableTile = Array.from(tiles).find(
    (tile) => tile.textContent == 0
  );

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
            4 ==
          3;
        let isElementOnLeftEdge =
          tilesArrayShuffled.findIndex(
            (tile) => tile == tilesArrayShuffled[i + 1]
          ) %
            4 ==
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
          (tile) => tile.textContent == tilesArrayShuffled[i - 4]
        );
        adjacentElements.bottomElement = Array.from(tiles).find(
          (tile) => tile.textContent == tilesArrayShuffled[i + 4]
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
    // tile.addEventListener("click", dragOver);
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
