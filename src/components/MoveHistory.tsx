import type { Move } from '../chess/types';
import { useEffect, useRef } from 'react';

interface Props {
  moves: Move[];
}

const PIECE_SYMBOLS: Record<string, string> = {
  king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '',
};

const FILE = ['a','b','c','d','e','f','g','h'];

function formatMove(move: Move): string {
  if (move.isCastling) {
    return move.to.col > move.from.col ? 'O-O' : 'O-O-O';
  }
  const sym = PIECE_SYMBOLS[move.piece.type];
  const capture = move.captured || move.isEnPassant ? 'x' : '';
  const to = `${FILE[move.to.col]}${8 - move.to.row}`;
  if (move.piece.type === 'pawn' && capture) {
    return `${FILE[move.from.col]}x${to}`;
  }
  return `${sym}${capture}${to}${move.promotion ? `=${move.promotion[0].toUpperCase()}` : ''}`;
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
      flex: 1,
      overflowY: 'auto',
      padding: '6px 0',
      minHeight: 0,
    }}>
      {pairs.length === 0 && (
        <div style={{
          color: '#484f58',
          fontSize: 13,
          textAlign: 'center',
          padding: '32px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 28, opacity: 0.3 }}>♟</span>
          Henüz hamle yok
        </div>
      )}
      {pairs.map(([white, black], i) => {
        const isLast = i === pairs.length - 1;
        return (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '28px 1fr 1fr',
              gap: 2,
              padding: '4px 10px',
              background: isLast
                ? 'rgba(99,102,241,0.08)'
                : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
              borderLeft: isLast ? '2px solid rgba(99,102,241,0.5)' : '2px solid transparent',
              transition: 'background 0.2s',
            }}
          >
            <span style={{
              color: '#484f58',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'monospace',
              paddingTop: 1,
            }}>{i + 1}.</span>

            <span style={{
              color: '#e6edf3',
              fontSize: 13,
              fontFamily: 'monospace',
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.06)',
            }}>
              {formatMove(white)}
            </span>

            <span style={{
              color: '#7d8590',
              fontSize: 13,
              fontFamily: 'monospace',
              fontWeight: 500,
              padding: '1px 6px',
              borderRadius: 4,
              background: black ? 'rgba(255,255,255,0.03)' : 'transparent',
            }}>
              {black ? formatMove(black) : ''}
            </span>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
