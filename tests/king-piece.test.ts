import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("king moves generation", () => {
  it("should generate all available moves for king piece", () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("32", "pawn");
    gameBoard.white.set("52", "pawn");
    gameBoard.white.set("06", "king");
    gameBoard.black.set("33", "king");
    const game = new Game(gameBoard);

    const moves = game.getAvailableMoves("33", "black");
    expect(moves.get("34")).toBe<PieceMove>("move");
    expect(moves.get("24")).toBe<PieceMove>("move");
    expect(moves.get("44")).toBe<PieceMove>("move");
    expect(moves.get("32")).toBe<PieceMove>("capture");
    expect(moves.get("23")).not.toBe<PieceMove>("move");
    expect(moves.get("43")).not.toBe<PieceMove>("move");
  });
});
