export type PieceColor = "black" | "white";
export type Piece = "knight" | "king" | "queen" | "pawn" | "rook" | "bishop";
export type ChessPiece = `${PieceColor}-${Piece}`;
export type PiecePosition = [x: number, y: number];
export type GameStatus = "draw" | "check" | "checkmate" | "win" | null;
export type GameBoard = (null | ChessPiece)[][];
export type PieceMoveType = "move" | "capture" | "promotion" | "all";
export type PieceMove = { position: PiecePosition; type: PieceMoveType };
