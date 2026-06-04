import type { Move } from '../chess/types';
import { useEffect, useRef } from 'react';

interface Props {
  moves: Move[];
}

const PIECE_LETTERS: Record<string, string> = {
  king: 'S',
  queen: 'V',
  rook: 'K',
  bishop: 'F',
  knight: 'A',
  pawn: '',
};

const FILE = ['a','b','c','d','e','f','g','h'];

function formatMove(move: Move): string {
  if (move.isCastling) {
    return move.to.col > move.from.col ? 'O-O' : 'O-O-O';
  }
  const piece = PIECE_LETTERS[move.piece.type];
  const capture = move.captured || move.isEnPassant ? 'x' : '';
  const from = `${FILE[move.from.col]}${8 - move.from.row}`;
  const to = `${FILE[move.to.col]}${8 - move.to.row}`;
  if (move.piece.type === 'pawn' && capture) {
    return `${FILE[move.from.col]}x${to}`;
  }
  return `${piece}${from}${capture}${to}${move.promotion ? `=${move.promotion[0].toUpperCase()}` : ''}`;
}

export default function MoveHistory({ moves }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [moves]);

  const pairs: [Move, Move | null][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i], moves[i + 1] ?? null]);
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 12,
      padding: '12px 0',
      flex: 1,
      overflowY: 'auto',
      minHeight: 0,
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ padding: '0 12px 6px', color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
        HAMLELEr
      </div>
      {pairs.length === 0 && (
        <div style={{ color: '#475569', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
          Henüz hamle yok
        </div>
      )}
      {pairs.map(([white, black], i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '32px 1fr 1fr',
            gap: 4,
            padding: '3px 12px',
            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
          }}
        >
          <span style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>{i + 1}.</span>
          <span style={{ color: '#e2e8f0', fontSize: 13, fontFamily: 'monospace', fontWeight: 500 }}>
            {formatMove(white)}
          </span>
          <span style={{ color: '#94a3b8', fontSize: 13, fontFamily: 'monospace' }}>
            {black ? formatMove(black) : ''}
          </span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
