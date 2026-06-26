import React, { useState, useEffect } from 'react';

export default function BinaryLampGame({ onBack }) {
  const [gameMode, setGameMode] = useState('free');
  const [bitCount, setBitCount] = useState(4);
  const [bulbs, setBulbs] = useState(Array(4).fill(false));
  const [showAnswer, setShowAnswer] = useState(true);
  const [targetNumber, setTargetNumber] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [confetti, setConfetti] = useState([]);

  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(293.66, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.1, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.2);
        });
      } else if (type === 'error') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(196.0, now);
        osc.frequency.linearRampToValueAtTime(110.0, now + 0.35);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      console.log('AudioContext não suportado ou bloqueado pelo navegador.');
    }
  };

  useEffect(() => {
    resetGame();
  }, [bitCount, gameMode]);

  const resetGame = () => {
    const defaultBulbs = Array(bitCount).fill(false);
    setBulbs(defaultBulbs);
    setUserGuess('');
    setFeedback(null);

    const maxVal = Math.pow(2, bitCount) - 1;

    if (gameMode === 'guessNumber') {
      const target = Math.floor(Math.random() * maxVal) + 1;
      setTargetNumber(target);
      setBulbs(decimalToBinaryArray(target, bitCount));
    } else if (gameMode === 'makeNumber') {
      const target = Math.floor(Math.random() * maxVal) + 1;
      setTargetNumber(target);
    }
  };

  const binaryToDecimal = (bulbArray) => {
    return bulbArray.reduce((acc, curr, index) => {
      if (curr) {
        const exponent = bulbArray.length - 1 - index;
        return acc + Math.pow(2, exponent);
      }
      return acc;
    }, 0);
  };

  const decimalToBinaryArray = (number, bits) => {
    const arr = [];
    for (let i = bits - 1; i >= 0; i--) {
      arr.push(((number >> i) & 1) === 1);
    }
    return arr;
  };

  const currentDecimalValue = binaryToDecimal(bulbs);

  const handleBulbClick = (index) => {
    playSound('click');
    const newBulbs = [...bulbs];
    newBulbs[index] = !newBulbs[index];
    setBulbs(newBulbs);
    setFeedback(null);
  };

  const launchConfetti = () => {
    const newParticles = [];
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: Math.random(),
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 12 + 6,
        speedX: Math.random() * 6 - 3,
        speedY: Math.random() * 4 + 4,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 10 - 5
      });
    }
    setConfetti(newParticles);
  };

  useEffect(() => {
    if (confetti.length === 0) return;
    const interval = setInterval(() => {
      setConfetti((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            rotation: p.rotation + p.rotSpeed
          }))
          .filter((p) => p.y < 110 && p.x >= -10 && p.x <= 110)
      );
    }, 24);
    return () => clearInterval(interval);
  }, [confetti]);

  const checkAnswer = () => {
    if (gameMode === 'guessNumber') {
      const parsedGuess = parseInt(userGuess, 10);
      if (parsedGuess === targetNumber) {
        handleCorrect();
      } else {
        handleIncorrect();
      }
    } else if (gameMode === 'makeNumber') {
      if (currentDecimalValue === targetNumber) {
        handleCorrect();
      } else {
        handleIncorrect();
      }
    }
  };

  const handleCorrect = () => {
    playSound('success');
    launchConfetti();
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    if (nextStreak > bestStreak) {
      setBestStreak(nextStreak);
    }
    setFeedback({
      type: 'success',
      text: 'Excelente! Você acertou em cheio! 🌟 (+1 acerto na sequência)'
    });

    setTimeout(() => {
      resetGame();
    }, 2200);
  };

  const handleIncorrect = () => {
    playSound('error');
    setStreak(0);
    setFeedback({
      type: 'error',
      text: gameMode === 'guessNumber'
        ? 'Ops! Esse não é o valor correto. Vamos somar novamente? 🔌'
        : 'Ainda não é o número alvo. Tente ligar ou desligar alguma lâmpada! 💡'
    });
  };

  const bitValues = Array.from({ length: bitCount }, (_, i) => Math.pow(2, bitCount - 1 - i));

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 text-white font-sans relative overflow-hidden flex flex-col justify-between">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-1/4 right-20 w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-cyan-300 rounded-full animate-ping"></div>
      </div>

      {confetti.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none rounded-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            transition: 'transform 0.05s linear',
            zIndex: 50
          }}
        />
      ))}

      <header className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4 z-10 border-b border-white/10 bg-black/20 backdrop-blur-md rounded-b-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            ← Voltar ao menu
          </button>
          <div className="bg-gradient-to-tr from-yellow-400 to-amber-500 p-2 rounded-2xl shadow-lg shadow-yellow-500/30 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-200">
              Lâmpadas Mágicas do Binário
            </h1>
            <p className="text-xs text-indigo-200 font-medium tracking-wide">Aprenda a linguagem secreta dos computadores!</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => { playSound('click'); setShowTutorial(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 text-indigo-950"
          >
            <span>Como Jogar? 📖</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition active:scale-95"
            title={soundEnabled ? 'Silenciar sons' : 'Ativar sons'}
          >
            {soundEnabled ? '🔊' : '🔈'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-grow flex flex-col justify-center items-center z-10 max-w-4xl">
        <div className="w-full bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border border-white/10">
          <div className="flex flex-col gap-1.5 w-full md:w-auto">
            <span className="text-xs uppercase tracking-wider text-pink-300 font-bold text-center md:text-left">Modo de Jogo:</span>
            <div className="grid grid-cols-3 gap-2 bg-black/30 p-1.5 rounded-xl">
              <button
                onClick={() => { playSound('click'); setGameMode('free'); }}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${gameMode === 'free' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow' : 'text-indigo-200 hover:text-white'}`}
              >
                💡 Treino Livre
              </button>
              <button
                onClick={() => { playSound('click'); setGameMode('guessNumber'); }}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${gameMode === 'guessNumber' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow' : 'text-indigo-200 hover:text-white'}`}
              >
                ❓ Qual é o Número?
              </button>
              <button
                onClick={() => { playSound('click'); setGameMode('makeNumber'); }}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${gameMode === 'makeNumber' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow' : 'text-indigo-200 hover:text-white'}`}
              >
                🎯 Faça o Número
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full md:w-auto">
            <span className="text-xs uppercase tracking-wider text-cyan-300 font-bold text-center md:text-left">Nível (Quantidade de Lâmpadas):</span>
            <div className="grid grid-cols-3 gap-2 bg-black/30 p-1.5 rounded-xl">
              {[4, 6, 8].map((bits) => (
                <button
                  key={bits}
                  onClick={() => { playSound('click'); setBitCount(bits); }}
                  className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${bitCount === bits ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-indigo-950 shadow' : 'text-indigo-200 hover:text-white'}`}
                >
                  {bits} Bits {bits === 4 ? '(Fácil)' : bits === 6 ? '(Médio)' : '(Gênio)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full bg-black/30 border border-white/20 backdrop-blur-lg p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center">
          <div className="mb-6 text-center">
            {gameMode === 'free' && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-yellow-300 flex items-center justify-center gap-2">
                  <span>Modo Treino Livre</span>
                </h3>
                <p className="text-sm text-indigo-200 mt-1">Ligue ou desligue as lâmpadas clicando nelas e veja a soma!</p>
              </div>
            )}

            {gameMode === 'guessNumber' && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-cyan-300">Qual é o valor decimal desse código binário?</h3>
                <p className="text-sm text-indigo-200 mt-1">Some os valores de todas as lâmpadas que estão acesas!</p>
              </div>
            )}

            {gameMode === 'makeNumber' && (
              <div className="flex flex-col items-center">
                <span className="text-indigo-300 text-sm font-semibold uppercase tracking-wider">Acenda as lâmpadas corretas para formar:</span>
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mt-1 animate-bounce">
                  {targetNumber}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-row flex-wrap justify-center items-center gap-3 md:gap-4 my-4 w-full select-none">
            {bulbs.map((isOn, index) => {
              const value = bitValues[index];
              const exponent = bitCount - 1 - index;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-between p-3 rounded-2xl transition-all duration-300 border w-[68px] sm:w-[84px] md:w-[94px] cursor-pointer ${isOn ? 'bg-gradient-to-b from-yellow-400/20 to-amber-400/10 border-yellow-400/70 shadow-lg shadow-yellow-500/20 scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  onClick={() => {
                    if (gameMode !== 'guessNumber') {
                      handleBulbClick(index);
                    } else {
                      playSound('error');
                      setFeedback({ type: 'error', text: 'Neste modo, você precisa adivinhar o valor das lâmpadas dadas! Não vale mudar elas! 😉' });
                    }
                  }}
                >
                  <span className={`text-xl md:text-2xl font-black mb-1.5 transition ${isOn ? 'text-yellow-400' : 'text-white/40'}`}>
                    {isOn ? '1' : '0'}
                  </span>

                  <div className="relative my-2">
                    {isOn && <div className="absolute inset-0 bg-yellow-400 blur-xl rounded-full opacity-60 scale-125 animate-pulse"></div>}
                    <svg viewBox="0 0 24 24" className={`w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 ${isOn ? 'text-yellow-400 scale-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]' : 'text-indigo-950 stroke-white/30 fill-black/40'}`} fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2.5 15h-5v-1h5v1zm0-2h-5v-1h5v1zm1.07-3.23c-.32.22-.57.54-.7.91l-.22.62c-.05.13-.17.22-.31.22H9.66c-.14 0-.26-.09-.31-.22l-.22-.62c-.13-.37-.38-.69-.7-.91C7.11 11.9 6.2 10.51 6.2 9c0-3.2 2.6-5.8 5.8-5.8s5.8 2.6 5.8 5.8c0 1.51-.91 2.9-2.23 3.77z" />
                    </svg>
                  </div>

                  <div className={`mt-2 flex flex-col items-center w-full py-1.5 rounded-lg border transition ${isOn ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40' : 'bg-black/30 text-white/50 border-white/5'}`}>
                    <span className="text-xs font-mono font-medium opacity-70">2^{exponent}</span>
                    <span className="text-sm md:text-base font-extrabold mt-0.5">{value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-3 bg-black/40 px-5 py-3 rounded-2xl border border-white/10 shadow-inner">
            <span className="text-sm font-bold text-indigo-200">Exibir calculadora e resposta?</span>
            <button
              onClick={() => { playSound('click'); setShowAnswer(!showAnswer); }}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${showAnswer ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gray-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${showAnswer ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className="text-xs font-bold font-mono">{showAnswer ? 'SIM 👍' : 'NÃO 🤫'}</span>
          </div>

          <div className="w-full mt-6">
            {showAnswer ? (
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center flex flex-col items-center justify-center animate-fadeIn">
                <span className="text-xs text-indigo-300 uppercase tracking-wider font-bold">Matemática do Código:</span>
                <div className="text-base md:text-lg font-semibold mt-2 text-indigo-100 flex flex-wrap items-center justify-center gap-1.5">
                  {bitValues.map((val, idx) => {
                    const active = bulbs[idx];
                    return (
                      <React.Fragment key={idx}>
                        <span className={`px-2 py-0.5 rounded-md font-bold transition-all ${active ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30' : 'bg-black/20 text-white/20 line-through'}`}>
                          {val}
                        </span>
                        {idx < bitValues.length - 1 && <span className="opacity-40">+</span>}
                      </React.Fragment>
                    );
                  })}
                  <span className="opacity-70 font-bold">=</span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 bg-white px-3 py-0.5 rounded-lg bg-emerald-500/10">
                    {currentDecimalValue}
                  </span>
                </div>
                <div className="mt-3 text-xs text-indigo-200/70">
                  💡 <span className="font-semibold text-indigo-200">Dica:</span> Somamos apenas os números das lâmpadas acesas (<span className="text-yellow-300">1</span>). As apagadas (<span className="text-white/40">0</span>) ficam fora da soma!
                </div>
              </div>
            ) : (
              <div className="bg-black/50 border border-white/5 p-5 rounded-2xl text-center text-indigo-300 text-sm flex flex-col items-center justify-center min-h-[90px] italic">
                <span className="text-2xl mb-1">🤫</span>
                <span>A calculadora e respostas estão ocultas para desafiar seu cérebro!</span>
              </div>
            )}
          </div>

          {gameMode !== 'free' && (
            <div className="w-full mt-6 border-t border-white/10 pt-6 flex flex-col items-center gap-4">
              {gameMode === 'guessNumber' && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
                  <input
                    type="number"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="Digite sua resposta..."
                    className="bg-black/40 border-2 border-indigo-400/40 rounded-2xl px-5 py-3 text-xl font-bold w-full focus:outline-none focus:border-cyan-400 text-center text-white placeholder-indigo-300/40"
                    onKeyDown={(e) => { if (e.key === 'Enter') checkAnswer(); }}
                  />
                  <button
                    onClick={checkAnswer}
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-indigo-950 font-black px-8 py-3.5 rounded-2xl transition shadow-lg w-full sm:w-auto active:scale-95"
                  >
                    Confirmar
                  </button>
                </div>
              )}

              {gameMode === 'makeNumber' && (
                <button
                  onClick={checkAnswer}
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-indigo-950 font-black px-12 py-3.5 rounded-2xl transition shadow-lg text-lg active:scale-95 flex items-center gap-2"
                >
                  <span>Pronto! Já configurei! 👍</span>
                </button>
              )}

              {feedback && (
                <div className={`mt-3 px-5 py-3.5 rounded-2xl text-center font-bold text-sm md:text-base animate-bounce ${feedback.type === 'success' ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300' : 'bg-rose-500/20 border border-rose-400 text-rose-300'}`}>
                  {feedback.text}
                </div>
              )}

              <div className="flex items-center gap-8 text-sm font-semibold mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">🔥 Sequência Atual:</span>
                  <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full text-base font-extrabold font-mono">{streak}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">🏆 Recorde:</span>
                  <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-base font-extrabold font-mono">{bestStreak}</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="text-xs text-indigo-300 underline hover:text-indigo-100 transition mt-2 cursor-pointer"
              >
                Pular este desafio e gerar outro 🔄
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-black/30 backdrop-blur-md text-center py-4 border-t border-white/10 text-xs text-indigo-300 font-medium tracking-wide z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>🎮 Criado especialmente para ensinar código binário de forma lúdica.</span>
          <span>Dica do Mestre: Os computadores usam sequências assim de 8 bits (chamadas de Bytes)! 💻</span>
        </div>
      </footer>

      {showTutorial && (
        <div className="fixed inset-0 bg-indigo-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
          <div className="bg-gradient-to-b from-indigo-900 to-purple-900 border-2 border-indigo-400/40 rounded-3xl p-6 md:p-8 max-w-2xl w-full text-white shadow-2xl relative my-8">
            <button
              onClick={() => { playSound('click'); setShowTutorial(false); }}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition active:scale-90"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-indigo-400/20 pb-4 mb-5">
              <span className="text-3xl">📖</span>
              <div>
                <h2 className="text-2xl font-black text-yellow-300">Como funciona o Código Binário?</h2>
                <p className="text-xs text-indigo-200">A linguagem secreta dos computadores decifrada para você!</p>
              </div>
            </div>

            <div className="space-y-4 text-sm md:text-base text-indigo-100 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <p>Os computadores são feitos de circuitos eletrônicos que só entendem duas coisas: LIGADO ou DESLIGADO.</p>

              <div className="grid grid-cols-2 gap-3 bg-black/40 p-3 rounded-xl border border-white/5 my-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  <div>
                    <div className="font-extrabold text-yellow-400">Lâmpada Acesa</div>
                    <div className="text-xs opacity-80">Representa o bit 1 (LIGADO)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔌</span>
                  <div>
                    <div className="font-extrabold text-indigo-300">Lâmpada Apagada</div>
                    <div className="text-xs opacity-80">Representa o bit 0 (DESLIGADO)</div>
                  </div>
                </div>
              </div>

              <h4 className="font-extrabold text-cyan-300 text-lg mt-4">🔢 Como calcular os valores?</h4>
              <p>Diferente de nós que contamos de 1 em 1 ou de 10 em 10, no código binário cada posição tem um valor que é o dobro do anterior. Da direita para a esquerda:</p>

              <div className="bg-indigo-950/50 p-4 rounded-xl border border-indigo-500/20 font-mono text-center">
                <div className="grid grid-cols-4 gap-2 text-xs md:text-sm">
                  <div className="p-2 bg-white/5 rounded-lg"><span className="block text-indigo-300">2^3</span><span className="block font-black text-base text-yellow-300">8</span></div>
                  <div className="p-2 bg-white/5 rounded-lg"><span className="block text-indigo-300">2^2</span><span className="block font-black text-base text-yellow-300">4</span></div>
                  <div className="p-2 bg-white/5 rounded-lg"><span className="block text-indigo-300">2^1</span><span className="block font-black text-base text-yellow-300">2</span></div>
                  <div className="p-2 bg-white/5 rounded-lg"><span className="block text-indigo-300">2^0</span><span className="block font-black text-base text-yellow-300">1</span></div>
                </div>
              </div>

              <h4 className="font-extrabold text-pink-300 text-lg mt-4">🍎 Exemplo de Soma:</h4>
              <p>Imagine que temos 4 lâmpadas e queremos representar o número 5:</p>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-xs md:text-sm">
                <div className="flex justify-around items-center mb-2">
                  <div className="text-center"><span className="block text-white/40">🔌</span><span className="block font-bold">8</span><span className="block text-white/40 font-bold">0</span></div>
                  <span className="text-lg opacity-40">+</span>
                  <div className="text-center"><span className="block">💡</span><span className="block font-black text-yellow-400">4</span><span className="block text-yellow-400 font-bold">1</span></div>
                  <span className="text-lg opacity-40">+</span>
                  <div className="text-center"><span className="block text-white/40">🔌</span><span className="block font-bold">2</span><span className="block text-white/40 font-bold">0</span></div>
                  <span className="text-lg opacity-40">+</span>
                  <div className="text-center"><span className="block">💡</span><span className="block font-black text-yellow-400">1</span><span className="block text-yellow-400 font-bold">1</span></div>
                </div>
                <div className="text-center font-bold text-sm border-t border-white/10 pt-2 text-indigo-200">Fazendo as somas: 4 + 1 = 5. O código binário gerado é 0101!</div>
              </div>

              <p className="text-indigo-200 text-xs italic mt-4 text-center">Viu como é simples? Escolha um modo de jogo, ative os neurônios e divirta-se quebrando recordes! 🏆</p>
            </div>

            <div className="border-t border-indigo-400/20 pt-4 mt-5 text-center">
              <button
                onClick={() => { playSound('click'); setShowTutorial(false); }}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-950 font-black px-8 py-3 rounded-2xl shadow-lg transition active:scale-95"
              >
                Entendi! Vamos Jogar! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
