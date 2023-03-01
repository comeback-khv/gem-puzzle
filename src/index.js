/* imports */
import './index.scss';
import './index.html';
import click from './assets/sounds/click.wav';

/* page */
const body = document.querySelector('.body');

function createMain(name) {
  const element = document.createElement('div');
  element.classList.add(name);
  body.appendChild(element);
}

createMain('buttons');
createMain('stats');
createMain('tiles');
createMain('sizes');

const page = {
  buttons: document.querySelector('.buttons'),
  stats: document.querySelector('.stats'),
  tiles: document.querySelector('.tiles'),
  sizes: document.querySelector('.sizes'),
};

const frameSize = document.createElement('div');
const otherSizes = document.createElement('div');
let tilesArrayStarting;
let tilesArrayShuffled;
let size = 4;

/* fill main page */
function createButton(name) {
  const button = document.createElement('button');
  button.classList.add('button');
  button.classList.add(`buttons__${name}`);
  button.textContent = name;
  page.buttons.appendChild(button);
}

function createStat(name) {
  const stat = document.createElement('div');
  const statTitle = document.createElement('div');
  const statText = document.createElement('div');
  stat.classList.add(name);
  statTitle.classList.add(`${name}__title`);
  statText.classList.add(`${name}__text`);
  statTitle.textContent = `${name}:`;
  page.stats.appendChild(stat);
  stat.appendChild(statTitle);
  stat.appendChild(statText);
}

function createVolume() {
  const volume = document.createElement('button');
  volume.classList.add('volume');
  page.stats.appendChild(volume);
}

function createTile() {
  const numberOfTiles = size * size;
  let distanceX = 0;
  let distanceY = 0;
  tilesArrayStarting = [];
  for (let i = 0; i < numberOfTiles; i++) {
    tilesArrayStarting.push(i);
  }
  const tilesArrayStartingCopy = tilesArrayStarting.concat();
  tilesArrayShuffled = tilesArrayStartingCopy.sort(() => Math.random() - 0.5);
  for (let i = 0; i < numberOfTiles; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.textContent = tilesArrayShuffled[i];
    tile.style.top = `${distanceY}px`;
    tile.style.left = `${distanceX}px`;
    distanceX += 70;
    if (tile.textContent == 0) {
      tile.style.fontSize = 0;
    }
    page.tiles.appendChild(tile);
    if ((i + 1) % size == 0 && i !== 0) {
      distanceX = 0;
      distanceY += 70;
    }
  }
}

function createSizePanel() {
  const frameSizeTitle = document.createElement('div');
  const frameSizeText = document.createElement('div');
  const otherSizesTitle = document.createElement('div');
  const otherSizesText = document.createElement('div');
  frameSize.appendChild(frameSizeTitle);
  frameSize.appendChild(frameSizeText);
  otherSizes.appendChild(otherSizesTitle);
  otherSizes.appendChild(otherSizesText);
  frameSizeTitle.textContent = 'Frame size:';
  otherSizesTitle.textContent = 'Other sizes:';
  frameSize.classList.add('frame-size');
  otherSizes.classList.add('other-size');
  frameSizeTitle.classList.add('frame-size__title');
  otherSizesTitle.classList.add('other-size__title');
  page.sizes.appendChild(frameSize);
  page.sizes.appendChild(otherSizes);
}

function createOtherSizes(type) {
  const size = document.createElement('div');
  size.classList.add('other-size__text');
  size.classList.add(type);
  size.textContent = type;
  otherSizes.appendChild(size);
}

function createCurrentSize(current) {
  const size = document.createElement('div');
  size.classList.add('frame-size__text');
  size.textContent = current;
  frameSize.appendChild(size);
}

function fillMainPage() {
  createButton('start');
  createButton('stop');
  createButton('save');
  createButton('results');
  createStat('moves');
  createStat('time');
  createVolume();
  createTile();
  createSizePanel();
  createOtherSizes('2x2');
  createOtherSizes('3x3');
  createOtherSizes('4x4');
  createOtherSizes('5x5');
  createOtherSizes('6x6');
  createOtherSizes('7x7');
  createOtherSizes('8x8');
  createCurrentSize('4x4');
}

fillMainPage();


