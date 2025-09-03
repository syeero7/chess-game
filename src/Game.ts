import type {
  PieceIndexString,
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
  private kingPositions: Record<PieceColor, PieceIndexString>;

  constructor(gameBoard: GameBoard) {
    this.board = gameBoard;
    this.status = null;
    this.activePlayer = "white";
    this.kingPositions = { white: "40", black: "47" };
  }

  private switchPlayerTurn() {
    this.activePlayer = this.activePlayer === "white" ? "black" : "white";
  }

  movePiece(
    from: PieceIndexString,
    to: PieceIndexString,
    type: PieceMove,
    promotion?: Exclude<Piece, "king" | "pawn">,
  ) {
    const fromSquare = this.board.white.get(from) || this.board.black.get(from);
    const toSquare = this.board.white.get(to) || this.board.black.get(to);
    if (!fromSquare || ((type === "all" || type === "capture") && !toSquare)) {
      throw new Error("Invalid piece position");
    }
    const color = this.activePlayer;
    if (fromSquare === "king") this.kingPositions[color] = to;
    this.board[color].set(to, this.board[color].get(from)!);
    this.board[color].delete(from);
    this.board[this.getOpponentColor(color)].delete(to);
    if (fromSquare === "pawn" && type === "promotion" && promotion) {
      this.board[color].set(to, promotion);
    }
  }

  getAvailableMoves(position: PieceIndexString, color: PieceColor) {
    const piece = this.board[color].get(position);
    if (piece == null) throw new Error("Invalid piece position");
    const [currentX, currentY] = position.split("").map((p) => Number(p));
    const moves = new Map<PieceIndexString, PieceMove>();

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
          const square = `${posX}${posY}` as PieceIndexString;
          const moveType = this.getMoveType(color, this.board, square);
          if (moveType === "invalid") continue;
          if (moveType === "move" && x !== 0) continue;
          if (this.isKingUnderAttack(position, square, color)) continue;
          const promotion = this.isPawnPromotion(color, posY);
          let tmpMove: PieceMove = moveType;
          if (promotion && moveType === "capture") tmpMove = "all";
          if (promotion && moveType === "move") tmpMove = "promotion";
          moves.set(square, tmpMove);
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
            const square = `${posX}${posY}` as PieceIndexString;
            const moveType = this.getMoveType(color, this.board, square);
            if (moveType === "invalid") break;
            if (this.isKingUnderAttack(position, square, color)) break;
            moves.set(square, moveType);
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
          const square = `${posX}${posY}` as PieceIndexString;
          const moveType = this.getMoveType(color, this.board, square);
          if (moveType === "invalid") continue;
          if (this.isKingUnderAttack(position, square, color)) continue;
          moves.set(square, moveType);
        }
        return moves;
      }

      case "king": {
        const validMoves = VALID_MOVES.king;

        for (const [x, y] of validMoves) {
          const [posX, posY] = [currentX + x, currentY + y];
          if (!this.isValidMove(posX, posY)) continue;
          const square = `${posX}${posY}` as PieceIndexString;
          const moveType = this.getMoveType(color, this.board, square);
          if (moveType === "invalid") continue;
          if (this.isKingUnderAttack(position, square, color, square)) continue;
          moves.set(square, moveType);
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
    position: PieceIndexString,
    board: GameBoard,
  ) {
    const [kingX, kingY] = position.split("").map((p) => Number(p));
    const opponent = this.getOpponentColor(color);
    const pawnMoves =
      color === "white"
        ? VALID_MOVES.pawn.slice(1)
        : VALID_MOVES.pawn.slice(1).map((p) => [p[0], p[1] * -1]);
    for (const [x, y] of pawnMoves) {
      const [posX, posY] = [kingX + x, kingY + y];
      if (!this.isValidMove(posX, posY)) continue;
      const square = `${posX}${posY}` as PieceIndexString;
      const moveType = this.getMoveType(color, board, square);
      if (moveType === "invalid" || moveType === "move") continue;
      if (board[opponent].get(square) === "pawn") return true;
    }

    const kingMoves = VALID_MOVES.king;
    for (const [x, y] of kingMoves) {
      const [posX, posY] = [kingX + x, kingY + y];
      if (!this.isValidMove(posX, posY)) continue;
      const square = `${posX}${posY}` as PieceIndexString;
      const moveType = this.getMoveType(color, board, square);
      if (moveType === "invalid" || moveType === "move") continue;
      if (board[opponent].get(square) === "king") return true;
    }

    const knightMoves = VALID_MOVES.knight;
    for (const [x, y] of knightMoves) {
      const [posX, posY] = [kingX + x, kingY + y];
      if (!this.isValidMove(posX, posY)) continue;
      const square = `${posX}${posY}` as PieceIndexString;
      const moveType = this.getMoveType(color, board, square);
      if (moveType === "invalid" || moveType === "move") continue;
      if (board[opponent].get(square) === "knight") return true;
    }

    const queenMoves = VALID_MOVES.queen; // rook + bishop
    for (const [x, y] of queenMoves) {
      let [posX, posY] = [kingX + x, kingY + y];

      while (this.isValidMove(posX, posY)) {
        const square = `${posX}${posY}` as PieceIndexString;
        const moveType = this.getMoveType(color, board, square);
        if (moveType === "invalid") break;
        const piece = board[opponent].get(square);
        if (piece && moveType === "capture") {
          if (piece === "queen") return true;
          if ((x === 0 || y === 0) && piece === "rook") return true;
          if (x !== 0 && y !== 0 && piece === "bishop") return true;
          break;
        }

        posX += x;
        posY += y;
      }
    }

    return false;
  }

  private isKingUnderAttack(
    from: PieceIndexString,
    to: PieceIndexString,
    color: PieceColor,
    kingPosition = this.kingPositions[color],
  ) {
    const tmpBoard = structuredClone(this.board);
    if (!tmpBoard[color].has(from)) throw new Error("Invalid piece position");
    tmpBoard[color].set(to, tmpBoard[color].get(from)!);
    tmpBoard[color].delete(from);
    tmpBoard[this.getOpponentColor(color)].delete(to);
    return this.isUnderAttack(color, kingPosition, tmpBoard);
  }

  private isValidMove(x: number, y: number) {
    return x >= 0 && y >= 0 && x < 8 && y < 8;
  }

  private getMoveType(
    color: PieceColor,
    board: GameBoard,
    square: PieceIndexString,
  ) {
    if (board[color].has(square)) return "invalid";
    if (board[this.getOpponentColor(color)].has(square)) return "capture";
    return "move";
  }

  private getOpponentColor(color: PieceColor) {
    return color === "black" ? "white" : "black";
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
