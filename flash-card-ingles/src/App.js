import React, { useState, useEffect, useMemo, useRef } from 'react';
import MainMenu from './components/MainMenu';
import DinoCodeLabGame from './components/DinoCodeLabGame';
import BinaryLampGame from './components/BinaryLampGame';

// Dados da Entrevista extraídos do PDF
const interviewData = [
  // APRESENTAÇÃO
  { id: 1, category: 'Apresentação', pt: 'Meu nome é Jonathan Bach.', en: 'My name is Jonathan Bach.' },
  { id: 2, category: 'Apresentação', pt: 'Sou Engenheiro Fullstack com foco em Inteligência Artificial.', en: 'I am a Fullstack Engineer focused on Artificial Intelligence.' },
  { id: 3, category: 'Apresentação', pt: 'Tenho mais de oito anos de experiência em desenvolvimento de software.', en: 'I have more than eight years of experience in software development.' },
  { id: 4, category: 'Apresentação', pt: 'Trabalhei com sistemas web, mobile, IoT, cloud e IA.', en: 'I worked with web, mobile, IoT, cloud, and AI systems.' },
  { id: 5, category: 'Apresentação', pt: 'Hoje trabalho com sistemas bancários em larga escala.', en: 'Today I work on large-scale banking systems.' },
  { id: 6, category: 'Apresentação', pt: 'Também lidero iniciativas de Inteligência Artificial.', en: 'I also lead Artificial Intelligence initiatives.' },

  // HISTÓRIA PROFISSIONAL
  { id: 7, category: 'História Profissional', pt: 'Comecei trabalhando com hardware.', en: 'I started working with computer hardware.' },
  { id: 8, category: 'História Profissional', pt: 'Aos 16 anos comecei a desenvolver websites.', en: 'At the age of 16, I started building websites.' },
  { id: 9, category: 'História Profissional', pt: 'Desenvolvi sistemas para indústrias e clínicas médicas.', en: 'I developed systems for manufacturing companies and medical clinics.' },
  { id: 10, category: 'História Profissional', pt: 'Depois trabalhei com desenvolvimento mobile.', en: 'Later, I worked with mobile development.' },
  { id: 11, category: 'História Profissional', pt: 'Em seguida trabalhei com soluções IoT para o agronegócio.', en: 'Then I worked with IoT solutions for agribusiness.' },
  { id: 12, category: 'História Profissional', pt: 'Depois entrei em consultorias de software.', en: 'After that, I joined software consultancies.' },
  { id: 13, category: 'História Profissional', pt: 'Tornei-me Líder Técnico.', en: 'I became a Technical Lead.' },
  { id: 14, category: 'História Profissional', pt: 'Hoje trabalho com sistemas bancários e Inteligência Artificial.', en: 'Today I work with banking systems and Artificial Intelligence.' },

  // NODE.JS E TYPESCRIPT
  { id: 15, category: 'Node.js & TypeScript', pt: 'Tenho mais de seis anos de experiência com Node.js.', en: 'I have more than six years of experience with Node.js.' },
  { id: 16, category: 'Node.js & TypeScript', pt: 'Tenho vários anos de experiência com TypeScript.', en: 'I have several years of experience with TypeScript.' },
  { id: 17, category: 'Node.js & TypeScript', pt: 'Construí APIs REST e serviços GraphQL.', en: 'I built REST APIs and GraphQL services.' },
  { id: 18, category: 'Node.js & TypeScript', pt: 'Trabalhei com arquiteturas de microsserviços.', en: 'I worked with microservices architectures.' },
  { id: 19, category: 'Node.js & TypeScript', pt: 'Desenvolvi aplicações cloud-native.', en: 'I developed cloud-native applications.' },
  { id: 20, category: 'Node.js & TypeScript', pt: 'Trabalhei com sistemas corporativos de grande porte.', en: 'I worked with enterprise-scale systems.' },
  { id: 21, category: 'Node.js & TypeScript', pt: 'Trabalhei com ambientes de alta disponibilidade.', en: 'I worked with high-availability environments.' },

  // INTELIGÊNCIA ARTIFICIAL E PROMPT ENGINEERING
  { id: 22, category: 'Inteligência Artificial', pt: 'Trabalhei em uma plataforma de IA Generativa.', en: 'I worked on a Generative AI platform.' },
  { id: 23, category: 'Inteligência Artificial', pt: 'A plataforma era utilizada por Product Owners, desenvolvedores e clientes.', en: 'The platform was used by Product Owners, developers, and clients.' },
  { id: 24, category: 'Inteligência Artificial', pt: 'A IA refinava histórias de usuário.', en: 'The AI refined user stories.' },
  { id: 25, category: 'Inteligência Artificial', pt: 'A IA melhorava requisitos.', en: 'The AI improved requirements.' },
  { id: 26, category: 'Inteligência Artificial', pt: 'A IA gerava documentação técnica.', en: 'The AI generated technical documentation.' },
  { id: 27, category: 'Inteligência Artificial', pt: 'A IA identificava inconsistências.', en: 'The AI identified inconsistencies.' },
  { id: 28, category: 'Inteligência Artificial', pt: 'A IA apoiava a tomada de decisão.', en: 'The AI supported decision-making.' },
  { id: 29, category: 'Inteligência Artificial', pt: 'Trabalhei em arquitetura, desenvolvimento e integração com IA.', en: 'I worked on architecture, development, and AI integration.' },
  { id: 30, category: 'Inteligência Artificial', pt: 'Desenvolvo agentes de IA e soluções baseadas em LLMs.', en: 'I build AI agents and LLM-powered solutions.' },
  { id: 31, category: 'Inteligência Artificial', pt: 'Meu objetivo é melhorar produtividade e qualidade de software.', en: 'My goal is to improve productivity and software quality.' },
  { id: 32, category: 'Inteligência Artificial', pt: 'Trabalhei extensivamente com engenharia de prompts.', en: 'I worked extensively with prompt engineering.' },
  { id: 33, category: 'Inteligência Artificial', pt: 'Melhorei a qualidade dos prompts.', en: 'I improved prompt quality.' },
  { id: 34, category: 'Inteligência Artificial', pt: 'Otimizei o gerenciamento de contexto.', en: 'I optimized context management.' },
  { id: 35, category: 'Inteligência Artificial', pt: 'Reduzi o consumo de tokens.', en: 'I reduced token consumption.' },
  { id: 36, category: 'Inteligência Artificial', pt: 'Melhorei a consistência das respostas.', en: 'I improved response consistency.' },
  { id: 37, category: 'Inteligência Artificial', pt: 'Foquei em escalabilidade e confiabilidade.', en: 'I focused on scalability and reliability.' },

  // AWS E CLOUD & SISTEMAS DISTRIBUÍDOS
  { id: 38, category: 'Cloud & Distribuído', pt: 'Tenho ampla experiência com AWS.', en: 'I have extensive experience with AWS.' },
  { id: 39, category: 'Cloud & Distribuído', pt: 'Trabalhei com Lambda, ECS e EKS.', en: 'I worked with Lambda, ECS, and EKS.' },
  { id: 40, category: 'Cloud & Distribuído', pt: 'Trabalhei com API Gateway, DynamoDB, SQS, SNS e S3.', en: 'I worked with API Gateway, DynamoDB, SQS, SNS, and S3.' },
  { id: 41, category: 'Cloud & Distribuído', pt: 'Trabalhei com CloudFront, Aurora MySQL, MongoDB e SQL Server.', en: 'I worked with CloudFront, Aurora MySQL, MongoDB, and SQL Server.' },
  { id: 42, category: 'Cloud & Distribuído', pt: 'Trabalhei com Azure DevOps Pipelines.', en: 'I worked with Azure DevOps pipelines.' },
  { id: 43, category: 'Cloud & Distribuído', pt: 'Sim, trabalhei extensivamente com sistemas distribuídos.', en: 'Yes, I worked extensively with distributed systems.' },
  { id: 44, category: 'Cloud & Distribuído', pt: 'Projetei arquiteturas de microsserviços e sistemas orientados a eventos.', en: 'I designed microservices architectures and event-driven systems.' },
  { id: 45, category: 'Cloud & Distribuído', pt: 'Trabalhei com comunicação assíncrona.', en: 'I worked with asynchronous communication.' },
  { id: 46, category: 'Cloud & Distribuído', pt: 'Projetei sistemas de alta disponibilidade.', en: 'I designed highly available systems.' },
  { id: 47, category: 'Cloud & Distribuído', pt: 'Trabalhei com integrações bancárias.', en: 'I worked with banking integrations.' },

  // SITUAÇÃO DESAFIADORA E LIDERANÇA
  { id: 48, category: 'Desafios & Liderança', pt: 'Um dos maiores desafios aconteceu durante o Natal em uma plataforma de pedágio.', en: 'One of the biggest challenges happened during Christmas on a toll payment platform.' },
  { id: 49, category: 'Desafios & Liderança', pt: 'A plataforma era integrada a sistemas bancários e um problema afetou 80 mil clientes.', en: 'The platform was integrated with banking systems and a critical issue affected 80,000 customers.' },
  { id: 50, category: 'Desafios & Liderança', pt: 'Participei da resposta ao incidente: analisei logs, DBs e microsserviços.', en: 'I joined the incident response effort: analyzed logs, databases, and microservices.' },
  { id: 51, category: 'Desafios & Liderança', pt: 'Identifiquei a causa raiz e executei scripts de recuperação em produção.', en: 'I identified the root cause and executed recovery scripts in production.' },
  { id: 52, category: 'Desafios & Liderança', pt: 'O serviço foi restaurado e isso me ensinou ownership e resiliência.', en: 'The service was restored successfully, teaching me ownership and resilience.' },
  { id: 53, category: 'Desafios & Liderança', pt: 'Gosto de liderar equipes e ajudar engenheiros a crescer.', en: 'I enjoy leading teams and helping engineers grow.' },
  { id: 54, category: 'Desafios & Liderança', pt: 'Minha função é criar estrutura e remover bloqueios.', en: 'My role is to create structure and remove blockers.' },
  { id: 55, category: 'Desafios & Liderança', pt: 'Gosto de mentorar desenvolvedores. Liderança é servir a equipe.', en: 'I enjoy mentoring developers. I believe leadership is about serving the team.' },
  { id: 56, category: 'Desafios & Liderança', pt: 'Liderança não é ter todas as respostas, é organizar o trabalho e aproveitar os pontos fortes.', en: 'Leadership is not about having all the answers. It is about organizing the work and leveraging team strengths.' },

  // POR QUE ESSA VAGA & PEGADINHAS
  { id: 57, category: 'Objetivos & Pegadinhas', pt: 'Gosto de trabalhar com equipes globais, resolver problemas complexos e construir produtos de impacto.', en: 'I enjoy working with global teams, solving complex problems, and building impactful products.' },
  { id: 58, category: 'Objetivos & Pegadinhas', pt: 'Esta vaga está alinhada com minha experiência e objetivos de carreira.', en: 'This role aligns with my experience and career goals.' },
  { id: 59, category: 'Objetivos & Pegadinhas', pt: 'Você se considera um Engenheiro de IA? Sim, desenvolvo soluções com IA em produção.', en: 'Do you consider yourself an AI Engineer? Yes, I have been building AI-powered solutions in production.' },
  { id: 60, category: 'Objetivos & Pegadinhas', pt: 'Combino conhecimento em IA com fortes habilidades de engenharia de software.', en: 'I combine AI knowledge with strong software engineering skills.' },
  { id: 61, category: 'Objetivos & Pegadinhas', pt: 'Você treinou seus próprios modelos? Trabalhei principalmente com modelos fundacionais.', en: 'Have you trained your own models? I have worked primarily with existing foundation models.' },
  { id: 62, category: 'Objetivos & Pegadinhas', pt: 'Meu foco foi aplicar IA para resolver problemas de negócio.', en: 'My focus has been applying AI to solve business problems.' },
  { id: 63, category: 'Objetivos & Pegadinhas', pt: 'Você é mais forte em IA ou Engenharia de Software? Minha base mais forte é Software Engineering.', en: 'Are you stronger in AI or Software Engineering? My strongest foundation is Software Engineering.' },
  { id: 64, category: 'Objetivos & Pegadinhas', pt: 'A Inteligência Artificial é uma extensão natural dessa experiência.', en: 'Artificial Intelligence is a natural extension of that experience.' },
  { id: 65, category: 'Objetivos & Pegadinhas', pt: 'Por que deveríamos contratar você? Trago experiência em software, cloud, liderança e IA.', en: 'Why should we hire you? I bring experience in software engineering, cloud, leadership, and AI.' },
  { id: 66, category: 'Objetivos & Pegadinhas', pt: 'Posso contribuir desde o primeiro dia. Gosto de aprender e resolver problemas reais.', en: 'I can contribute from day one. I enjoy learning and solving real business problems.' },

  // FRASES PARA GANHAR TEMPO
  { id: 67, category: 'Frases de Apoio', pt: 'Você poderia repetir a pergunta?', en: 'Could you please repeat the question?' },
  { id: 68, category: 'Frases de Apoio', pt: 'Você poderia falar um pouco mais devagar?', en: 'Could you speak a little slower, please?' },
  { id: 69, category: 'Frases de Apoio', pt: 'Deixe-me pensar por um momento.', en: 'Let me think for a moment.' },
  { id: 70, category: 'Frases de Apoio', pt: 'Essa é uma ótima pergunta.', en: 'That\'s a great question.' },
  { id: 71, category: 'Frases de Apoio', pt: 'Com base na minha experiência...', en: 'Based on my experience...' },
  { id: 72, category: 'Frases de Apoio', pt: 'Do ponto de vista técnico...', en: 'From a technical perspective...' },
  { id: 73, category: 'Frases de Apoio', pt: 'Nos meus projetos anteriores...', en: 'In my previous projects...' }
];

