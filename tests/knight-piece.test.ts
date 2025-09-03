import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("knight moves generation", () => {
  it("should generate all available moves for knight piece", () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("40", "king");
    gameBoard.white.set("32", "knight");
    gameBoard.white.set("03", "bishop");
    gameBoard.white.set("44", "pawn");
    gameBoard.black.set("47", "king");
    gameBoard.black.set("36", "knight");
    gameBoard.black.set("53", "pawn");
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves("32", "white");
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

    const black = game.getAvailableMoves("36", "black");
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
