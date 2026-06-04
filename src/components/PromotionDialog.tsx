import type { PieceType, Color } from '../chess/types';

interface Props {
  color: Color;
  onSelect: (piece: PieceType) => void;
}

const OPTIONS: { type: PieceType; label: string }[] = [
  { type: 'queen',  label: 'Vezir'  },
  { type: 'rook',   label: 'Kale'   },
  { type: 'bishop', label: 'Fil'    },
  { type: 'knight', label: 'At'     },
];

const UNICODE: Record<string, Record<string, string>> = {
  white: { queen: '♕', rook: '♖', bishop: '♗', knight: '♘' },
  black: { queen: '♛', rook: '♜', bishop: '♝', knight: '♞' },
};

export default function PromotionDialog({ color, onSelect }: Props) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      animation: 'fadeInUp 0.2s ease',
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #161b22, #0d1117)',
        borderRadius: 20,
        padding: '28px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        border: '1px solid #21262d',
        boxShadow: '0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>♟</div>
          <h2 style={{
            color: '#e6edf3',
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "'Playfair Display', serif",
          }}>
            Piyon Terfisi
          </h2>
          <p style={{ color: '#7d8590', fontSize: 12, marginTop: 4 }}>
            Bir taş seçin
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {OPTIONS.map(opt => (
            <button
              key={opt.type}
              onClick={() => onSelect(opt.type)}
              style={{
                width: 82,
                height: 90,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid #30363d',
                borderRadius: 14,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                transition: 'all 0.15s',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = '#30363d';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: 42, lineHeight: 1 }}>
                {UNICODE[color][opt.type]}
              </span>
              <span style={{ color: '#7d8590', fontSize: 11, fontWeight: 500 }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
