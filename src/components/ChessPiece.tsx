import type { Piece } from '../chess/types';

interface Props {
  piece: Piece;
  size?: number;
}

const PIECE_UNICODE: Record<string, Record<string, string>> = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
};

export default function ChessPiece({ piece, size = 52 }: Props) {
  const symbol = PIECE_UNICODE[piece.color][piece.type];

  return (
    <span
      style={{
        fontSize: size,
        lineHeight: 1,
        userSelect: 'none',
        display: 'block',
        textAlign: 'center',
        filter: piece.color === 'white'
          ? 'drop-shadow(0 2px 3px rgba(0,0,0,0.6))'
          : 'drop-shadow(0 2px 3px rgba(0,0,0,0.8)) drop-shadow(0 0 1px rgba(255,255,255,0.1))',
        cursor: 'grab',
      }}
      role="img"
      aria-label={`${piece.color} ${piece.type}`}
    >
      {symbol}
    </span>
  );
}
