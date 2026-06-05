import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bug, Play, Upload, Copy, CheckCheck, AlertTriangle,

  Cpu, Lightbulb, Code2, Loader2, ChevronDown, Trash2
} from 'lucide-react'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import { useDebugStore } from '../store'
import { debugAPI } from '../lib/api'
import { nanoid } from '../lib/nanoid'

const languages = ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Rust', 'C++', 'C#']

function SeverityBadge({ category }: { category: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    name_error: { color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
    type_error: { color: '#fb923c', bg: 'rgba(249,115,22,0.1)' },
    syntax_error: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    index_error: { color: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
    attribute_error: { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
    general: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
  }
  const style = map[category?.toLowerCase()] || map['general']
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ color: style.color, background: style.bg, fontFamily: 'JetBrains Mono', fontSize: '0.72rem' }}>
      {category?.replace(/_/g, ' ').toUpperCase() || 'UNKNOWN'}
    </span>
  )
}

function StreamingText({ text }: { text: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  )
}

function SkeletonLoader() {
  return (
    <div className="space-y-3 p-4">
      {[80, 60, 90, 50, 70].map((w, i) => (
        <div key={i} className="h-3 rounded shimmer" style={{ width: `${w}%` }} />
      ))}
      <div className="h-24 rounded shimmer mt-4" />
      <div className="h-3 rounded shimmer" style={{ width: '40%' }} />
    </div>
  )
}

