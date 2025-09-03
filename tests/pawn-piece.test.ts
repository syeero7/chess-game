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
    expect(white).toContainEqual<PieceMove>({ position: [0, 2], type: "move" });
    expect(white).toContainEqual<PieceMove>({ position: [0, 3], type: "move" });

    const black = game.getAvailableMoves("26", "black");
    expect(black).toContainEqual<PieceMove>({ position: [2, 5], type: "move" });
    expect(black).toContainEqual<PieceMove>({ position: [2, 4], type: "move" });
  });

  it("should generate available capture moves for pawn pieces", () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("03", "pawn");
    gameBoard.white.set("23", "pawn");
    gameBoard.black.set("14", "pawn");
    gameBoard.black.set("34", "pawn");
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves("23", "white");
    expect(white).toContainEqual<PieceMove>({ position: [2, 4], type: "move" });
    expect(white).toContainEqual<PieceMove>({
      position: [1, 4],
      type: "capture",
    });
    expect(white).toContainEqual<PieceMove>({
      position: [3, 4],
      type: "capture",
    });

    const black = game.getAvailableMoves("14", "black");
    expect(black).toContainEqual<PieceMove>({ position: [1, 3], type: "move" });
    expect(black).toContainEqual<PieceMove>({
      position: [2, 3],
      type: "capture",
    });
    expect(black).toContainEqual<PieceMove>({
      position: [0, 3],
      type: "capture",
    });
  });

  it("should generate available promotion moves for pawn pieces", () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("26", "pawn");
    gameBoard.black.set("01", "pawn");
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves("26", "white");
    expect(white).toContainEqual<PieceMove>({
      position: [2, 7],
      type: "promotion",
    });

    const black = game.getAvailableMoves("01", "black");
    expect(black).toContainEqual<PieceMove>({
      position: [0, 0],
      type: "promotion",
    });
  });

  it('should generate available capture and promotion moves as "all" moves for pawn pieces', () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("60", "knight");
    gameBoard.white.set("26", "pawn");
    gameBoard.black.set("17", "knight");
    gameBoard.black.set("71", "pawn");
    const game = new Game(gameBoard);

    const white = game.getAvailableMoves("26", "white");
    expect(white).toContainEqual<PieceMove>({ position: [1, 7], type: "all" });

    const black = game.getAvailableMoves("71", "black");
    expect(black).toContainEqual<PieceMove>({ position: [6, 0], type: "all" });
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
    expect(white).not.toContainEqual<PieceMove>({
      position: [4, 2],
      type: "capture",
    });

    const black = game.getAvailableMoves("36", "black");
    expect(black).toContainEqual<PieceMove>({
      position: [4, 5],
      type: "capture",
    });
  });
});
