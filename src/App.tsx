import { useReducer, useCallback } from 'react';
import { gameReducer, createInitialState } from './chess/gameReducer';
import type { GameAction } from './chess/gameReducer';
import type { Position, PieceType } from './chess/types';
import ChessBoard from './components/ChessBoard';
import MoveHistory from './components/MoveHistory';
import PlayerCard, { PIECE_VALS } from './components/PlayerCard';
import PromotionDialog from './components/PromotionDialog';

function getMaterialAdvantage(pieces: { type: string }[]) {
  return pieces.reduce((sum, p) => sum + (PIECE_VALS[p.type] ?? 0), 0);
}

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

  const whiteMat = getMaterialAdvantage(state.capturedPieces.white);
  const blackMat = getMaterialAdvantage(state.capturedPieces.black);
  const whiteAdv = Math.max(0, whiteMat - blackMat);
  const blackAdv = Math.max(0, blackMat - whiteMat);

  const gameOver = state.status !== 'playing';
  let bannerText = '';
  let bannerColor = '';
  let bannerBg = '';
  if (state.status === 'checkmate') {
    const winner = state.currentTurn === 'white' ? 'Siyah' : 'Beyaz';
    bannerText = `${winner} kazandı! Şah mat!`;
    bannerColor = '#c4b5fd';
    bannerBg = 'linear-gradient(135deg, rgba(109,40,217,0.4), rgba(139,92,246,0.2))';
  } else if (state.status === 'stalemate') {
    bannerText = 'Pat! Oyun berabere.';
    bannerColor = '#fde047';
    bannerBg = 'linear-gradient(135deg, rgba(161,98,7,0.4), rgba(234,179,8,0.2))';
  } else if (state.isCheck) {
    bannerText = `${state.currentTurn === 'white' ? 'Beyaz' : 'Siyah'} şah altında!`;
    bannerColor = '#fca5a5';
    bannerBg = 'linear-gradient(135deg, rgba(153,27,27,0.4), rgba(239,68,68,0.2))';
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      backgroundImage: `
        radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.06) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.05) 0%, transparent 50%)
      `,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: '20px 24px',
    }}>

      {/* Title */}
      <div style={{
        marginBottom: 24,
        textAlign: 'center',
        animation: 'fadeInUp 0.6s ease',
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 28,
          fontWeight: 700,
          color: '#e6edf3',
          letterSpacing: '-0.5px',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: 24 }}>♟</span>
          Satranç
          <span style={{ fontSize: 24 }}>♟</span>
        </h1>
        <p style={{ color: '#484f58', fontSize: 12, marginTop: 4, letterSpacing: 1 }}>
          İKİ OYUNCULU
        </p>
      </div>

      {/* Main layout */}
      <div style={{
        display: 'flex',
        gap: 20,
        alignItems: 'flex-start',
        animation: 'fadeInUp 0.6s ease 0.1s both',
      }}>

        {/* Board column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

          {/* Black player */}
          <PlayerCard
            color="black"
            name="Siyah"
            isActive={state.currentTurn === 'black' && !gameOver}
            capturedByThisPlayer={state.capturedPieces.black}
            materialAdvantage={blackAdv}
          />

          {/* Board */}
          <ChessBoard state={state} onSquareClick={handleSquareClick} />

          {/* White player */}
          <PlayerCard
            color="white"
            name="Beyaz"
            isActive={state.currentTurn === 'white' && !gameOver}
            capturedByThisPlayer={state.capturedPieces.white}
            materialAdvantage={whiteAdv}
          />
        </div>

        {/* Right panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: 256,
          alignSelf: 'stretch',
        }}>

          {/* Status / new game card */}
          <div style={{
            background: 'rgba(22,27,34,0.9)',
            border: '1px solid #21262d',
            borderRadius: 14,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            backdropFilter: 'blur(12px)',
          }}>

            {/* Status banner */}
            {bannerText && (
              <div style={{
                background: bannerBg,
                border: `1px solid ${bannerColor}40`,
                borderRadius: 10,
                padding: '10px 14px',
                color: bannerColor,
                fontSize: 13,
                fontWeight: 700,
                textAlign: 'center',
                letterSpacing: 0.3,
              }}>
                {state.status === 'checkmate' && '♛ '}
                {state.status === 'stalemate' && '🤝 '}
                {state.isCheck && state.status === 'playing' && '⚠ '}
                {bannerText}
              </div>
            )}

            {/* Stat row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { label: 'Hamle', value: state.moveHistory.length },
                { label: 'Alınan', value: state.capturedPieces.white.length + state.capturedPieces.black.length },
                { label: 'Sıra', value: state.currentTurn === 'white' ? '⬜' : '⬛' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid #21262d',
                  borderRadius: 8,
                  padding: '8px 6px',
                  textAlign: 'center',
                }}>
                  <div style={{ color: '#e6edf3', fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{value}</div>
                  <div style={{ color: '#484f58', fontSize: 10, marginTop: 3, letterSpacing: 0.5 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* New game button */}
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '10px 0',
                background: 'linear-gradient(135deg, #238636, #2ea043)',
                border: '1px solid #2ea043',
                borderRadius: 8,
                color: '#fff',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                letterSpacing: 0.3,
                transition: 'all 0.15s',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2ea043, #3fb950)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(46,160,67,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #238636, #2ea043)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              + Yeni Oyun
            </button>
          </div>

          {/* Move history */}
          <div style={{
            background: 'rgba(22,27,34,0.9)',
            border: '1px solid #21262d',
            borderRadius: 14,
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{
              padding: '12px 14px 8px',
              borderBottom: '1px solid #21262d',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>📋</span>
              <span style={{ color: '#7d8590', fontSize: 12, fontWeight: 600, letterSpacing: 0.8 }}>
                HAMLE GEÇMİŞİ
              </span>
            </div>
            <MoveHistory moves={state.moveHistory} />
          </div>
        </div>
      </div>

      {state.pendingPromotion && (
        <PromotionDialog
          color={state.pendingPromotion.color}
          onSelect={handlePromotion}
        />
      )}
    </div>
  );
}
