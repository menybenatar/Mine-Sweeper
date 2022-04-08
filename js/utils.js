"use strict";
function buildBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board.push([]);
    for (var j = 0; j < size; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      gUnMinesPostion.push({ i, j });
      board[i][j] = cell;
    }
  }

  return board;
}
function renderBoard() {
  var strHTML = "";
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += `<tr>\n`;
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      var className = "";
      var symbolOnBoard = "";
      if (cell.isMine) {
        className += "mine";
        // symbolOnBoard = MINE;
      } else if (cell.minesAroundCount) {
        className +=
          cell.minesAroundCount === 1
            ? "num one"
            : cell.minesAroundCount === 2
            ? "num two"
            : cell.minesAroundCount === 3
            ? "num three"
            : "num four";
        // symbolOnBoard = cell.minesAroundCount;
      }

      strHTML += `\t<td class="cell ${className}"  title="${i}-${j}"
                            onclick="cellClicked(this, ${i}, ${j})"  oncontextmenu="cellMarked(this, ${i} , ${j})">${symbolOnBoard}
                         </td>\n`;
    }
    strHTML += `</tr>\n`;
  }
  //   console.log(strHTML);

  var elBoard = document.querySelector(".board-container");
  elBoard.innerHTML = strHTML;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function renderCell(location, value) {
  var elCell = document.querySelector(`[title='${location.i}-${location.j}']`);
  elCell.innerHTML = value;
}
function putValuInElement(selector, value) {
  var element = document.querySelector(selector);

  element.innerText = value;
}
function sumOfDigits(number) {
  if (number >= 0) return number.toString().length;
  else return number.toString().length - 1;
}
