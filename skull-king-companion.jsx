import { useState, useEffect, useRef } from "react";

const PIRATE_ICONS = ["🏴‍☠️", "⚓", "🦜", "🗡️", "💀", "🧭", "🐙", "🦈"];
const BONUS_TYPES = [
  { id: "pirate", label: "Pirate capturé", icon: "🏴‍☠️", value: 30 },
  { id: "mermaid", label: "Sirène (par SK)", icon: "🧜‍♀️", value: 40 },
  { id: "skullking", label: "Skull King capturé", icon: "💀", value: 50 },
];

function calculateScore(bid, tricks, bonuses, roundNum) {
  if (bid === 0) {
    return tricks === 0 ? roundNum * 10 : -(roundNum * 10);
  }
  if (bid === tricks) {
    const bonusTotal = bonuses.reduce((s, b) => s + b.value * b.count, 0);
    return bid * 20 + bonusTotal;
  }
  return -Math.abs(bid - tricks) * 10;
}

// ─── Shared UI Components ───
function PhoneFrame({ children }) {
  return (
    <div style={{
      width: "100%", maxWidth: 420, minHeight: 700, margin: "0 auto",
      background: "linear-gradient(170deg, #0a1628 0%, #122040 40%, #0d1a30 100%)",
      borderRadius: 32, position: "relative", overflow: "hidden",
      boxShadow: "0 0 80px rgba(10,22,40,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
      fontFamily: "'Cinzel', 'Georgia', serif",
    }}>
      {/* Subtle texture overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a853' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{ position: "relative", zIndex: 1, minHeight: 700, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

function GoldButton({ children, onClick, disabled, small, variant = "primary" }) {
  const base = {
    primary: {
      background: "linear-gradient(135deg, #d4a853 0%, #b8860b 50%, #d4a853 100%)",
      color: "#0a1628", border: "1px solid #e8c36a",
      boxShadow: "0 4px 20px rgba(212,168,83,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
    },
    secondary: {
      background: "rgba(212,168,83,0.08)", color: "#d4a853",
      border: "1px solid rgba(212,168,83,0.3)", boxShadow: "none",
    },
    danger: {
      background: "rgba(232,93,38,0.15)", color: "#e85d26",
      border: "1px solid rgba(232,93,38,0.3)", boxShadow: "none",
    }
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...base[variant],
      padding: small ? "8px 16px" : "14px 28px",
      borderRadius: 12, fontFamily: "'Cinzel', serif",
      fontSize: small ? 12 : 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1, letterSpacing: 1.5, textTransform: "uppercase",
      transition: "all 0.2s", width: small ? "auto" : "100%",
    }}>
      {children}
    </button>
  );
}

function Header({ title, subtitle, onBack }) {
  return (
    <div style={{ padding: "20px 20px 12px", display: "flex", alignItems: "center", gap: 12 }}>
      {onBack && (
        <button onClick={onBack} style={{
          background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)",
          borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", color: "#d4a853", fontSize: 18,
        }}>←</button>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ color: "#d4a853", fontSize: 18, fontWeight: 700, fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>
          {title}
        </div>
        {subtitle && <div style={{ color: "rgba(212,168,83,0.5)", fontSize: 11, marginTop: 2, fontFamily: "system-ui", letterSpacing: 0.5 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

// ─── Screens ───

function HomeScreen({ onNewGame, onHistory, gameHistory }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 32, gap: 20,
      opacity: show ? 1 : 0, transform: show ? "none" : "translateY(20px)",
      transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {/* Logo area */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <div style={{
          fontSize: 72, lineHeight: 1, filter: "drop-shadow(0 0 30px rgba(212,168,83,0.4))",
          animation: "float 3s ease-in-out infinite",
        }}>💀</div>
        <style>{`@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`}</style>
      </div>
      <div style={{
        fontSize: 32, fontWeight: 700, color: "#d4a853", textAlign: "center",
        fontFamily: "'Cinzel', serif", letterSpacing: 3,
        textShadow: "0 0 40px rgba(212,168,83,0.3)",
      }}>SKULL KING</div>
      <div style={{
        fontSize: 13, color: "rgba(212,168,83,0.5)", letterSpacing: 4,
        textTransform: "uppercase", fontFamily: "system-ui", marginTop: -8,
      }}>companion</div>

      <div style={{ width: "100%", maxWidth: 280, marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
        <GoldButton onClick={onNewGame}>⚔️ Nouvelle partie</GoldButton>
        <GoldButton onClick={onHistory} variant="secondary">
          📜 Historique {gameHistory.length > 0 && `(${gameHistory.length})`}
        </GoldButton>
        <GoldButton variant="secondary" onClick={() => {}}>📖 Règles du jeu</GoldButton>
      </div>
      <div style={{
        position: "absolute", bottom: 20, color: "rgba(212,168,83,0.2)",
        fontSize: 10, fontFamily: "system-ui", letterSpacing: 1,
      }}>PROTOTYPE v1.0</div>
    </div>
  );
}

function SetupScreen({ onBack, onStart }) {
  const [players, setPlayers] = useState([
    { name: "", icon: PIRATE_ICONS[0] },
    { name: "", icon: PIRATE_ICONS[1] },
  ]);
  const addPlayer = () => {
    if (players.length < 8) {
      setPlayers([...players, { name: "", icon: PIRATE_ICONS[players.length % PIRATE_ICONS.length] }]);
    }
  };
  const removePlayer = (i) => {
    if (players.length > 2) setPlayers(players.filter((_, idx) => idx !== i));
  };
  const updateName = (i, name) => {
    const p = [...players]; p[i] = { ...p[i], name }; setPlayers(p);
  };
  const cycleIcon = (i) => {
    const p = [...players];
    const cur = PIRATE_ICONS.indexOf(p[i].icon);
    p[i] = { ...p[i], icon: PIRATE_ICONS[(cur + 1) % PIRATE_ICONS.length] };
    setPlayers(p);
  };
  const canStart = players.every(p => p.name.trim().length > 0);
  return (
    <>
      <Header title="Équipage" subtitle={`${players.length} joueurs · 10 manches`} onBack={onBack} />
      <div style={{ flex: 1, padding: "0 20px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {players.map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(212,168,83,0.04)", border: "1px solid rgba(212,168,83,0.1)",
              borderRadius: 14, padding: "10px 14px",
            }}>
              <button onClick={() => cycleIcon(i)} style={{
                width: 42, height: 42, borderRadius: 12, border: "1px solid rgba(212,168,83,0.2)",
                background: "rgba(212,168,83,0.08)", fontSize: 22, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{p.icon}</button>
              <input
                value={p.name} onChange={e => updateName(i, e.target.value)}
                placeholder={`Joueur ${i + 1}`}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "#d4a853", fontSize: 15, fontFamily: "'Cinzel', serif",
                  padding: "8px 4px",
                }}
              />
              {players.length > 2 && (
                <button onClick={() => removePlayer(i)} style={{
                  width: 30, height: 30, borderRadius: 8, border: "none",
                  background: "rgba(232,93,38,0.1)", color: "#e85d26",
                  cursor: "pointer", fontSize: 14,
                }}>✕</button>
              )}
            </div>
          ))}
        </div>
        {players.length < 8 && (
          <button onClick={addPlayer} style={{
            width: "100%", padding: 14, marginTop: 10, borderRadius: 14,
            border: "1px dashed rgba(212,168,83,0.2)", background: "transparent",
            color: "rgba(212,168,83,0.4)", cursor: "pointer", fontSize: 14, fontFamily: "system-ui",
          }}>+ Ajouter un joueur</button>
        )}
      </div>
      <div style={{ padding: 20 }}>
        <GoldButton onClick={() => onStart(players)} disabled={!canStart}>
          Larguer les amarres !
        </GoldButton>
      </div>
    </>
  );
}

