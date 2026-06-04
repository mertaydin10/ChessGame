import type { Color, Piece } from '../chess/types';

interface Props {
  pieces: Piece[];
  color: Color;
  label: string;
}

const UNICODE: Record<string, Record<string, string>> = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
};

const ORDER = ['queen', 'rook', 'bishop', 'knight', 'pawn'];

function sortPieces(pieces: Piece[]): Piece[] {
  return [...pieces].sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type));
}

export default function CapturedPieces({ pieces, color, label }: Props) {
  const sorted = sortPieces(pieces);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 12px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 8,
      border: '1px solid rgba(255,255,255,0.06)',
      minHeight: 36,
    }}>
      <span style={{ color: '#64748b', fontSize: 11, fontWeight: 600, minWidth: 60 }}>{label}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {sorted.map((p, i) => (
          <span key={i} style={{ fontSize: 18, lineHeight: 1 }}>
            {UNICODE[p.color][p.type]}
          </span>
        ))}
        {pieces.length === 0 && (
          <span style={{ color: '#334155', fontSize: 12 }}>—</span>
        )}
      </div>
    </div>
  );
}
