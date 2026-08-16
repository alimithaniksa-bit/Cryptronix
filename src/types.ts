export type SignalType = 'BUY' | 'SELL' | 'LONG' | 'SHORT';

export type SignalStatus = 'PENDING' | 'ACTIVE' | 'TP1' | 'TP2' | 'TP3' | 'SL' | 'CLOSED';

export interface IndicatorMetrics {
  rsi: number;
  macd: 'BULLISH_CROSS' | 'BEARISH_CROSS' | 'NEUTRAL';
  ema200: 'ABOVE' | 'BELOW';
  volume24h: string;
}

export interface CryptoSignal {
  id: string;
  pair: string;
  type: SignalType;
  entryPrice: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  stopLoss: number;
  timeframe: '5m' | '15m' | '1h' | '4h' | '1d';
  status: SignalStatus;
  timestamp: string; // ISO string
  accuracyScore: number; // e.g., 90-95
  score: number; // calculated quality score (1-10)
  aiReasoning: string;
  indicatorMetrics: IndicatorMetrics;
  currentPrice: number;
  pnlPercent: number; // current or final profit/loss percent
  concept?: string;
  confirmations?: string[];
  riskProfile?: string;
}

export interface CryptoAlert {
  id: string;
  pair: string;
  triggerPrice: number;
  direction: 'ABOVE' | 'BELOW';
  isTriggered: boolean;
  createdAt: string;
}

export interface CoinTicker {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  high24h: number;
  low24h: number;
  sparkline: number[];
}

export interface MarketAnalysisResponse {
  pair: string;
  signal: SignalType;
  entryPrice: number;
  tp1: number;
  tp2: number;
  tp3: number;
  stopLoss: number;
  reasoning: string;
  confidence: number;
  concept?: string;
  confirmations?: string[];
  riskProfile?: string;
  engineUsed?: string;
}

export type AIProvider = 'auto' | 'custom' | 'gemini' | 'openai' | 'anthropic' | 'groq' | 'openrouter' | 'deepseek' | 'built_in';

export interface AISettingsConfig {
  provider: AIProvider;
  apiKey: string;
  customEndpoint?: string;
  model: string;
  temperature?: number;
}
