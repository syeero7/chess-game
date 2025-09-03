import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard } from "../src/types";

describe("pawn moves generation", () => {
  it("should generate available normal moves for pawn pieces", () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("01", "pawn");
    gameBoard.white.set("11", "pawn");
    gameBoard.black.set("26", "pawn");
    gameBoard.black.set("16", "pawn");
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves("01", "white");
    expect(white.get("02")).toBe<PieceMove>("move");
    expect(white.get("03")).toBe<PieceMove>("move");

    const black = game.getAvailableMoves("26", "black");
    expect(black.get("25")).toBe<PieceMove>("move");
    expect(black.get("24")).toBe<PieceMove>("move");
  });

  it("should generate available capture moves for pawn pieces", () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("03", "pawn");
    gameBoard.white.set("23", "pawn");
    gameBoard.black.set("14", "pawn");
    gameBoard.black.set("34", "pawn");
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves("23", "white");
    expect(white.get("24")).toBe<PieceMove>("move");
    expect(white.get("14")).toBe<PieceMove>("capture");
    expect(white.get("34")).toBe<PieceMove>("capture");

    const black = game.getAvailableMoves("14", "black");
    expect(black.get("13")).toBe<PieceMove>("move");
    expect(black.get("23")).toBe<PieceMove>("capture");
    expect(black.get("03")).toBe<PieceMove>("capture");
  });

  it("should generate available promotion moves for pawn pieces", () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("26", "pawn");
    gameBoard.black.set("01", "pawn");
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves("26", "white");
    expect(white.get("27")).toBe<PieceMove>("promotion");

    const black = game.getAvailableMoves("01", "black");
    expect(black.get("00")).toBe<PieceMove>("promotion");
  });

  it('should generate available capture and promotion moves as "all" moves for pawn pieces', () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("60", "knight");
    gameBoard.white.set("26", "pawn");
    gameBoard.black.set("17", "knight");
    gameBoard.black.set("71", "pawn");
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves("26", "white");
    expect(white.get("17")).toBe<PieceMove>("all");

    const black = game.getAvailableMoves("71", "black");
    expect(black.get("60")).toBe<PieceMove>("all");
  });

  it("should not generate any moves that puts ally king under attack", () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("40", "king");
    gameBoard.white.set("03", "bishop");
    gameBoard.white.set("31", "pawn");
    gameBoard.white.set("45", "pawn");
    gameBoard.black.set("47", "king");
    gameBoard.black.set("04", "bishop");
    gameBoard.black.set("42", "pawn");
    gameBoard.black.set("25", "pawn");
    gameBoard.black.set("36", "pawn");
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves("31", "white");
    expect(white.get("42")).not.toBe<PieceMove>("capture");

    const black = game.getAvailableMoves("36", "black");
    expect(black.get("45")).toBe<PieceMove>("capture");
  });
});
