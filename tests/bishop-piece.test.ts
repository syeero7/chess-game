import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("bishop moves generation", () => {
  it("should generate all available moves for bishop pieces", () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("40", "king");
    gameBoard.white.set("42", "bishop");
    gameBoard.white.set("04", "pawn");
    gameBoard.black.set("47", "king");
    gameBoard.black.set("26", "bishop");
    gameBoard.black.set("44", "rook");
    gameBoard.black.set("64", "pawn");
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves("42", "white");
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

    const black = game.getAvailableMoves("26", "black");
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
