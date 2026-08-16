import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  ExternalLink,
  Sliders
} from 'lucide-react';
import { AIProvider, AISettingsConfig } from '../types';

export const DEFAULT_AI_SETTINGS: AISettingsConfig = {
  provider: 'built_in',
  apiKey: '',
  customEndpoint: '',
  model: 'gemini-2.5-flash',
  temperature: 0.2
};

const PROVIDER_PRESETS: {
  id: AIProvider;
  name: string;
  badge: string;
  color: string;
  defaultEndpoint: string;
  models: { id: string; label: string; desc: string }[];
  keyHelpUrl?: string;
  keyPlaceholder: string;
}[] = [
  {
    id: 'built_in',
    name: 'Cryptronix Built-in Core',
    badge: 'Standard Ready',
    color: 'from-amber-500/20 to-yellow-500/20 text-immersive-gold border-immersive-gold/30',
    defaultEndpoint: '',
    models: [
      { id: 'gemini-2.5-flash', label: 'Quant Flash Core (Default)', desc: 'Built-in server-side quantitative engine' }
    ],
    keyPlaceholder: 'No API key needed — uses built-in server matrix'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    badge: 'Native Google GenAI',
    color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30',
    defaultEndpoint: 'https://generativelanguage.googleapis.com',
    models: [
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', desc: 'Fast, high-fidelity quantitative analysis' },
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', desc: 'Next-gen real-time multimodal reasoning' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', desc: 'Deep complex technical pattern reasoning' }
    ],
    keyHelpUrl: 'https://aistudio.google.com/app/apikey',
    keyPlaceholder: 'AIzaSy...'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    badge: 'GPT-4o Matrix',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    defaultEndpoint: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o', desc: 'Flagship omni model with exceptional quant logic' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini', desc: 'Affordable, low latency high throughput' },
      { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', desc: 'High context comprehensive scanner' }
    ],
    keyHelpUrl: 'https://platform.openai.com/api-keys',
    keyPlaceholder: 'sk-proj-...'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    badge: 'Claude 3.5 Sonnet',
    color: 'from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30',
    defaultEndpoint: 'https://api.anthropic.com/v1',
    models: [
      { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', desc: 'Industry-leading reasoning & code synthesis' },
      { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku', desc: 'Ultra-fast tactical scan execution' },
      { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus', desc: 'Heavy analytical synthesis' }
    ],
    keyHelpUrl: 'https://console.anthropic.com/settings/keys',
    keyPlaceholder: 'sk-ant-api03-...'
  },
  {
    id: 'groq',
    name: 'Groq Cloud',
    badge: 'Llama 3.3 (LPUs)',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    defaultEndpoint: 'https://api.groq.com/openai/v1',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', desc: 'Ultra-fast ~800 tok/s LPU execution' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', desc: 'High-speed multi-expert engine' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant', desc: 'Sub-100ms ultra-low latency response' }
    ],
    keyHelpUrl: 'https://console.groq.com/keys',
    keyPlaceholder: 'gsk_...'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek AI',
    badge: 'DeepSeek V3 / R1',
    color: 'from-blue-600/20 to-indigo-600/20 text-blue-400 border-blue-500/30',
    defaultEndpoint: 'https://api.deepseek.com/v1',
    models: [
      { id: 'deepseek-chat', label: 'DeepSeek-V3 (Chat)', desc: 'State-of-the-art open quant reasoning' },
      { id: 'deepseek-reasoner', label: 'DeepSeek-R1 (Reasoner)', desc: 'Chain-of-thought mathematical risk breakdown' }
    ],
    keyHelpUrl: 'https://platform.deepseek.com/api_keys',
    keyPlaceholder: 'sk-...'
  },
  {
    id: 'custom',
    name: 'Custom / Ollama / Local',
    badge: 'OpenAI-Compatible',
    color: 'from-gray-500/20 to-zinc-500/20 text-gray-300 border-gray-500/30',
    defaultEndpoint: 'http://localhost:11434/v1',
    models: [
      { id: 'llama3', label: 'Ollama Llama3', desc: 'Local Ollama model' },
      { id: 'mistral', label: 'Ollama Mistral', desc: 'Local Mistral model' },
      { id: 'openrouter/auto', label: 'OpenRouter Auto', desc: 'OpenRouter unified gateway' }
    ],
    keyPlaceholder: 'Optional for local Ollama / LM Studio, required for proxies'
  }
];

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
  const [form, setForm] = useState<AISettingsConfig>(config);
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs?: number;
    message?: string;
    error?: string;
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setForm(config);
    setTestResult(null);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const currentPreset = PROVIDER_PRESETS.find(p => p.id === form.provider) || PROVIDER_PRESETS[0];

  const handleProviderSelect = (providerId: AIProvider) => {
    const preset = PROVIDER_PRESETS.find(p => p.id === providerId);
    if (!preset) return;

    setForm(prev => ({
      ...prev,
      provider: providerId,
      model: preset.models[0]?.id || prev.model,
      customEndpoint: providerId === 'custom' ? (prev.customEndpoint || preset.defaultEndpoint) : preset.defaultEndpoint
    }));
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const resp = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: form.provider,
          apiKey: form.apiKey,
          customEndpoint: form.customEndpoint,
          model: form.model
        })
      });

      const data = await resp.json();
      if (resp.ok && data.success) {
        setTestResult({
          success: true,
          latencyMs: data.latencyMs,
          message: data.message || `Connection active! Latency: ${data.latencyMs}ms`
        });
      } else {
        setTestResult({
          success: false,
          error: data.error || 'Connection rejected by host'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Failed to reach backend test route'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveConfig(form);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setForm(DEFAULT_AI_SETTINGS);
    setTestResult(null);
  };

  return (
    <div id="ai_settings_modal_overlay" className="fixed inset-0 z-50 bg-immersive-bg/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-immersive-card border border-immersive-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-immersive-border bg-immersive-header/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-immersive-gold/15 border border-immersive-gold/30 flex items-center justify-center text-immersive-gold shadow-[0_0_15px_rgba(243,186,47,0.2)]">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-white font-mono font-bold text-base flex items-center gap-2">
                AI Engine & Custom API Settings
                <span className="text-[10px] px-2 py-0.5 bg-immersive-green/10 text-immersive-green border border-immersive-green/30 rounded-full font-mono">
                  Multi-LLM Matrix
                </span>
              </h2>
              <p className="text-xs text-immersive-muted font-mono">
                Connect your personal API key or custom endpoint to drive technical AI searches
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-immersive-muted hover:text-white p-1.5 rounded-lg border border-transparent hover:border-immersive-border transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 font-mono text-xs">
          
          {/* Provider Selection Tabs */}
          <div>
            <label className="block text-[10px] font-bold text-immersive-muted uppercase tracking-wider mb-2">
              Select AI Engine Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {PROVIDER_PRESETS.map((p) => {
                const isSelected = form.provider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProviderSelect(p.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? `bg-gradient-to-br ${p.color} border-current shadow-sm`
                        : 'bg-immersive-inner/60 border-immersive-border text-immersive-muted hover:border-immersive-muted/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-[#EAECEF]'}`}>
                        {p.name.split(' ')[0]}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-current shrink-0" />}
                    </div>
                    <span className="text-[9px] opacity-75 truncate">{p.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Provider Config Box */}
          <div className="bg-immersive-inner/80 border border-immersive-border rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-immersive-border/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-immersive-gold" />
                <span className="font-bold text-white text-xs">{currentPreset.name} Configuration</span>
              </div>
              {currentPreset.keyHelpUrl && (
                <a
                  href={currentPreset.keyHelpUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-immersive-gold hover:underline flex items-center gap-1"
                >
                  Get API Key <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* API Key Input (Hidden if built_in) */}
            {form.provider !== 'built_in' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-immersive-muted uppercase flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-immersive-gold" />
                    API Key {form.provider === 'custom' ? '(Optional for local)' : '(Required)'}
                  </label>
                  {form.apiKey && (
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, apiKey: '' }))}
                      className="text-[10px] text-immersive-red hover:underline"
                    >
                      Clear Key
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={form.apiKey}
                    onChange={(e) => setForm(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder={currentPreset.keyPlaceholder}
                    className="w-full bg-immersive-bg border border-immersive-border text-white text-xs rounded-xl py-2.5 pl-3 pr-10 focus:border-immersive-gold/60 outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-immersive-muted hover:text-white cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Custom Endpoint URL (for Custom, OpenAI proxy, Groq, Ollama) */}
            {(form.provider === 'custom' || form.provider === 'openai' || form.provider === 'deepseek' || form.provider === 'groq') && (
              <div>
                <label className="block text-[10px] font-bold text-immersive-muted uppercase mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Base Endpoint URL
                </label>
                <input
                  type="text"
                  value={form.customEndpoint || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, customEndpoint: e.target.value }))}
                  placeholder={currentPreset.defaultEndpoint || 'https://api.openai.com/v1'}
                  className="w-full bg-immersive-bg border border-immersive-border text-white text-xs rounded-xl p-2.5 focus:border-immersive-gold/60 outline-none font-mono"
                />
                <p className="text-[10px] text-immersive-muted mt-1">
                  {form.provider === 'custom' 
                    ? 'Use http://localhost:11434/v1 for Ollama, http://localhost:1234/v1 for LM Studio, or your reverse proxy.' 
                    : 'Default endpoint automatically routes to standard provider gateway.'}
                </p>
              </div>
            )}

            {/* Model Name & Presets */}
            <div>
              <label className="block text-[10px] font-bold text-immersive-muted uppercase mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Target AI Model
              </label>

              {/* Preset Model Buttons */}
              {currentPreset.models.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  {currentPreset.models.map((m) => {
                    const isModelActive = form.model === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, model: m.id }))}
                        className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          isModelActive
                            ? 'bg-immersive-gold/15 border-immersive-gold text-white font-bold'
                            : 'bg-immersive-bg/70 border-immersive-border text-immersive-muted hover:text-white hover:border-immersive-muted/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px]">{m.label}</span>
                          {isModelActive && <span className="w-1.5 h-1.5 rounded-full bg-immersive-gold animate-pulse" />}
                        </div>
                        <span className="text-[9px] text-immersive-muted font-normal block mt-0.5 truncate">{m.desc}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Custom Model Name Input */}
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                placeholder="Or type custom model name (e.g. gpt-4o, llama-3.3-70b-versatile)..."
                className="w-full bg-immersive-bg border border-immersive-border text-white text-xs rounded-xl p-2.5 focus:border-immersive-gold/60 outline-none font-mono"
              />
            </div>

            {/* Temperature / Creativity */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold text-immersive-muted uppercase flex items-center gap-1">
                  <Sliders className="w-3 h-3" />
                  Sampling Temperature: {form.temperature ?? 0.2}
                </label>
                <span className="text-[9px] text-immersive-gold font-bold">
                  {(form.temperature ?? 0.2) <= 0.2 ? 'Deterministic Quant (Recommended)' : 'Analytical Flow'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={form.temperature ?? 0.2}
                onChange={(e) => setForm(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full accent-immersive-gold cursor-pointer"
              />
            </div>

            {/* Test Connection Button & Result */}
            <div className="pt-2 border-t border-immersive-border/60">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || (form.provider !== 'built_in' && form.provider !== 'custom' && !form.apiKey)}
                  className="bg-immersive-inner hover:bg-immersive-inner/80 border border-immersive-border hover:border-immersive-gold/40 text-white font-bold py-2 px-3.5 rounded-xl flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-immersive-gold ${isTesting ? 'animate-spin' : ''}`} />
                  {isTesting ? 'Testing API Link...' : 'Test Connection'}
                </button>

                {testResult && (
                  <div className={`flex-1 p-2 rounded-xl border text-[11px] flex items-center gap-2 ${
                    testResult.success 
                      ? 'bg-immersive-green/10 border-immersive-green/30 text-immersive-green' 
                      : 'bg-immersive-red/10 border-immersive-red/30 text-immersive-red'
                  }`}>
                    {testResult.success ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span className="truncate">{testResult.message} ({testResult.latencyMs}ms)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="truncate">{testResult.error}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Security & Local Storage Notice */}
          <div className="bg-immersive-inner/40 border border-immersive-border/60 rounded-xl p-3 flex items-start gap-2.5 text-immersive-muted text-[10px] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-immersive-green shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#EAECEF] block">Zero-Data Exposure Privacy Protocol:</strong>
              Your custom API keys are kept safely in your local browser storage. Requests are proxied via server-side execution directly to your designated API provider without persistence to permanent databases.
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-immersive-border bg-immersive-header/50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-immersive-muted hover:text-white text-xs font-mono py-2 px-3 rounded-lg transition-colors cursor-pointer"
          >
            Reset to Built-in Engine
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-immersive-inner hover:bg-immersive-inner/80 border border-immersive-border text-immersive-muted hover:text-white font-mono text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-immersive-green hover:bg-[#02C076EE] text-immersive-bg font-mono font-black text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(2,192,118,0.25)] transition-all cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  SAVED!
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  SAVE & ACTIVATE ENGINE
                </>
              )}
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
