import React, { useState, useEffect, useRef } from 'react';

// --- SISTEMA DE SOM RETRO (Web Audio API) ---
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playJump() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playCrash() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playScore() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
}

const sound = new SoundSynth();

// --- MISSÕES EDUCATIVAS ---
const MISSIONS = [
  {
    id: 1,
    title: '1. Gravidade da Lua 🌕',
    description: 'As constantes definem as regras do universo do jogo. Altera a constante GRAVIDADE para 0.4 para fazeres o Dino flutuar como um astronauta!',
    check: (cfg) => cfg.gravidade === 0.4,
    reward: 'Conceito de Constante Aprendido!'
  },
  {
    id: 2,
    title: '2. O Super Salto 🦘',
    description: 'As variáveis podem mudar a qualquer momento! Modifica a variável forcaDoSalto para 18 ou mais, para o Dino conseguir saltar super alto.',
    check: (cfg) => cfg.forcaDoSalto >= 18,
    reward: 'Conceito de Variável Dominado!'
  },
  {
    id: 3,
    title: '3. Invasão em Loop 🌵🌵🌵',
    description: 'Os ciclos (loops) repetem tarefas rapidamente. Ajusta o limite do ciclo para criar 3 obstáculos seguidos num único ciclo for!',
    check: (cfg) => cfg.quantidadeObstaculos === 3,
    reward: 'Mestre dos Loops Ativado!'
  }
];

