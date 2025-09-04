export type PieceColor = "black" | "white";
export type Piece = "knight" | "king" | "queen" | "pawn" | "rook" | "bishop";
export type PiecePosition = [x: number, y: number];
export type PieceIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type PieceIndexString = `${PieceIndex}${PieceIndex}`;
export type GameBoard = Record<PieceColor, Map<PieceIndexString, Piece>>;
export type PieceMove = "move" | "capture" | "promotion" | "all" | "check";
export type ChessPiece = `${PieceColor}-${Piece}`;
export type PieceMovesMap = Map<PieceIndexString, PieceMove>;
export type GameStatus =
  | `${PieceColor}-check`
  | "checkmate"
  | "stalemate"
  | null;
