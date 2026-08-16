import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Key, 
  Server, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Zap, 
  RefreshCw, 
  ShieldCheck, 
  Globe, 
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AIProvider, AISettingsConfig } from '../types';

export const DEFAULT_AI_SETTINGS: AISettingsConfig = {
  provider: 'auto',
  apiKey: '',
  customEndpoint: '',
  model: 'gemini-2.5-flash',
  temperature: 0.2
};

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AISettingsConfig;
  onSaveConfig: (config: AISettingsConfig) => void;
}

export default function ApiSettingsModal({
  isOpen,
  onClose,
  config,
  onSaveConfig
}: ApiSettingsModalProps) {
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [provider, setProvider] = useState<AIProvider>(config.provider || 'auto');
  const [customEndpoint, setCustomEndpoint] = useState(config.customEndpoint || '');
  const [model, setModel] = useState(config.model || '');
  const [temperature, setTemperature] = useState(config.temperature ?? 0.2);
  
  const [showKey, setShowKey] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    engineName?: string;
  } | null>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setApiKey(config.apiKey || '');
      setProvider(config.provider || 'auto');
      setCustomEndpoint(config.customEndpoint || '');
      setModel(config.model || '');
      setTemperature(config.temperature ?? 0.2);
      setTestResult(null);
    }
  }, [isOpen, config]);

  // Key detection helper
  const detectKeyType = (key: string): { label: string; provider: AIProvider; defaultModel: string; defaultEndpoint: string } => {
    const trimmed = key.trim();
    if (!trimmed) {
      return {
        label: 'No Key Entered (Using Core Engine)',
        provider: 'built_in',
        defaultModel: 'gemini-2.5-flash',
        defaultEndpoint: ''
      };
    }
    if (trimmed.startsWith('AIza')) {
      return {
        label: 'Google Gemini Key (Auto-Detected)',
        provider: 'gemini',
        defaultModel: 'gemini-2.5-flash',
        defaultEndpoint: 'https://generativelanguage.googleapis.com'
      };
    }
    if (trimmed.startsWith('sk-ant')) {
      return {
        label: 'Anthropic Claude Key (Auto-Detected)',
        provider: 'anthropic',
        defaultModel: 'claude-3-5-sonnet-20241022',
        defaultEndpoint: 'https://api.anthropic.com/v1'
      };
    }
    if (trimmed.startsWith('gsk_')) {
      return {
        label: 'Groq Cloud Key (Auto-Detected)',
        provider: 'groq',
        defaultModel: 'llama-3.3-70b-versatile',
        defaultEndpoint: 'https://api.groq.com/openai/v1'
      };
    }
    if (trimmed.startsWith('sk-or-')) {
      return {
        label: 'OpenRouter API Key (Auto-Detected)',
        provider: 'openrouter',
        defaultModel: 'google/gemini-2.0-flash-exp:free',
        defaultEndpoint: 'https://openrouter.ai/api/v1'
      };
    }
    if (trimmed.startsWith('sk-')) {
      return {
        label: 'OpenAI / Compatible API Key (Auto-Detected)',
        provider: 'openai',
        defaultModel: 'gpt-4o',
        defaultEndpoint: 'https://api.openai.com/v1'
      };
    }
    return {
      label: 'Custom API Key / Proxy',
      provider: 'custom',
      defaultModel: 'gpt-4o',
      defaultEndpoint: customEndpoint || 'https://api.openai.com/v1'
    };
  };

  const detectedInfo = detectKeyType(apiKey);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const resp = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provider === 'auto' ? detectedInfo.provider : provider,
          apiKey: apiKey.trim(),
          customEndpoint: customEndpoint.trim(),
          model: (model || (provider === 'auto' ? detectedInfo.defaultModel : '')).trim()
        })
      });

      const data = await resp.json();
      if (resp.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || 'API connection verified successfully!',
          latencyMs: data.latencyMs,
          engineName: data.engineName
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Connection test failed. Please check your API key.'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network request failed. Ensure server is running.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    const finalProvider = provider;
    const finalModel = model.trim() || detectedInfo.defaultModel;
    
    const newConfig: AISettingsConfig = {
      provider: finalProvider,
      apiKey: apiKey.trim(),
      customEndpoint: customEndpoint.trim(),
      model: finalModel,
      temperature
    };

    onSaveConfig(newConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-immersive-card border border-immersive-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-6"
        >
          {/* Header */}
          <div className="p-5 border-b border-immersive-border flex items-center justify-between bg-immersive-inner/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-immersive-gold/15 border border-immersive-gold/30 flex items-center justify-center text-immersive-gold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-white font-mono font-bold text-sm uppercase tracking-wider">
                  Custom AI API Settings
                </h3>
                <p className="text-immersive-muted text-xs">
                  Enter any API key to run real-time quant scans
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-immersive-muted hover:text-white p-1.5 rounded-lg hover:bg-immersive-inner transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            
            {/* Primary API Key Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-immersive-gold" />
                  Your AI API Key
                </label>
                <span className="text-[10px] text-immersive-muted">
                  Supports Gemini, OpenAI, Claude, Groq, OpenRouter, etc.
                </span>
              </div>
              
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setTestResult(null);
                  }}
                  placeholder="Paste your API key here (e.g. AIzaSy..., sk-..., gsk_...)"
                  className="w-full bg-immersive-bg border border-immersive-border focus:border-immersive-gold rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-immersive-muted/50 focus:outline-none pr-10 transition-colors shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-immersive-muted hover:text-white p-1"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Real-time Detection Tag */}
              <div className="mt-2 flex items-center justify-between bg-immersive-inner/60 border border-immersive-border/60 rounded-lg px-3 py-1.5">
                <span className="text-[11px] font-mono text-immersive-muted flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-immersive-gold" />
                  Status:
                </span>
                <span className="text-[11px] font-mono font-bold text-immersive-green">
                  {detectedInfo.label}
                </span>
              </div>
            </div>

            {/* Advanced Customizations Dropdown Toggle */}
            <div className="border border-immersive-border/60 rounded-xl overflow-hidden bg-immersive-inner/30">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-mono text-immersive-gold hover:bg-immersive-inner/50 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5 font-bold">
                  <Sliders className="w-3.5 h-3.5" />
                  Optional Endpoint & Model Overrides
                </span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvanced && (
                <div className="p-3.5 border-t border-immersive-border/60 space-y-3 bg-immersive-bg/50">
                  {/* Provider Choice */}
                  <div>
                    <label className="text-[11px] font-mono text-immersive-muted block mb-1">
                      Provider Engine
                    </label>
                    <select
                      value={provider}
                      onChange={(e) => {
                        const p = e.target.value as AIProvider;
                        setProvider(p);
                        setTestResult(null);
                      }}
                      className="w-full bg-immersive-inner border border-immersive-border rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-immersive-gold"
                    >
                      <option value="auto">✨ Auto-Detect from Key (Recommended)</option>
                      <option value="gemini">Google Gemini (Gemini 2.5/2.0 Flash)</option>
                      <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                      <option value="anthropic">Anthropic Claude (Claude 3.5 Sonnet)</option>
                      <option value="groq">Groq High-Speed (Llama 3.3 70B)</option>
                      <option value="openrouter">OpenRouter Gateway</option>
                      <option value="deepseek">DeepSeek (V3 / R1)</option>
                      <option value="custom">Custom Endpoint (Ollama / Proxy)</option>
                    </select>
                  </div>

                  {/* Custom Model Name */}
                  <div>
                    <label className="text-[11px] font-mono text-immersive-muted block mb-1">
                      Model Identifier (Optional)
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder={`Default: ${detectedInfo.defaultModel}`}
                      className="w-full bg-immersive-inner border border-immersive-border rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-immersive-gold placeholder:text-immersive-muted/40"
                    />
                  </div>

                  {/* Custom Base URL Endpoint */}
                  <div>
                    <label className="text-[11px] font-mono text-immersive-muted block mb-1">
                      Custom Base URL / Endpoint (Optional)
                    </label>
                    <input
                      type="text"
                      value={customEndpoint}
                      onChange={(e) => setCustomEndpoint(e.target.value)}
                      placeholder="e.g. https://api.openai.com/v1 or http://localhost:11434/v1"
                      className="w-full bg-immersive-inner border border-immersive-border rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-immersive-gold placeholder:text-immersive-muted/40"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Test Connection Output Box */}
            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                  testResult.success
                    ? 'bg-immersive-green/10 border-immersive-green/40 text-immersive-green'
                    : 'bg-immersive-red/10 border-immersive-red/40 text-immersive-red'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-bold">{testResult.message}</p>
                  {testResult.engineName && (
                    <p className="text-[10px] opacity-80 mt-0.5">
                      Engine: {testResult.engineName} {testResult.latencyMs ? `• ${testResult.latencyMs}ms` : ''}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Security note */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-immersive-muted/80 bg-immersive-inner/20 p-2 rounded-lg border border-immersive-border/30">
              <ShieldCheck className="w-3.5 h-3.5 text-immersive-gold shrink-0" />
              <span>Your API keys are stored locally on your device and sent securely through direct TLS calls.</span>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-immersive-border bg-immersive-inner/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full sm:w-auto px-4 py-2 bg-immersive-inner hover:bg-immersive-inner/80 border border-immersive-border hover:border-immersive-gold text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-immersive-gold" />
                  <span>Verifying API...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-immersive-gold" />
                  <span>Test API Connection</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-3.5 py-2 text-immersive-muted hover:text-white font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="w-1/2 sm:w-auto px-5 py-2 bg-immersive-gold hover:bg-immersive-gold/90 text-black font-mono text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save API Key</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
