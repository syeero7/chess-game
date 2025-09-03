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
    expect(white.get("06")).not.toBe<PieceMove>("move");
    expect(white.get("20")).not.toBe<PieceMove>("move");
    expect(white.get("64")).not.toBe<PieceMove>("capture");

    const black = game.getAvailableMoves("26", "black");
    expect(black.get("17")).toBe<PieceMove>("move");
    expect(black.get("35")).toBe<PieceMove>("move");
    expect(black.get("15")).toBe<PieceMove>("move");
    expect(black.get("37")).toBe<PieceMove>("move");
    expect(black.get("04")).toBe<PieceMove>("capture");
    expect(black.get("71")).not.toBe<PieceMove>("move");
  });
});
