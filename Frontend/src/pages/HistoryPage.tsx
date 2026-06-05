import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ChevronRight, Clock,
  AlertTriangle, CheckCircle2, Bug, Trash2, Code2
} from 'lucide-react'
import { useDebugStore, type DebugHistoryItem } from '../store'
import ReactMarkdown from 'react-markdown'

const SEVERITY_COLORS = {
  critical: { text: '#c084fc', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.2)' },
  high: { text: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  medium: { text: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
  low: { text: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
}

function HistoryCard({ item, onDelete }: { item: DebugHistoryItem; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const sev = SEVERITY_COLORS[item.severity] || SEVERITY_COLORS.medium

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="rounded-xl overflow-hidden transition-all"
      style={{ background: 'rgba(13,21,40,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}
    >
      {/* Card header */}
      <div className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: sev.bg, border: `1px solid ${sev.border}` }}>
          <AlertTriangle size={14} style={{ color: sev.text }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>
              {item.error_type}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs"
              style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontFamily: 'JetBrains Mono', fontSize: '0.68rem' }}>
              {item.language}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs"
              style={{ background: sev.bg, color: sev.text, fontFamily: 'JetBrains Mono', fontSize: '0.68rem' }}>
              {item.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-xs mt-0.5 truncate" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>
            {item.error_message}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1" style={{ color: '#334155' }}>
            <Clock size={11} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem' }}>
              {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <CheckCircle2 size={10} style={{ color: '#10b981' }} />
            <span className="text-xs" style={{ color: '#10b981', fontFamily: 'JetBrains Mono', fontSize: '0.68rem' }}>Resolved</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="w-6 h-6 rounded flex items-center justify-center transition-all hover:bg-red-500/10"
            style={{ color: '#334155' }}>
            <Trash2 size={12} />
          </motion.button>
          <motion.div animate={{ rotate: expanded ? 90 : 0 }}>
            <ChevronRight size={14} style={{ color: '#475569' }} />
          </motion.div>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t px-4 pb-4 space-y-4" style={{ borderColor: 'rgba(99,102,241,0.08)' }}>
              {/* Code snippet */}
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 size={12} style={{ color: '#6366f1' }} />
                  <span className="text-xs font-medium" style={{ color: '#64748b', fontFamily: 'JetBrains Mono' }}>Code Snippet</span>
                </div>
                <pre className="text-xs p-3 rounded-lg overflow-auto"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(99,102,241,0.1)', color: '#94a3b8', fontFamily: 'JetBrains Mono', maxHeight: 160, lineHeight: 1.6 }}>
                  <code>{item.code}</code>
                </pre>
              </div>

              {/* AI Analysis */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Bug size={12} style={{ color: '#8b5cf6' }} />
                  <span className="text-xs font-medium" style={{ color: '#64748b', fontFamily: 'JetBrains Mono' }}>AI Analysis</span>
                </div>
                <div className="p-3 rounded-lg"
                  style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)' }}>
                  <div className="markdown">
                    <ReactMarkdown>{item.ai_response}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function HistoryPage() {
  const { history, clearHistory } = useDebugStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')

  const filtered = history.filter((h) => {
    const matchSearch = h.error_message.toLowerCase().includes(search.toLowerCase()) ||
      h.error_type.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || h.category === filter
    return matchSearch && matchFilter
  })

  const categories = ['all', ...Array.from(new Set(history.map((h) => h.category)))]

  // Fake delete by rebuilding (zustand doesn't expose item-level delete, add it)
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())
  const visible = filtered.filter((h) => !deletedIds.has(h.id))

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>
            Debug History
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>
            {visible.length} analyses · all time
          </p>
        </div>
        {history.length > 0 && (
          <motion.button whileHover={{ scale: 1.02 }} onClick={clearHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}>
            <Trash2 size={13} /> Clear All
          </motion.button>
        )}
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search errors..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all"
            style={{
              background: 'rgba(99,102,241,0.05)',
              border: '1px solid rgba(99,102,241,0.12)',
              color: '#f1f5f9',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.8rem',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.12)'}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.slice(0, 5).map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              className="px-3 py-1.5 rounded-lg text-xs transition-all"
              style={{
                background: filter === cat ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.05)',
                border: `1px solid ${filter === cat ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.1)'}`,
                color: filter === cat ? '#818cf8' : '#475569',
                fontFamily: 'JetBrains Mono',
              }}>
              {cat === 'all' ? 'All' : cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {visible.length === 0 ? (
          <div className="text-center py-16">
            <Bug size={36} className="mx-auto mb-3" style={{ color: '#334155' }} />
            <p className="text-sm" style={{ color: '#475569', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
              {history.length === 0 ? 'No debug history yet.' : 'No results match your search.'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {visible.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onDelete={() => setDeletedIds((s) => new Set([...s, item.id]))}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
