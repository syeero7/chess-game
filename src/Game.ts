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
  private kingPositions: Record<PieceColor, PiecePosition>;

  constructor(gameBoard: GameBoard) {
    this.board = gameBoard;
    this.status = null;
    this.activePlayer = "white";
    this.kingPositions = { white: [4, 0], black: [4, 7] };
  }

  private switchPlayerTurn() {
    this.activePlayer = this.activePlayer === "white" ? "black" : "white";
  }

  getAvailableMoves(pos: PiecePosition) {
    const [currentX, currentY] = pos;
    const square = this.board[currentY][currentX];
    if (square === null) {
      throw new Error("Invalid piece position");
    }

    const [color, piece] = square.split("-") as [PieceColor, Piece];
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
          const moveType = this.getMoveType(color, this.board[posY][posX]);
          if (moveType === "invalid") continue;
          if (moveType === "move" && x !== 0) continue;
          if (this.isKingUnderAttack(pos, [posX, posY], color)) continue;

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

      case "rook":
      case "queen":
      case "bishop": {
        const validMoves = VALID_MOVES[piece];

        for (const [x, y] of validMoves) {
          let [posX, posY] = [currentX + x, currentY + y];

          while (this.isValidMove(posX, posY)) {
            const moveType = this.getMoveType(color, this.board[posY][posX]);
            if (moveType === "invalid") break;
            if (this.isKingUnderAttack(pos, [posX, posY], color)) break;
            moves.push({ position: [posX, posY], type: moveType });
            if (moveType === "capture") break;

            posX += x;
            posY += y;
          }
        }
        return moves;
      }

      case "knight": {
        const validMoves = VALID_MOVES.knight;

        for (const [x, y] of validMoves) {
          const [posX, posY] = [currentX + x, currentY + y];
          if (!this.isValidMove(posX, posY)) continue;
          const moveType = this.getMoveType(color, this.board[posY][posX]);
          if (moveType === "invalid") continue;
          if (this.isKingUnderAttack(pos, [posX, posY], color)) continue;
          moves.push({ position: [posX, posY], type: moveType });
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

  private isUnderAttack(
    color: PieceColor,
    pos: PiecePosition,
    board: GameBoard,
  ) {
    const [kingX, kingY] = pos;
    const pawnMoves =
      color === "white"
        ? VALID_MOVES.pawn.slice(1)
        : VALID_MOVES.pawn.slice(1).map((p) => [p[0], p[1] * -1]);
    for (const [x, y] of pawnMoves) {
      const [posX, posY] = [kingX + x, kingY + y];
      if (!this.isValidMove(posX, posY)) continue;
      const square = board[posY][posX];
      const moveType = this.getMoveType(color, square);
      if (moveType === "invalid" || square === null) continue;
      if (moveType === "capture" && square.endsWith("pawn")) return true;
    }

    const kingMoves = VALID_MOVES.king;
    for (const [x, y] of kingMoves) {
      const [posX, posY] = [kingX + x, kingY + y];
      if (!this.isValidMove(posX, posY)) continue;
      const square = board[posY][posX];
      const moveType = this.getMoveType(color, square);
      if (moveType === "invalid" || square === null) continue;
      if (moveType === "capture" && square.endsWith("king")) return true;
    }

    const knightMoves = VALID_MOVES.knight;
    for (const [x, y] of knightMoves) {
      const [posX, posY] = [kingX + x, kingY + y];
      if (!this.isValidMove(posX, posY)) continue;
      const square = board[posY][posX];
      const moveType = this.getMoveType(color, square);
      if (moveType === "invalid" || square === null) continue;
      if (moveType === "capture" && square.endsWith("knight")) return true;
    }

    const queenMoves = VALID_MOVES.queen; // rook + bishop
    for (const [x, y] of queenMoves) {
      let [posX, posY] = [kingX + x, kingY + y];

      while (this.isValidMove(posX, posY)) {
        const square = board[posY][posX];
        const moveType = this.getMoveType(color, square);
        if (moveType === "invalid") break;
        if (square && moveType === "capture") {
          if (square.endsWith("queen")) return true;
          if ((x === 0 || y === 0) && square.endsWith("rook")) return true;
          if (x !== 0 && y !== 0 && square.endsWith("bishop")) return true;
          break;
        }

        posX += x;
        posY += y;
      }
    }

    return false;
  }

  private isKingUnderAttack(
    from: PiecePosition,
    to: PiecePosition,
    color: PieceColor,
  ) {
    const tmpBoard = structuredClone(this.board);
    const [fromX, fromY] = from;
    const [toX, toY] = to;
    tmpBoard[toY][toX] = tmpBoard[fromY][fromX];
    tmpBoard[fromY][fromX] = null;
    return this.isUnderAttack(color, this.kingPositions[color], tmpBoard);
  }

  private isValidMove(x: number, y: number) {
    return x >= 0 && y >= 0 && x < 8 && y < 8;
  }

  private getMoveType(color: PieceColor, square: ChessPiece | null) {
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
