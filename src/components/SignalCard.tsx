import React, { useState } from 'react';
import { CryptoSignal } from '../types';
import { ArrowUpRight, ArrowDownRight, Compass, Check, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';

interface SignalCardProps {
  signal: CryptoSignal;
}

export default function SignalCard({ signal }: SignalCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isLong = signal.type === 'LONG' || signal.type === 'BUY';
  const isPending = signal.status === 'PENDING';
  const isClosed = signal.status === 'CLOSED';
  
  // Helpers for identifying target hits
  const tp1Hit = isLong ? (signal.currentPrice >= signal.takeProfit1) : (signal.currentPrice <= signal.takeProfit1);
  const tp2Hit = isLong ? (signal.currentPrice >= signal.takeProfit2) : (signal.currentPrice <= signal.takeProfit2);
  const tp3Hit = isLong ? (signal.currentPrice >= signal.takeProfit3) : (signal.currentPrice <= signal.takeProfit3);

  return (
    <div 
      id={`signal_card_${signal.id}`}
      className={`bg-immersive-card border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] ${
        isClosed 
          ? 'border-immersive-border/60 filter opacity-80' 
          : isLong 
            ? 'border-immersive-border hover:border-immersive-green/40 shadow-lg shadow-immersive-green/5' 
            : 'border-immersive-border hover:border-immersive-red/40 shadow-lg shadow-immersive-red/5'
      }`}
    >
      {/* Top Header */}
      <div id={`signal_card_header_${signal.id}`} className="p-4.5 border-b border-immersive-border bg-immersive-inner/25 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col">
            <span className="text-white font-mono font-bold text-base tracking-tight">{signal.pair.replace("USDT", "/USDT")}</span>
            <span className="text-immersive-muted text-[10px] font-mono uppercase tracking-widest font-bold">{signal.timeframe} TIMEFRAME • SPOT / FUTURES</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Signal Action Badge */}
          <span 
            id={`signal_badge_${signal.id}`}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-black tracking-tighter flex items-center gap-1 border ${
              isLong 
                ? 'bg-immersive-green/10 text-immersive-green border-immersive-green/20' 
                : 'bg-immersive-red/10 text-immersive-red border-immersive-red/20'
            }`}
          >
            {isLong ? (
              <>
                <ArrowUpRight className="w-3.5 h-3.5" /> LONG
              </>
            ) : (
              <>
                <ArrowDownRight className="w-3.5 h-3.5" /> SHORT
              </>
            )}
          </span>

          {/* Status Badge */}
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
            isClosed 
              ? 'bg-immersive-inner text-immersive-muted border-immersive-border' 
              : signal.status.startsWith('TP')
                ? 'bg-immersive-green/20 text-immersive-green border-immersive-green/30'
                : 'bg-immersive-gold/10 text-immersive-gold border-immersive-gold/20 animate-pulse'
          }`}>
            {signal.status}
          </span>
        </div>
      </div>

      {/* Main Stats Segment */}
      <div id={`signal_card_metrics_${signal.id}`} className="p-5 grid grid-cols-2 gap-4">
        {/* Entry Price & Current Price */}
        <div className="flex flex-col">
          <span className="text-immersive-muted text-[10px] font-mono uppercase font-bold tracking-wider">ENTRY ZONE</span>
          <span className="text-white text-base font-bold font-mono mt-0.5">${signal.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-immersive-muted text-[10px] font-mono uppercase font-bold tracking-wider">LIVE TICK PRICE</span>
          <span className="text-white text-base font-bold font-mono mt-0.5">${signal.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        {/* Profit Meter */}
        <div className="col-span-2 bg-immersive-inner/50 rounded-xl p-3 border border-immersive-border flex items-center justify-between">
          <span className="text-immersive-muted text-[10px] font-mono uppercase font-bold">UNREALIZED P&L</span>
          <span className={`text-base font-bold font-mono tracking-tight flex items-center gap-1 ${
            signal.pnlPercent >= 0 ? 'text-immersive-green' : 'text-immersive-red'
          }`}>
            {signal.pnlPercent >= 0 ? '+' : ''}{signal.pnlPercent}%
          </span>
        </div>
      </div>

      {/* Targets Setup */}
      <div id={`signal_card_targets_${signal.id}`} className="mx-5 mb-4 p-3 bg-immersive-inner rounded-xl border border-immersive-border space-y-2.5">
        <div className="flex justify-between items-center border-b border-immersive-border pb-1.5">
          <p className="text-[10px] text-immersive-muted font-mono uppercase tracking-wider font-bold">Mithani Target Matrix</p>
          <span className="text-[10px] text-immersive-green uppercase font-mono font-bold">Continuous Track</span>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 text-xs font-mono">
          {/* TP1 */}
          <div className="flex items-center justify-between col-span-2">
            <span className="text-immersive-muted flex items-center gap-1 text-[11px]">
              TP1 TARGET 
              {tp1Hit && <Check className="w-3.5 h-3.5 text-immersive-green" />}
            </span>
            <span className={`font-semibold ${tp1Hit ? 'text-immersive-green' : 'text-immersive-primary'}`}>
              ${signal.takeProfit1.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* TP2 */}
          <div className="flex items-center justify-between col-span-2">
            <span className="text-immersive-muted flex items-center gap-1 text-[11px]">
              TP2 TARGET
              {tp2Hit && <Check className="w-3.5 h-3.5 text-immersive-green" />}
            </span>
            <span className={`font-semibold ${tp2Hit ? 'text-immersive-green' : 'text-immersive-primary'}`}>
              ${signal.takeProfit2.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* TP3 */}
          <div className="flex items-center justify-between col-span-2">
            <span className="text-immersive-muted flex items-center gap-1 text-[11px]">
              TP3 TARGET
              {tp3Hit && <Check className="w-3.5 h-3.5 text-immersive-green" />}
            </span>
            <span className={`font-semibold ${tp3Hit ? 'text-immersive-green' : 'text-immersive-primary'}`}>
              ${signal.takeProfit3.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Stop Loss */}
          <div className="flex items-center justify-between col-span-2 pt-1.5 border-t border-immersive-border/60">
            <span className="text-immersive-muted flex items-center gap-1 text-[11px] font-bold">
              STOP LOSS
              <AlertCircle className="w-3.5 h-3.5 text-immersive-red" />
            </span>
            <span className="font-bold text-immersive-red">
              ${signal.stopLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Technical Indicators Summary */}
      <div className="px-5 pb-4 flex flex-wrap gap-1.5 justify-around text-[10px] font-mono text-immersive-muted">
        <span className="px-2 py-0.5 bg-immersive-inner/60 rounded border border-immersive-border">
          RSI: <span className={signal.indicatorMetrics.rsi > 65 ? 'text-immersive-gold font-bold' : 'text-immersive-green'}>{signal.indicatorMetrics.rsi}</span>
        </span>
        <span className="px-2 py-0.5 bg-immersive-inner/60 rounded border border-immersive-border">
          MACD: <span className="text-immersive-green font-bold">{signal.indicatorMetrics.macd.replace('_', ' ')}</span>
        </span>
        <span className="px-2 py-0.5 bg-immersive-inner/60 rounded border border-immersive-border">
          EMA200: <span className="text-immersive-primary font-bold">{signal.indicatorMetrics.ema200}</span>
        </span>
      </div>

      {/* Accordion AI reasoning panel */}
      <div className="border-t border-immersive-border bg-immersive-inner/10">
        <button
          id={`toggle_reasoning_${signal.id}`}
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left p-3 flex items-center justify-between text-xs text-immersive-muted hover:text-white font-mono hover:bg-immersive-inner/25 transition-colors"
        >
          <span className="flex items-center gap-1.5 text-immersive-gold">
            <Sparkles className="w-3.5 h-3.5 text-immersive-gold animate-pulse" />
            Mithani AI Deep Analysis
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-immersive-muted">Acc. {signal.accuracyScore}%</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {expanded && (
          <div className="p-4 pt-1.5 text-immersive-primary text-[11px] leading-relaxed font-mono border-t border-immersive-border bg-immersive-inner/30 space-y-3">
            {signal.concept && (
              <div className="flex items-center justify-between text-[10px] bg-immersive-gold/5 border border-immersive-gold/20 text-immersive-gold px-2.5 py-1 rounded-xl">
                <span>STRATEGY CONCEPT:</span>
                <span className="font-bold text-white">{signal.concept}</span>
              </div>
            )}
            
            {signal.confirmations && signal.confirmations.length > 0 && (
              <div className="space-y-1">
                <span className="text-[9px] text-immersive-muted uppercase block font-bold">CONFIRMED INDICATORS:</span>
                <div className="flex flex-wrap gap-1">
                  {signal.confirmations.map((conf, i) => (
                    <span key={i} className="text-[9px] bg-immersive-green/10 text-immersive-green border border-immersive-green/20 px-1.5 py-0.5 rounded-md font-bold">
                      ✓ {conf}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {signal.riskProfile && (
              <div className="flex items-center justify-between text-[9px] text-immersive-muted">
                <span>RISK CONFIG:</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                  signal.riskProfile === 'CONSERVATIVE' 
                    ? 'bg-immersive-green/10 text-immersive-green border-immersive-green/20'
                    : signal.riskProfile === 'AGGRESSIVE'
                      ? 'bg-immersive-red/10 text-immersive-red border-immersive-red/20'
                      : 'bg-immersive-gold/10 text-immersive-gold border-immersive-gold/20'
                }`}>
                  {signal.riskProfile}
                </span>
              </div>
            )}

            <p className="bg-immersive-inner/60 p-2.5 rounded-xl border border-immersive-border whitespace-pre-wrap leading-relaxed text-[#E0E2E5]">
              {signal.aiReasoning}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