/* main logic */
function dragAndDrop() {
  let activeTile;
  const adjacentElements = {};
  const tiles = document.querySelectorAll('.tile');
  const moves = document.querySelector('.moves__text');
  const replaceableTile = Array.from(tiles).find(tile => tile.textContent == 0);
  replaceableTile.style.backgroundImage = 'none';
  replaceableTile.style.backgroundColor = 'transparent';
  replaceableTile.style.zIndex = '-1';
  replaceableTile.style.border = 'none';

  function makeDraggable() {
    tilesArrayShuffled.forEach((tile, i) => {
      if (tile == replaceableTile.textContent) {
        for (const key in adjacentElements) {
          if (adjacentElements[key]) {
            adjacentElements[key].removeAttribute('draggable', 'true');
          }
        }
        const isElementOnRightEdge =
          tilesArrayShuffled.findIndex(
            tile => tile == tilesArrayShuffled[i - 1]
          ) %
            size ==
          size - 1;
        const isElementOnLeftEdge =
          tilesArrayShuffled.findIndex(
            tile => tile == tilesArrayShuffled[i + 1]
          ) %
            size ==
          0;
        if (!isElementOnLeftEdge) {
          adjacentElements.leftElement = Array.from(tiles).find(
            tile => tile.textContent == tilesArrayShuffled[i + 1]
          );
        } else adjacentElements.leftElement = null;
        if (!isElementOnRightEdge) {
          adjacentElements.rightElement = Array.from(tiles).find(
            tile => tile.textContent == tilesArrayShuffled[i - 1]
          );
        } else adjacentElements.rightElement = null;
        adjacentElements.topElement = Array.from(tiles).find(
          tile => tile.textContent == tilesArrayShuffled[i - size]
        );
        adjacentElements.bottomElement = Array.from(tiles).find(
          tile => tile.textContent == tilesArrayShuffled[i + size]
        );
        for (const key in adjacentElements) {
          if (adjacentElements[key]) {
            adjacentElements[key].setAttribute('draggable', 'true');
          }
        }
      }
    });
  }
  makeDraggable();
  function dragStart() {
    activeTile = this;
    if (!activeTile.hasAttribute('draggable')) {
      return;
    }
    this.classList.add('active');
  }

  function dragOver(e) {
    if (this == replaceableTile) {
      e.preventDefault();
    }
  }

  function drop() {
    if (!activeTile.hasAttribute('draggable')) {
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
    activeTile.classList.remove('active');
    makeDraggable();
    isFinished();
  }
  tiles.forEach(tile => {
    tile.addEventListener('dragstart', dragStart);
    tile.addEventListener('dragover', dragOver);
    tile.addEventListener('drop', drop);
    tile.addEventListener('click', dragStart);
    tile.addEventListener('click', drop);
    tile.addEventListener('click', addClickSound);
  });
}

dragAndDrop();

function isFinished() {
  if (
    tilesArrayStarting.slice(1).toString() ==
    tilesArrayShuffled.slice(0, -1).toString()
  ) {
    console.log('Game is finished');
  }
}

/* moves */
const moves = document.querySelector('.moves__text');
let count = 0;
moves.textContent = count;

/* time */
const time = document.querySelector('.time__text');
let hours = 0;
let minutes = 0;
let seconds = 0;
const zeroTime = `0${hours}:0${minutes}:0${seconds}`;
time.textContent = zeroTime;

function startTime() {
  seconds++;
  seconds = seconds < 10 ? String(seconds).padStart(2, '0') : seconds;
  minutes = minutes < 10 ? String(minutes).padStart(2, '0') : minutes;
  hours = hours < 10 ? String(hours).padStart(2, '0') : hours;
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

/* start */
const start = document.querySelector('.buttons__start');
let timeStart;

function reset() {
  count = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  const tiles = document.querySelectorAll('.tile');
  moves.textContent = count;
  tiles.forEach(tile => {
    tile.remove();
  });
}

start.addEventListener('click', () => {
  reset();
  createTile();
  dragAndDrop();
  clearInterval(timeStart);
  time.textContent = zeroTime;
  timeStart = setInterval(startTime, 1000);
  addGameStatus();
  showPopup();
});

/* stop */
const stop = document.querySelector('.buttons__stop');
stop.addEventListener('click', () => {
  if (body.classList.contains('body--active')) {
    removeGameStatus();
    clearInterval(timeStart);
  } else {
    addGameStatus();
    timeStart = setInterval(startTime, 1000);
  }
});

/* change size */
const otherSize = document.querySelectorAll('.other-size__text');

function changeSize() {
  const tiles = document.querySelector('.tiles');
  size = Number(event.target.textContent[0]);
  tiles.style.width = `${size * 70}px`;
  tiles.style.height = `${size * 70}px`;
}

otherSize.forEach(size => {
  size.addEventListener('click', event => {
    changeSize();
    reset();
    createTile();
    dragAndDrop();
    clearInterval(timeStart);
    time.textContent = zeroTime;
    removeGameStatus();
    stop.classList.remove('buttons__stop--active');
    stop.textContent = 'stop';
  });
});

/* add sound */
const volume = document.querySelector('.volume');
volume.addEventListener('click', () => {
  volume.classList.toggle('volume--muted');
});

function addClickSound() {
  if (!volume.classList.contains('volume--muted')) {
    const audio = new Audio(click);
    audio.play();
  } else audio.stop();
}

/* popup non started */
function createPopupStart() {
  const popup = document.createElement('div');
  const popupTitle = document.createElement('div');
  const popupText = document.createElement('div');
  popupTitle.textContent = 'Start game first';
  popupText.textContent = 'OK';
  popup.classList.add('popup-start');
  popupTitle.classList.add('popup-start__title');
  popupText.classList.add('popup-start__text');
  body.appendChild(popup);
  popup.appendChild(popupTitle);
  popup.appendChild(popupText);
}

createPopupStart();

const popupStart = document.querySelector('.popup-start');
const popupStartText = document.querySelector('.popup-start__text');

function showPopupStart() {
  const tile = document.querySelectorAll('.tile');
  if (!tile[0].classList.contains('tile--active')) {
    popupStart.classList.add('popup-start--active');
  }
}
page.tiles.addEventListener('click', showPopupStart);

popupStartText.addEventListener('click', () => {
  popupStart.classList.toggle('popup-start--active');
});

/* popup results */

function createPopupResults() {
  const popup = document.createElement('div');
  popup.classList.add('popup-results');
  body.appendChild(popup);
}

createPopupResults();

const popupResults = document.querySelector('.popup-results');
const currentSize = document.querySelector('.frame-size__text');

function addResultHeader() {
  const popupLine = document.createElement('div');
  const popupNumber = document.createElement('div');
  const popupDate = document.createElement('div');
  const popupSize = document.createElement('div');
  const popupTime = document.createElement('div');
  const popupMoves = document.createElement('div');
  popupLine.classList.add('popup-results__header');
  popupNumber.classList.add('popup-results__element');
  popupDate.classList.add('popup-results__element');
  popupSize.classList.add('popup-results__element');
  popupTime.classList.add('popup-results__element');
  popupMoves.classList.add('popup-results__element');
  popupResults.appendChild(popupLine);
  popupLine.appendChild(popupNumber);
  popupLine.appendChild(popupDate);
  popupLine.appendChild(popupSize);
  popupLine.appendChild(popupTime);
  popupLine.appendChild(popupMoves);
  popupNumber.textContent = '№';
  popupDate.textContent = 'Date';
  popupSize.textContent = 'Size';
  popupTime.textContent = 'Time';
  popupMoves.textContent = 'Moves';
}
addResultHeader();

function addResult() {
  const popupLine = document.createElement('div');
  const popupNumber = document.createElement('div');
  const popupDate = document.createElement('div');
  const popupSize = document.createElement('div');
  const popupTime = document.createElement('div');
  const popupMoves = document.createElement('div');
  popupLine.classList.add('popup-results__line');
  popupNumber.classList.add('popup-results__element');
  popupDate.classList.add('popup-results__element');
  popupSize.classList.add('popup-results__element');
  popupTime.classList.add('popup-results__element');
  popupMoves.classList.add('popup-results__element');
  popupResults.appendChild(popupLine);
  popupLine.appendChild(popupNumber);
  popupLine.appendChild(popupDate);
  popupLine.appendChild(popupSize);
  popupLine.appendChild(popupTime);
  popupLine.appendChild(popupMoves);
  popupNumber.textContent = 1;
  popupDate.textContent = getDate();
  popupSize.textContent = currentSize.textContent;
  popupTime.textContent = time.textContent;
  popupMoves.textContent = moves.textContent;
}

addResult();

function getDate() {
  const date = new Date();
  const day = date.getDate();
  const month =
    date.getMonth() + 1 < 10
      ? (date.getMonth() + 1).toString().padStart(2, 0)
      : date.getMonth() + 1;
  const year = date.getFullYear();
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const currentDate = `${day}.${month}.${year} ${time}`;
  return currentDate;
}

const results = document.querySelector('.buttons__results');

results.addEventListener('click', () => {
  popupResults.classList.add('popup-results--active');
});

/* game status */

// function isGameStarted {
//   return tile[0].classList.contains("tile--active");
//! body.classList.contains("body--active");
// }

function addGameStatus() {
  const tile = document.querySelectorAll('.tile');
  tile.forEach(tile => tile.classList.add('tile--active'));
  body.classList.add('body--active');
  stop.classList.add('buttons__stop--active');
  stop.textContent = 'stop';
}

function removeGameStatus() {
  const tile = document.querySelectorAll('.tile');
  tile.forEach(tile => tile.classList.remove('tile--active'));
  body.classList.remove('body--active');
  stop.textContent = 'resume';
}
