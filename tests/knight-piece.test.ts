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
    expect(white.get("24")).toBe<PieceMove>("move");
    expect(white.get("13")).toBe<PieceMove>("move");
    expect(white.get("11")).toBe<PieceMove>("move");
    expect(white.get("20")).toBe<PieceMove>("move");
    expect(white.get("53")).toBe<PieceMove>("capture");
    expect(white.get("44")).not.toBe<PieceMove>("move");
    expect(white.get("40")).not.toBe<PieceMove>("move");

    const black = game.getAvailableMoves("36", "black");
    expect(black.get("15")).not.toBe<PieceMove>("move");
    expect(black.get("24")).not.toBe<PieceMove>("move");
    expect(black.get("44")).not.toBe<PieceMove>("capture");
  });
});
