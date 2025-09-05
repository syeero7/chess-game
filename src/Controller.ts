import type {
  ChessPiece,
  GameBoard,
  Piece,
  PieceColor,
  PieceIndex,
  PieceIndexString,
} from "./types";
import { Game } from "./Game";

export class Controller {
  private game: Game | null;
  computer: boolean;
  selectedSquare: PieceIndexString | null;
  selectedBy: ChessPiece | null;

  constructor() {
    this.game = null;
    this.selectedSquare = null;
    this.selectedBy = null;
    this.computer = false;
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

  computerMove(game: Game) {
    const board = game.getGameBoard();
    const computer = game.getActivePlayer();
    const pieces = board[computer];
    const normalMoves = [];

    for (const fromSquare of pieces.keys()) {
      const moves = game.getAvailableMoves(fromSquare, computer);
      if (!moves.size) continue;

      for (const [toSquare, moveType] of moves.entries()) {
        switch (moveType) {
          case "move": {
            normalMoves.push({ fromSquare, toSquare, moveType });
            continue;
          }

          case "all":
          case "promotion": {
            game.movePiece(fromSquare, toSquare, moveType, "queen");
            return;
          }

          case "capture":
          case "check": {
            game.movePiece(fromSquare, toSquare, moveType);
            return;
          }
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * normalMoves.length);
    const { fromSquare, toSquare, moveType } = normalMoves[randomIndex];
    game.movePiece(fromSquare, toSquare, moveType);
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