const categories = ['Todos', ...new Set(interviewData.map(item => item.category))];

export default function App() {
  const [selectedGame, setSelectedGame] = useState('menu');
  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'lista' | 'progresso'
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Ajustes de Voz
  const [speechRate, setSpeechRate] = useState(0.85);
  const [speechPitch, setSpeechPitch] = useState(1.05);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [autoplayBilingual, setAutoplayBilingual] = useState(true);
  const [keepScreenOn, setKeepScreenOn] = useState(false); // Wake lock opcional
  
  // Vozes nativas
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [selectedPTVoiceURI, setSelectedPTVoiceURI] = useState('');

  // Referências de controle
  const autoplayRef = useRef(autoplay);
  const autoplayBilingualRef = useRef(autoplayBilingual);
  const isPlayingRef = useRef(isPlaying);
  const speechTimeoutRef = useRef(null);
  const wakeLockRef = useRef(null);
  const audioCtxRef = useRef(null);
  const silentNodeRef = useRef(null);
  const silentAudioElRef = useRef(null);
  const advanceAudioElRef = useRef(null);
  const advanceNodeRef = useRef(null);
  const advancedRef = useRef(false);

  // Sincronizar referências
  useEffect(() => { autoplayRef.current = autoplay; }, [autoplay]);
  useEffect(() => { autoplayBilingualRef.current = autoplayBilingual; }, [autoplayBilingual]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // Progresso de aprendizagem
  const [cardProgress, setCardProgress] = useState(() => {
    return interviewData.reduce((acc, curr) => {
      acc[curr.id] = 'novo';
      return acc;
    }, {});
  });

  const filteredData = useMemo(() => {
    if (selectedCategory === 'Todos') return interviewData;
    return interviewData.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [selectedCategory]);

  const currentCard = filteredData[currentIndex] || null;

  // Carregar vozes do dispositivo
  const loadVoices = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      if (voices.length > 0) {
        const preferredVoiceEN = voices.find(v => 
          v.lang.startsWith('en') && 
          (
            v.name.toLowerCase().includes('natural') || 
            v.name.toLowerCase().includes('premium') || 
            v.name.toLowerCase().includes('siri') || 
            v.name.toLowerCase().includes('google') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('samantha')
          )
        ) || voices.find(v => v.lang.startsWith('en'));

        if (preferredVoiceEN) {
          setSelectedVoiceURI(preferredVoiceEN.voiceURI);
        }

        const preferredVoicePT = voices.find(v => 
          v.lang.startsWith('pt-BR') || v.lang.startsWith('pt')
        );
        if (preferredVoicePT) {
          setSelectedPTVoiceURI(preferredVoicePT.voiceURI);
        }
      }
    }
  };

  const ensureAudioActive = async () => {
    try {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
    } catch (e) {
      // ignore
    }
    try {
      if (silentAudioElRef.current && silentAudioElRef.current.paused) {
        await silentAudioElRef.current.play();
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      stopSilentAudioTracker();
      releaseWakeLock();
    };
  }, []);

  // WAKE LOCK API (Evitar que a tela apague sozinha)
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        console.debug('WakeLock acquired');
        if (wakeLockRef.current && typeof wakeLockRef.current.addEventListener === 'function') {
          wakeLockRef.current.addEventListener('release', () => {
            console.debug('WakeLock released');
            if (keepScreenOn) {
              setTimeout(() => { try { requestWakeLock(); } catch(e) {} }, 500);
            }
          });
        }
      } catch (err) {
        console.warn("Wake Lock falhou:", err);
      }
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().then(() => {
        wakeLockRef.current = null;
      });
    }
  };

  useEffect(() => {
    if (keepScreenOn) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [keepScreenOn]);

  // TRUQUE DO ÁUDIO SILENCIOSO (Web Audio API) para manter a thread ativa no background / tela apagada
  const startSilentAudioTracker = async () => {
    try {
      console.debug('startSilentAudioTracker invoked');
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        console.debug('AudioContext created');
      }
      console.debug('AudioContext state before resume:', audioCtxRef.current.state);
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
        console.debug('AudioContext resumed');
      }
      if (silentNodeRef.current) {
        console.debug('silentNode already running');
        return;
      }
      
      const ctx = audioCtxRef.current;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);

      let source;
      if ('ConstantSourceNode' in window) {
        source = ctx.createConstantSource();
        source.offset.value = 0;
        source.connect(gain);
        source.start();
        console.debug('ConstantSourceNode started');
      } else {
        const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i += 1) {
          data[i] = (Math.random() * 2 - 1) * 1e-6;
        }
        source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(gain);
        source.start();
        console.debug('BufferSource silent tracker started');
      }
      silentNodeRef.current = source;
      // Fallback: cria um elemento <audio> com WAV silencioso em loop.
      if (!silentAudioElRef.current) {
        try {
          const silentWav = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';
          const a = new Audio(silentWav);
          a.loop = true;
          a.volume = 0;
          a.play().then(() => {
            silentAudioElRef.current = a;
          }).catch((err) => {
            console.warn('Não foi possível tocar áudio silencioso:', err);
          });
        } catch (e) {
          console.warn('Erro ao criar elemento de áudio silencioso:', e);
        }
      }
    } catch (e) {
      console.warn("Navegador impediu execução de áudio silencioso:", e);
    }
  };

  const stopSilentAudioTracker = () => {
    if (silentNodeRef.current) {
      try {
        console.debug('Stopping silentNode');
        silentNodeRef.current.stop();
      } catch (e) { console.warn('Error stopping silentNode', e); }
      silentNodeRef.current = null;
    }
    if (silentAudioElRef.current) {
      try {
        console.debug('Stopping silentAudioEl');
        silentAudioElRef.current.pause();
        silentAudioElRef.current.src = '';
      } catch (e) {}
      silentAudioElRef.current = null;
    }
    // também cancela qualquer agendamento pendente
    try { stopScheduledAdvance(); } catch (e) {}
  };

  const stopAdvanceAudio = () => {
    if (advanceAudioElRef.current) {
      try {
        console.debug('Stopping advanceAudioEl');
        advanceAudioElRef.current.pause();
        URL.revokeObjectURL(advanceAudioElRef.current.src);
      } catch (e) {}
      advanceAudioElRef.current = null;
    }
  };

  const createSilentWavBlob = (seconds) => {
    const sampleRate = 22050;
    const channels = 1;
    const bytesPerSample = 2;
    const blockAlign = channels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const length = Math.max(1, Math.floor(seconds * sampleRate));
    const dataSize = length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i += 1) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    const frequency = 440;
    const amplitude = 0.02;
    for (let i = 0; i < length; i += 1) {
      const sample = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * amplitude;
      const intSample = Math.max(-32768, Math.min(32767, Math.round(sample * 32767)));
      view.setInt16(44 + i * bytesPerSample, intSample, true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  };

  // Scheduler de avanço usando AudioBufferSource (funciona mesmo quando timers são suspensos)
  const stopScheduledAdvance = () => {
    if (advanceNodeRef.current) {
      try { advanceNodeRef.current.stop(); } catch (e) {}
      advanceNodeRef.current = null;
    }
  };

  const estimateSpeechDuration = (text, lang, rate) => {
    const words = (text || '').split(/\s+/).filter(Boolean).length || 1;
    // estimativa: 2.5 palavras por segundo base, ajustada pela taxa
    const baseWps = 2.5;
    const adjRate = (rate && typeof rate === 'number') ? rate : (lang.startsWith('en') ? speechRate : 0.95);
    const seconds = words / (baseWps * (adjRate || 1));
    return Math.max(0.6, seconds);
  };

  const scheduleAdvance = async (seconds, callback = null) => {
    try {
      console.debug('scheduleAdvance requested, seconds=', seconds);
      stopAdvanceAudio();
      stopScheduledAdvance();
      advancedRef.current = false;

      if (typeof seconds !== 'number' || seconds <= 0) {
        seconds = 1;
      }

      // Primeiro tenta usar a rota via HTMLAudio para tornar o agendamento mais robusto
      try {
        const silentBlob = createSilentWavBlob(seconds);
        const url = URL.createObjectURL(silentBlob);
        console.debug('scheduleAdvance using HTMLAudio fallback, url=', url);
        const audio = new Audio(url);
        audio.volume = 0.02;
        audio.preload = 'auto';

        audio.onplay = () => {
          console.debug('advanceAudio onplay');
        };

        audio.onerror = (event) => {
          console.warn('advanceAudio onerror', event);
          advanceAudioElRef.current = null;
          URL.revokeObjectURL(url);
        };

        audio.onended = () => {
          console.debug('advanceAudio onended');
          advanceAudioElRef.current = null;
          URL.revokeObjectURL(url);
          if (!advancedRef.current && autoplayRef.current) {
            advancedRef.current = true;
            try {
              if (typeof callback === 'function') {
                callback();
              } else {
                handleNext();
              }
            } catch (e) {
              console.warn('Falha no callback de avanço:', e);
            }
          }
        };

        advanceAudioElRef.current = audio;
        audio.play().then(() => {
          console.debug('advanceAudio play started');
        }).catch((e) => {
          console.warn('Falha ao tocar áudio de avanço:', e);
          stopAdvanceAudio();
        });
        return;
      } catch (audioError) {
        console.warn('Fallback de áudio silencioso falhou:', audioError);
      }

      if (!audioCtxRef.current) {
        await startSilentAudioTracker();
      } else if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
      if (!audioCtxRef.current) return;

      const ctx = audioCtxRef.current;
      const sampleRate = ctx.sampleRate || 44100;
      const length = Math.ceil(sampleRate * seconds);
      const buffer = ctx.createBuffer(1, length, sampleRate);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = false;

      const gain = ctx.createGain();
      gain.gain.value = 0;
      src.connect(gain);
      gain.connect(ctx.destination);

      src.onended = () => {
        advanceNodeRef.current = null;
        if (!advancedRef.current && autoplayRef.current) {
          advancedRef.current = true;
          try {
            if (typeof callback === 'function') {
              callback();
            } else {
              handleNext();
            }
          } catch (e) {
            console.warn('Falha no callback de avanço:', e);
          }
        }
      };

      advanceNodeRef.current = src;
      try { src.start(); } catch (e) { console.warn('Falha ao iniciar advance node:', e); }
    } catch (e) {
      console.warn('Erro ao agendar avanço:', e);
    }
  };

  // MEDIA SESSION API (Controladores e Informações na Tela de Bloqueio do Telemóvel/Celular)
  const updateLockScreenMetadata = (card, mode) => {
    if ('mediaSession' in navigator && card) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: mode === 'pt' ? `Mentalize: ${card.pt}` : `English: ${card.en}`,
        artist: 'Jonathan Bach — Prep Entrevista',
        album: card.category,
        artwork: [
          { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512', sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      // Permite usar botões do fone/carro/tela bloqueada para avançar ou voltar
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        handleNext();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        handlePrev();
      });
    }
  };

  // Avançar e Voltar
  const handleNext = () => {
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    advancedRef.current = true;
    try { stopScheduledAdvance(); } catch (e) {}
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % filteredData.length);
  };

  const handlePrev = () => {
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    advancedRef.current = true;
    try { stopScheduledAdvance(); } catch (e) {}
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + filteredData.length) % filteredData.length);
  };

  // Função de síntese de voz (TTS)

  // Reseta estado do agendador ao trocar de card
  useEffect(() => {
    advancedRef.current = false;
    try { stopScheduledAdvance(); } catch (e) {}
  }, [currentIndex]);
  const speakText = (text, lang = 'en-US', onDoneCallback = null) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel(); // Evita sobreposição
    // Tenta garantir que o AudioContext / tracker esteja ativo antes de falar
    try { ensureAudioActive(); } catch(e) {}

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    if (lang.startsWith('en')) {
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      const selectedVoice = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
      if (selectedVoice) utterance.voice = selectedVoice;
      
      // Atualiza metadados na tela de bloqueio
      if (currentCard) updateLockScreenMetadata(currentCard, 'en');
    } else {
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      const selectedPTVoice = availableVoices.find(v => v.voiceURI === selectedPTVoiceURI);
      if (selectedPTVoice) utterance.voice = selectedPTVoice;

      if (currentCard) updateLockScreenMetadata(currentCard, 'pt');
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      console.debug('utterance.onstart', { lang });
      // Notifica o SO que a reprodução iniciou para manter vivo o background
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
      try { startSilentAudioTracker(); } catch (e) { console.warn('startSilentAudioTracker error', e); }
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      console.debug('utterance.onend', { lang });
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
      // Não para o tracker de keepalive aqui; ele permanece até o autoplay ser desativado.
      if (onDoneCallback && !advancedRef.current) {
        onDoneCallback();
      }
      if (autoplayRef.current && lang.startsWith('en') && !advancedRef.current) {
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = setTimeout(() => {
          if (autoplayRef.current && !advancedRef.current) {
            advancedRef.current = true;
            handleNext();
          }
        }, 1800);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      console.warn('utterance.onerror');
      stopScheduledAdvance();
      advancedRef.current = true;
    };

    window.speechSynthesis.speak(utterance);
   };

    // Reage a mudanças de visibilidade para tentar reativar o tracker/wake lock
    useEffect(() => {
      const onVisibilityChange = () => {
        console.debug('visibilitychange', document.visibilityState);
        if (document.visibilityState === 'visible') {
          if (keepScreenOn) requestWakeLock();
          try { ensureAudioActive(); } catch (e) { console.warn('ensureAudioActive error', e); }
        }
      };

      document.addEventListener('visibilitychange', onVisibilityChange);
      return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    }, [keepScreenOn]);


  // CONTROLES DO AUTOPLAY BILINGUE
  useEffect(() => {
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    stopScheduledAdvance();
    advancedRef.current = false;

    if (autoplay && currentCard) {
      // Mantém o keepalive de áudio rodando enquanto o autoplay estiver ativo
      startSilentAudioTracker();

      if (!isFlipped) {
        if (autoplayBilingualRef.current) {
          // BILÍNGUE: Fala Português e agenda virar o card após o tempo estimado + margem
          const seconds = estimateSpeechDuration(currentCard.pt, 'pt-BR', 0.95) + 2.0;
          speakText(currentCard.pt, 'pt-BR', () => {
            if (!advancedRef.current && autoplayRef.current) {
              advancedRef.current = true;
              setIsFlipped(true);
            }
          });
          scheduleAdvance(seconds, () => {
            if (!advancedRef.current && autoplayRef.current) {
              advancedRef.current = true;
              setIsFlipped(true);
            }
          });
        } else {
          // INGLÊS EXCLUSIVO: vira o card imediatamente e deixa o effect falar EN em seguida
          advancedRef.current = true;
          setIsFlipped(true);
        }
      } else {
        // Lê Inglês e agenda avançar para o próximo card
        const seconds = estimateSpeechDuration(currentCard.en, 'en-US', speechRate) + 1.8;
        speakText(currentCard.en, 'en-US');
        scheduleAdvance(seconds, () => {
          if (!advancedRef.current && autoplayRef.current) {
            advancedRef.current = true;
            handleNext();
          }
        });
      }
    }

    return () => {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      stopScheduledAdvance();
    };
  }, [currentIndex, isFlipped, autoplay, autoplayBilingual]);

  // Limpa trackers de áudio quando o Autoplay é desativado
  useEffect(() => {
    if (!autoplay) {
      stopSilentAudioTracker();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    }
  }, [autoplay]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab !== 'flashcards') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      } else if (e.code === 'KeyS' || e.code === 'KeyV') {
        if (currentCard) {
          speakText(isFlipped ? currentCard.en : currentCard.pt, isFlipped ? 'en-US' : 'pt-BR');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, filteredData, activeTab, speechRate, speechPitch, selectedVoiceURI, availableVoices, selectedPTVoiceURI]);

  // Atualizar progresso de auto-avaliação
  const updateStatus = (id, status) => {
    setCardProgress(prev => ({ ...prev, [id]: status }));
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  // Painel de Estatísticas
  const stats = useMemo(() => {
    const total = interviewData.length;
    const dominados = Object.values(cardProgress).filter(s => s === 'dominado').length;
    const revisar = Object.values(cardProgress).filter(s => s === 'revisar').length;
    const novos = Object.values(cardProgress).filter(s => s === 'novo').length;
    
    return {
      total,
      dominados,
      revisar,
      novos,
      percent: Math.round((dominados / total) * 100)
    };
  }, [cardProgress]);

  const englishVoices = useMemo(() => availableVoices.filter(v => v.lang.startsWith('en')), [availableVoices]);
  const portugueseVoices = useMemo(() => availableVoices.filter(v => v.lang.startsWith('pt')), [availableVoices]);

  // In-app logging (captura do console para diagnóstico sem Safari Inspector)
  const logsRef = useRef([]);
  const [showLogs, setShowLogs] = useState(false);

  const pushLog = (level, ...args) => {
    const text = args.map(a => {
      try { return typeof a === 'string' ? a : JSON.stringify(a); } catch (e) { return String(a); }
    }).join(' ');
    const entry = { ts: new Date().toISOString(), level, text };
    logsRef.current.push(entry);
    try { localStorage.setItem('fc_logs', JSON.stringify(logsRef.current.slice(-2000))); } catch (e) {}
  };

  useEffect(() => {
    try {
      const prev = JSON.parse(localStorage.getItem('fc_logs') || '[]');
      if (Array.isArray(prev) && prev.length) logsRef.current = prev;
    } catch (e) {}

    const orig = { log: console.log, debug: console.debug, warn: console.warn, error: console.error };
    console.log = (...a) => { pushLog('log', ...a); orig.log.apply(console, a); };
    console.debug = (...a) => { pushLog('debug', ...a); orig.debug.apply(console, a); };
    console.warn = (...a) => { pushLog('warn', ...a); orig.warn.apply(console, a); };
    console.error = (...a) => { pushLog('error', ...a); orig.error.apply(console, a); };

    return () => {
      console.log = orig.log; console.debug = orig.debug; console.warn = orig.warn; console.error = orig.error;
    };
  }, []);

  const exportLogs = () => {
    try {
      const text = logsRef.current.map(e => `${e.ts} [${e.level}] ${e.text}`).join('\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'flashcard-logs.txt'; document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { console.warn('Falha ao exportar logs', e); }
  };

  const clearLogs = () => { logsRef.current = []; try { localStorage.removeItem('fc_logs'); } catch (e) {} };

  if (selectedGame === 'menu') {
    return <MainMenu onSelectGame={setSelectedGame} />;
  }

  if (selectedGame === 'dino') {
    return <DinoCodeLabGame onBack={() => setSelectedGame('menu')} />;
  }

  if (selectedGame === 'binary') {
    return <BinaryLampGame onBack={() => setSelectedGame('menu')} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-4 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Tech Interview Prep <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">Jonathan Bach</span>
              </h1>
              <p className="text-xs text-slate-400">Treine suas respostas em inglês para engenharia de software e IA</p>
            </div>
          </div>

          {/* Navegação Principal */}
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'flashcards' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🚀 Flashcards
            </button>
            <button
              onClick={() => setActiveTab('lista')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'lista' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📖 Lista Completa
            </button>
            <button
              onClick={() => setActiveTab('progresso')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'progresso' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Progresso ({stats.percent}%)
            </button>
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-grow max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        
        {/* CONFIGURAÇÃO EXTRA DE VOZ SUAVE E IDIOMAS */}
        {activeTab === 'flashcards' && (
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 grid grid-cols-1 md:grid-cols-3 gap-4 items-center animate-fade-in">
            
            {/* Escolha da Voz em Inglês */}
            <div className="flex flex-col gap-1.5 col-span-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                🇺🇸 Voz para Inglês (EN):
              </label>
              {englishVoices.length > 0 ? (
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-250 outline-none focus:border-blue-500 w-full"
                >
                  {englishVoices.map(voice => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-[10px] text-rose-400">Nenhuma voz EN encontrada.</div>
              )}
            </div>

            {/* Escolha da Voz em Português */}
            <div className="flex flex-col gap-1.5 col-span-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                🇧🇷 Voz para Português (PT):
              </label>
              {portugueseVoices.length > 0 ? (
                <select
                  value={selectedPTVoiceURI}
                  onChange={(e) => setSelectedPTVoiceURI(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-250 outline-none focus:border-blue-500 w-full"
                >
                  {portugueseVoices.map(voice => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-[10px] text-rose-400">Nenhuma voz PT encontrada.</div>
              )}
            </div>

            {/* Ajuste do Tom (Pitch) */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>🍃 Tom da Voz EN (Pitch):</span>
                <span className="text-emerald-400 font-mono text-[11px]">{speechPitch < 1 ? 'Grave' : speechPitch > 1 ? 'Suave' : 'Padrão'} ({speechPitch}x)</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-500">Grave</span>
                <input
                  type="range"
                  min="0.7"
                  max="1.4"
                  step="0.05"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="flex-grow h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Suave</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 1: FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="flex flex-col gap-6 flex-grow justify-center">
            
            {/* Barra de Seleção de Categoria e Ajustes Rápidos */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none font-sans">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                      selectedCategory === cat 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Controles de Autoplay e Persistência */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-700/60">
                
                {/* Botão de Manter Tela Ligada */}
                <button
                  onClick={() => setKeepScreenOn(!keepScreenOn)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    keepScreenOn
                      ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Evita que o telemóvel desligue a tela automaticamente"
                >
                  💡 {keepScreenOn ? 'Tela: Sempre Ligada' : 'Tela: Padrão'}
                </button>

                {/* Ativador do modo Ouvinte (Autoplay) */}
                <div className="flex items-center gap-2 bg-slate-850 p-1 rounded-xl border border-slate-700/60">
                  <button
                    onClick={() => setAutoplay(!autoplay)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      autoplay 
                        ? 'bg-emerald-500/20 text-emerald-400 shadow' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${autoplay ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                    Autoplay
                  </button>

                  {/* Configuração Bilíngue */}
                  {autoplay && (
                    <button
                      onClick={() => setAutoplayBilingual(!autoplayBilingual)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                        autoplayBilingual 
                          ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' 
                          : 'bg-slate-800 border-transparent text-slate-400'
                      }`}
                      title="Lê português antes e depois inglês"
                    >
                      {autoplayBilingual ? '🇧🇷 PT ➔ 🇺🇸 EN' : '🇺🇸 Só EN'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Alerta de segundo plano útil */}
            {autoplay && (
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] rounded-xl px-4 py-2.5 flex items-center gap-2 animate-pulse">
                <span>🎧</span>
                <span>
                  <strong>Modo Ouvinte Ativo:</strong> Você pode desligar a tela ou colocar o telemóvel no bolso. O áudio e a transição de frases continuarão em segundo plano de forma automática!
                </span>
              </div>
            )}

            {/* Contador e Categoria */}
            {currentCard && (
              <div className="flex justify-between items-center px-2 text-sm text-slate-400">
                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-medium border border-slate-700">
                  {currentCard.category}
                </span>
                <span className="font-mono">
                  {currentIndex + 1} / {filteredData.length}
                </span>
              </div>
            )}

            {/* FLASHCARD (Efeito Flip 3D) */}
            {currentCard ? (
              <div className="w-full flex justify-center py-2">
                <div 
                  className="w-full max-w-2xl h-80 cursor-pointer group"
                  style={{ perspective: '1000px' }}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div 
                    className={`relative w-full h-full text-center transition-transform duration-550 transform-style-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    
                    {/* Lado da Frente (Português) */}
                    <div className="absolute w-full h-full backface-hidden rounded-3xl bg-slate-800 border-2 border-slate-700 p-8 flex flex-col justify-between shadow-2xl hover:border-blue-500/50 transition-all">
                      <div className="flex justify-between items-start">
                        <span className="text-xs tracking-wider uppercase text-blue-400 font-bold">Mentalize a Resposta em Inglês</span>
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">PT-BR</span>
                      </div>
                      
                      <div className="flex-grow flex flex-col items-center justify-center py-4">
                        <p className="text-lg sm:text-2xl font-medium text-slate-100 leading-relaxed max-w-lg">
                          "{currentCard.pt}"
                        </p>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(currentCard.pt, 'pt-BR');
                          }}
                          className="flex items-center gap-1.5 mt-4 bg-slate-700 hover:bg-slate-650 text-slate-200 text-xs font-bold px-4 py-2 rounded-full border border-slate-600 transition-all"
                        >
                          🔊 LER EM PORTUGUÊS
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-700/40">
                        <span className="text-xs text-slate-500">Mapeado na categoria: {currentCard.category}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1.5">
                          <span>Revelar resposta</span>
                          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Lado de Trás (Inglês) */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-slate-800 border-2 border-slate-700 p-8 flex flex-col justify-between shadow-2xl hover:border-emerald-500/50 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-xs tracking-wider uppercase text-emerald-400 font-bold">Resposta Correta</span>
                          {isPlaying && (
                            <div className="flex gap-1 items-center h-4">
                              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                              <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">EN-US</span>
                      </div>

                      <div className="flex-grow flex flex-col items-center justify-center py-4 gap-4">
                        <p className="text-xl sm:text-2xl font-semibold text-emerald-400 leading-relaxed max-w-lg">
                          "{currentCard.en}"
                        </p>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(currentCard.en, 'en-US');
                          }}
                          className="flex items-center gap-2 bg-emerald-500 text-slate-900 font-bold px-6 py-2.5 rounded-full hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-sm animate-pulse"
                          title="Ler em voz alta"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                          OUVIR EM VOZ ALTA (EN)
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-700/40">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped(false);
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          ← Voltar para pergunta
                        </button>
                        {autoplay && (
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            {autoplayBilingual ? 'Modo Bilíngue Ativo' : 'Reprodução Automática'}
                          </span>
                        )}
                        {!autoplay && <span className="text-xs text-slate-400">Atalho: Pressione Espaço</span>}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">Nenhum card encontrado nessa categoria.</p>
              </div>
            )}

            {/* CONTROLES DE DECISÃO E NAVEGAÇÃO */}
            {currentCard && (
              <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
                
                {/* Auto-avaliação */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    onClick={() => updateStatus(currentCard.id, 'revisar')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      cardProgress[currentCard.id] === 'revisar'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-rose-500/50'
                    }`}
                  >
                    <span className="text-xl">🔴</span>
                    <span className="text-xs font-semibold mt-1">Revisar</span>
                  </button>

                  <button
                    onClick={() => updateStatus(currentCard.id, 'novo')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      cardProgress[currentCard.id] === 'novo'
                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-yellow-500/50'
                    }`}
                  >
                    <span className="text-xl">🟡</span>
                    <span className="text-xs font-semibold mt-1">Neutro</span>
                  </button>

                  <button
                    onClick={() => updateStatus(currentCard.id, 'dominado')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      cardProgress[currentCard.id] === 'dominado'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-emerald-500/50'
                    }`}
                  >
                    <span className="text-xl">🟢</span>
                    <span className="text-xs font-semibold mt-1">Dominado!</span>
                  </button>
                </div>

                {/* Navegação Manual */}
                <div className="flex justify-between items-center mt-2 px-1">
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold border border-slate-700 transition-all active:scale-95"
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/10 transition-all active:scale-95"
                  >
                    Avançar →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: LISTA COMPLETA */}
        {activeTab === 'lista' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">Todas as Frases do Roteiro</h2>
                <p className="text-xs text-slate-400">Excelente para revisar de ponta a ponta e ouvir no modo contínuo.</p>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden divide-y divide-slate-800/80">
              {filteredData.map((item, index) => (
                <div 
                  key={item.id} 
                  className="p-4 sm:p-5 hover:bg-slate-800/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
                >
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">#{index+1}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-300">
                      PT: {item.pt}
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-emerald-400">
                      EN: {item.en}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => speakText(item.pt, 'pt-BR')}
                      className="p-2 rounded-lg bg-slate-700/65 hover:bg-slate-650 text-slate-200 transition-all flex items-center gap-1 text-xs"
                      title="Ouvir em português"
                    >
                      <span>🇧🇷</span>
                      <span className="hidden sm:inline">PT</span>
                    </button>

                    <button
                      onClick={() => speakText(item.en, 'en-US')}
                      className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 transition-all flex items-center gap-1 text-xs font-bold"
                      title="Ouvir em inglês"
                    >
                      <span>🇺🇸</span>
                      <span className="hidden sm:inline">EN</span>
                    </button>
                    
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => updateStatus(item.id, 'revisar')}
                        className={`w-6 h-6 rounded-md text-xs flex items-center justify-center border transition-all ${
                          cardProgress[item.id] === 'revisar' ? 'bg-rose-500/20 border-rose-500' : 'bg-slate-800 border-slate-700 hover:border-rose-500'
                        }`}
                        title="Revisar"
                      >
                        🔴
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, 'dominado')}
                        className={`w-6 h-6 rounded-md text-xs flex items-center justify-center border transition-all ${
                          cardProgress[item.id] === 'dominado' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-800 border-slate-700 hover:border-emerald-500'
                        }`}
                        title="Fácil"
                      >
                        🟢
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: PROGRESSO */}
        {activeTab === 'progresso' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white">Seu progresso na preparação</h2>
                <p className="text-sm text-slate-400">
                  Pratique diariamente para atingir 100% de confiança em todos os tópicos da entrevista.
                </p>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Confiança geral:</span>
                    <span className="text-emerald-400">{stats.percent}% de domínio</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3.5 overflow-hidden border border-slate-600">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 shrink-0">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 text-center flex flex-col justify-center min-w-[90px]">
                  <span className="text-2xl font-bold text-emerald-400">{stats.dominados}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Dominados</span>
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 text-center flex flex-col justify-center min-w-[90px]">
                  <span className="text-2xl font-bold text-rose-400">{stats.revisar}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">A Revisar</span>
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 text-center flex flex-col justify-center min-w-[90px]">
                  <span className="text-2xl font-bold text-slate-300">{stats.novos}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Não vistos</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">Progresso por Categoria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.filter(c => c !== 'Todos').map(cat => {
                  const catItems = interviewData.filter(i => i.category === cat);
                  const dominadosCat = catItems.filter(i => cardProgress[i.id] === 'dominado').length;
                  const percentCat = Math.round((dominadosCat / catItems.length) * 100);

                  return (
                    <div key={cat} className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-200">{cat}</span>
                        <span className="text-xs text-slate-400">{dominadosCat} / {catItems.length}</span>
                      </div>
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full transition-all"
                          style={{ width: `${percentCat}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="py-6 border-t border-slate-800/60 bg-slate-900 text-center text-xs text-slate-500 px-4">
        <p className="max-w-md mx-auto">
          Pratique as respostas, domine os jargões corporativos de tecnologia e sinta-se confiante para responder a perguntas difíceis. Boa sorte, Jonathan!
        </p>
      </footer>

      {/* Painel de logs in-app (útil para capturar eventos após bloquear a tela) */}
      <div className="fixed z-50 right-4 bottom-4 text-sm">
        <div className="flex flex-col items-end">
          <button
            onClick={() => setShowLogs(s => !s)}
            className="bg-slate-800/80 text-slate-200 px-3 py-2 rounded-lg border border-slate-700/60 shadow-lg"
          >
            {showLogs ? 'Fechar Logs' : 'Ver Logs'}
          </button>

          {showLogs && (
            <div className="mt-2 w-96 max-h-72 bg-black/90 text-white p-2 rounded-lg border border-slate-700/60 overflow-auto">
              <div className="flex gap-2 items-center mb-2">
                <button onClick={exportLogs} className="bg-emerald-500 text-slate-900 px-2 py-1 rounded text-xs">Exportar</button>
                <button onClick={() => { try { navigator.clipboard.writeText(logsRef.current.map(e => `${e.ts} [${e.level}] ${e.text}`).join('\n')); } catch(e){ console.warn('copy failed', e); } }} className="bg-slate-700 px-2 py-1 rounded text-xs">Copiar</button>
                <button onClick={() => { clearLogs(); }} className="bg-rose-500 px-2 py-1 rounded text-xs">Limpar</button>
              </div>
              <pre className="text-[11px] whitespace-pre-wrap">{logsRef.current.slice(-1000).map(e => `${e.ts} [${e.level}] ${e.text}`).join('\n')}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

