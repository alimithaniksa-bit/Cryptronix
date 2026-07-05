import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Zap, Cpu, Lock, Coins, Volume2, TrendingUp, Sparkles } from 'lucide-react';
import { CoinTicker } from '../types';
import CryptronixLogo from './CryptronixLogo';

interface LandingPageProps {
  onEnterSystem: () => void;
  coins: CoinTicker[];
}

export default function LandingPage({ onEnterSystem, coins }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-immersive-bg text-immersive-primary overflow-hidden relative font-sans flex flex-col justify-between selection:bg-immersive-gold/30 selection:text-immersive-gold">
      
      {/* Ambient Grid Backdrop */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Radiant Glowing Elements in Space */}
      <div className="absolute top-[20%] left-[10%] w-[450px] h-[450px] bg-immersive-gold/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-immersive-green/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-immersive-gold/5 rounded-full blur-[220px] pointer-events-none" />

      {/* Futuristic Header */}
      <header className="relative z-10 w-full border-b border-immersive-border bg-immersive-header/80 backdrop-blur-md px-6 py-4 shrink-0 shadow-[0_4px_30px_rgba(3,7,18,0.4)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Dynamic Logo Monogram */}
            <CryptronixLogo size={42} className="animate-[pulse_3s_ease-in-out_infinite]" />
            <div>
              <h1 className="text-white font-mono font-black text-base sm:text-lg tracking-wider text-glow-blue">CRYPTRONIX</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-immersive-gold animate-ping"></span>
                <span className="text-[8px] text-immersive-gold font-mono uppercase tracking-widest font-bold">V4.2 Neon Core</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-[11px] font-mono font-semibold tracking-wider text-immersive-muted">
              <span className="hover:text-immersive-gold transition-colors cursor-pointer">// COGNITIVE CORE</span>
              <span className="hover:text-immersive-gold transition-colors cursor-pointer">// NEURAL SCANNER</span>
              <span className="hover:text-immersive-gold transition-colors cursor-pointer">// QUANT MATRIX</span>
            </div>
            <button
              onClick={onEnterSystem}
              className="bg-immersive-gold hover:bg-[#80eaff] text-immersive-bg font-mono font-black text-xs py-2 px-5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.45)] hover:shadow-[0_0_25px_rgba(128,234,255,0.65)] transition-all cursor-pointer glow-blue"
            >
              LAUNCH APP
            </button>
          </div>
        </div>
      </header>

      {/* Floating 3D Coin Badges in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {/* Floating Bitcoin Logo */}
        <motion.div 
          animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] left-[6%] bg-immersive-card/60 border border-immersive-gold/30 p-2.5 rounded-2xl flex items-center gap-2 backdrop-blur-md shadow-lg glow-blue"
        >
          <div className="w-7 h-7 bg-immersive-gold/10 text-immersive-gold rounded-xl flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
          <div className="font-mono text-[9px]">
            <span className="block text-white font-bold leading-none">BTCUSDT</span>
            <span className="text-immersive-gold font-bold leading-none text-[8px] mt-0.5 block">QUANT LIVE</span>
          </div>
        </motion.div>

        {/* Floating Ethereum Logo */}
        <motion.div 
          animate={{ y: [0, 22, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[28%] left-[10%] bg-immersive-card/60 border border-immersive-green/30 p-2.5 rounded-2xl flex items-center gap-2 backdrop-blur-md shadow-lg glow-green"
        >
          <div className="w-7 h-7 bg-immersive-green/10 text-immersive-green rounded-xl flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="font-mono text-[9px]">
            <span className="block text-white font-bold leading-none">ETHUSDT</span>
            <span className="text-immersive-green font-bold leading-none text-[8px] mt-0.5 block">92.2% ACCURACY</span>
          </div>
        </motion.div>

        {/* Floating AI neural node Badge */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[43%] bg-immersive-card/60 border border-immersive-gold/30 p-2.5 rounded-2xl flex items-center gap-2 backdrop-blur-md shadow-lg glow-blue"
        >
          <div className="w-7 h-7 bg-immersive-gold/15 text-immersive-gold rounded-xl flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="font-mono text-[9px]">
            <span className="block text-white font-bold leading-none">AI CORE</span>
            <span className="text-immersive-muted font-bold leading-none text-[8px] mt-0.5 block">&lt; 14ms DELTA</span>
          </div>
        </motion.div>
      </div>

      {/* Main Hero Stage */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        
        {/* Left Side: Copywriting & High-Value Propositions */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-immersive-gold/10 border border-immersive-gold/30 px-3 py-1.5 rounded-xl text-immersive-gold text-[10px] font-mono font-bold uppercase tracking-wider glow-blue">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            Audited 90%+ Target Accuracy Neural System
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight leading-none text-white">
              Institutional <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-immersive-gold via-[#80eaff] to-blue-500 text-glow-blue">
                Predictive Trading
              </span>
            </h1>
            <p className="text-immersive-muted font-sans text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
              Cryptronix harnesses advanced multi-factor order-flow vectors and neural quantitative risk matrices. Scan the live markets, detect hidden liquidity blocks, and execute with absolute precision.
            </p>
          </div>

          {/* Interactive Start CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onEnterSystem}
              className="group relative bg-gradient-to-r from-immersive-gold to-[#00aaff] hover:brightness-110 text-immersive-bg font-mono font-black py-4 px-8 rounded-2xl text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center gap-2 glow-blue"
            >
              INITIALIZE QUANT SYSTEM
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button
              onClick={onEnterSystem}
              className="text-[11px] font-mono font-bold uppercase tracking-widest text-immersive-muted hover:text-white transition-colors px-4 py-3 border border-immersive-border hover:border-immersive-muted/40 rounded-2xl cursor-pointer bg-immersive-inner/15"
            >
              Demo Scanner
            </button>
          </div>

          {/* Micro Telemetry list */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-immersive-border max-w-md mx-auto lg:mx-0">
            <div>
              <span className="block text-white font-mono font-black text-xl sm:text-2xl text-glow-blue">92.2%</span>
              <span className="text-[9px] font-mono text-immersive-muted uppercase font-bold mt-0.5 block tracking-wider">Audited Win-Rate</span>
            </div>
            <div>
              <span className="block text-white font-mono font-black text-xl sm:text-2xl text-glow-green">&lt; 14ms</span>
              <span className="text-[9px] font-mono text-immersive-muted uppercase font-bold mt-0.5 block tracking-wider">Market Ingress</span>
            </div>
            <div>
              <span className="block text-white font-mono font-black text-xl sm:text-2xl">24/7</span>
              <span className="text-[9px] font-mono text-immersive-muted uppercase font-bold mt-0.5 block tracking-wider">Core Operations</span>
            </div>
          </div>
        </div>

        {/* Right Side: 3D Immersive Mockup with Interactive Springs */}
        <div className="lg:col-span-7 flex items-center justify-center relative select-none">
          
          {/* Subtle light pulse beneath the 3D card */}
          <div className="absolute w-[80%] h-[60%] bg-immersive-gold/5 rounded-full blur-[90px] animate-pulse pointer-events-none" />

          {/* Main 3D Preserved Perspective Stage */}
          <div className="relative w-full max-w-xl aspect-[16/10] [perspective:1200px]">
            <motion.div
              whileHover={{ rotateY: -10, rotateX: 6, scale: 1.02 }}
              style={{ 
                transform: "rotateY(-18deg) rotateX(12deg) rotateZ(-3deg)", 
                transformStyle: "preserve-3d" 
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="w-full h-full bg-[#08112d]/80 border border-white/10 rounded-2xl p-2 sm:p-3 shadow-[0_50px_80px_rgba(0,0,0,0.85),0_0_35px_rgba(0,240,255,0.2)] relative backdrop-blur-xl group"
            >
              {/* Floating glossy glass frame overlay */}
              <div className="absolute inset-0 rounded-2xl border border-white/5 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20" />
              
              {/* Header inside mockup */}
              <div className="h-6 flex items-center justify-between px-2.5 border-b border-white/5 mb-2 text-[8px] font-mono text-immersive-muted">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-immersive-red"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-immersive-gold"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-immersive-green"></span>
                  <span className="ml-2">cryptronix_neural_v4.app</span>
                </div>
                <div>SECURE TERMINAL ACTIVE</div>
              </div>

              {/* Mockup image element */}
              <div className="w-full h-[calc(100%-1.5rem)] rounded-xl overflow-hidden border border-white/5 relative">
                <img 
                  src="/src/assets/images/cryptronix_mockup_1783241069676.jpg" 
                  alt="Cryptronix Futuristic 3D Trading Console Mockup" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Multi-layered depth indicator panel behind mockup */}
              <div 
                className="absolute -inset-4 bg-immersive-gold/5 border border-immersive-gold/10 rounded-2xl -z-10 pointer-events-none opacity-60 glow-blue" 
                style={{ transform: "translateZ(-25px)" }}
              />
              <div 
                className="absolute -inset-8 bg-immersive-green/5 border border-white/5 rounded-2xl -z-20 pointer-events-none opacity-30" 
                style={{ transform: "translateZ(-50px)" }}
              />
            </motion.div>
          </div>
        </div>

      </main>

      {/* Grid Features Section */}
      <section className="relative z-10 w-full border-t border-immersive-border bg-immersive-inner/25 py-8 px-6 shrink-0 shadow-[0_-4px_30px_rgba(3,7,18,0.2)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="flex items-start gap-3.5 p-4 rounded-xl hover:bg-immersive-card/50 transition-colors border border-transparent hover:border-immersive-border/50">
            <div className="w-10 h-10 bg-immersive-gold/10 rounded-xl flex items-center justify-center text-immersive-gold shrink-0 border border-immersive-gold/20 glow-blue">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-mono font-bold text-xs uppercase tracking-wider text-glow-blue">Neural Risk Shield</h3>
              <p className="text-[11px] text-immersive-muted font-mono leading-relaxed mt-1">
                Advanced risk matrix calculating optimal exposure thresholds dynamically with automated Stop-Loss guardrails.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl hover:bg-immersive-card/50 transition-colors border border-transparent hover:border-immersive-border/50">
            <div className="w-10 h-10 bg-immersive-green/10 rounded-xl flex items-center justify-center text-immersive-green shrink-0 border border-immersive-green/20 glow-green">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-mono font-bold text-xs uppercase tracking-wider text-glow-green">Ultra Low-Latency</h3>
              <p className="text-[11px] text-immersive-muted font-mono leading-relaxed mt-1">
                Sub-14ms market tick ingestion providing real-time data sync with public trade volumes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl hover:bg-immersive-card/50 transition-colors border border-transparent hover:border-immersive-border/50">
            <div className="w-10 h-10 bg-immersive-gold/15 rounded-xl flex items-center justify-center text-immersive-gold shrink-0 border border-immersive-gold/20 glow-blue">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-mono font-bold text-xs uppercase tracking-wider text-glow-blue">Multi-Factor Engine</h3>
              <p className="text-[11px] text-immersive-muted font-mono leading-relaxed mt-1">
                Combines Smart Money Concepts (SMC), Volume Profile, and Wyckoff distribution phases into one cohesive target matrix.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-immersive-border/60 py-4 px-6 text-center text-[10px] font-mono text-immersive-muted shrink-0 bg-immersive-bg/95">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 CRYPTRONIX QUANT NETWORK INC. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-4">
            <span className="text-immersive-gold text-glow-blue">PING: 14ms</span>
            <span className="text-immersive-green text-glow-green">● SYSTEM STABLE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

