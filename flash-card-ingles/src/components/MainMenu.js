import React from 'react';

export default function MainMenu({ onSelectGame }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col">
      
      {/* HEADER */}
      <header className="border-b border-slate-800/60 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Tech Interview Prep
              </h1>
              <p className="text-xs text-slate-400">Prepare suas respostas em inglês para entrevistas de software e IA</p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 py-12 max-w-5xl mx-auto w-full">
        
        {/* HERO SECTION */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Bem-vindo ao Treino de Entrevistas!
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Selecione um modo de estudo para praticar suas respostas em inglês com áudio e autoplay.
          </p>
        </div>

        {/* GAMES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          
          {/* FLASHCARD GAME */}
          <button
            onClick={() => onSelectGame('flashcards')}
            className="group relative overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-800/40 backdrop-blur p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 active:scale-95"
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative space-y-4">
              <div className="text-5xl">🎴</div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  Flashcards
                </h3>
                <p className="text-sm text-slate-400">
                  Estude as respostas com cartões interativos. Flip para revelar a resposta em inglês, pratique a pronúncia com áudio e acompanhe seu progresso.
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400">✓</span> Modo Autoplay Bilíngue
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400">✓</span> Text-to-Speech em Inglês e Português
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400">✓</span> Ajuste de Velocidade e Tom de Voz
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400">✓</span> Rastreamento de Progresso
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <span className="inline-block text-xs font-bold text-blue-400 group-hover:text-blue-300">
                  Começar →
                </span>
              </div>
            </div>
          </button>

          {/* DINO CODE LAB GAME */}
          <button
            onClick={() => onSelectGame('dino')}
            className="group relative overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-800/40 backdrop-blur p-8 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative space-y-4">
              <div className="text-5xl">🦖</div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  Dino Code Lab
                </h3>
                <p className="text-sm text-slate-400">
                  Ajuste constantes, variáveis e loops para ensinar o Dino a pular, ganhar pontos e superar obstáculos.
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400">✓</span> Aprende constantes e variáveis
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400">✓</span> Explora loops com cactos em sequência
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400">✓</span> Recebe missões e feedback visual
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <span className="inline-block text-xs font-bold text-amber-400 group-hover:text-amber-300">
                  Jogar agora →
                </span>
              </div>
            </div>
          </button>

        </div>

        {/* STATS PREVIEW */}
        <div className="mt-16 w-full max-w-3xl p-6 rounded-3xl border border-slate-700/50 bg-slate-800/30 backdrop-blur">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Preparação incluindo:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">73</div>
              <div className="text-xs text-slate-400 mt-1">Frases de Treino</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">11</div>
              <div className="text-xs text-slate-400 mt-1">Categorias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">2</div>
              <div className="text-xs text-slate-400 mt-1">Idiomas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">∞</div>
              <div className="text-xs text-slate-400 mt-1">Repetições</div>
            </div>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="py-6 border-t border-slate-800/60 bg-slate-900 text-center text-xs text-slate-500 px-4">
        <p className="max-w-md mx-auto">
          Desenvolvido por <strong>Jonathan Bach</strong> para preparação de entrevistas de software e IA.
        </p>
      </footer>

    </div>
  );
}
