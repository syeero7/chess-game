import type {
  GameBoard,
  Piece,
  PieceColor,
  PieceIndex,
  PieceIndexString,
} from "./types";
import { Game } from "./Game";

export class Controller {
  private game: Game | null;

  constructor() {
    this.game = null;
  }

  getGame() {
    return this.game;
  }

  abortGame() {
    this.game = null;
  }

  startNewGame() {
    const gameBoard = this.createNewGameBoard();
    this.game = new Game(gameBoard);
  }

  private createNewGameBoard() {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    const pieces: Record<PieceIndex, Piece> = {
      "0": "rook",
      "1": "knight",
      "2": "bishop",
      "3": "queen",
      "4": "king",
      "5": "bishop",
      "6": "knight",
      "7": "rook",
    };

    for (const row of [0, 1, 6, 7]) {
      for (let col = 0 as PieceIndex; col < 8; col++) {
        const square = `${col}${row}` as PieceIndexString;
        const color: PieceColor = row === 0 || row == 1 ? "white" : "black";
        if (row === 0 || row === 7) {
          gameBoard[color].set(square, pieces[col]);
          continue;
        }
        gameBoard[color].set(square, "pawn");
      }
    }

    return gameBoard;
  }
}
