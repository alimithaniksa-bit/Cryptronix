import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  TrendingUp, 
  BarChart2, 
  Bell, 
  Settings, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  X, 
  AudioLines, 
  Coins, 
  Calculator, 
  Volume2, 
  VolumeX,
  History,
  Grid
} from 'lucide-react';

import { CryptoSignal, CoinTicker, CryptoAlert, MarketAnalysisResponse } from './types';
import { soundEngine } from './lib/sound';
import StatsBanner from './components/StatsBanner';
import SignalCard from './components/SignalCard';
import AlertSettings from './components/AlertSettings';
import TechnicalScanner from './components/TechnicalScanner';
import LandingPage from './components/LandingPage';
import CryptronixLogo from './components/CryptronixLogo';

export default function App() {
  // Navigation / View State
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  // Application Data States
  const [coins, setCoins] = useState<CoinTicker[]>([]);
  const [signals, setSignals] = useState<CryptoSignal[]>([]);
  const [alerts, setAlerts] = useState<CryptoAlert[]>([]);
  const [stats, setStats] = useState({ total: 0, winRate: 85, avgProfit: 4.2 });
  const [notifications, setNotifications] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active View Tab inside signal container: "active" | "history"
  const [signalTab, setSignalTab] = useState<'active' | 'history'>('active');

  // Custom quick creator modal/state
  const [showQuickCreator, setShowQuickCreator] = useState(false);
  const [quickPair, setQuickPair] = useState('BTCUSDT');
  const [quickType, setQuickType] = useState<'LONG' | 'SHORT'>('LONG');
  const [quickTimeframe, setQuickTimeframe] = useState<'15m' | '1h' | '4h'>('1h');

  // Risk Calculator States
  const [accountBalance, setAccountBalance] = useState('10000');
  const [riskPercent, setRiskPercent] = useState('1');
  const [entryValue, setEntryValue] = useState('68000');
  const [stopValue, setStopValue] = useState('66300');
  const [leveragedSize, setLeveragedSize] = useState<number | null>(null);
  const [suggestedMargin, setSuggestedMargin] = useState<number | null>(null);

  // Load and poll data from full-stack server with high resilience
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchJSON = async (url: string) => {
          try {
            const r = await fetch(url);
            if (r.ok) return await r.json();
          } catch (e) {
            // Keep console clean and avoid popping unhandled rejections during server restarts
          }
          return null;
        };

        const [coinsData, signalsData, alertsData, statsData] = await Promise.all([
          fetchJSON('/api/market-data'),
          fetchJSON('/api/signals'),
          fetchJSON('/api/alerts'),
          fetchJSON('/api/stats')
        ]);

        if (coinsData) setCoins(coinsData);
        if (signalsData) setSignals(signalsData);
        if (alertsData) setAlerts(alertsData);
        if (statsData) setStats(statsData);
      } catch (err) {
        // Safe catch-all
      }
    };

    // First load
    fetchData();

    // Periodic quick update every 3 seconds for prices and target triggers
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Poll for alert notifications with high resilience
  useEffect(() => {
    const pollNotifications = async () => {
      try {
        const resp = await fetch('/api/notifications/poll');
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.notifications && data.notifications.length > 0) {
            // Append incoming notifications
            setNotifications(prev => [...prev, ...data.notifications]);
            
            // Trigger audio synthesizer depending on notification keyword
            if (soundEnabled) {
              const text = data.notifications.join(" ").toLowerCase();
              if (text.includes("target")) {
                soundEngine.playSuccessChime();
              } else if (text.includes("stop loss")) {
                soundEngine.playStopLossHit();
              } else {
                soundEngine.playAlert();
              }
            }
          }
        }
      } catch (err) {
        // Safe catch-all to prevent noisy console warnings
      }
    };

    const interval = setInterval(pollNotifications, 3000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Handle Quick Custom Alert creation
  const handleCreateAlert = async (pair: string, price: number, direction: 'ABOVE' | 'BELOW') => {
    try {
      const resp = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pair, triggerPrice: price, direction })
      });
      if (resp.ok) {
        const newAlert = await resp.json();
        setAlerts(prev => [newAlert, ...prev]);
        if (soundEnabled) soundEngine.playAlert();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Alert
  const handleDeleteAlert = async (id: string) => {
    try {
      const resp = await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
      if (resp.ok) {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Deploy custom analysis directly as target trade
  const handleDeploySignal = async (analysis: MarketAnalysisResponse) => {
    try {
      const resp = await fetch('/api/signals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pair: analysis.pair,
          type: analysis.signal,
          entryPrice: analysis.entryPrice,
          timeframe: '1h',
          concept: analysis.concept,
          confirmations: analysis.confirmations,
          riskProfile: analysis.riskProfile,
          accuracyScore: analysis.confidence,
          reasoning: analysis.reasoning,
          tp1: analysis.tp1,
          tp2: analysis.tp2,
          tp3: analysis.tp3,
          stopLoss: analysis.stopLoss
        })
      });
      if (resp.ok) {
        const newSignal = await resp.json();
        setSignals(prev => [newSignal, ...prev]);
        if (soundEnabled) soundEngine.playSuccessChime();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Generate arbitrary user signal manually
  const triggerManualSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeCoin = coins.find(c => c.symbol === quickPair);
    const price = activeCoin ? activeCoin.price : 100;

    try {
      const resp = await fetch('/api/signals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pair: quickPair,
          type: quickType,
          entryPrice: price,
          timeframe: quickTimeframe
        })
      });
      if (resp.ok) {
        const newSignal = await resp.json();
        setSignals(prev => [newSignal, ...prev]);
        setShowQuickCreator(false);
        if (soundEnabled) soundEngine.playSuccessChime();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Safe manual audio trigger for testing & initializing audio context on click
  const testChime = () => {
    soundEngine.playSuccessChime();
  };

  // Helper filter lists for signal grid view
  const activeSignals = signals.filter(s => s.status !== 'CLOSED');
  const historicalSignals = signals.filter(s => s.status === 'CLOSED');

  // Risk Position calculator logic
  const calculatePositionRatio = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseFloat(accountBalance);
    const risk = parseFloat(riskPercent);
    const entry = parseFloat(entryValue);
    const stop = parseFloat(stopValue);

    if (isNaN(balance) || isNaN(risk) || isNaN(entry) || isNaN(stop) || entry <= 0 || stop <= 0) return;

    const riskAmount = balance * (risk / 100);
    const distancePercent = Math.abs(entry - stop) / entry;
    
    if (distancePercent <= 0) return;
    
    // Leverage sizing parameters
    const size = riskAmount / distancePercent;
    setLeveragedSize(parseFloat(size.toFixed(2)));
    setSuggestedMargin(parseFloat((size / 10).toFixed(2))); // Recommend a standard 10x multiplier limit
  };

  // Dismiss a floating trade notification toast
  const dismissNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, idx) => idx !== index));
  };

  if (!showDashboard) {
    return (
      <LandingPage 
        onEnterSystem={() => {
          setShowDashboard(true);
          if (soundEnabled) soundEngine.playSuccessChime();
        }} 
        coins={coins} 
      />
    );
  }

  return (
    <div id="app_root" className="min-h-screen bg-[#050608] text-[#E0E2E5] flex flex-col font-sans selection:bg-immersive-green/30 selection:text-immersive-green">
      
      {/* Floating Automated Notification Stack */}
      <div id="notification_container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
        <AnimatePresence>
          {notifications.map((notif, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`p-4 rounded-xl border flex items-start gap-3 shadow-2xl relative ${
                notif.toLowerCase().includes('stop loss') 
                  ? 'bg-immersive-card/95 border-immersive-red/50 text-immersive-red'
                  : 'bg-immersive-card/95 border-immersive-green/50 text-immersive-green'
              }`}
            >
              <div className="flex-1 text-xs font-mono font-medium leading-relaxed">
                {notif}
              </div>
              <button 
                onClick={() => dismissNotification(index)}
                className="p-1 hover:bg-white/10 rounded text-immersive-muted hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Grid Header */}
      <header id="app_header" className="h-20 border-b border-immersive-border bg-immersive-header backdrop-blur-md sticky top-0 z-40 shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CryptronixLogo size={42} className="animate-[pulse_3s_ease-in-out_infinite]" />
            <div>
              <h1 className="text-white font-mono font-black text-base sm:text-lg tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-immersive-muted text-glow-blue">CRYPTRONIX</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-immersive-gold shadow-[0_0_8px_#00f0ff] animate-pulse"></span>
                <span className="text-[10px] text-immersive-gold font-mono font-bold tracking-wider uppercase">Live Core Matrix Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Toggle Indicator */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled 
                  ? 'bg-immersive-green/10 border-immersive-green/30 text-immersive-green hover:bg-immersive-green/20' 
                  : 'bg-immersive-inner border-immersive-border text-immersive-muted hover:text-white'
              }`}
              title={soundEnabled ? "Mute Alarms" : "Enable Audio Alarms"}
            >
              {soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
            </button>

            {/* Manual test action */}
            <button
              onClick={testChime}
              className="hidden sm:flex text-immersive-muted hover:text-white border border-immersive-border hover:border-immersive-muted/40 text-[10px] font-mono font-bold uppercase tracking-wider py-1.5 px-3 rounded-xl transition-all items-center gap-1.5 cursor-pointer bg-immersive-inner/30"
            >
              Test Chime
            </button>

            <button
              onClick={() => setShowQuickCreator(true)}
              className="bg-immersive-green hover:bg-[#02C076EE] text-immersive-bg font-mono font-black text-xs py-2 px-3.5 sm:px-4 rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(2,192,118,0.25)] transition-all cursor-pointer"
            >
              + PRO SIGNAL
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard body */}
      <main id="app_body" className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-6 w-full">
        
        {/* Dynamic Audited Accuracy Stats Banner */}
        <StatsBanner stats={stats} />

        {/* Live Prices Tick Ribbon */}
        <div id="price_ticker_ribbon" className="bg-immersive-card border border-immersive-border rounded-2xl p-5 mb-6 shadow-md overflow-hidden">
          <div className="flex items-center gap-2.5 mb-3 border-b border-immersive-border/60 pb-2">
            <Coins className="w-4.5 h-4.5 text-immersive-gold animate-spin" />
            <h3 className="text-white text-xs font-mono uppercase tracking-widest font-bold">Cryptronix Live Price Feed</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coins.map((coin) => (
              <div 
                key={coin.symbol} 
                className="bg-immersive-inner/50 border border-immersive-border rounded-xl p-3.5 flex flex-col hover:border-immersive-green/45 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-immersive-gold animate-pulse" />
                    <span className="text-[#EAECEF] font-mono font-bold text-sm">{coin.symbol.replace("USDT", "")}/USDT</span>
                    <span className="text-immersive-muted text-[10px] font-mono font-normal">({coin.name})</span>
                  </div>
                  <span className={`text-xs font-mono leading-none font-bold ${coin.change24h >= 0 ? 'text-immersive-green' : 'text-immersive-red'}`}>
                    {coin.change24h >= 0 ? '▲ +' : '▼ '}{coin.change24h}%
                  </span>
                </div>
                <div className="text-white text-base font-bold font-mono mt-2">${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price < 1 ? 4 : 2 })}</div>
                
                {/* Micro trendsparkline */}
                <div className="flex items-end gap-1 h-5 mt-2.5 overflow-hidden items-stretch">
                  {coin.sparkline.map((val, idx) => {
                    const max = Math.max(...coin.sparkline);
                    const min = Math.min(...coin.sparkline);
                    const heightPercent = max !== min ? ((val - min) / (max - min)) * 100 : 50;
                    return (
                      <div 
                        key={idx} 
                        className={`flex-1 rounded-sm ${coin.change24h >= 0 ? "bg-immersive-green/25" : "bg-immersive-red/25"}`} 
                        style={{ height: `${Math.max(15, heightPercent)}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Modules Grid */}
        <div id="main_dashboard_grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLUMNS: Signal Feed Room */}
          <div id="signal_feed_room_column" className="lg:col-span-2 space-y-6">
            
            {/* Signal Feed Container */}
            <div id="signals_container" className="bg-immersive-card border border-immersive-border rounded-2xl overflow-hidden p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-immersive-border pb-4 mb-5 gap-3">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-immersive-green" />
                  <div>
                    <h2 className="text-white font-mono font-bold text-base uppercase tracking-wider">Trading Room Signals Feed</h2>
                    <span className="text-[10px] text-immersive-muted font-mono tracking-wide">Real-time parameters synchronized with public feeds</span>
                  </div>
                </div>

                {/* Tabs active vs completed */}
                <div className="flex items-center p-0.5 bg-immersive-inner border border-immersive-border rounded-xl">
                  <button
                    onClick={() => setSignalTab('active')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      signalTab === 'active' 
                        ? 'bg-immersive-card text-white shadow-sm border border-immersive-border' 
                        : 'text-immersive-muted hover:text-white'
                    }`}
                  >
                    Active Setup ({activeSignals.length})
                  </button>
                  <button
                    onClick={() => setSignalTab('history')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      signalTab === 'history' 
                        ? 'bg-immersive-card text-white shadow-sm border border-immersive-border' 
                        : 'text-immersive-muted hover:text-white'
                    }`}
                  >
                    Audit History ({historicalSignals.length})
                  </button>
                </div>
              </div>

              {/* Grid content mapping signals */}
              {signalTab === 'active' ? (
                activeSignals.length === 0 ? (
                  <div className="bg-immersive-inner/30 p-10 rounded-xl border border-immersive-border/60 flex flex-col items-center justify-center text-center">
                    <AlertTriangle className="w-8 h-8 text-immersive-gold mb-2 animate-bounce" />
                    <p className="text-sm font-mono text-immersive-primary font-bold">No Active Trading Channels</p>
                    <p className="text-xs text-immersive-muted max-w-xs mt-1.5 font-mono leading-relaxed">
                      All automatic trading cycles completed or hit Target matrix. Trigger a manual deep AI scan above to spin up a custom active signal channel!
                    </p>
                  </div>
                ) : (
                  <div id="active_signals_grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeSignals.map(sig => (
                      <div key={sig.id}>
                        <SignalCard signal={sig} />
                      </div>
                    ))}
                  </div>
                )
              ) : (
                historicalSignals.length === 0 ? (
                  <div className="bg-immersive-inner/30 p-10 rounded-xl border border-immersive-border/60 flex flex-col items-center justify-center text-center">
                    <History className="w-8 h-8 text-immersive-muted mb-2" />
                    <p className="text-sm font-mono text-immersive-primary font-bold">No Closed Signal History</p>
                  </div>
                ) : (
                  <div id="historical_signals_grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {historicalSignals.map(sig => (
                      <div key={sig.id}>
                        <SignalCard signal={sig} />
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Risk & Leverage Position Sizing Calculator */}
            <div id="position_sizing_calculator" className="bg-immersive-card border border-immersive-border rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2.5 mb-4 border-b border-immersive-border pb-3">
                <Calculator className="w-5 h-5 text-immersive-gold" />
                <h2 className="text-white font-mono font-bold text-base uppercase tracking-wider">Risk Position Calculator</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <form onSubmit={calculatePositionRatio} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono text-immersive-muted font-bold">Balance (USDT)</label>
                      <input 
                        type="number" 
                        value={accountBalance} 
                        onChange={e => setAccountBalance(e.target.value)}
                        className="bg-immersive-inner border border-immersive-border text-sm rounded-xl p-2.5 text-white font-mono focus:border-immersive-gold/50 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono text-immersive-muted font-bold">Risk amount (%)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={riskPercent} 
                        onChange={e => setRiskPercent(e.target.value)}
                        className="bg-immersive-inner border border-immersive-border text-sm rounded-xl p-2.5 text-white font-mono focus:border-immersive-gold/50 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono text-immersive-muted font-bold">Entry Price ($)</label>
                      <input 
                        type="number" 
                        value={entryValue}
                        onChange={e => setEntryValue(e.target.value)}
                        className="bg-immersive-inner border border-immersive-border text-sm rounded-xl p-2.5 text-white font-mono focus:border-immersive-gold/50 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono text-immersive-muted font-bold">Stop Loss ($)</label>
                      <input 
                        type="number" 
                        value={stopValue} 
                        onChange={e => setStopValue(e.target.value)}
                        className="bg-immersive-inner border border-immersive-border text-sm rounded-xl p-2.5 text-white font-mono focus:border-immersive-gold/50 outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-immersive-gold hover:bg-[#F3BA2FEE] text-immersive-bg font-mono font-bold py-2.5 rounded-xl text-xs transition-colors mt-2 cursor-pointer shadow-[0_0_15px_rgba(243,186,47,0.1)]"
                  >
                    CALCULATE INSTITUTIONAL EXPOSURE
                  </button>
                </form>

                {/* Calculator Results */}
                <div className="bg-immersive-inner border border-immersive-border rounded-xl p-4.5 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-mono text-immersive-muted uppercase tracking-wider font-bold mb-2">Calculated Exposure Matrix</p>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-immersive-muted">USD Risk Amount:</span>
                        <span className="text-immersive-red font-bold">${((parseFloat(accountBalance) || 0) * ((parseFloat(riskPercent) || 0) / 100)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span className="text-immersive-muted">Stop Distance:</span>
                        <span className="text-[#EAECEF]">
                          {Math.abs(((parseFloat(entryValue) - parseFloat(stopValue)) / (parseFloat(entryValue) || 1)) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-immersive-border/60 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[11px] font-mono text-immersive-muted font-bold">Leveraged Size:</span>
                      <span className="text-base font-bold font-mono text-immersive-gold">
                        {leveragedSize !== null ? `$${leveragedSize.toLocaleString()}` : '—'}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-[11px] font-mono text-immersive-muted font-bold">Suggested Margin (10x):</span>
                      <span className="text-sm font-bold font-mono text-immersive-green">
                        {suggestedMargin !== null ? `$${suggestedMargin.toLocaleString()}` : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Scanners & Alert setups */}
          <div id="scanners_and_alerts_column" className="space-y-6">
            
            {/* Technical AI Market Scanner */}
            <TechnicalScanner coins={coins} onDeploySignal={handleDeploySignal} />

            {/* Automated Alerts configuration */}
            <AlertSettings 
              alerts={alerts} 
              coins={coins} 
              onCreateAlert={handleCreateAlert} 
              onDeleteAlert={handleDeleteAlert} 
            />

          </div>

        </div>

      </main>

      {/* Quick Custom Pro Signal Manual Creator Modal */}
      <AnimatePresence>
        {showQuickCreator && (
          <div id="quick_creator_overlay" className="fixed inset-0 z-50 bg-immersive-bg/90 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-immersive-card border border-immersive-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-immersive-border pb-3">
                <span className="text-white font-mono font-bold text-sm tracking-wider uppercase">Create Custom PRO Signal Channel</span>
                <button 
                  onClick={() => setShowQuickCreator(false)}
                  className="p-1 hover:bg-immersive-inner rounded-lg text-immersive-muted hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={triggerManualSignal} className="space-y-4 font-mono text-xs">
                
                {/* select pair */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-immersive-muted uppercase font-bold">Select Asset Pair</label>
                  <select
                    value={quickPair}
                    onChange={e => setQuickPair(e.target.value)}
                    className="bg-immersive-inner border border-immersive-border rounded-xl p-2.5 text-slate-200 text-sm font-semibold outline-none focus:border-immersive-green/50 cursor-pointer"
                  >
                    {coins.map(c => (
                      <option key={c.symbol} value={c.symbol}>
                        {c.symbol.replace("USDT", "")}/USDT (Live Price: ${c.price.toLocaleString(undefined, { minimumFractionDigits: c.price < 1 ? 4 : 2 })})
                      </option>
                    ))}
                  </select>
                </div>

                {/* action and timeframe */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-immersive-muted uppercase font-bold">Signal Action</label>
                    <select
                      value={quickType}
                      onChange={e => setQuickType(e.target.value as any)}
                      className="bg-immersive-inner border border-immersive-border rounded-xl p-2.5 text-slate-200 text-sm font-semibold outline-none cursor-pointer"
                    >
                      <option value="LONG">LONG (BUY)</option>
                      <option value="SHORT">SHORT (SELL)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-immersive-muted uppercase font-bold">Timeframe</label>
                    <select
                      value={quickTimeframe}
                      onChange={e => setQuickTimeframe(e.target.value as any)}
                      className="bg-immersive-inner border border-immersive-border rounded-xl p-2.5 text-slate-200 text-sm font-semibold outline-none cursor-pointer"
                    >
                      <option value="15m">15m</option>
                      <option value="1h">1h</option>
                      <option value="4h">4h</option>
                    </select>
                  </div>
                </div>

                <p className="text-[10px] text-immersive-muted leading-relaxed border-t border-immersive-border pt-3 font-sans">
                  Deploying this signal starts live tick tracking on the server. Cryptronix Signals calculations will dynamically calibrate TP1 (+1.5%), TP2 (+3.5%), TP3 (+6%), and Stop Loss (-2.5%) based on the live target price matrix.
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4.5 pt-3 border-t border-immersive-border">
                  <button
                    type="button"
                    onClick={() => setShowQuickCreator(false)}
                    className="py-2.5 bg-immersive-inner text-immersive-muted hover:text-white border border-immersive-border hover:border-immersive-muted rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 bg-immersive-green hover:bg-[#02C076FA] text-immersive-bg font-mono font-black rounded-xl text-xs transition-colors cursor-pointer shadow-[0_0_15px_rgba(2,192,118,0.2)]"
                  >
                    DEPLOY CHANNEL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simple Footer */}
      <footer id="app_footer" className="mt-12 py-6 bg-immersive-header border-t border-immersive-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-immersive-muted gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-immersive-gold animate-pulse shadow-[0_0_6px_#F3BA2F]"></div>
            <span className="text-xs font-bold text-immersive-gold uppercase">Automated Alerts: ACTIVE</span>
          </div>
          <div className="text-center md:text-right uppercase tracking-[0.2em] font-medium text-[10px] text-immersive-muted">
            Accuracy audited by Cryptronix Core Engine v4.2.1 • Risk Management Enabled
          </div>
          <div className="flex items-center gap-4">
            <span>PING: 14ms</span>
            <span className="text-immersive-green">● LIVE CORE SYNC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
