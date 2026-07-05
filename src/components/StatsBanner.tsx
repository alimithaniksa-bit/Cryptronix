import React from 'react';
import { Percent, TrendingUp, CheckCircle2, Award } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    winRate: number;
    avgProfit: number;
  };
}

export default function StatsBanner({ stats }: StatsProps) {
  return (
    <div id="stats_banner_container" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Overall Accuracy Card */}
      <div id="win_rate_card" className="bg-immersive-card border border-immersive-border rounded-2xl p-6 flex items-center gap-4 hover:border-immersive-green/45 transition-all duration-300 relative overflow-hidden group shadow-lg">
        <div className="absolute top-0 left-0 w-full h-1 bg-immersive-green shadow-[0_0_8px_#02C076]"></div>
        <div id="win_rate_icon" className="p-3.5 bg-immersive-green/10 text-immersive-green rounded-xl transition-transform duration-300 group-hover:scale-110">
          <Percent className="w-5.5 h-5.5 animate-pulse" />
        </div>
        <div id="win_rate_info" className="flex-1">
          <p className="text-immersive-muted text-[10px] font-mono font-bold uppercase tracking-wider">OVERALL ACCURACY</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black font-mono text-white tracking-tight">{stats.winRate}%</span>
            <span className="text-xs text-immersive-green font-mono font-bold">(85% Target)</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-immersive-inner rounded-full overflow-hidden">
            <div 
              className="h-full bg-immersive-green shadow-[0_0_8px_#02C076] transition-all duration-500" 
              style={{ width: `${stats.winRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Average Profit Card */}
      <div id="avg_profit_card" className="bg-immersive-card border border-immersive-border rounded-2xl p-6 flex items-center gap-4 hover:border-immersive-gold/45 transition-all duration-300 relative overflow-hidden group shadow-lg">
        <div className="absolute top-0 left-0 w-full h-1 bg-immersive-gold shadow-[0_0_8px_#F3BA2F]"></div>
        <div id="avg_profit_icon" className="p-3.5 bg-immersive-gold/10 text-immersive-gold rounded-xl transition-transform duration-300 group-hover:scale-110">
          <TrendingUp className="w-5.5 h-5.5" />
        </div>
        <div id="avg_profit_info" className="flex-1">
          <p className="text-immersive-muted text-[10px] font-mono font-bold uppercase tracking-wider">AVERAGE SIGNAL P&L</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black font-mono text-white tracking-tight">+{stats.avgProfit}%</span>
            <span className="text-xs text-immersive-gold font-mono font-bold">gain / trade</span>
          </div>
          <p className="text-[11px] text-immersive-muted mt-1.5 font-mono">Performance verified across closed signals</p>
        </div>
      </div>

      {/* Total Scanned Logs */}
      <div id="total_trades_card" className="bg-immersive-card border border-immersive-border rounded-2xl p-6 flex items-center gap-4 hover:border-immersive-primary/45 transition-all duration-300 relative overflow-hidden group shadow-lg">
        <div className="absolute top-0 left-0 w-full h-1 bg-immersive-primary/40"></div>
        <div id="total_trades_icon" className="p-3.5 bg-immersive-inner text-immersive-primary rounded-xl transition-transform duration-300 group-hover:scale-110">
          <CheckCircle2 className="w-5.5 h-5.5" />
        </div>
        <div id="total_trades_info" className="flex-1">
          <p className="text-immersive-muted text-[10px] font-mono font-bold uppercase tracking-wider">TOTAL SCANNED LOGS</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black font-mono text-white tracking-tight">{stats.total}</span>
            <span className="text-xs text-immersive-muted font-mono">signals generated</span>
          </div>
          <p className="text-[11px] text-immersive-muted mt-1.5 font-mono">Real-time indicators & automated audits</p>
        </div>
      </div>
    </div>
  );
}
