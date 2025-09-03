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
    expect(white.get("54")).toBe<PieceMove>("move");
    expect(white.get("43")).toBe<PieceMove>("move");
    expect(white.get("73")).toBe<PieceMove>("move");
    expect(white.get("52")).toBe<PieceMove>("move");
    expect(white.get("55")).toBe<PieceMove>("capture");
    expect(white.get("56")).not.toBe<PieceMove>("move");
    expect(white.get("13")).not.toBe<PieceMove>("move");

    const black = game.getAvailableMoves("14", "black");
    expect(black.get("65")).not.toBe<PieceMove>("move");
    expect(black.get("11")).not.toBe<PieceMove>("move");
    expect(black.get("16")).not.toBe<PieceMove>("capture");
  });
});
