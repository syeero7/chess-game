import type {
  ChessPiece,
  PiecePosition,
  GameStatus,
  PieceColor,
  GameBoard,
  Piece,
  PieceMove,
} from "./types";
import { VALID_MOVES } from "./valid-moves";

export class Game {
  private board: GameBoard;
  private status: GameStatus;
  private activePlayer: PieceColor;

  constructor(gameBoard: GameBoard) {
    this.board = gameBoard;
    this.status = null;
    this.activePlayer = "white";
  }

  private switchPlayerTurn() {
    this.activePlayer = this.activePlayer === "white" ? "black" : "white";
  }

  getAvailableMoves(pos: PiecePosition) {
    const square = this.board[pos[1]][pos[0]];
    if (square === null) {
      throw new Error("Invalid piece position");
    }

    const [color, piece] = square.split("-") as [PieceColor, Piece];
    const [currentX, currentY] = pos;
    const moves: PieceMove[] = [];

    switch (piece) {
      case "pawn": {
        const validMoves =
          color === "white"
            ? [...VALID_MOVES.pawn]
            : VALID_MOVES.pawn.map((p) => [p[0], p[1] * -1]);
        if (color === "white" && currentY === 1) validMoves.push([0, 2]);
        if (color === "black" && currentY === 6) validMoves.push([0, -2]);

        for (const [x, y] of validMoves) {
          const [posX, posY] = [currentX + x, currentY + y];
          if (!this.isValidMove(posX, posY)) continue;
          const moveType = this.getMoveType(color, posX, posY);
          if (moveType === "invalid") continue;
          if (moveType === "move" && x !== 0) continue;

          const move: Partial<PieceMove> = {};
          move.position = [posX, posY];
          move.type = moveType;
          const promotion = this.isPawnPromotion(color, posY);
          if (promotion && moveType === "capture") move.type = "all";
          if (promotion && moveType === "move") move.type = "promotion";
          moves.push(move as PieceMove);
        }
        return moves;
      }
    }
  }

  getGameBoard() {
    return this.board;
  }

  getGameStatus() {
    return this.status;
  }

  private isValidMove(x: number, y: number) {
    return x >= 0 && y >= 0 && x < 8 && y < 8;
  }

  private getMoveType(color: PieceColor, x: number, y: number) {
    const square = this.board[y][x];
    if (square === null) return "move";
    if (square.startsWith(color)) return "invalid";
    return "capture";
  }

  private isPawnPromotion(color: PieceColor, posY: number) {
    switch (color) {
      case "black":
        return posY === 0;
      case "white":
        return posY === 7;
    }
  }
}

export function createBoard() {
  const board: GameBoard = Array.from({ length: 8 }, () =>
    new Array(8).fill(null),
  );
  board[1] = new Array<ChessPiece>(8).fill("white-pawn");
  board[6] = new Array<ChessPiece>(8).fill("black-pawn");
  board[0] = [
    "white-rook",
    "white-knight",
    "white-bishop",
    "white-queen",
    "white-king",
    "white-bishop",
    "white-knight",
    "white-rook",
  ];
  board[7] = [
    "black-rook",
    "black-knight",
    "black-bishop",
    "black-queen",
    "black-king",
    "black-bishop",
    "black-knight",
    "black-rook",
  ];
  return board;
}
