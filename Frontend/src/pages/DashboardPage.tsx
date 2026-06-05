import { motion } from 'framer-motion'
import { Bug, CheckCircle2, TrendingUp, Zap, ArrowRight, Clock, AlertTriangle } from 'lucide-react'
import { useDebugStore, useAuthStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { day: 'Mon', bugs: 3 }, { day: 'Tue', bugs: 7 }, { day: 'Wed', bugs: 5 },
  { day: 'Thu', bugs: 12 }, { day: 'Fri', bugs: 8 }, { day: 'Sat', bugs: 4 }, { day: 'Sun', bugs: 6 },
]

const errorExamples = [
  { label: 'NameError', code: "name 'x' is not defined", category: 'name_error', sev: 'high' },
  { label: 'TypeError', code: "unsupported operand type(s) for +: 'int' and 'str'", category: 'type_error', sev: 'medium' },
  { label: 'IndexError', code: 'list index out of range', category: 'index_error', sev: 'high' },
]

const severityColors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981', critical: '#8b5cf6' }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function DashboardPage() {
  const { history } = useDebugStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const resolved = history.filter((h) => h.ai_response).length
  const recent = history.slice(0, 5)

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Welcome header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>
            Good morning, {user?.name || 'Developer'} 👋
          </h2>
          <p className="text-sm mt-1" style={{ color: '#475569', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}>
            {history.length} analyses total · {resolved} resolved
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/debug')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            fontFamily: 'Syne',
            boxShadow: '0 0 24px rgba(99,102,241,0.35)',
          }}
        >
          <Bug size={14} />
          Analyze Error
          <ArrowRight size={12} />
        </motion.button>
      </motion.div>

      {/* Stats cards */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Bug, label: 'Total Analyses', value: history.length, color: '#6366f1', glow: 'rgba(99,102,241,0.2)' },
          { icon: CheckCircle2, label: 'Resolved', value: resolved, color: '#10b981', glow: 'rgba(16,185,129,0.2)' },
          { icon: TrendingUp, label: 'This Week', value: chartData.reduce((a, b) => a + b.bugs, 0), color: '#06b6d4', glow: 'rgba(6,182,212,0.2)' },
          { icon: Zap, label: 'AI Accuracy', value: '94%', color: '#8b5cf6', glow: 'rgba(139,92,246,0.2)' },
        ].map(({ icon: Icon, label, value, color, glow }) => (
          <motion.div key={label} variants={item}
            className="p-4 rounded-xl relative overflow-hidden"
            style={{ background: 'rgba(13,21,40,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}
            whileHover={{ borderColor: 'rgba(99,102,241,0.3)', scale: 1.01 }}>
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-40"
              style={{ background: glow }} />
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${glow}`, border: `1px solid ${color}30` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-2xl font-bold" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>{label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 p-5 rounded-xl"
          style={{ background: 'rgba(13,21,40,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>
            Debug Activity
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorBugs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} width={25} />
              <Tooltip
                contentStyle={{ background: '#0d1528', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 12, color: '#f1f5f9' }}
                cursor={{ stroke: 'rgba(99,102,241,0.2)' }}
              />
              <Area type="monotone" dataKey="bugs" stroke="#6366f1" strokeWidth={2} fill="url(#colorBugs)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="p-5 rounded-xl space-y-3"
          style={{ background: 'rgba(13,21,40,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>
            Quick Debug
          </h3>
          {errorExamples.map((ex) => (
            <motion.button key={ex.label} whileHover={{ x: 3 }}
              onClick={() => navigate('/debug')}
              className="w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all"
              style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.08)' }}>
              <AlertTriangle size={13} style={{ color: severityColors[ex.sev as keyof typeof severityColors], marginTop: 1 }} />
              <div className="min-w-0">
                <p className="text-xs font-medium" style={{ color: '#94a3b8', fontFamily: 'Syne' }}>{ex.label}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: '#334155', fontFamily: 'JetBrains Mono', fontSize: '0.72rem' }}>{ex.code}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Recent history */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="p-5 rounded-xl"
        style={{ background: 'rgba(13,21,40,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>Recent Analyses</h3>
          <button onClick={() => navigate('/history')} className="text-xs flex items-center gap-1 transition-colors"
            style={{ color: '#6366f1', fontFamily: 'JetBrains Mono' }}>
            View all <ArrowRight size={11} />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-10">
            <Bug size={32} className="mx-auto mb-3" style={{ color: '#334155' }} />
            <p className="text-sm" style={{ color: '#475569', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
              No analyses yet. Start by pasting an error.
            </p>
            <motion.button whileHover={{ scale: 1.03 }} onClick={() => navigate('/debug')}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontFamily: 'Syne' }}>
              <Bug size={14} /> Analyze your first error
            </motion.button>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((item) => (
              <motion.div key={item.id} whileHover={{ x: 2 }}
                className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all"
                style={{ border: '1px solid rgba(99,102,241,0.06)' }}
                onClick={() => navigate('/history')}>
                <div className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: severityColors[item.severity] || '#6366f1' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#f1f5f9', fontFamily: 'Syne', fontSize: '0.82rem' }}>
                    {item.error_type}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: '#334155', fontFamily: 'JetBrains Mono', fontSize: '0.72rem' }}>
                    {item.error_message}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0" style={{ color: '#334155' }}>
                  <Clock size={11} />
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem' }}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
