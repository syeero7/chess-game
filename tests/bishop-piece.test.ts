import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("bishop moves generation", () => {
  it("should generate all available moves for bishop pieces", () => {
    const gameBoard: GameBoard = Array.from({ length: 8 }, () =>
      new Array(8).fill(null),
    );
    gameBoard[0][4] = "white-king";
    gameBoard[2][4] = "white-bishop";
    gameBoard[4][0] = "white-pawn";
    gameBoard[7][4] = "black-king";
    gameBoard[6][2] = "black-bishop";
    gameBoard[4][4] = "black-rook";
    gameBoard[4][6] = "black-pawn";
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves([4, 2]);
    expect(white).not.toContainEqual<PieceMove>({
      position: [0, 6],
      type: "move",
    });
    expect(white).not.toContainEqual<PieceMove>({
      position: [2, 0],
      type: "move",
    });
    expect(white).not.toContainEqual<PieceMove>({
      position: [6, 4],
      type: "capture",
    });

    const black = game.getAvailableMoves([2, 6]);
    expect(black).toContainEqual<PieceMove>({ position: [1, 7], type: "move" });
    expect(black).toContainEqual<PieceMove>({ position: [3, 5], type: "move" });
    expect(black).toContainEqual<PieceMove>({ position: [1, 5], type: "move" });
    expect(black).toContainEqual<PieceMove>({ position: [3, 7], type: "move" });
    expect(black).toContainEqual<PieceMove>({
      position: [0, 4],
      type: "capture",
    });
    expect(black).not.toContainEqual<PieceMove>({
      position: [7, 1],
      type: "move",
    });
  });
});
