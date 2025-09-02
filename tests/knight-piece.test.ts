import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("knight moves generation", () => {
  it("should generate all available moves for knight piece", () => {
    const gameBoard: GameBoard = Array.from({ length: 8 }, () =>
      new Array(8).fill(null),
    );
    gameBoard[0][4] = "white-king";
    gameBoard[2][3] = "white-knight";
    gameBoard[3][0] = "white-bishop";
    gameBoard[4][4] = "white-pawn";
    gameBoard[7][4] = "black-king";
    gameBoard[6][3] = "black-knight";
    gameBoard[3][5] = "black-pawn";
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves([3, 2]);
    expect(white).toContainEqual<PieceMove>({ position: [2, 4], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [1, 3], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [1, 1], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [2, 0], type: "move" });
    expect(white).toContainEqual<PieceMove>({
      position: [5, 3],
      type: "capture",
    });
    expect(white).not.toContainEqual<PieceMove>({
      position: [4, 4],
      type: "move",
    });
    expect(white).not.toContainEqual<PieceMove>({
      position: [4, 0],
      type: "move",
    });

    const black = game.getAvailableMoves([3, 6]);
    expect(black).not.toContainEqual<PieceMove>({
      position: [1, 5],
      type: "move",
    });
    expect(black).not.toContainEqual<PieceMove>({
      position: [2, 4],
      type: "move",
    });
    expect(black).not.toContainEqual<PieceMove>({
      position: [4, 4],
      type: "capture",
    });
  });
});
