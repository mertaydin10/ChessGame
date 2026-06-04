import type { Position } from '../chess/types';
import type { ExtendedGameState } from '../chess/gameReducer';
import { positionsEqual, findKing } from '../chess/board';
import ChessPiece from './ChessPiece';

interface Props {
  state: ExtendedGameState;
  onSquareClick: (pos: Position) => void;
  flipped?: boolean;
}

const SQ = 74;

export default function ChessBoard({ state, onSquareClick, flipped = false }: Props) {
  const { board, selectedPosition, validMoves, isCheck, currentTurn } = state;
  const kingPos = isCheck ? findKing(board, currentTurn) : null;
  const lastMove = state.moveHistory[state.moveHistory.length - 1];

  const rows = flipped ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0];
  const cols = flipped ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];

  const LIGHT = '#eeeed2';
  const DARK  = '#769656';
  const LIGHT_SEL  = '#f6f669';
  const DARK_SEL   = '#baca2b';
  const LIGHT_LAST = '#cdd16f';
  const DARK_LAST  = '#aaa23a';

  return (
    <div style={{
      padding: 6,
      background: 'linear-gradient(145deg, #2d2416, #1a150d)',
      borderRadius: 6,
      boxShadow: `
        0 0 0 1px rgba(255,255,255,0.06),
        0 4px 6px rgba(0,0,0,0.4),
        0 12px 40px rgba(0,0,0,0.6),
        0 24px 80px rgba(0,0,0,0.4)
      `,
    }}>
      <div style={{
        display: 'inline-flex',
        flexDirection: 'column',
        border: '2px solid #1a1209',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        {rows.map(row => (
          <div key={row} style={{ display: 'flex' }}>
            {/* Rank */}
            <div style={{
              width: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: (row + 0) % 2 === 0 ? DARK : LIGHT,
              color: (row + 0) % 2 === 0 ? LIGHT : DARK,
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'monospace',
              userSelect: 'none',
            }}>
              {8 - row}
            </div>

            {cols.map(col => {
              const piece = board[row][col];
              const pos = { row, col };
              const isLight = (row + col) % 2 === 0;
              const isSelected = selectedPosition ? positionsEqual(selectedPosition, pos) : false;
              const isValidMove = validMoves.some(m => positionsEqual(m, pos));
              const isLastFrom = lastMove ? positionsEqual(lastMove.from, pos) : false;
              const isLastTo   = lastMove ? positionsEqual(lastMove.to,   pos) : false;
              const isKingCheck = kingPos ? positionsEqual(kingPos, pos) : false;

              let bg = isLight ? LIGHT : DARK;
              if (isSelected) bg = isLight ? LIGHT_SEL : DARK_SEL;
              else if (isLastFrom || isLastTo) bg = isLight ? LIGHT_LAST : DARK_LAST;
              if (isKingCheck) bg = '#c84b4b';

              return (
                <div
                  key={col}
                  className="square-btn"
                  onClick={() => onSquareClick(pos)}
                  style={{
                    width: SQ,
                    height: SQ,
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    animation: isKingCheck ? 'check-pulse 1.2s ease infinite' : undefined,
                  }}
                >
                  {/* Corner file label (only bottom row) */}
                  {row === (flipped ? 7 : 0) && (
                    <span style={{
                      position: 'absolute',
                      bottom: 2,
                      right: 3,
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: isLight ? DARK : LIGHT,
                      userSelect: 'none',
                      lineHeight: 1,
                      opacity: 0.85,
                    }}>
                      {String.fromCharCode(97 + col)}
                    </span>
                  )}

                  {/* Valid move dots / rings */}
                  {isValidMove && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                      pointerEvents: 'none',
                    }}>
                      {piece ? (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '50%',
                          border: '6px solid rgba(0,0,0,0.35)',
                          boxSizing: 'border-box',
                        }} />
                      ) : (
                        <div style={{
                          width: SQ * 0.31,
                          height: SQ * 0.31,
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.25)',
                        }} />
                      )}
                    </div>
                  )}

                  {piece && (
                    <div className="piece-wrap" style={{ position: 'relative', zIndex: 2 }}>
                      <ChessPiece piece={piece} size={SQ * 0.76} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
