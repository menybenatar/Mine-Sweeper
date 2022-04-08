"use strict";
var gBoard;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gGame;
var gUnMinesPostion;
var gINtervalSec;
var gLive;
var gIs7Boom;
const MINE = "💣";
const FLAG = "🚩";
const LOSE = "😭";
const WIN = "😎";
const NORMAL = "🙂";
const DEVIL = "😈";

function initGame() {
  gUnMinesPostion = [];
  gBoard = buildBoard(gLevel.SIZE);
  putMinesRandomalyOnBoard();
  setMinesNegsCount();
  renderBoard();
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
  gLive = 3;
}
function restart(size = gLevel.SIZE, mines = gLevel.MINES) {
  gLevel.SIZE = size;
  gLevel.MINES = mines;
  putValuInElement(".smileybtn span", NORMAL);
  putValuInElement("#timer", "000");
  putValuInElement(".live span", "3");
  document.querySelector(".live span").style.color = "black";

  if (gINtervalSec) {
    gINtervalSec = clearInterval(gINtervalSec);
  }
  initGame();
  updateFlags();
  gIs7Boom = false;
}
function sevenBoom() {
  gIs7Boom = true;
  restart(12, 21);
}

function setMinesNegsCount() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) continue;
      gBoard[i][j].minesAroundCount = getMineNegsCount({ i, j });
    }
  }
}
//location is object like {i:3,j:1}
// finding around cell count of mines
function getMineNegsCount(location) {
  var count = 0;
  var size = gLevel.SIZE;
  for (var i = location.i - 1; i <= location.i + 1; ++i) {
    for (var j = location.j - 1; j <= location.j + 1; ++j) {
      if (i >= 0 && i < size && j >= 0 && j < size && gBoard[i][j].isMine) {
        count++;
      }
    }
  }
  return count;
}
function putMinesRandomalyOnBoard() {
  var pos,
    counter = 0;

  if (gIs7Boom) {
    pos = 0;
    while (pos < gUnMinesPostion.length && counter < gLevel.MINES) {
      var i = gUnMinesPostion[pos].i + 1;
      var j = gUnMinesPostion[pos].j + 1;
      pos++;
      if (checkIfIndexIs7(i, j)) {
        counter++;
        gBoard[i - 1][j - 1].isMine = true;
        gUnMinesPostion.splice(pos, 1);
      }
    }
    console.log(counter);
  } else {
    for (let m = 0; m < gLevel.MINES; m++) {
      pos = getRandomInt(0, gUnMinesPostion.length);
      var iIdx = gUnMinesPostion[pos].i;
      var jIdx = gUnMinesPostion[pos].j;
      gBoard[iIdx][jIdx].isMine = true;
      gUnMinesPostion.splice(pos, 1);
    }
  }
}
function cellClicked(elCell, i, j) {
  if (!gINtervalSec) {
    gINtervalSec = setInterval(updateTimer, 1000);
  }
  if (!gGame.isOn) return;
  if (elCell.classList.contains("checked")) return;
  if (elCell.classList.contains("flag")) return;
  if (gBoard[i][j].isMine && gLive) {
    gLive--;
    putValuInElement(".live span", gLive);
    putValuInElement(".smileybtn span", DEVIL);

    if (!gLive) document.querySelector(".live span").style.color = "red";
    setTimeout(() => {
      putValuInElement(".smileybtn span", NORMAL);
    }, 500);
    return;
  }
  elCell.classList.add("checked");
  gGame.shownCount++;

  if (gBoard[i][j].isMine) {
    renderCell({ i, j }, MINE);
    elCell.style.backgroundColor = "red";
    shownAllMines();
    gameOver();
    return;
  } else if (gBoard[i][j].minesAroundCount) {
    gBoard[i][j].isShown = true;
    renderCell({ i, j }, gBoard[i][j].minesAroundCount);
  } else {
    gBoard[i][j].isShown = true;
    expandShown({ i, j });
  }
  if (checkVictory()) {
    Victory();
  }
}

function cellMarked(elCell, i, j) {
  if (elCell.classList.contains("checked")) return;
  if (!elCell.classList.contains("flag")) {
    if (gLevel.MINES - gGame.markedCount <= 0) return;
    elCell.classList.add("flag");
    elCell.innerHTML = FLAG;
    gBoard[i][j].isMarked = true;
    gGame.markedCount++;
    updateFlags();
    if (checkVictory()) {
      Victory();
    }
  } else {
    gGame.markedCount--;
    gBoard[i][j].isMarked = false;
    elCell.classList.remove("flag");
    elCell.innerHTML = "";
    updateFlags();
  }
}
function shownAllMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) {
        var elMine = document.querySelector(`[title='${i}-${j}']`);
        elMine.classList.add("checked");
        elMine.innerHTML = MINE;
      }
    }
  }
}
function gameOver() {
  putValuInElement(".smileybtn span", LOSE);
  gGame.isOn = false;
  gIs7Boom = false;
  gINtervalSec = clearInterval(gINtervalSec);
}
function checkVictory() {
  if (
    gGame.markedCount === gLevel.MINES &&
    gLevel.SIZE ** 2 - gLevel.MINES === gGame.shownCount
  ) {
    return true;
  } else {
    return false;
  }
}
function Victory() {
  console.log(WIN);
  putValuInElement(".smileybtn span", WIN);
  gGame.isOn = false;
  gIs7Boom = false;
  gINtervalSec = clearInterval(gINtervalSec);
}
function updateTimer() {
  if (gGame.secsPassed === 999) gameOver();
  gGame.secsPassed++;
  var diff = 3 - sumOfDigits(gGame.secsPassed);
  var strTimer = "0".repeat(diff) + gGame.secsPassed;
  putValuInElement("#timer", strTimer);
}
function updateFlags() {
  var numOfFlags = gLevel.MINES - gGame.markedCount;
  var strFlags;
  if (numOfFlags >= 0) {
    var diff = 3 - sumOfDigits(numOfFlags);
    strFlags = "0".repeat(diff) + numOfFlags;
  } else {
    return;
  }

  putValuInElement("#bomb-counter", strFlags);
}
function expandShown(location) {
  var size = gLevel.SIZE;
  for (var i = location.i - 1; i <= location.i + 1; ++i) {
    if (i < 0 || i >= size) continue;
    for (var j = location.j - 1; j <= location.j + 1; ++j) {
      if (j >= 0 && j < size) {
        if (
          gBoard[i][j].isShown ||
          gBoard[i][j].isMarked ||
          gBoard[i][j].isMine
        )
          continue;
        gGame.shownCount++;
        gBoard[i][j].isShown = true;
        var element = document.querySelector(`[title='${i}-${j}']`);
        element.classList.add("checked");
        if (gBoard[i][j].minesAroundCount) {
          renderCell({ i, j }, gBoard[i][j].minesAroundCount);
        }
        if (!gBoard[i][j].minesAroundCount) {
          expandShown({ i, j });
        }
      }
    }
  }
}
function checkIfIndexIs7(i, j) {
  return i === 7 || j === 7 || (i * j) % 7 === 0 || ("" + i * j).includes("7");
}
