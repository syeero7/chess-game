import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("queen moves generation", () => {
  it("should generate all available moves for queen piece", () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("40", "king");
    gameBoard.white.set("31", "queen");
    gameBoard.white.set("43", "rook");
    gameBoard.white.set("02", "pawn");
    gameBoard.black.set("47", "king");
    gameBoard.black.set("46", "queen");
    gameBoard.black.set("04", "pawn");
    gameBoard.black.set("61", "pawn");
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves("31", "white");
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

    const black = game.getAvailableMoves("46", "black");
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
