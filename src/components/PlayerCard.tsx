import type { Color, Piece } from '../chess/types';

interface Props {
  color: Color;
  name: string;
  isActive: boolean;
  capturedByThisPlayer: Piece[];
  materialAdvantage: number;
}

const PIECE_VALS: Record<string, number> = { queen: 9, rook: 5, bishop: 3, knight: 3, pawn: 1, king: 0 };
const ORDER = ['queen', 'rook', 'bishop', 'knight', 'pawn'];
const UNICODE: Record<string, Record<string, string>> = {
  white: { queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙', king: '♔' },
  black: { queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟', king: '♚' },
};

function sortPieces(pieces: Piece[]) {
  return [...pieces].sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type));
}

export default function PlayerCard({ color, name, isActive, capturedByThisPlayer, materialAdvantage }: Props) {
  const sorted = sortPieces(capturedByThisPlayer);
  const avatarBg = color === 'white'
    ? 'linear-gradient(135deg, #e2e8f0, #cbd5e1)'
    : 'linear-gradient(135deg, #1e293b, #0f172a)';
  const avatarBorder = color === 'white' ? '#94a3b8' : '#475569';
  const avatarSymbol = color === 'white' ? '♔' : '♚';
  const avatarSymbolColor = color === 'white' ? '#1e293b' : '#e2e8f0';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      background: isActive
        ? 'linear-gradient(135deg, rgba(100,116,139,0.15), rgba(71,85,105,0.1))'
        : 'rgba(255,255,255,0.02)',
      border: isActive
        ? '1px solid rgba(148,163,184,0.25)'
        : '1px solid rgba(255,255,255,0.05)',
      borderRadius: 12,
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Active glow strip */}
      {isActive && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: color === 'white'
            ? 'linear-gradient(180deg, #e2e8f0, #94a3b8)'
            : 'linear-gradient(180deg, #475569, #1e293b)',
          borderRadius: '12px 0 0 12px',
        }} />
      )}

      {/* Avatar */}
      <div style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        background: avatarBg,
        border: `2px solid ${avatarBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        color: avatarSymbolColor,
        flexShrink: 0,
        boxShadow: isActive ? '0 0 12px rgba(148,163,184,0.2)' : 'none',
      }}>
        {avatarSymbol}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            color: isActive ? '#f1f5f9' : '#94a3b8',
            fontSize: 14,
            fontWeight: 600,
            transition: 'color 0.3s',
          }}>{name}</span>
          {isActive && (
            <div style={{ position: 'relative', width: 8, height: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#4ade80',
                position: 'absolute',
              }} />
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#4ade80',
                position: 'absolute',
                animation: 'pulse-ring 1.5s ease-out infinite',
              }} />
            </div>
          )}
        </div>

        {/* Captured pieces */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2, minHeight: 18 }}>
          {sorted.map((p, i) => (
            <span key={i} style={{
              fontSize: 14,
              lineHeight: 1,
              opacity: 0.85,
            }}>
              {UNICODE[p.color][p.type]}
            </span>
          ))}
          {materialAdvantage > 0 && (
            <span style={{
              color: '#4ade80',
              fontSize: 11,
              fontWeight: 700,
              marginLeft: 4,
            }}>+{materialAdvantage}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export { PIECE_VALS };
