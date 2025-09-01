import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("knight moves generation", () => {
  it("should generate all available moves for knight piece", () => {
    const gameBoard: GameBoard = Array.from({ length: 8 }, () =>
      new Array(8).fill(null),
    );
    gameBoard[3][3] = "white-knight";
    gameBoard[1][2] = "white-pawn";
    gameBoard[5][2] = "black-pawn";
    gameBoard[4][5] = "black-pawn";
    const game = new Game(gameBoard);

    const moves = game.getAvailableMoves([3, 3]);
    expect(moves).toContainEqual<PieceMove>({ position: [1, 4], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [4, 5], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [5, 2], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [4, 1], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [1, 2], type: "move" });
    expect(moves).toContainEqual<PieceMove>({
      position: [2, 5],
      type: "capture",
    });
    expect(moves).toContainEqual<PieceMove>({
      position: [5, 4],
      type: "capture",
    });
    expect(moves).not.toContainEqual<PieceMove>({
      position: [2, 1],
      type: "move",
    });
  });
});
