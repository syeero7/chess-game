import { it, expect, describe } from "vitest";
import { Game } from "../src/Game";
import { PieceMove, GameBoard, GameStatus } from "../src/types";

describe("stalemate", () => {
  it('should update game state to "stalemate" & not generate any moves', () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("40", "king");
    gameBoard.white.set("62", "queen");
    gameBoard.white.set("30", "rook");
    gameBoard.white.set("24", "pawn");
    gameBoard.black.set("47", "king");
    gameBoard.black.set("25", "pawn");
    const game = new Game(gameBoard);

    game.movePiece("62", "66", "move");
    const moves = game.getAvailableMoves("25", "black");
    expect(game.getGameStatus()).toBe<GameStatus>("stalemate");
    expect(moves.size).toBe(0);
  });
});

describe("checkmate", () => {
  it('should update the state to "check" & generate only the moves that can escape the attack', () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("40", "king");
    gameBoard.white.set("50", "rook");
    gameBoard.white.set("35", "pawn");
    gameBoard.black.set("47", "king");
    gameBoard.black.set("05", "bishop");
    const game = new Game(gameBoard);

    game.movePiece("35", "36", "move");
    expect(game.getGameStatus()).toBe<GameStatus>("black-check");
    const king = game.getAvailableMoves("47", "black");
    expect(king.get("46")).toBe<PieceMove>("move");
    expect(king.get("37")).toBe<PieceMove>("move");
    expect(king.get("36")).toBe<PieceMove>("capture");
    expect(king.get("57")).not.toBe<PieceMove>("move");

    const bishop = game.getAvailableMoves("05", "black");
    expect(bishop.get("27")).not.toBe<PieceMove>("move");
    expect(bishop.get("50")).not.toBe<PieceMove>("capture");
    expect(bishop.size).toBe(0);
  });

  it('should update game state to "checkmate" & not generate any moves', () => {
    const gameBoard: GameBoard = { black: new Map(), white: new Map() };
    gameBoard.white.set("40", "king");
    gameBoard.white.set("06", "queen");
    gameBoard.white.set("25", "knight");
    gameBoard.white.set("50", "rook");
    gameBoard.white.set("35", "pawn");
    gameBoard.black.set("47", "king");
    gameBoard.black.set("05", "bishop");
    const game = new Game(gameBoard);

    game.movePiece("35", "36", "move");
    expect(game.getGameStatus()).toBe<GameStatus>("checkmate");
    const king = game.getAvailableMoves("47", "black");
    expect(king.get("46")).not.toBe<PieceMove>("move");
    expect(king.get("37")).not.toBe<PieceMove>("move");
    expect(king.get("36")).not.toBe<PieceMove>("capture");
    expect(king.size).toBe(0);
  });
});