function BidScreen({ players, round, onSubmitBids, onBack }) {
  const [bids, setBids] = useState(players.map(() => 0));
  const [revealed, setRevealed] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [blindMode, setBlindMode] = useState(true);

  const submitBid = () => {
    if (currentPlayer < players.length - 1) {
      setCurrentPlayer(currentPlayer + 1);
    } else {
      setAllDone(true);
    }
  };

  const revealAndContinue = () => {
    setRevealed(true);
    setTimeout(() => onSubmitBids(bids), 1200);
  };

  if (blindMode && !allDone) {
    const p = players[currentPlayer];
    return (
      <>
        <Header title={`Manche ${round}`} subtitle={`${round} carte${round > 1 ? "s" : ""} en main`} onBack={onBack} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 20 }}>
          <div style={{ fontSize: 48 }}>{p.icon}</div>
          <div style={{ color: "#d4a853", fontSize: 20, fontFamily: "'Cinzel', serif", textAlign: "center" }}>
            {p.name}
          </div>
          <div style={{ color: "rgba(212,168,83,0.5)", fontSize: 12, fontFamily: "system-ui", letterSpacing: 1 }}>
            Combien de plis vas-tu remporter ?
          </div>
          {/* Bid selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12 }}>
            <button onClick={() => setBids(b => { const n = [...b]; n[currentPlayer] = Math.max(0, n[currentPlayer] - 1); return n; })}
              style={{
                width: 52, height: 52, borderRadius: "50%", fontSize: 24,
                background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)",
                color: "#d4a853", cursor: "pointer",
              }}>−</button>
            <div style={{
              width: 80, height: 80, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(212,168,83,0.05))",
              border: "2px solid rgba(212,168,83,0.3)",
              fontSize: 36, color: "#d4a853", fontWeight: 700, fontFamily: "'Cinzel', serif",
            }}>{bids[currentPlayer]}</div>
            <button onClick={() => setBids(b => { const n = [...b]; n[currentPlayer] = Math.min(round, n[currentPlayer] + 1); return n; })}
              style={{
                width: 52, height: 52, borderRadius: "50%", fontSize: 24,
                background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)",
                color: "#d4a853", cursor: "pointer",
              }}>+</button>
          </div>
          <div style={{ color: "rgba(212,168,83,0.3)", fontSize: 11, fontFamily: "system-ui" }}>
            Joueur {currentPlayer + 1} / {players.length}
          </div>
          <div style={{ width: "100%", maxWidth: 260, marginTop: 8 }}>
            <GoldButton onClick={submitBid}>Valider ✓</GoldButton>
          </div>
        </div>
      </>
    );
  }

  // Reveal phase
  return (
    <>
      <Header title={`Manche ${round}`} subtitle="Enchères" onBack={onBack} />
      <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 12, justifyContent: "center" }}>
        <div style={{ color: "rgba(212,168,83,0.5)", fontSize: 12, textAlign: "center", fontFamily: "system-ui", letterSpacing: 2, marginBottom: 8 }}>
          {revealed ? "ENCHÈRES RÉVÉLÉES" : "PRÊTS À RÉVÉLER ?"}
        </div>
        {players.map((p, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(212,168,83,0.04)", border: "1px solid rgba(212,168,83,0.1)",
            borderRadius: 14, padding: "12px 16px",
            transform: revealed ? "none" : "scale(0.98)", opacity: revealed ? 1 : 0.7,
            transition: `all 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
          }}>
            <span style={{ fontSize: 24 }}>{p.icon}</span>
            <span style={{ flex: 1, color: "#d4a853", fontFamily: "'Cinzel', serif", fontSize: 15 }}>{p.name}</span>
            <div style={{
              width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              background: revealed ? "linear-gradient(135deg, #d4a853, #b8860b)" : "rgba(212,168,83,0.1)",
              color: revealed ? "#0a1628" : "rgba(212,168,83,0.3)",
              fontSize: revealed ? 20 : 16, fontWeight: 700, fontFamily: "'Cinzel', serif",
              transition: "all 0.4s",
            }}>
              {revealed ? bids[i] : "?"}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: 20 }}>
        {!revealed ? (
          <GoldButton onClick={revealAndContinue}>Révéler les enchères 🎭</GoldButton>
        ) : (
          <div style={{ color: "rgba(212,168,83,0.4)", fontSize: 12, textAlign: "center", fontFamily: "system-ui" }}>
            Jouez la manche...
          </div>
        )}
      </div>
    </>
  );
}

function ResultScreen({ players, round, bids, onSubmitResults, onBack }) {
  const [tricks, setTricks] = useState(players.map(() => 0));
  const [bonuses, setBonuses] = useState(players.map(() => BONUS_TYPES.map(b => ({ ...b, count: 0 }))));
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const totalTricks = tricks.reduce((a, b) => a + b, 0);

  const toggleBonus = (pi, bi) => {
    const b = bonuses.map(p => p.map(x => ({ ...x })));
    b[pi][bi].count = b[pi][bi].count > 0 ? 0 : 1;
    setBonuses(b);
  };

  return (
    <>
      <Header title={`Manche ${round} — Résultats`}
        subtitle={`Plis distribués: ${totalTricks} / ${round}`} onBack={onBack} />
      <div style={{ flex: 1, padding: "0 20px", overflowY: "auto" }}>
        {players.map((p, i) => (
          <div key={i} style={{
            background: "rgba(212,168,83,0.04)", border: "1px solid rgba(212,168,83,0.1)",
            borderRadius: 14, padding: 14, marginBottom: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{p.icon}</span>
              <span style={{ flex: 1, color: "#d4a853", fontFamily: "'Cinzel', serif", fontSize: 14 }}>{p.name}</span>
              <span style={{ color: "rgba(212,168,83,0.4)", fontSize: 11, fontFamily: "system-ui" }}>
                Enchère: {bids[i]}
              </span>
            </div>
            {/* Tricks */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "rgba(212,168,83,0.5)", fontSize: 11, fontFamily: "system-ui", width: 55 }}>Plis :</span>
              <div style={{ display: "flex", gap: 6 }}>
                {Array.from({ length: round + 1 }, (_, n) => (
                  <button key={n} onClick={() => { const t = [...tricks]; t[i] = n; setTricks(t); }}
                    style={{
                      width: 34, height: 34, borderRadius: 8, fontSize: 14, fontWeight: 700,
                      border: tricks[i] === n ? "2px solid #d4a853" : "1px solid rgba(212,168,83,0.15)",
                      background: tricks[i] === n ? "rgba(212,168,83,0.2)" : "transparent",
                      color: tricks[i] === n ? "#d4a853" : "rgba(212,168,83,0.3)",
                      cursor: "pointer", fontFamily: "'Cinzel', serif",
                    }}>{n}</button>
                ))}
              </div>
            </div>
            {/* Bonuses (only if bid was correct and > 0) */}
            {bids[i] > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {BONUS_TYPES.map((bt, bi) => (
                  <button key={bt.id} onClick={() => toggleBonus(i, bi)} style={{
                    padding: "4px 10px", borderRadius: 8, fontSize: 11,
                    border: bonuses[i][bi].count > 0 ? "1px solid rgba(212,168,83,0.4)" : "1px solid rgba(212,168,83,0.1)",
                    background: bonuses[i][bi].count > 0 ? "rgba(212,168,83,0.12)" : "transparent",
                    color: bonuses[i][bi].count > 0 ? "#d4a853" : "rgba(212,168,83,0.3)",
                    cursor: "pointer", fontFamily: "system-ui",
                  }}>{bt.icon} +{bt.value}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ padding: 20 }}>
        <GoldButton onClick={() => onSubmitResults(tricks, bonuses)}>
          Calculer les scores ⚡
        </GoldButton>
      </div>
    </>
  );
}

