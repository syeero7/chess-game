import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("pawn moves generation", () => {
  const emptyBoard: GameBoard = Array.from({ length: 8 }, () =>
    new Array(8).fill(null),
  );

  it("should generate available normal moves for pawn pieces", () => {
    const gameBoard = [...emptyBoard];
    gameBoard[1][0] = "white-pawn";
    gameBoard[1][1] = "white-pawn";
    gameBoard[6][2] = "black-pawn";
    gameBoard[6][1] = "black-pawn";
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves([0, 1]);
    expect(white).toContainEqual<PieceMove>({ position: [0, 2], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [0, 3], type: "move" });

    const black = game.getAvailableMoves([2, 6]);
    expect(black).toContainEqual<PieceMove>({ position: [2, 5], type: "move" });
    expect(black).toContainEqual<PieceMove>({ position: [2, 4], type: "move" });
  });

  it("should generate available capture moves for pawn pieces", () => {
    const gameBoard = [...emptyBoard];
    gameBoard[3][0] = "white-pawn";
    gameBoard[3][2] = "white-pawn";
    gameBoard[4][1] = "black-pawn";
    gameBoard[4][3] = "black-pawn";
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves([2, 3]);
    expect(white).toContainEqual<PieceMove>({ position: [2, 4], type: "move" });
    expect(white).toContainEqual<PieceMove>({
      position: [1, 4],
      type: "capture",
    });
    expect(white).toContainEqual<PieceMove>({
      position: [3, 4],
      type: "capture",
    });

    const black = game.getAvailableMoves([1, 4]);
    expect(black).toContainEqual<PieceMove>({ position: [1, 3], type: "move" });
    expect(black).toContainEqual<PieceMove>({
      position: [2, 3],
      type: "capture",
    });
    expect(black).toContainEqual<PieceMove>({
      position: [0, 3],
      type: "capture",
    });
  });

  it("should generate available promotion moves for pawn pieces", () => {
    const gameBoard = [...emptyBoard];
    gameBoard[6][2] = "white-pawn";
    gameBoard[1][0] = "black-pawn";
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves([2, 6]);
    expect(white).toContainEqual<PieceMove>({
      position: [2, 7],
      type: "promotion",
    });

    const black = game.getAvailableMoves([0, 1]);
    expect(black).toContainEqual<PieceMove>({
      position: [0, 0],
      type: "promotion",
    });
  });

  it('should generate available capture and promotion moves as "all" moves for pawn pieces', () => {
    const gameBoard = [...emptyBoard];
    gameBoard[6][3] = "white-pawn";
    gameBoard[0][6] = "white-knight";
    gameBoard[1][5] = "black-pawn";
    gameBoard[7][4] = "black-knight";
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves([3, 6]);
    expect(white).toContainEqual<PieceMove>({ position: [4, 7], type: "all" });

    const black = game.getAvailableMoves([5, 1]);
    expect(black).toContainEqual<PieceMove>({ position: [6, 0], type: "all" });
  });
});
