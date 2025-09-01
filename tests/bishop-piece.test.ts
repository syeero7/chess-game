import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("bishop moves generation", () => {
  it("should generate all available moves for bishop pieces", () => {
    const gameBoard: GameBoard = Array.from({ length: 8 }, () =>
      new Array(8).fill(null),
    );
    gameBoard[2][4] = "white-bishop";
    gameBoard[4][1] = "white-pawn";
    gameBoard[3][6] = "white-pawn";
    gameBoard[6][3] = "black-bishop";
    gameBoard[5][1] = "black-pawn";
    gameBoard[4][6] = "black-pawn";
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves([4, 2]);
    expect(white).toContainEqual<PieceMove>({ position: [6, 0], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [3, 1], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [5, 3], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [2, 4], type: "move" });
    expect(white).toContainEqual<PieceMove>({
      position: [1, 5],
      type: "capture",
    });
    expect(white).toContainEqual<PieceMove>({
      position: [6, 4],
      type: "capture",
    });
    expect(white).not.toContainEqual<PieceMove>({
      position: [0, 6],
      type: "move",
    });
    expect(white).not.toContainEqual<PieceMove>({
      position: [7, 5],
      type: "move",
    });

    const black = game.getAvailableMoves([3, 6]);
    expect(black).toContainEqual<PieceMove>({ position: [2, 5], type: "move" });
    expect(black).toContainEqual<PieceMove>({ position: [2, 7], type: "move" });
    expect(black).toContainEqual<PieceMove>({ position: [4, 7], type: "move" });
    expect(black).toContainEqual<PieceMove>({ position: [5, 4], type: "move" });
    expect(black).toContainEqual<PieceMove>({
      position: [1, 4],
      type: "capture",
    });
    expect(black).toContainEqual<PieceMove>({
      position: [6, 3],
      type: "capture",
    });
    expect(black).not.toContainEqual<PieceMove>({
      position: [7, 2],
      type: "move",
    });
  });
});