export default function DinoCodeLabGame({ onBack }) {
  const canvasRef = useRef(null);

  const [config, setConfig] = useState({
    gravidade: 1.0,
    forcaDoSalto: 12,
    velocidadeObstaculo: 6,
    quantidadeObstaculos: 1,
    corDoDino: '#ff5722'
  });

  const [editorValues, setEditorValues] = useState({ ...config });
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [codeSuccessFlash, setCodeSuccessFlash] = useState(false);

  const gameLoopRef = useRef(null);
  const gameStateRef = useRef({
    dino: { x: 50, y: 180, vy: 0, width: 34, height: 44, jumping: false },
    obstacles: [],
    score: 0,
    frameCount: 0,
    particles: []
  });

  useEffect(() => {
    sound.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    MISSIONS.forEach((mission) => {
      if (mission.check(config) && !completedMissions.includes(mission.id)) {
        setCompletedMissions((prev) => [...prev, mission.id]);
      }
    });
  }, [config, completedMissions]);

  useEffect(() => {
    const saved = localStorage.getItem('dino_code_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const currentGameState = gameStateRef.current;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(120, 40, 40, 8);
      ctx.fillRect(100, 48, 80, 8);
      ctx.fillRect(380, 60, 50, 8);
      ctx.fillRect(360, 68, 90, 8);

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 220);
      ctx.lineTo(canvas.width, 220);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      for (let i = 0; i < canvas.width; i += 80) {
        const offset = (currentGameState.frameCount * (gameRunning ? config.velocidadeObstaculo : 0)) % 80;
        ctx.fillRect(i - offset + 20, 225, 4, 2);
        ctx.fillRect(i - offset + 50, 230, 2, 2);
      }

      if (gameRunning && !gameOver) {
        currentGameState.frameCount++;

        currentGameState.dino.vy += config.gravidade;
        currentGameState.dino.y += currentGameState.dino.vy;

        if (currentGameState.dino.y >= 176) {
          currentGameState.dino.y = 176;
          currentGameState.dino.vy = 0;
          currentGameState.dino.jumping = false;
        }

        if (!currentGameState.dino.jumping && currentGameState.frameCount % 5 === 0) {
          currentGameState.particles.push({
            x: currentGameState.dino.x + 5,
            y: 215,
            vx: -config.velocidadeObstaculo * 0.5,
            vy: -Math.random() * 2,
            size: Math.random() * 3 + 1,
            alpha: 1
          });
        }

        for (let i = currentGameState.particles.length - 1; i >= 0; i--) {
          const p = currentGameState.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.05;
          if (p.alpha <= 0) {
            currentGameState.particles.splice(i, 1);
          } else {
            ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
          }
        }

        if (currentGameState.frameCount % 90 === 0) {
          const startX = canvas.width;
          for (let i = 0; i < config.quantidadeObstaculos; i++) {
            currentGameState.obstacles.push({
              x: startX + (i * 42),
              y: 185,
              width: 18,
              height: 35,
              passed: false
            });
          }
        }

        for (let i = currentGameState.obstacles.length - 1; i >= 0; i--) {
          const obs = currentGameState.obstacles[i];
          obs.x -= config.velocidadeObstaculo;

          ctx.fillStyle = '#15803d';
          ctx.fillRect(obs.x + 5, obs.y, 8, obs.height);
          ctx.fillRect(obs.x, obs.y + 10, 5, 12);
          ctx.fillRect(obs.x, obs.y + 10, 8, 4);
          ctx.fillRect(obs.x + 13, obs.y + 6, 5, 15);
          ctx.fillRect(obs.x + 10, obs.y + 17, 8, 4);

          const dinoBox = currentGameState.dino;
          if (
            dinoBox.x < obs.x + obs.width &&
            dinoBox.x + dinoBox.width > obs.x &&
            dinoBox.y < obs.y + obs.height &&
            dinoBox.y + dinoBox.height > obs.y
          ) {
            for (let k = 0; k < 15; k++) {
              currentGameState.particles.push({
                x: dinoBox.x + 15,
                y: dinoBox.y + 20,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: Math.random() * 5 + 2,
                alpha: 1
              });
            }
            sound.playCrash();
            setGameOver(true);
            setGameRunning(false);
          }

          if (!obs.passed && obs.x + obs.width < dinoBox.x) {
            obs.passed = true;
            currentGameState.score += 10;
            setScore(currentGameState.score);
            if (currentGameState.score % 50 === 0) {
              sound.playScore();
            }
          }

          if (obs.x + obs.width < -50) {
            currentGameState.obstacles.splice(i, 1);
          }
        }
      } else {
        for (let i = currentGameState.particles.length - 1; i >= 0; i--) {
          const p = currentGameState.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.02;
          if (p.alpha <= 0) {
            currentGameState.particles.splice(i, 1);
          } else {
            ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha})`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
          }
        }
      }

      const dino = currentGameState.dino;
      ctx.fillStyle = config.corDoDino;
      ctx.fillRect(dino.x, dino.y, dino.width, dino.height - 10);
      ctx.fillRect(dino.x + 8, dino.y - 6, 14, 12);
      ctx.fillRect(dino.x + 12, dino.y - 20, 24, 16);
      ctx.fillRect(dino.x + 24, dino.y - 14, 16, 10);
      ctx.fillRect(dino.x + 18, dino.y - 2, 14, 6);
      ctx.fillRect(dino.x + 6, dino.y - 16, 6, 6);
      ctx.fillRect(dino.x + 4, dino.y - 8, 6, 6);
      ctx.fillRect(dino.x + 2, dino.y, 6, 6);
      ctx.fillRect(dino.x - 8, dino.y + 8, 8, 12);
      ctx.fillRect(dino.x - 14, dino.y + 12, 6, 8);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(dino.x + 26, dino.y - 16, 6, 6);
      ctx.fillStyle = '#000000';
      ctx.fillRect(dino.x + 28, dino.y - 14, 3, 3);

      ctx.fillStyle = '#334155';
      const isAltFrame = Math.floor(currentGameState.frameCount / 6) % 2 === 0;
      if (dino.jumping || !gameRunning || gameOver) {
        ctx.fillRect(dino.x + 6, dino.y + dino.height - 10, 6, 10);
        ctx.fillRect(dino.x + 22, dino.y + dino.height - 10, 6, 10);
      } else {
        ctx.fillRect(dino.x + 6, dino.y + dino.height - 10, 6, isAltFrame ? 10 : 4);
        ctx.fillRect(dino.x + 22, dino.y + dino.height - 10, 6, isAltFrame ? 4 : 10);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameRunning, gameOver, config]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['Space', 'ArrowUp'].includes(e.code)) {
        e.preventDefault();
        triggerJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameRunning, gameOver]);

  const triggerJump = () => {
    const state = gameStateRef.current;
    if (!state.dino.jumping && gameRunning && !gameOver) {
      state.dino.vy = -config.forcaDoSalto;
      state.dino.jumping = true;
      sound.playJump();
    }
  };

  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('dino_code_highscore', score.toString());
      }
    }
  }, [gameOver, score, highScore]);

  const aplicarCodigoEReiniciar = () => {
    setConfig({ ...editorValues });
    setCodeSuccessFlash(true);
    setTimeout(() => setCodeSuccessFlash(false), 800);

    const state = gameStateRef.current;
    state.dino = { x: 50, y: 176, vy: 0, width: 34, height: 44, jumping: false };
    state.obstacles = [];
    state.score = 0;
    state.frameCount = 0;
    state.particles = [];

    setScore(0);
    setGameOver(false);
    setGameRunning(true);
  };

  const carregarDicaMissao = (missionId) => {
    const valoresSugeridos = { ...editorValues };
    if (missionId === 1) {
      valoresSugeridos.gravidade = 0.4;
    } else if (missionId === 2) {
      valoresSugeridos.forcaDoSalto = 20;
    } else if (missionId === 3) {
      valoresSugeridos.quantidadeObstaculos = 3;
    }
    setEditorValues(valoresSugeridos);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            ← Voltar ao menu
          </button>
          <div className="bg-gradient-to-tr from-amber-500 to-rose-500 p-2 rounded-lg text-white animate-pulse">
            <span className="text-xl">🖥️</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
              Dino Code Lab <span className="text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-extrabold uppercase">Beta Kids</span>
            </h1>
            <p className="text-xs text-slate-400">Aprende constantes, variáveis e ciclos jogando!</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            title={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? '🔈' : '🔊'}
          </button>

          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg px-4 py-1">
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Recorde</span>
              <span className="font-mono text-amber-400 font-bold">{highScore} m</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Pontuação</span>
              <span className="font-mono text-emerald-400 font-bold">{score} m</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6 overflow-hidden max-w-[1600px] mx-auto w-full">
        <section className="flex-1 flex flex-col gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-sm font-semibold uppercase text-slate-400 mb-3 flex items-center gap-2">
              <span>📖</span>
              Missões de Programação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {MISSIONS.map((m) => {
                const isCompleted = completedMissions.includes(m.id);
                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-lg border transition ${
                      isCompleted
                        ? 'bg-emerald-950/40 border-emerald-800/80'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className={`text-xs font-bold ${isCompleted ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {m.title}
                      </h3>
                      {isCompleted ? (
                        <span className="text-emerald-400">✓</span>
                      ) : (
                        <span className="text-[10px] text-amber-500 font-bold bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/60 uppercase shrink-0">Pendente</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{m.description}</p>
                    {!isCompleted && (
                      <button
                        onClick={() => carregarDicaMissao(m.id)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>✨</span> Auto-ajustar código
                      </button>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-400 italic block font-semibold">🌟 {m.reward}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-950 border-2 border-slate-800 rounded-xl p-4 flex flex-col items-center relative overflow-hidden shadow-2xl">
            <div className="relative w-full aspect-[24/10] max-w-[700px] border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
              <canvas
                ref={canvasRef}
                width={700}
                height={250}
                className="w-full h-full block cursor-pointer"
                onClick={triggerJump}
              />

              {!gameRunning && !gameOver && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-3 animate-bounce">
                    <span className="text-white text-2xl">▶</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mb-1">Dino Code Lab 🦖</h3>
                  <p className="text-xs text-slate-300 max-w-sm mb-4">
                    Para começares, clica em "Injetar Código" na barra lateral para carregar as tuas variáveis!
                  </p>
                  <button
                    onClick={aplicarCodigoEReiniciar}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold rounded-lg shadow-md hover:from-emerald-400 hover:to-teal-500 transition-all text-sm uppercase tracking-wider"
                  >
                    Correr Programa 🚀
                  </button>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-rose-500 font-extrabold text-xs uppercase tracking-widest bg-rose-950/50 border border-rose-900 px-3 py-1 rounded-full mb-2">Erro de Execução (Colisão)</span>
                  <h3 className="text-2xl font-black text-white mb-1">O Dino Bateu! 💥</h3>
                  <p className="text-xs text-slate-300 max-w-xs mb-4">
                    Modifica o teu código na direita para saltar mais alto ou ajustar a velocidade!
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={aplicarCodigoEReiniciar}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <span>↺</span> Correr de Novo
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full max-w-[700px] mt-4 flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded shadow-sm text-[10px]">Espaço</kbd>
                ou
                <kbd className="px-2 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded shadow-sm text-[10px]">↑</kbd> para Saltar
              </span>
              <button
                onClick={triggerJump}
                disabled={!gameRunning || gameOver}
                className="lg:hidden px-6 py-3 bg-indigo-600 active:bg-indigo-700 text-white font-bold rounded-lg uppercase tracking-wider text-sm select-none"
              >
                Saltar (Tocar) ⚡
              </button>
              <span className="hidden lg:inline text-[11px] text-slate-500 italic">Dica: Clicar no ecrã do jogo também salta!</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-950/40 to-slate-950 border border-slate-800/80 rounded-xl p-4">
            <h3 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-2">
              <span>❓</span> Como funciona este Laboratório?
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
              <li><strong>Constante:</strong> Um valor fixado pelas regras do jogo (como a <code className="text-amber-400">GRAVIDADE</code>) que não se altera sozinho.</li>
              <li><strong>Variável:</strong> Caixa onde guardamos valores dinâmicos que podemos mudar (ex: <code className="text-sky-400">forcaDoSalto</code> ou a <code className="text-emerald-400">corDoDino</code>).</li>
              <li><strong>Ciclos (Loops):</strong> Permite ordenar que o computador repita tarefas instantaneamente. O ciclo <code className="text-purple-400">for</code> cria múltiplos cactos num piscar de olhos.</li>
            </ul>
          </div>
        </section>

        <section className="w-full lg:w-[480px] flex flex-col bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden min-h-[500px]">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-mono text-slate-400 ml-2">meu_codigo.js</span>
            </div>

            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${activeTab === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Editor JS
              </button>
              <button
                onClick={() => setActiveTab('instructions')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${activeTab === 'instructions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Glossário 📖
              </button>
            </div>
          </div>

          {activeTab === 'editor' ? (
            <div className="flex-1 flex flex-col p-5 font-mono text-sm leading-relaxed overflow-y-auto space-y-5">
              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
                  <span>// CONSTANTE: Puxa o Dino para baixo</span>
                  <span className="text-[10px] bg-amber-950/45 text-amber-400 px-2 py-0.5 rounded-md border border-amber-900/30 font-sans">Valores: 0.1 a 3</span>
                </div>
                <div className="flex items-center flex-wrap gap-2 text-base">
                  <span className="text-rose-500 font-bold">const</span>
                  <span className="text-amber-400 font-bold">GRAVIDADE</span>
                  <span className="text-slate-400">=</span>
                  <input
                    type="number"
                    value={editorValues.gravidade}
                    onChange={(e) => setEditorValues({ ...editorValues, gravidade: Math.max(0.1, Math.min(3, parseFloat(e.target.value) || 1)) })}
                    className="bg-slate-950 border-2 border-slate-700 text-amber-300 font-bold px-3 py-1.5 rounded-lg w-24 text-center focus:outline-none focus:border-indigo-500 text-lg transition-colors"
                    step="0.1"
                    min="0.1"
                    max="3"
                  />
                  <span className="text-slate-400">;</span>
                </div>
              </div>

              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
                  <span>// VARIÁVEL: Altura do pulo do Dino</span>
                  <span className="text-[10px] bg-sky-950/45 text-sky-400 px-2 py-0.5 rounded-md border border-sky-900/30 font-sans">Valores: 5 a 30</span>
                </div>
                <div className="flex items-center flex-wrap gap-2 text-base">
                  <span className="text-blue-500 font-bold">let</span>
                  <span className="text-sky-300 font-bold">forcaDoSalto</span>
                  <span className="text-slate-400">=</span>
                  <input
                    type="number"
                    value={editorValues.forcaDoSalto}
                    onChange={(e) => setEditorValues({ ...editorValues, forcaDoSalto: Math.max(5, Math.min(30, parseInt(e.target.value, 10) || 12)) })}
                    className="bg-slate-950 border-2 border-slate-700 text-sky-200 font-bold px-3 py-1.5 rounded-lg w-24 text-center focus:outline-none focus:border-indigo-500 text-lg transition-colors"
                    min="5"
                    max="30"
                  />
                  <span className="text-slate-400">;</span>
                </div>
              </div>

              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
                  <span>// VARIÁVEL: Quão rápido correm os cactos</span>
                  <span className="text-[10px] bg-sky-950/45 text-sky-400 px-2 py-0.5 rounded-md border border-sky-900/30 font-sans">Valores: 2 a 18</span>
                </div>
                <div className="flex items-center flex-wrap gap-2 text-base">
                  <span className="text-blue-500 font-bold">let</span>
                  <span className="text-sky-300 font-bold">velocidadeCacto</span>
                  <span className="text-slate-400">=</span>
                  <input
                    type="number"
                    value={editorValues.velocidadeObstaculo}
                    onChange={(e) => setEditorValues({ ...editorValues, velocidadeObstaculo: Math.max(2, Math.min(18, parseInt(e.target.value, 10) || 6)) })}
                    className="bg-slate-950 border-2 border-slate-700 text-sky-200 font-bold px-3 py-1.5 rounded-lg w-24 text-center focus:outline-none focus:border-indigo-500 text-lg transition-colors"
                    min="2"
                    max="18"
                  />
                  <span className="text-slate-400">;</span>
                </div>
              </div>

              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
                  <span>// VARIÁVEL: Cor da roupa espacial</span>
                  <span className="text-[10px] bg-emerald-950/45 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-900/30 font-sans">Seletor</span>
                </div>
                <div className="flex items-center flex-wrap gap-2 text-base">
                  <span className="text-blue-500 font-bold">let</span>
                  <span className="text-sky-300 font-bold">corDoDino</span>
                  <span className="text-slate-400">=</span>
                  <select
                    value={editorValues.corDoDino}
                    onChange={(e) => setEditorValues({ ...editorValues, corDoDino: e.target.value })}
                    className="bg-slate-950 border-2 border-slate-700 text-emerald-300 font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer text-base transition-colors"
                  >
                    <option value="#ff5722">Laranja 🔥</option>
                    <option value="#1d4ed8">Azul 🌌</option>
                    <option value="#a855f7">Roxo 👾</option>
                    <option value="#ec4899">Rosa 🍧</option>
                    <option value="#facc15">Amarelo ⚡</option>
                  </select>
                  <span className="text-slate-400">;</span>
                </div>
              </div>

              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
                  <span>// CICLO: Quantos cactos criados de uma vez</span>
                  <span className="text-[10px] bg-purple-950/45 text-purple-400 px-2 py-0.5 rounded-md border border-purple-900/30 font-sans">Repetições</span>
                </div>
                <div className="flex items-center flex-wrap gap-2 text-base font-bold">
                  <span className="text-purple-500">for</span>
                  <span className="text-slate-400">(</span>
                  <span className="text-blue-500">let</span>
                  <span className="text-slate-200 font-normal">i =</span>
                  <span className="text-amber-400 font-normal">0</span>
                  <span className="text-slate-400">;</span>
                  <span className="text-slate-200 font-normal">i &lt;</span>
                  <select
                    value={editorValues.quantidadeObstaculos}
                    onChange={(e) => setEditorValues({ ...editorValues, quantidadeObstaculos: parseInt(e.target.value, 10) })}
                    className="bg-slate-950 border-2 border-slate-700 text-amber-400 px-3 py-1 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer text-base transition-colors font-bold"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                  <span className="text-slate-400">;</span>
                  <span className="text-slate-200 font-normal">i++</span>
                  <span className="text-slate-400">)</span>
                  <span className="text-slate-400">{'{'}</span>
                </div>
                <div className="pl-6 text-emerald-400 font-semibold my-2 text-sm flex items-center gap-2">
                  <span>criarObstaculo();</span>
                  <span className="text-xs text-slate-500 font-normal">// Desenha {editorValues.quantidadeObstaculos} cactos</span>
                </div>
                <div className="font-bold text-slate-400">{' }'}</div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-800">
                <button
                  onClick={aplicarCodigoEReiniciar}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg text-sm ${
                    codeSuccessFlash
                      ? 'bg-emerald-500 text-slate-950 scale-102 shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white active:scale-95'
                  }`}
                >
                  {codeSuccessFlash ? (
                    <>
                      <span>✓</span> Código Injetado com Sucesso! 💻
                    </>
                  ) : (
                    <>
                      <span>💻</span> Injetar Código & Reiniciar 🚀
                    </>
                  )}
                </button>
                <div className="text-center text-[10px] text-slate-500 mt-2">
                  Nota: Aplicar o código vai reiniciar o jogo atual para testar a nova física.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <span>🏆</span> O Meu Primeiro Manual de Programação
              </h3>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-rose-400">1. O que são as Constantes?</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pensa nas constantes como as leis da natureza. No nosso jogo, a <code className="text-amber-400 font-bold">GRAVIDADE</code> é uma constante. Ela puxa sempre o Dino de volta ao chão com a mesma força. Se tentares mudá-la para <strong>0.4</strong>, o Dino parecerá levitar.
                </p>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-sky-400">2. O que são Variáveis?</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  As variáveis são como caixas mágicas onde guardamos informações que podem variar ou mudar a qualquer altura. A <code className="text-sky-300 font-bold">forcaDoSalto</code> é o quanto o Dino consegue pular. Podes aumentá-la para superar obstáculos maiores!
                </p>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-purple-400">3. O que é um Ciclo (Loop)?</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Um ciclo ensina o computador a repetir tarefas chatas muito rapidamente. Com o ciclo <code className="text-purple-400 font-bold">for</code>, nós pedimos para criar múltiplos obstáculos seguidos sem termos de escrever a mesma linha de código repetidamente!
                </p>
              </div>

              <div className="p-3 bg-indigo-950/30 rounded-lg border border-indigo-900/50 text-center">
                <span className="text-xs text-indigo-300 font-medium">Completa as 3 missões do quadro esquerdo para te tornares um Mestre Programador!</span>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-3 text-center text-xs text-slate-500">
        Desenvolvido para incentivar a curiosidade científica e o pensamento computacional em jovens exploradores. 💻🦖
      </footer>
    </div>
  );
}
