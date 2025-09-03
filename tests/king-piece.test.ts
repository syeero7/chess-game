import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("king moves generation", () => {
  it("should generate all available moves for king piece", () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("32", "pawn");
    gameBoard.white.set("52", "pawn");
    gameBoard.black.set("33", "king");
    const game = new Game(gameBoard);

    const moves = game.getAvailableMoves("33", "black");
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
