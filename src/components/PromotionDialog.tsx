import type { PieceType, Color } from '../chess/types';

interface Props {
  color: Color;
  onSelect: (piece: PieceType) => void;
}

const OPTIONS: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];

const UNICODE: Record<string, Record<string, string>> = {
  white: { queen: '♕', rook: '♖', bishop: '♗', knight: '♘' },
  black: { queen: '♛', rook: '♜', bishop: '♝', knight: '♞' },
};

export default function PromotionDialog({ color, onSelect }: Props) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: 16,
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        <h2 style={{ color: '#f1f5f9', margin: 0, fontSize: 20, fontWeight: 600 }}>
          Piyon Terfi! Bir taş seçin
        </h2>
        <div style={{ display: 'flex', gap: 12 }}>
          {OPTIONS.map(piece => (
            <button
              key={piece}
              onClick={() => onSelect(piece)}
              style={{
                width: 80,
                height: 80,
                fontSize: 48,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
                color: color === 'white' ? '#fff' : '#1e293b',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background = 'rgba(99,102,241,0.3)';
                (e.target as HTMLElement).style.transform = 'scale(1.1)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                (e.target as HTMLElement).style.transform = 'scale(1)';
              }}
              title={piece}
            >
              {UNICODE[color][piece]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
