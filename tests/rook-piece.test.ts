import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("rook moves generation", () => {
  it("should generate all available moves for rook pieces", () => {
    const gameBoard: GameBoard = Array.from({ length: 8 }, () =>
      new Array(8).fill(null),
    );
    gameBoard[0][4] = "white-king";
    gameBoard[3][0] = "white-bishop";
    gameBoard[3][5] = "white-rook";
    gameBoard[1][5] = "white-pawn";
    gameBoard[6][1] = "white-pawn";
    gameBoard[7][4] = "black-king";
    gameBoard[4][1] = "black-rook";
    gameBoard[5][5] = "black-pawn";
    gameBoard[3][3] = "black-pawn";
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves([5, 3]);
    expect(white).toContainEqual<PieceMove>({ position: [5, 4], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [4, 3], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [7, 3], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [5, 2], type: "move" });
    expect(white).toContainEqual<PieceMove>({
      position: [5, 5],
      type: "capture",
    });
    expect(white).not.toContainEqual<PieceMove>({
      position: [5, 6],
      type: "move",
    });
    expect(white).not.toContainEqual<PieceMove>({
      position: [1, 3],
      type: "move",
    });

    const black = game.getAvailableMoves([1, 4]);
    expect(black).not.toContainEqual<PieceMove>({
      position: [6, 5],
      type: "move",
    });
    expect(black).not.toContainEqual<PieceMove>({
      position: [1, 1],
      type: "move",
    });
    expect(black).not.toContainEqual<PieceMove>({
      position: [1, 6],
      type: "capture",
    });
  });
});
