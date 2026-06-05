import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import { authAPI } from '../lib/api'
import { useAuthStore } from '../store'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authAPI.login(email, password)
      const token = res.data.access_token
      const name = email.split('@')[0]
      setAuth(token, { email, name })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(13,21,40,1) 0%, rgba(20,12,50,1) 100%)' }}>
        {/* Grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Glows */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-12 max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 60px rgba(99,102,241,0.4)' }}>
            <Zap size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4 gradient-text" style={{ fontFamily: 'Syne' }}>
            DebugMind AI
          </h2>
          <p className="text-base leading-relaxed" style={{ color: '#64748b', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
            Understand bugs before they break production. AI-powered root cause analysis for developers.
          </p>
          
          {/* Feature bullets */}
          <div className="mt-8 space-y-3 text-left">
            {['Instant root cause analysis', 'AI-generated fix suggestions', 'Full debugging history', 'Supports all major languages'].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#6366f1' }} />
                <span className="text-sm" style={{ color: '#64748b', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold gradient-text" style={{ fontFamily: 'Syne' }}>DebugMind AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>Welcome back</h1>
            <p className="text-sm" style={{ color: '#475569', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
              Sign in to your debugging workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}>
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            {[
              { label: 'Email', type: 'email', value: email, setValue: setEmail, placeholder: 'you@company.com' },
            ].map(({ label, type, value, setValue, placeholder }) => (
              <div key={label}>
                <label className="block text-xs font-medium mb-1.5"
                  style={{ color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  required
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(99,102,241,0.05)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    color: '#f1f5f9',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '0.82rem',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.15)'}
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium mb-1.5"
                style={{ color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(99,102,241,0.05)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    color: '#f1f5f9',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '0.82rem',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.15)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#475569' }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all"
              style={{
                background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                fontFamily: 'Syne',
                boxShadow: loading ? 'none' : '0 0 30px rgba(99,102,241,0.35)',
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight size={14} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#475569', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}>
            No account?{' '}
            <Link to="/register" className="transition-colors" style={{ color: '#6366f1' }}>
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
