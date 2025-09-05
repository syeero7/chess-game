import "./style.css";
import type {
  ChessPiece,
  Piece,
  PieceColor,
  PieceIndexString,
  PieceMove,
  PieceMovesMap,
} from "./types";
import { Controller } from "./Controller";

const main = document.querySelector("main");
const header = main?.querySelector("header");
const turnHeader = header?.querySelector("h1");
const gameBoard = document.querySelector<HTMLElement>("[data-game-board]");
const overScreen = document.querySelector<HTMLElement>("[data-game-over]");
const startScreen = document.querySelector<HTMLElement>("[data-game-start]");
const pawnPromo = document.querySelector<HTMLElement>("[data-pawn-promotion]");
const backdrop = document.querySelector<HTMLElement>("[data-backdrop]");
const overHeader = overScreen?.querySelector("h1");
const restartBtn = overScreen?.querySelector("button");

if (
  !main ||
  !header ||
  !gameBoard ||
  !overScreen ||
  !startScreen ||
  !pawnPromo ||
  !backdrop ||
  !turnHeader ||
  !overHeader ||
  !restartBtn
) {
  throw new Error(
    JSON.stringify({
      main,
      header,
      gameBoard,
      overScreen,
      startScreen,
      turnHeader,
      pawnPromo,
      backdrop,
      overHeader,
      restartBtn,
    }),
  );
}

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

const controller = new Controller();

gameBoard.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  if (e.target.tagName !== "BUTTON") return;
  const squareId = e.target.dataset.squareId as PieceIndexString | undefined;
  const moveType = e.target.dataset.moveType as PieceMove | undefined;
  const { title } = e.target;
  const game = controller.getGame();
  if (!game || !squareId || (!moveType && !title)) return;
  const [color, piece] = title.toLowerCase().split(" ") as [PieceColor, Piece];
  if (!moveType && game.getActivePlayer() !== color) return;

  if (!moveType) {
    clearGameBoard();
    controller.selectedSquare = squareId;
    controller.selectedBy = `${color}-${piece}`;
    const moves = game.getAvailableMoves(squareId, color);
    renderGameBoard(moves);
    return;
  }

  const { selectedSquare, selectedBy } = controller;
  if (!selectedSquare || !selectedBy || selectedSquare === squareId) return;

  if (moveType === "promotion" || moveType === "all") {
    const buttons = pawnPromo.querySelectorAll("button");
    const pieceColor = selectedBy.split("-")[0] as PieceColor;
    buttons.forEach((btn) => {
      btn.textContent = chessSymbols[`${pieceColor}-${btn.ariaLabel as Piece}`];
      btn.dataset.squareId = squareId;
    });
    backdrop.dataset.open = "true";
    pawnPromo.dataset.open = "true";
    return;
  }

  game.movePiece(selectedSquare, squareId, moveType);
  controller.selectedSquare = null;
  controller.selectedBy = null;
  const status = game.getGameStatus();
  if (status === "checkmate" || status === "stalemate") {
    overHeader.textContent = status;
    backdrop.dataset.open = "true";
    overScreen.dataset.open = "true";
    return;
  }

  clearGameBoard();
  renderGameBoard();
  playComputerMove();
});

header.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  const { action } = e.target.dataset;

  switch (action) {
    case "rotate": {
      gameBoard.classList.toggle("rotate");
      break;
    }
    case "abort": {
      controller.abortGame();
      backdrop.dataset.open = "true";
      overScreen.dataset.open = "true";
      overHeader.textContent = "Aborted";
      break;
    }
  }
});

pawnPromo.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  if (e.target.tagName !== "BUTTON") return;
  const squareId = e.target.dataset.squareId as PieceIndexString | undefined;
  const piece = e.target.ariaLabel as Exclude<Piece, "king" | "pawn"> | null;
  if (!squareId || !piece) throw new Error(JSON.stringify({ squareId, piece }));
  const { selectedBy, selectedSquare } = controller;
  const game = controller.getGame();
  if (!game || !selectedSquare || !selectedBy?.endsWith("pawn")) return;

  game.movePiece(selectedSquare, squareId, "promotion", piece);
  backdrop.dataset.open = "false";
  pawnPromo.dataset.open = "false";

  const status = game.getGameStatus();
  if (status === "checkmate" || status === "stalemate") {
    overHeader.textContent = status;
    backdrop.dataset.open = "true";
    overScreen.dataset.open = "true";
    return;
  }

  clearGameBoard();
  renderGameBoard();
  playComputerMove();
});

restartBtn.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  main.dataset.open = "false";
  overScreen.dataset.open = "false";
  startScreen.dataset.open = "true";
});

startScreen.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  const { choice } = e.target.dataset;
  if (choice == null) return;
  controller.computer = choice === "computer";
  controller.startNewGame();
  startScreen.dataset.open = "false";
  backdrop.dataset.open = "false";
  main.dataset.open = "true";
  clearGameBoard();
  renderGameBoard();
});

function renderGameBoard(moves?: PieceMovesMap) {
  const game = controller.getGame();
  if (!game) return;
  const board = game.getGameBoard();
  const status = game.getGameStatus();
  const fragment = document.createDocumentFragment();
  const active = game.getActivePlayer();
  turnHeader!.textContent = `${chessSymbols[`${active}-knight`]} ${active}'s turn`;

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

function playComputerMove() {
  if (!controller.computer) return;
  const game = controller.getGame();
  if (!game || !overHeader || !backdrop || !overScreen) return;

  controller.computerMove(game);
  const status = game.getGameStatus();
  if (status === "checkmate" || status === "stalemate") {
    overHeader.textContent = status;
    backdrop.dataset.open = "true";
    overScreen.dataset.open = "true";
    return;
  }

  setTimeout(() => {
    clearGameBoard();
    renderGameBoard();
  }, 500);
}
