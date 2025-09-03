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
    expect(white.get("37")).toBe<PieceMove>("move");
    expect(white.get("75")).toBe<PieceMove>("move");
    expect(white.get("01")).toBe<PieceMove>("move");
    expect(white.get("22")).toBe<PieceMove>("move");
    expect(white.get("61")).toBe<PieceMove>("capture");
    expect(white.get("04")).toBe<PieceMove>("capture");
    expect(white.get("71")).not.toBe<PieceMove>("move");

    const black = game.getAvailableMoves("46", "black");
    expect(black.get("43")).toBe<PieceMove>("capture");
    expect(black.get("06")).not.toBe<PieceMove>("move");
    expect(black.get("73")).not.toBe<PieceMove>("move");
    expect(black.get("02")).not.toBe<PieceMove>("capture");
  });
});
