import type { Board, Color, Move, Piece, Position } from './types';
import { cloneBoard, findKing, isInBounds, positionsEqual, getSquare, setSquare } from './board';

function opponent(color: Color): Color {
  return color === 'white' ? 'black' : 'white';
}

function getRawMoves(board: Board, pos: Position, enPassantTarget: Position | null): Position[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const moves: Position[] = [];
  const { row, col } = pos;
  const { type, color } = piece;

  const addIfValid = (r: number, c: number) => {
    if (!isInBounds(r, c)) return false;
    const target = board[r][c];
    if (target && target.color === color) return false;
    moves.push({ row: r, col: c });
    return !target;
  };

  const slide = (dr: number, dc: number) => {
    let r = row + dr;
    let c = col + dc;
    while (isInBounds(r, c)) {
      const target = board[r][c];
      if (target) {
        if (target.color !== color) moves.push({ row: r, col: c });
        break;
      }
      moves.push({ row: r, col: c });
      r += dr;
      c += dc;
    }
  };

  switch (type) {
    case 'pawn': {
      const dir = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;

      // Forward
      if (isInBounds(row + dir, col) && !board[row + dir][col]) {
        moves.push({ row: row + dir, col });
        // Double forward from start
        if (row === startRow && !board[row + 2 * dir][col]) {
          moves.push({ row: row + 2 * dir, col });
        }
      }

      // Captures
      for (const dc of [-1, 1]) {
        const nr = row + dir;
        const nc = col + dc;
        if (isInBounds(nr, nc)) {
          const target = board[nr][nc];
          if (target && target.color !== color) {
            moves.push({ row: nr, col: nc });
          }
          // En passant
          if (enPassantTarget && enPassantTarget.row === nr && enPassantTarget.col === nc) {
            moves.push({ row: nr, col: nc });
          }
        }
      }
      break;
    }

    case 'knight': {
      const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      for (const [dr, dc] of knightMoves) addIfValid(row + dr, col + dc);
      break;
    }

    case 'bishop':
      slide(-1, -1); slide(-1, 1); slide(1, -1); slide(1, 1);
      break;

    case 'rook':
      slide(-1, 0); slide(1, 0); slide(0, -1); slide(0, 1);
      break;

    case 'queen':
      slide(-1, -1); slide(-1, 1); slide(1, -1); slide(1, 1);
      slide(-1, 0); slide(1, 0); slide(0, -1); slide(0, 1);
      break;

    case 'king': {
      const kingMoves = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
      for (const [dr, dc] of kingMoves) addIfValid(row + dr, col + dc);

      // Castling
      if (!piece.hasMoved) {
        // Kingside
        const kRook = board[row][7];
        if (kRook && kRook.type === 'rook' && !kRook.hasMoved &&
            !board[row][5] && !board[row][6]) {
          moves.push({ row, col: col + 2 });
        }
        // Queenside
        const qRook = board[row][0];
        if (qRook && qRook.type === 'rook' && !qRook.hasMoved &&
            !board[row][1] && !board[row][2] && !board[row][3]) {
          moves.push({ row, col: col - 2 });
        }
      }
      break;
    }
  }

  return moves;
}

export function isSquareAttacked(board: Board, pos: Position, byColor: Color): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === byColor) {
        const raw = getRawMoves(board, { row: r, col: c }, null);
        if (raw.some(m => positionsEqual(m, pos))) return true;
      }
    }
  }
  return false;
}

export function isInCheck(board: Board, color: Color): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  return isSquareAttacked(board, kingPos, opponent(color));
}

function applyMoveToBoard(board: Board, from: Position, to: Position, enPassantTarget: Position | null): Board {
  const newBoard = cloneBoard(board);
  const piece = getSquare(newBoard, from)!;
  const dir = piece.color === 'white' ? -1 : 1;

  // En passant capture
  if (piece.type === 'pawn' && enPassantTarget && positionsEqual(to, enPassantTarget)) {
    setSquare(newBoard, { row: to.row - dir, col: to.col }, null);
  }

  // Castling rook move
  if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
    if (to.col > from.col) {
      // Kingside
      const rook = getSquare(newBoard, { row: from.row, col: 7 });
      setSquare(newBoard, { row: from.row, col: 5 }, rook ? { ...rook, hasMoved: true } : null);
      setSquare(newBoard, { row: from.row, col: 7 }, null);
    } else {
      // Queenside
      const rook = getSquare(newBoard, { row: from.row, col: 0 });
      setSquare(newBoard, { row: from.row, col: 3 }, rook ? { ...rook, hasMoved: true } : null);
      setSquare(newBoard, { row: from.row, col: 0 }, null);
    }
  }

  setSquare(newBoard, to, { ...piece, hasMoved: true });
  setSquare(newBoard, from, null);
  return newBoard;
}

export function getValidMoves(board: Board, pos: Position, enPassantTarget: Position | null): Position[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const rawMoves = getRawMoves(board, pos, enPassantTarget);
  const validMoves: Position[] = [];

  for (const move of rawMoves) {
    // Castling validation: king cannot castle through check
    if (piece.type === 'king' && Math.abs(move.col - pos.col) === 2) {
      const dir = move.col > pos.col ? 1 : -1;
      const throughCol = pos.col + dir;

      // Cannot castle if in check
      if (isInCheck(board, piece.color)) continue;

      // Cannot castle through attacked square
      const throughBoard = applyMoveToBoard(board, pos, { row: pos.row, col: throughCol }, enPassantTarget);
      if (isInCheck(throughBoard, piece.color)) continue;
    }

    const newBoard = applyMoveToBoard(board, pos, move, enPassantTarget);
    if (!isInCheck(newBoard, piece.color)) {
      validMoves.push(move);
    }
  }

  return validMoves;
}

export function applyMove(board: Board, move: Move, enPassantTarget: Position | null): Board {
  return applyMoveToBoard(board, move.from, move.to, enPassantTarget);
}

export function hasAnyValidMove(board: Board, color: Color, enPassantTarget: Position | null): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row: r, col: c }, enPassantTarget);
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
}

export function computeEnPassantTarget(from: Position, to: Position, piece: Piece): Position | null {
  if (piece.type === 'pawn' && Math.abs(to.row - from.row) === 2) {
    const midRow = (from.row + to.row) / 2;
    return { row: midRow, col: from.col };
  }
  return null;
}
