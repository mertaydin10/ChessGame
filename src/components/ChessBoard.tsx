import type { Position } from '../chess/types';
import type { ExtendedGameState } from '../chess/gameReducer';
import { positionsEqual, findKing } from '../chess/board';
import ChessPiece from './ChessPiece';

interface Props {
  state: ExtendedGameState;
  onSquareClick: (pos: Position) => void;
  flipped?: boolean;
}

export default function ChessBoard({ state, onSquareClick, flipped = false }: Props) {
  const { board, selectedPosition, validMoves, isCheck, currentTurn } = state;
  const kingPos = isCheck ? findKing(board, currentTurn) : null;

  const lastMove = state.moveHistory[state.moveHistory.length - 1];

  const rows = flipped ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0];
  const cols = flipped ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      border: '3px solid #475569',
      borderRadius: 4,
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    }}>
      {rows.map(row => (
        <div key={row} style={{ display: 'flex' }}>
          {/* Rank label */}
          <div style={{
            width: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1e293b',
            color: '#64748b',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'monospace',
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
            const isLastTo = lastMove ? positionsEqual(lastMove.to, pos) : false;
            const isKingInCheck = kingPos ? positionsEqual(kingPos, pos) : false;

            let bgColor = isLight ? '#f0d9b5' : '#b58863';
            if (isSelected) bgColor = isLight ? '#f6f669' : '#baca2b';
            else if (isLastFrom || isLastTo) bgColor = isLight ? '#cdd16f' : '#aaa23a';
            if (isKingInCheck) bgColor = '#e74c3c';

            return (
              <div
                key={col}
                onClick={() => onSquareClick(pos)}
                style={{
                  width: 72,
                  height: 72,
                  background: bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                {/* Valid move indicator */}
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
                        border: '4px solid rgba(0,0,0,0.4)',
                        borderRadius: 2,
                        boxSizing: 'border-box',
                      }} />
                    ) : (
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.2)',
                      }} />
                    )}
                  </div>
                )}

                {piece && (
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <ChessPiece piece={piece} size={50} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* File labels row */}
      <div style={{ display: 'flex', background: '#1e293b' }}>
        <div style={{ width: 24 }} />
        {cols.map(col => (
          <div key={col} style={{
            width: 72,
            textAlign: 'center',
            color: '#64748b',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'monospace',
            paddingBottom: 2,
          }}>
            {String.fromCharCode(97 + col)}
          </div>
        ))}
      </div>
    </div>
  );
}
