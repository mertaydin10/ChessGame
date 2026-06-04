export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type Color = 'white' | 'black';

export interface Piece {
  type: PieceType;
  color: Color;
  hasMoved?: boolean;
}

export type Square = Piece | null;
export type Board = Square[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  isEnPassant?: boolean;
  isCastling?: boolean;
  promotion?: PieceType;
}

export interface GameState {
  board: Board;
  currentTurn: Color;
  selectedPosition: Position | null;
  validMoves: Position[];
  moveHistory: Move[];
  enPassantTarget: Position | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  capturedPieces: { white: Piece[]; black: Piece[] };
  status: 'playing' | 'checkmate' | 'stalemate' | 'draw';
}