function ScoreBoard({ players, rounds, scores, currentRound, onNextRound, onEndGame, onBack }) {
  const cumulative = players.map((_, pi) => {
    let total = 0;
    return rounds.map(r => { total += r.scores[pi]; return total; });
  });
  const totals = cumulative.map(c => c[c.length - 1] || 0);
  const maxScore = Math.max(...totals, 1);
  const minScore = Math.min(...totals, 0);
  const range = Math.max(maxScore - minScore, 1);
  const sorted = players.map((p, i) => ({ ...p, idx: i, total: totals[i] })).sort((a, b) => b.total - a.total);

  // Mini chart
  const chartH = 120;
  const chartW = 280;

  return (
    <>
      <Header title="Tableau des scores" subtitle={`Après ${rounds.length} manche${rounds.length > 1 ? "s" : ""}`} onBack={onBack} />
      <div style={{ flex: 1, padding: "0 20px", overflowY: "auto" }}>
        {/* Ranking */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {sorted.map((p, rank) => {
            const medal = rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : "";
            const lastRoundScore = rounds.length > 0 ? rounds[rounds.length - 1].scores[p.idx] : 0;
            return (
              <div key={p.idx} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: rank === 0 ? "rgba(212,168,83,0.1)" : "rgba(212,168,83,0.03)",
                border: rank === 0 ? "1px solid rgba(212,168,83,0.3)" : "1px solid rgba(212,168,83,0.08)",
                borderRadius: 14, padding: "10px 14px",
              }}>
                <span style={{ fontSize: 14, width: 24, textAlign: "center" }}>{medal || `${rank + 1}.`}</span>
                <span style={{ fontSize: 20 }}>{p.icon}</span>
                <span style={{ flex: 1, color: "#d4a853", fontFamily: "'Cinzel', serif", fontSize: 14 }}>{p.name}</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#d4a853", fontSize: 20, fontWeight: 700, fontFamily: "'Cinzel', serif" }}>{p.total}</div>
                  <div style={{
                    fontSize: 10, fontFamily: "system-ui",
                    color: lastRoundScore >= 0 ? "rgba(100,200,100,0.7)" : "rgba(232,93,38,0.7)",
                  }}>{lastRoundScore >= 0 ? "+" : ""}{lastRoundScore}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini chart */}
        {rounds.length > 1 && (
          <div style={{
            background: "rgba(212,168,83,0.03)", border: "1px solid rgba(212,168,83,0.08)",
            borderRadius: 14, padding: 16, marginBottom: 16,
          }}>
            <div style={{ color: "rgba(212,168,83,0.5)", fontSize: 10, fontFamily: "system-ui", letterSpacing: 1, marginBottom: 8 }}>
              ÉVOLUTION DES SCORES
            </div>
            <svg width={chartW} height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: "auto" }}>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(f => (
                <line key={f} x1={0} y1={chartH * f} x2={chartW} y2={chartH * f}
                  stroke="rgba(212,168,83,0.08)" strokeWidth={0.5} />
              ))}
              {/* Player lines */}
              {players.map((p, pi) => {
                const colors = ["#d4a853", "#e85d26", "#5da8e8", "#8dd45d", "#d45dbd", "#5dd4c4", "#d4d45d", "#d45d5d"];
                const points = cumulative[pi].map((v, ri) => {
                  const x = (ri / Math.max(rounds.length - 1, 1)) * (chartW - 20) + 10;
                  const y = chartH - ((v - minScore) / range) * (chartH - 20) - 10;
                  return `${x},${y}`;
                }).join(" ");
                return (
                  <g key={pi}>
                    <polyline points={points} fill="none" stroke={colors[pi % colors.length]}
                      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
                    {cumulative[pi].map((v, ri) => {
                      const x = (ri / Math.max(rounds.length - 1, 1)) * (chartW - 20) + 10;
                      const y = chartH - ((v - minScore) / range) * (chartH - 20) - 10;
                      return <circle key={ri} cx={x} cy={y} r={3} fill={colors[pi % colors.length]} />;
                    })}
                  </g>
                );
              })}
            </svg>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
              {players.map((p, pi) => {
                const colors = ["#d4a853", "#e85d26", "#5da8e8", "#8dd45d", "#d45dbd", "#5dd4c4", "#d4d45d", "#d45d5d"];
                return (
                  <div key={pi} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: colors[pi % colors.length] }} />
                    <span style={{ fontSize: 10, color: "rgba(212,168,83,0.5)", fontFamily: "system-ui" }}>{p.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Last round detail */}
        {rounds.length > 0 && (
          <div style={{
            background: "rgba(212,168,83,0.03)", border: "1px solid rgba(212,168,83,0.08)",
            borderRadius: 14, padding: 14, marginBottom: 16,
          }}>
            <div style={{ color: "rgba(212,168,83,0.5)", fontSize: 10, fontFamily: "system-ui", letterSpacing: 1, marginBottom: 8 }}>
              DÉTAIL MANCHE {rounds.length}
            </div>
            {players.map((p, i) => {
              const r = rounds[rounds.length - 1];
              const correct = r.bids[i] === r.tricks[i];
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "6px 0",
                  borderBottom: i < players.length - 1 ? "1px solid rgba(212,168,83,0.06)" : "none",
                }}>
                  <span style={{ fontSize: 14 }}>{p.icon}</span>
                  <span style={{ flex: 1, color: "rgba(212,168,83,0.7)", fontSize: 12, fontFamily: "system-ui" }}>
                    {p.name}
                  </span>
                  <span style={{ fontSize: 11, fontFamily: "system-ui", color: "rgba(212,168,83,0.4)", marginRight: 4 }}>
                    {r.bids[i]}→{r.tricks[i]}
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: 700, fontFamily: "system-ui",
                    color: correct ? "rgba(100,200,100,0.8)" : "rgba(232,93,38,0.8)",
                    minWidth: 40, textAlign: "right",
                  }}>
                    {r.scores[i] >= 0 ? "+" : ""}{r.scores[i]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ padding: 20, display: "flex", gap: 10 }}>
        {currentRound <= 10 ? (
          <GoldButton onClick={onNextRound}>Manche {currentRound} →</GoldButton>
        ) : (
          <GoldButton onClick={onEndGame}>🏆 Fin de partie</GoldButton>
        )}
      </div>
    </>
  );
}

function EndScreen({ players, rounds, onHome }) {
  const totals = players.map((_, pi) => rounds.reduce((s, r) => s + r.scores[pi], 0));
  const sorted = players.map((p, i) => ({ ...p, idx: i, total: totals[i] })).sort((a, b) => b.total - a.total);
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 200); }, []);

  return (
    <>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: 32, gap: 12,
        opacity: show ? 1 : 0, transform: show ? "none" : "translateY(30px)",
        transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ fontSize: 12, color: "rgba(212,168,83,0.4)", fontFamily: "system-ui", letterSpacing: 3 }}>
          VICTOIRE
        </div>
        <div style={{
          fontSize: 56, filter: "drop-shadow(0 0 30px rgba(212,168,83,0.5))",
          animation: "float 2s ease-in-out infinite",
        }}>🏆</div>
        <div style={{
          fontSize: 28, color: "#d4a853", fontFamily: "'Cinzel', serif", fontWeight: 700,
          textShadow: "0 0 30px rgba(212,168,83,0.3)",
        }}>{sorted[0].name}</div>
        <div style={{ fontSize: 36, color: "#d4a853", fontFamily: "'Cinzel', serif", fontWeight: 700 }}>
          {sorted[0].total} pts
        </div>

        <div style={{ width: "100%", marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((p, rank) => (
            <div key={p.idx} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 12,
              background: rank === 0 ? "rgba(212,168,83,0.12)" : "rgba(212,168,83,0.03)",
              border: `1px solid rgba(212,168,83,${rank === 0 ? 0.3 : 0.06})`,
              opacity: show ? 1 : 0,
              transform: show ? "none" : "translateX(-20px)",
              transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${0.3 + rank * 0.1}s`,
            }}>
              <span style={{ width: 24, textAlign: "center", fontSize: 14, color: "rgba(212,168,83,0.5)", fontFamily: "system-ui" }}>
                {rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : `${rank + 1}.`}
              </span>
              <span style={{ fontSize: 20 }}>{p.icon}</span>
              <span style={{ flex: 1, color: "#d4a853", fontFamily: "'Cinzel', serif", fontSize: 14 }}>{p.name}</span>
              <span style={{ color: "#d4a853", fontWeight: 700, fontFamily: "'Cinzel', serif", fontSize: 18 }}>{p.total}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: 20, display: "flex", gap: 10 }}>
        <GoldButton variant="secondary" onClick={onHome}>Accueil</GoldButton>
      </div>
    </>
  );
}

function HistoryScreen({ history, onBack }) {
  return (
    <>
      <Header title="Historique" subtitle={`${history.length} partie${history.length > 1 ? "s" : ""}`} onBack={onBack} />
      <div style={{ flex: 1, padding: "0 20px", overflowY: "auto" }}>
        {history.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 60, color: "rgba(212,168,83,0.3)", fontFamily: "system-ui", fontSize: 14 }}>
            Aucune partie jouée.<br />Lance-toi à l'abordage !
          </div>
        ) : (
          history.map((g, gi) => {
            const sorted = g.players.map((p, i) => ({ ...p, total: g.totals[i] })).sort((a, b) => b.total - a.total);
            return (
              <div key={gi} style={{
                background: "rgba(212,168,83,0.04)", border: "1px solid rgba(212,168,83,0.1)",
                borderRadius: 14, padding: 14, marginBottom: 10,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ color: "rgba(212,168,83,0.5)", fontSize: 11, fontFamily: "system-ui" }}>{g.date}</span>
                  <span style={{ color: "rgba(212,168,83,0.3)", fontSize: 11, fontFamily: "system-ui" }}>
                    {g.rounds} manches
                  </span>
                </div>
                {sorted.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                    <span style={{ fontSize: 12, width: 20 }}>{i === 0 ? "🥇" : ""}</span>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <span style={{ flex: 1, color: "rgba(212,168,83,0.7)", fontSize: 13, fontFamily: "system-ui" }}>{p.name}</span>
                    <span style={{ color: "#d4a853", fontWeight: 700, fontSize: 14, fontFamily: "'Cinzel', serif" }}>{p.total}</span>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

// ─── Main App ───
export default function SkullKingApp() {
  const [screen, setScreen] = useState("home");
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [rounds, setRounds] = useState([]);
  const [bids, setBids] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);

  const startGame = (p) => {
    setPlayers(p);
    setCurrentRound(1);
    setRounds([]);
    setScreen("bid");
  };

  const submitBids = (b) => {
    setBids(b);
    setScreen("result");
  };

  const submitResults = (tricks, bonuses) => {
    const scores = players.map((_, i) =>
      calculateScore(bids[i], tricks[i], bonuses[i], currentRound)
    );
    const newRound = { round: currentRound, bids: [...bids], tricks, bonuses, scores };
    const newRounds = [...rounds, newRound];
    setRounds(newRounds);
    setCurrentRound(currentRound + 1);
    setScreen("scores");
  };

  const endGame = () => {
    const totals = players.map((_, pi) => rounds.reduce((s, r) => s + r.scores[pi], 0));
    const entry = {
      players: players.map(p => ({ ...p })),
      totals,
      rounds: rounds.length,
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
    };
    setGameHistory([entry, ...gameHistory]);
    setScreen("end");
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#060d18", padding: "20px 8px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap" rel="stylesheet" />
      <PhoneFrame>
        {screen === "home" && (
          <HomeScreen
            onNewGame={() => setScreen("setup")}
            onHistory={() => setScreen("history")}
            gameHistory={gameHistory}
          />
        )}
        {screen === "setup" && (
          <SetupScreen onBack={() => setScreen("home")} onStart={startGame} />
        )}
        {screen === "bid" && (
          <BidScreen
            players={players} round={currentRound}
            onSubmitBids={submitBids}
            onBack={() => setScreen("scores")}
          />
        )}
        {screen === "result" && (
          <ResultScreen
            players={players} round={currentRound - (screen === "result" ? 0 : 1)}
            bids={bids} onSubmitResults={submitResults}
            onBack={() => setScreen("bid")}
          />
        )}
        {screen === "scores" && (
          <ScoreBoard
            players={players} rounds={rounds} scores={[]}
            currentRound={currentRound}
            onNextRound={() => setScreen("bid")}
            onEndGame={endGame}
            onBack={() => setScreen("home")}
          />
        )}
        {screen === "end" && (
          <EndScreen players={players} rounds={rounds} onHome={() => setScreen("home")} />
        )}
        {screen === "history" && (
          <HistoryScreen history={gameHistory} onBack={() => setScreen("home")} />
        )}
      </PhoneFrame>
    </div>
  );
}