export default function DebugPage() {
  const [code, setCode] = useState<string>('# Paste your code here\ndef greet(name):\n    print("Hello, " + nam)  # Bug: undefined variable\n\ngreet("World")')
  const [errorMsg, setErrorMsg] = useState("NameError: name 'nam' is not defined")
  const [language, setLanguage] = useState('Python')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ error_type: string; category: string; ai_response: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [langDropdown, setLangDropdown] = useState(false)
  const [streamedText, setStreamedText] = useState('')
  const { addToHistory, setCurrentAnalysis } = useDebugStore()
  const resultRef = useRef<HTMLDivElement>(null)

  // Simulate streaming effect
  useEffect(() => {
    if (!result?.ai_response) return
    setStreamedText('')
    const text = result.ai_response
    let i = 0
    const interval = setInterval(() => {
      i += 8
      setStreamedText(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, 12)
    return () => clearInterval(interval)
  }, [result?.ai_response])

  const handleAnalyze = async () => {
    if (!code.trim() || !errorMsg.trim()) return
    setLoading(true)
    setResult(null)
    setStreamedText('')
    try {
      const res = await debugAPI.analyzeError(code, errorMsg)
      const data = res.data
      setResult(data)
      const historyItem = {
        id: nanoid(),
        code,
        error_message: errorMsg,
        error_type: data.error_type || 'Unknown',
        category: data.category || 'general',
        ai_response: data.ai_response,
        timestamp: new Date().toISOString(),
        language,
        severity: 'high' as const,
      }
      addToHistory(historyItem)
      setCurrentAnalysis(historyItem)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
    } catch (err: any) {
      setResult({
        error_type: 'API Error',
        category: 'general',
        ai_response: `## Connection Error\n\nCouldn't reach the backend API.\n\n**Please check if the API is running and reachable at:**\n\`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}\``,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (result?.ai_response) {
      navigator.clipboard.writeText(result.ai_response)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCode(ev.target?.result as string || '')
    reader.readAsText(file)
  }

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Input */}
      <div className="lg:w-[45%] flex flex-col border-r overflow-hidden"
        style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
        {/* Panel header */}
        <div className="px-4 py-3 flex items-center justify-between shrink-0"
          style={{ borderBottom: '1px solid rgba(99,102,241,0.08)', background: 'rgba(8,13,26,0.5)' }}>
          <div className="flex items-center gap-2">
            <Code2 size={14} style={{ color: '#6366f1' }} />
            <span className="text-sm font-medium" style={{ fontFamily: 'Syne', color: '#94a3b8' }}>Code Input</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>
                {language}
                <ChevronDown size={11} />
              </button>
              <AnimatePresence>
                {langDropdown && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute right-0 top-8 z-50 rounded-lg overflow-hidden w-36"
                    style={{ background: '#0d1528', border: '1px solid rgba(99,102,241,0.2)' }}>
                    {languages.map((l) => (
                      <button key={l} onClick={() => { setLanguage(l); setLangDropdown(false) }}
                        className="w-full text-left px-3 py-1.5 text-xs transition-all hover:bg-white/5"
                        style={{ color: l === language ? '#6366f1' : '#94a3b8', fontFamily: 'JetBrains Mono' }}>
                        {l}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Upload */}
            <label className="cursor-pointer px-2.5 py-1 rounded-md text-xs flex items-center gap-1 transition-all"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>
              <Upload size={11} /> Upload
              <input type="file" accept=".py,.js,.ts,.java,.go,.rs,.cpp,.cs,.txt" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {/* Monaco editor */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <Editor
            height="100%"
            language={language.toLowerCase() === 'javascript' ? 'javascript' : language.toLowerCase() === 'typescript' ? 'typescript' : 'python'}
            value={code}
            onChange={(v) => setCode(v || '')}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: 'JetBrains Mono',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'gutter',
              padding: { top: 12 },
              wordWrap: 'on',
              contextmenu: false,
              smoothScrolling: true,
            }}
          />
        </div>

        {/* Error input */}
        <div className="px-4 pt-3 pb-2 shrink-0"
          style={{ borderTop: '1px solid rgba(99,102,241,0.08)', background: 'rgba(8,13,26,0.5)' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={12} style={{ color: '#ef4444' }} />
            <label className="text-xs font-medium" style={{ color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>
              Error Message / Stack Trace
            </label>
          </div>
          <textarea
            value={errorMsg}
            onChange={(e) => setErrorMsg(e.target.value)}
            placeholder="Paste your error message or stack trace here..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none transition-all"
            style={{
              background: 'rgba(239,68,68,0.04)',
              border: '1px solid rgba(239,68,68,0.15)',
              color: '#fca5a5',
              fontFamily: 'JetBrains Mono',
              lineHeight: 1.6,
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(239,68,68,0.4)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(239,68,68,0.15)'}
          />
        </div>

        {/* Analyze button */}
        <div className="px-4 pb-4 shrink-0">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={loading || !code.trim() || !errorMsg.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all"
            style={{
              background: loading || !code.trim() || !errorMsg.trim()
                ? 'rgba(99,102,241,0.3)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              fontFamily: 'Syne',
              boxShadow: loading ? 'none' : '0 0 30px rgba(99,102,241,0.3)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <><Loader2 size={15} className="animate-spin" /> Analyzing with AI...</>
            ) : (
              <><Play size={14} /> Analyze Error</>
            )}
          </motion.button>
        </div>
      </div>

      {/* Right Panel - Results */}
      <div className="flex-1 overflow-auto" ref={resultRef}>
        <AnimatePresence mode="wait">
          {!result && !loading && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <Bug size={28} style={{ color: '#6366f1' }} />
                <div className="absolute inset-0 rounded-2xl animate-pulse-glow"
                  style={{ background: 'rgba(99,102,241,0.1)', filter: 'blur(12px)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>
                AI Debug Analysis
              </h3>
              <p className="text-sm max-w-xs" style={{ color: '#475569', fontFamily: 'JetBrains Mono', lineHeight: 1.7, fontSize: '0.8rem' }}>
                Paste your code and error message, then click <strong style={{ color: '#6366f1' }}>Analyze Error</strong> to get instant AI-powered debugging insights.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-3 w-full max-w-xs">
                {[
                  { icon: Cpu, label: 'Root Cause Analysis' },
                  { icon: Lightbulb, label: 'Fix Suggestions' },
                  { icon: Code2, label: 'Corrected Code' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.08)' }}>
                    <Icon size={14} style={{ color: '#6366f1' }} />
                    <span className="text-xs" style={{ color: '#64748b', fontFamily: 'JetBrains Mono' }}>{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="p-4 border-b flex items-center gap-3"
                style={{ borderColor: 'rgba(99,102,241,0.08)', background: 'rgba(8,13,26,0.5)' }}>
                <Loader2 size={14} className="animate-spin" style={{ color: '#6366f1' }} />
                <span className="text-sm" style={{ fontFamily: 'JetBrains Mono', color: '#64748b', fontSize: '0.78rem' }}>
                  AI is analyzing your error...
                </span>
                <div className="flex gap-1 ml-auto">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full" style={{ background: '#6366f1' }} />
                  ))}
                </div>
              </div>
              <SkeletonLoader />
            </motion.div>
          )}

          {result && !loading && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-5 space-y-4">
              {/* Result header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertTriangle size={12} style={{ color: '#ef4444' }} />
                    <span className="text-xs font-medium" style={{ color: '#fca5a5', fontFamily: 'Syne' }}>
                      {result.error_type}
                    </span>
                  </div>
                  <SeverityBadge category={result.category} />
                </div>
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all"
                    style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>
                    {copied ? <><CheckCheck size={11} style={{ color: '#10b981' }} /> Copied</> : <><Copy size={11} /> Copy Fix</>}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { setResult(null); setStreamedText('') }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>
                    <Trash2 size={11} /> Clear
                  </motion.button>
                </div>
              </div>

              {/* AI confidence bar */}
              <div className="p-3 rounded-lg"
                style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>AI Confidence</span>
                  <span className="text-xs font-bold" style={{ color: '#10b981', fontFamily: 'Syne' }}>94%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(99,102,241,0.1)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '94%' }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #6366f1, #10b981)' }}
                  />
                </div>
              </div>

              {/* AI response with streaming effect */}
              <div className="p-4 rounded-xl relative"
                style={{ background: 'rgba(13,21,40,0.6)', border: '1px solid rgba(99,102,241,0.12)' }}>
                <div className="flex items-center gap-2 mb-3 pb-3"
                  style={{ borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
                  <div className="w-5 h-5 rounded flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <Cpu size={11} className="text-white" />
                  </div>
                  <span className="text-xs font-medium" style={{ fontFamily: 'Syne', color: '#94a3b8' }}>
                    DebugMind AI Response
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full ml-auto animate-pulse"
                    style={{ background: '#10b981' }} />
                </div>
                <StreamingText text={streamedText} />
                {streamedText.length < (result.ai_response?.length || 0) && (
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                    style={{ background: '#6366f1' }} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
