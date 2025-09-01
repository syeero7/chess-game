import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("queen moves generation", () => {
  it("should generate all available moves for queen piece", () => {
    const gameBoard: GameBoard = Array.from({ length: 8 }, () =>
      new Array(8).fill(null),
    );
    gameBoard[4][3] = "white-queen";
    gameBoard[2][3] = "white-pawn";
    gameBoard[4][5] = "white-pawn";
    gameBoard[2][1] = "black-pawn";
    gameBoard[6][3] = "black-pawn";
    const game = new Game(gameBoard);

    const moves = game.getAvailableMoves([3, 4]);
    expect(moves).toContainEqual<PieceMove>({ position: [3, 3], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [0, 4], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [3, 5], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [4, 4], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [2, 3], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [0, 7], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [6, 7], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [7, 0], type: "move" });
    expect(moves).toContainEqual<PieceMove>({
      position: [1, 2],
      type: "capture",
    });
    expect(moves).toContainEqual<PieceMove>({
      position: [3, 6],
      type: "capture",
    });
    expect(moves).not.toContainEqual<PieceMove>({
      position: [0, 1],
      type: "move",
    });
    expect(moves).not.toContainEqual<PieceMove>({
      position: [3, 0],
      type: "move",
    });
  });
});
