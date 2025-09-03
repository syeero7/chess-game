import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("rook moves generation", () => {
  it("should generate all available moves for rook pieces", () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("40", "king");
    gameBoard.white.set("03", "bishop");
    gameBoard.white.set("53", "rook");
    gameBoard.white.set("51", "pawn");
    gameBoard.white.set("16", "pawn");
    gameBoard.black.set("47", "king");
    gameBoard.black.set("14", "rook");
    gameBoard.black.set("55", "pawn");
    gameBoard.black.set("33", "pawn");
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves("53", "white");
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

    const black = game.getAvailableMoves("14", "black");
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
