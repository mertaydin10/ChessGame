import type { GameState, Position, PieceType, Move, Piece } from './types';
import { createInitialBoard, getSquare, setSquare, cloneBoard, positionsEqual } from './board';
import { getValidMoves, applyMove, isInCheck, hasAnyValidMove, computeEnPassantTarget } from './moves';

export type GameAction =
  | { type: 'SELECT_SQUARE'; position: Position }
  | { type: 'PROMOTE_PAWN'; pieceType: PieceType }
  | { type: 'RESET_GAME' };

export interface ExtendedGameState extends GameState {
  pendingPromotion: { position: Position; color: 'white' | 'black' } | null;
}

export function createInitialState(): ExtendedGameState {
  return {
    board: createInitialBoard(),
    currentTurn: 'white',
    selectedPosition: null,
    validMoves: [],
    moveHistory: [],
    enPassantTarget: null,
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    capturedPieces: { white: [], black: [] },
    status: 'playing',
    pendingPromotion: null,
  };
}

export function gameReducer(state: ExtendedGameState, action: GameAction): ExtendedGameState {
  switch (action.type) {
    case 'RESET_GAME':
      return createInitialState();

    case 'SELECT_SQUARE': {
      if (state.status !== 'playing' || state.pendingPromotion) return state;

      const { position } = action;
      const piece = getSquare(state.board, position);

      // If a piece is already selected, try to move it
      if (state.selectedPosition) {
        const isValidMove = state.validMoves.some(m => positionsEqual(m, position));

        if (isValidMove) {
          return executeMove(state, state.selectedPosition, position);
        }

        // Select new piece of same color
        if (piece && piece.color === state.currentTurn) {
          const validMoves = getValidMoves(state.board, position, state.enPassantTarget);
          return { ...state, selectedPosition: position, validMoves };
        }

        return { ...state, selectedPosition: null, validMoves: [] };
      }

      // Select a piece
      if (piece && piece.color === state.currentTurn) {
        const validMoves = getValidMoves(state.board, position, state.enPassantTarget);
        return { ...state, selectedPosition: position, validMoves };
      }

      return state;
    }

    case 'PROMOTE_PAWN': {
      if (!state.pendingPromotion) return state;
      const { position, color } = state.pendingPromotion;
      const newBoard = cloneBoard(state.board);
      setSquare(newBoard, position, { type: action.pieceType, color, hasMoved: true });

      const opponent = color === 'white' ? 'black' : 'white';
      const isCheck = isInCheck(newBoard, opponent);
      const hasMove = hasAnyValidMove(newBoard, opponent, state.enPassantTarget);
      const isCheckmate = isCheck && !hasMove;
      const isStalemate = !isCheck && !hasMove;

      return {
        ...state,
        board: newBoard,
        pendingPromotion: null,
        isCheck,
        isCheckmate,
        isStalemate,
        status: isCheckmate ? 'checkmate' : isStalemate ? 'stalemate' : 'playing',
      };
    }

    default:
      return state;
  }
}

function executeMove(state: ExtendedGameState, from: Position, to: Position): ExtendedGameState {
  const piece = getSquare(state.board, from)!;
  const captured = getSquare(state.board, to);
  const opponent: 'white' | 'black' = state.currentTurn === 'white' ? 'black' : 'white';

  const move: Move = {
    from,
    to,
    piece,
    captured: captured ?? undefined,
    isEnPassant: piece.type === 'pawn' &&
      state.enPassantTarget !== null &&
      positionsEqual(to, state.enPassantTarget),
    isCastling: piece.type === 'king' && Math.abs(to.col - from.col) === 2,
  };

  const newBoard = applyMove(state.board, move, state.enPassantTarget);

  // Track captured pieces
  const capturedPieces = {
    white: [...state.capturedPieces.white],
    black: [...state.capturedPieces.black],
  };

  if (move.captured) {
    capturedPieces[move.captured.color].push(move.captured);
  }
  if (move.isEnPassant) {
    const capturedPawn: Piece = { type: 'pawn', color: opponent };
    capturedPieces[opponent].push(capturedPawn);
  }

  const newEnPassantTarget = computeEnPassantTarget(from, to, piece);

  // Pawn promotion
  const isPromotion = piece.type === 'pawn' && (to.row === 0 || to.row === 7);
  if (isPromotion) {
    return {
      ...state,
      board: newBoard,
      selectedPosition: null,
      validMoves: [],
      moveHistory: [...state.moveHistory, move],
      enPassantTarget: newEnPassantTarget,
      capturedPieces,
      pendingPromotion: { position: to, color: piece.color },
    };
  }

  const isCheck = isInCheck(newBoard, opponent);
  const hasMove = hasAnyValidMove(newBoard, opponent, newEnPassantTarget);
  const isCheckmate = isCheck && !hasMove;
  const isStalemate = !isCheck && !hasMove;

  return {
    ...state,
    board: newBoard,
    currentTurn: opponent,
    selectedPosition: null,
    validMoves: [],
    moveHistory: [...state.moveHistory, move],
    enPassantTarget: newEnPassantTarget,
    isCheck,
    isCheckmate,
    isStalemate,
    capturedPieces,
    status: isCheckmate ? 'checkmate' : isStalemate ? 'stalemate' : 'playing',
    pendingPromotion: null,
  };
}
