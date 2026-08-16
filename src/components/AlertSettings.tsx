import React, { useState } from 'react';
import { CryptoAlert, CoinTicker } from '../types';
import { Bell, Plus, Trash2, ShieldAlert } from 'lucide-react';

interface AlertSettingsProps {
  alerts: CryptoAlert[];
  coins: CoinTicker[];
  onCreateAlert: (pair: string, price: number, direction: 'ABOVE' | 'BELOW') => void;
  onDeleteAlert: (id: string) => void;
}

export default function AlertSettings({ alerts, coins, onCreateAlert, onDeleteAlert }: AlertSettingsProps) {
  const [selectedPair, setSelectedPair] = useState(coins[0]?.symbol || 'BTCUSDT');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [direction, setDirection] = useState<'ABOVE' | 'BELOW'>('ABOVE');

  const activeCoin = coins.find(c => c.symbol === selectedPair);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(triggerPrice);
    if (!selectedPair || isNaN(price) || price <= 0) return;

    onCreateAlert(selectedPair, price, direction);
    setTriggerPrice('');
  };

  // Preset quick fill relative to current price (e.g., +2% or -2%)
  const handleQuickPercentPrice = (percent: number) => {
    if (!activeCoin) return;
    const computed = activeCoin.price * (1 + percent / 100);
    setTriggerPrice(computed.toFixed(activeCoin.price < 1 ? 4 : 2));
    setDirection(percent > 0 ? 'ABOVE' : 'BELOW');
  };

  return (
    <div id="alert_settings_panel" className="bg-immersive-card border border-immersive-border rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2.5 mb-4 border-b border-immersive-border pb-3">
        <Bell className="w-5 h-5 text-immersive-gold animate-bounce" />
        <h2 className="text-white font-mono font-bold text-base uppercase tracking-wider">Cryptronix Alert Manager</h2>
      </div>

      {/* Alert Creator Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Pair Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-immersive-muted text-xs font-mono uppercase font-bold">Asset Pair</label>
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="bg-immersive-inner border border-immersive-border text-immersive-primary text-sm font-mono rounded-xl p-2.5 outline-none focus:border-immersive-gold/50 cursor-pointer"
            >
              {coins.map(c => (
                <option key={c.symbol} value={c.symbol}>
                  {c.symbol.replace("USDT", "")}/USDT (${c.price.toLocaleString(undefined, { minimumFractionDigits: c.price < 1 ? 4 : 2 })})
                </option>
              ))}
            </select>
          </div>

          {/* Trigger direction */}
          <div className="flex flex-col gap-1.5">
            <label className="text-immersive-muted text-xs font-mono uppercase font-bold">Price Level Crossing</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('ABOVE')}
                className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                  direction === 'ABOVE'
                    ? 'bg-immersive-green/10 text-immersive-green border-immersive-green/40'
                    : 'bg-immersive-inner border-immersive-border text-immersive-muted hover:text-white'
                }`}
              >
                ABOVE (▲)
              </button>
              <button
                type="button"
                onClick={() => setDirection('BELOW')}
                className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                  direction === 'BELOW'
                    ? 'bg-immersive-red/10 text-immersive-red border-immersive-red/40'
                    : 'bg-immersive-[#161A1E] border-immersive-border text-immersive-muted hover:text-white'
                }`}
              >
                BELOW (▼)
              </button>
            </div>
          </div>
        </div>

        {/* Input Target */}
        <div className="flex flex-col gap-1.5">
          <label className="text-immersive-muted text-xs font-mono uppercase font-bold">Target Trigger Price (USDT)</label>
          <div className="relative">
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={triggerPrice}
              onChange={(e) => setTriggerPrice(e.target.value)}
              className="w-full bg-immersive-inner border border-immersive-border text-white text-sm font-mono rounded-xl p-2.5 pl-3 pr-16 outline-none focus:border-immersive-gold/50"
              required
            />
            <span className="absolute right-3.5 top-3 text-[10px] text-immersive-muted font-mono font-bold">USDT</span>
          </div>

          {/* Rapid Presets */}
          <div className="flex gap-1.5 mt-1 justify-end">
            <button
              type="button"
              onClick={() => handleQuickPercentPrice(-1.5)}
              className="text-[10px] bg-immersive-inner border border-immersive-border hover:bg-immersive-border/30 text-immersive-muted font-mono py-1 px-2.5 rounded-lg hover:text-white cursor-pointer"
            >
              -1.5%
            </button>
            <button
              type="button"
              onClick={() => handleQuickPercentPrice(-0.5)}
              className="text-[10px] bg-immersive-inner border border-immersive-border hover:bg-immersive-border/30 text-immersive-muted font-mono py-1 px-2.5 rounded-lg hover:text-white cursor-pointer"
            >
              -0.5%
            </button>
            <button
              type="button"
              onClick={() => handleQuickPercentPrice(0.5)}
              className="text-[10px] bg-immersive-inner border border-immersive-border hover:bg-immersive-border/30 text-immersive-muted font-mono py-1 px-2.5 rounded-lg hover:text-white cursor-pointer"
            >
              +0.5%
            </button>
            <button
              type="button"
              onClick={() => handleQuickPercentPrice(1.5)}
              className="text-[10px] bg-immersive-inner border border-immersive-border hover:bg-immersive-border/30 text-immersive-muted font-mono py-1 px-2.5 rounded-lg hover:text-white cursor-pointer"
            >
              +1.5%
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-immersive-gold hover:bg-[#F3BA2FEE] text-immersive-bg font-mono font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(243,186,47,0.15)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> ACTIVATE TRACKING ALERT
        </button>
      </form>

      {/* Active Alerts List */}
      <div className="mt-6 border-t border-immersive-border pt-4.5">
        <span className="text-immersive-muted text-xs font-mono uppercase tracking-wider font-bold block mb-3.5">Active Auto-Scanners ({alerts.length})</span>
        
        {alerts.length === 0 ? (
          <div className="bg-immersive-bg/50 p-4 rounded-xl border border-immersive-border flex flex-col items-center justify-center text-center">
            <ShieldAlert className="w-5 h-5 text-immersive-muted mb-1" />
            <p className="text-[11px] text-immersive-muted font-mono">No active price cross scanners enabled. Set one above to test live alarms.</p>
          </div>
        ) : (
          <div className="max-h-[170px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {alerts.map(a => (
              <div 
                key={a.id} 
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono transition-colors ${
                  a.isTriggered 
                    ? 'bg-immersive-gold/10 border-immersive-gold/20 text-immersive-gold' 
                    : 'bg-immersive-inner border-immersive-border text-immersive-primary hover:border-immersive-primary/20'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">{a.pair.replace("USDT", "")}/USDT</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      a.direction === "ABOVE" ? "bg-immersive-green/10 text-immersive-green" : "bg-immersive-red/10 text-immersive-red"
                    }`}>
                      {a.direction}
                    </span>
                  </div>
                  <span className="text-[10px] text-immersive-muted mt-0.5 font-sans">Trigger Level: ${a.triggerPrice.toLocaleString(undefined, { minimumFractionDigits: a.triggerPrice < 1 ? 4 : 2 })}</span>
                </div>

                <div className="flex items-center gap-2">
                  {a.isTriggered ? (
                    <span className="text-[10px] rounded px-1.5 py-0.5 bg-immersive-gold/20 text-immersive-gold font-bold animate-pulse">TRIGGERED</span>
                  ) : (
                    <span className="text-[10px] text-immersive-muted font-sans">Scanning...</span>
                  )}
                  <button
                    onClick={() => onDeleteAlert(a.id)}
                    className="p-1.5 hover:bg-immersive-red/10 text-immersive-muted hover:text-immersive-red rounded-lg transition-colors cursor-pointer"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
