import "./style.css";
import type {
  ChessPiece,
  PieceColor,
  PieceIndexString,
  PieceMovesMap,
} from "./types";
import { Controller } from "./Controller";

const main = document.querySelector<HTMLElement>("main");
const header = document.querySelector<HTMLElement>("main > header");
const gameBoard = document.querySelector<HTMLElement>("[data-game-board]");
const overScreen = document.querySelector<HTMLElement>("[data-game-over]");
const startScreen = document.querySelector<HTMLElement>("[data-game-start]");
const pawnPromo = document.querySelector<HTMLElement>("[data-pawn-promotion]");
const backdrop = document.querySelector<HTMLElement>("[data-backdrop]");

if (
  !main ||
  !header ||
  !gameBoard ||
  !overScreen ||
  !startScreen ||
  !pawnPromo ||
  !backdrop
) {
  throw new Error(
    JSON.stringify({
      main,
      header,
      gameBoard,
      overScreen,
      startScreen,
      pawnPromo,
      backdrop,
    }),
  );
}

const controller = new Controller();

gameBoard.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  const { squareId } = e.target.dataset;
});

header.addEventListener("click", (e) => {});

pawnPromo.addEventListener("click", (e) => {});

startScreen.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  const { choice } = e.target.dataset;
  if (choice == null) return;

  switch (choice) {
    case "player": {
      controller.startNewGame();
      startScreen.dataset.open = "false";
      backdrop.dataset.open = "false";
      main.dataset.open = "true";
      clearGameBoard();
      renderGameBoard();
    }
  }
});

const chessSymbols: Record<ChessPiece, string> = {
  "white-king": "♔",
  "white-queen": "♕",
  "white-bishop": "♗",
  "white-knight": "♘",
  "white-rook": "♖",
  "white-pawn": "♙",
  "black-king": "♚",
  "black-queen": "♛",
  "black-bishop": "♝",
  "black-knight": "♞",
  "black-rook": "♜",
  "black-pawn": "♟",
};

function renderGameBoard(moves?: PieceMovesMap) {
  const game = controller.getGame();
  if (!game) return;
  const board = game.getGameBoard();
  const status = game.getGameStatus();
  const fragment = document.createDocumentFragment();
  const boardSize = 8;
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const square = `${col}${row}` as PieceIndexString;
      const button = document.createElement("button");
      const squareColor = (row + col) % 2 === 0 ? "white" : "black";
      button.classList.add(squareColor, "square");
      button.dataset.squareId = square;

      if (board.black.has(square)) {
        const piece = board.black.get(square)!;
        button.textContent = chessSymbols[`black-${piece}` as ChessPiece];
        button.title = `Black ${piece[0].toUpperCase() + piece.slice(1)}`;
      }

      if (board.white.has(square)) {
        const piece = board.white.get(square)!;
        button.textContent = chessSymbols[`white-${piece}` as ChessPiece];
        button.title = `White ${piece[0].toUpperCase() + piece.slice(1)}`;
      }

      if (moves && moves.has(square)) {
        button.dataset.moveType = moves.get(square);
      }

      if (status && status.endsWith("check")) {
        if (board[status.split("-")[0] as PieceColor].get(square) === "king") {
          button.classList.add("king-check");
        }
      }

      fragment.appendChild(button);
    }
  }

  gameBoard?.appendChild(fragment);
}

function clearGameBoard() {
  while (gameBoard?.firstChild) {
    gameBoard.firstChild.remove();
  }
}
