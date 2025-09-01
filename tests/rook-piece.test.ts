import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("rook moves generation", () => {
  it("should generate all available moves for rook pieces", () => {
    const gameBoard: GameBoard = Array.from({ length: 8 }, () =>
      new Array(8).fill(null),
    );
    gameBoard[3][1] = "white-rook";
    gameBoard[1][1] = "white-pawn";
    gameBoard[4][0] = "white-pawn";
    gameBoard[4][6] = "black-rook";
    gameBoard[6][1] = "black-pawn";
    gameBoard[2][6] = "black-pawn";
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves([1, 3]);
    expect(white).toContainEqual<PieceMove>({ position: [1, 2], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [0, 3], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [1, 5], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [3, 3], type: "move" });
    expect(white).toContainEqual<PieceMove>({
      position: [1, 6],
      type: "capture",
    });
    expect(white).not.toContainEqual<PieceMove>({
      position: [1, 0],
      type: "move",
    });
    expect(white).not.toContainEqual<PieceMove>({
      position: [2, 7],
      type: "move",
    });

    const black = game.getAvailableMoves([6, 4]);
    expect(black).toContainEqual<PieceMove>({ position: [6, 3], type: "move" });
    expect(black).toContainEqual<PieceMove>({ position: [4, 4], type: "move" });
    expect(black).toContainEqual<PieceMove>({ position: [6, 7], type: "move" });
    expect(black).toContainEqual<PieceMove>({ position: [7, 4], type: "move" });
    expect(black).toContainEqual<PieceMove>({
      position: [0, 4],
      type: "capture",
    });
    expect(black).not.toContainEqual<PieceMove>({
      position: [6, 0],
      type: "move",
    });
  });
});
