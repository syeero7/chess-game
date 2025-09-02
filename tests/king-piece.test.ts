import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("king moves generation", () => {
  it("should generate all available moves for king piece", () => {
    const gameBoard: GameBoard = Array.from({ length: 8 }, () =>
      new Array(8).fill(null),
    );
    gameBoard[2][3] = "white-pawn";
    gameBoard[2][5] = "white-pawn";
    gameBoard[3][3] = "black-king";
    const game = new Game(gameBoard);

    const moves = game.getAvailableMoves([3, 3]);
    expect(moves).toContainEqual<PieceMove>({ position: [3, 4], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [2, 4], type: "move" });
    expect(moves).toContainEqual<PieceMove>({ position: [4, 4], type: "move" });
    expect(moves).toContainEqual<PieceMove>({
      position: [3, 2],
      type: "capture",
    });
    expect(moves).not.toContainEqual<PieceMove>({
      position: [2, 3],
      type: "move",
    });
    expect(moves).not.toContainEqual<PieceMove>({
      position: [4, 3],
      type: "move",
    });
  });
});
