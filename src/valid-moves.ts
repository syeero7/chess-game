import type { Piece, PiecePosition } from "./types";

const bishopMoves: PiecePosition[] = [
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
];
const rookMoves: PiecePosition[] = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1],
];

export const VALID_MOVES: Record<Piece, PiecePosition[]> = {
  bishop: bishopMoves,
  rook: rookMoves,
  queen: [...bishopMoves, ...rookMoves],
  king: [...bishopMoves, ...rookMoves],
  pawn: [
    [0, 1],
    [1, 1],
    [-1, 1],
  ],
  knight: [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-2, 1],
    [-1, 2],
    [-1, -2],
    [-2, -1],
  ],
};
