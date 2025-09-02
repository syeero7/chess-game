import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("queen moves generation", () => {
  it("should generate all available moves for queen piece", () => {
    const gameBoard: GameBoard = Array.from({ length: 8 }, () =>
      new Array(8).fill(null),
    );
    gameBoard[0][4] = "white-king";
    gameBoard[1][3] = "white-queen";
    gameBoard[3][4] = "white-rook";
    gameBoard[2][0] = "white-pawn";
    gameBoard[7][4] = "black-king";
    gameBoard[6][4] = "black-queen";
    gameBoard[4][0] = "black-pawn";
    gameBoard[1][6] = "black-pawn";
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves([3, 1]);
    expect(white).toContainEqual<PieceMove>({ position: [3, 7], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [7, 5], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [0, 1], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [2, 2], type: "move" });
    expect(white).toContainEqual<PieceMove>({
      position: [6, 1],
      type: "capture",
    });
    expect(white).toContainEqual<PieceMove>({
      position: [0, 4],
      type: "capture",
    });
    expect(white).not.toContainEqual<PieceMove>({
      position: [7, 1],
      type: "move",
    });

    const black = game.getAvailableMoves([4, 6]);
    expect(black).toContainEqual<PieceMove>({
      position: [4, 3],
      type: "capture",
    });
    expect(black).not.toContainEqual<PieceMove>({
      position: [0, 6],
      type: "move",
    });
    expect(black).not.toContainEqual<PieceMove>({
      position: [7, 3],
      type: "move",
    });
    expect(black).not.toContainEqual<PieceMove>({
      position: [0, 2],
      type: "capture",
    });
  });
});
