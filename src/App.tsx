import { useReducer, useCallback } from 'react';
import { gameReducer, createInitialState } from './chess/gameReducer';
import type { GameAction } from './chess/gameReducer';
import type { Position, PieceType } from './chess/types';
import ChessBoard from './components/ChessBoard';
import MoveHistory from './components/MoveHistory';
import CapturedPieces from './components/CapturedPieces';
import PromotionDialog from './components/PromotionDialog';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  const handleSquareClick = useCallback((pos: Position) => {
    dispatch({ type: 'SELECT_SQUARE', position: pos } as GameAction);
  }, []);

  const handlePromotion = useCallback((piece: PieceType) => {
    dispatch({ type: 'PROMOTE_PAWN', pieceType: piece } as GameAction);
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const turnLabel = state.currentTurn === 'white' ? 'Beyaz' : 'Siyah';
  const turnColor = state.currentTurn === 'white' ? '#f1f5f9' : '#94a3b8';

  let statusMessage = '';
  if (state.status === 'checkmate') {
    const winner = state.currentTurn === 'white' ? 'Siyah' : 'Beyaz';
    statusMessage = `♛ ${winner} kazandı! Şah mat!`;
  } else if (state.status === 'stalemate') {
    statusMessage = '🤝 Pat! Oyun berabere.';
  } else if (state.isCheck) {
    statusMessage = `⚠️ ${turnLabel} şah altında!`;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: 24,
    }}>
      <div style={{
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
        maxWidth: 1100,
        width: '100%',
      }}>
        {/* Left: Board + captured pieces */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Black captured */}
          <CapturedPieces
            pieces={state.capturedPieces.black}
            color="black"
            label="Siyah aldı"
          />

          <ChessBoard state={state} onSquareClick={handleSquareClick} />

          {/* White captured */}
          <CapturedPieces
            pieces={state.capturedPieces.white}
            color="white"
            label="Beyaz aldı"
          />
        </div>

        {/* Right panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          width: 260,
          alignSelf: 'stretch',
        }}>
          {/* Header */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: state.currentTurn === 'white' ? '#f1f5f9' : '#334155',
                border: '2px solid #475569',
                flexShrink: 0,
              }} />
              <span style={{ color: '#94a3b8', fontSize: 13 }}>Sıra:</span>
              <span style={{ color: turnColor, fontSize: 15, fontWeight: 700 }}>
                {turnLabel}
              </span>
            </div>

            {statusMessage && (
              <div style={{
                background: state.status === 'checkmate'
                  ? 'rgba(99,102,241,0.15)'
                  : state.status === 'stalemate'
                    ? 'rgba(234,179,8,0.15)'
                    : 'rgba(239,68,68,0.15)',
                border: `1px solid ${
                  state.status === 'checkmate' ? 'rgba(99,102,241,0.3)'
                  : state.status === 'stalemate' ? 'rgba(234,179,8,0.3)'
                  : 'rgba(239,68,68,0.3)'
                }`,
                borderRadius: 8,
                padding: '8px 12px',
                color: state.status === 'checkmate' ? '#a5b4fc'
                  : state.status === 'stalemate' ? '#fde047'
                  : '#fca5a5',
                fontSize: 13,
                fontWeight: 600,
                textAlign: 'center',
              }}>
                {statusMessage}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleReset}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Yeni Oyun
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}>
            {[
              { label: 'Hamleler', value: state.moveHistory.length },
              { label: 'Alınan', value: state.capturedPieces.white.length + state.capturedPieces.black.length },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: '10px 12px',
                textAlign: 'center',
              }}>
                <div style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 700 }}>{value}</div>
                <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Move history */}
          <MoveHistory moves={state.moveHistory} />

          {/* Game title */}
          <div style={{ textAlign: 'center', color: '#1e293b', fontSize: 11, paddingTop: 4 }}>
            <span style={{ color: '#334155' }}>♟ Satranç Oyunu</span>
          </div>
        </div>
      </div>

      {/* Promotion dialog */}
      {state.pendingPromotion && (
        <PromotionDialog
          color={state.pendingPromotion.color}
          onSelect={handlePromotion}
        />
      )}
    </div>
  );
}
