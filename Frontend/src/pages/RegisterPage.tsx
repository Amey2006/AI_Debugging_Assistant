import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { authAPI } from '../lib/api'
import { useAuthStore } from '../store'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Has a number', ok: /\d/.test(password) },
    { label: 'Has special char', ok: /[^a-zA-Z0-9]/.test(password) },
  ]
  const strength = checks.filter((c) => c.ok).length
  const colors = ['#ef4444', '#f59e0b', '#10b981']
  const labels = ['Weak', 'Fair', 'Strong']

  if (!password) return null
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all"
            style={{ background: i < strength ? colors[strength - 1] : 'rgba(255,255,255,0.06)' }} />
        ))}
      </div>
      <p className="text-xs" style={{ color: strength > 0 ? colors[strength - 1] : '#475569', fontFamily: 'JetBrains Mono' }}>
        {strength > 0 ? labels[strength - 1] : ''}
      </p>
      <div className="space-y-1">
        {checks.map(({ label, ok }) => (
          <div key={label} className="flex items-center gap-1.5">
            <CheckCircle2 size={11} style={{ color: ok ? '#10b981' : '#334155' }} />
            <span className="text-xs" style={{ color: ok ? '#10b981' : '#334155', fontFamily: 'JetBrains Mono', fontSize: '0.7rem' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [username, setName] = useState('')
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
      await authAPI.register(email, password, username)
      // Auto login after register
      const res = await authAPI.login(email, password)
      setAuth(res.data.access_token, { email, name: username })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed. Try a different email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(13,21,40,1) 0%, rgba(15,8,40,1) 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-12 max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', boxShadow: '0 0 60px rgba(139,92,246,0.4)' }}>
            <Zap size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Syne', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Start Debugging Smarter
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#64748b', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>
            Join developers who use DebugMind AI to resolve bugs faster and understand root causes deeply.
          </p>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold gradient-text" style={{ fontFamily: 'Syne' }}>DebugMind AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>Create account</h1>
            <p className="text-sm" style={{ color: '#475569', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
              Free forever. No credit card required.
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
              { label: 'Name', type: 'text', value: username, setValue: setName, placeholder: 'John Developer' },
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
                  className="absolute right-3 top-3 transition-colors" style={{ color: '#475569' }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all mt-2"
              style={{
                background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                fontFamily: 'Syne',
                boxShadow: loading ? 'none' : '0 0 30px rgba(99,102,241,0.35)',
              }}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : (
                <>Create Free Account <ArrowRight size={14} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#475569', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6366f1' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
