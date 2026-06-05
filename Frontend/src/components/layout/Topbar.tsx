import { Bell, Search, ChevronDown, Zap } from 'lucide-react'
import { useAuthStore } from '../../store'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface TopbarProps {
  title?: string
  subtitle?: string
}

export default function Topbar({ title = 'Dashboard', subtitle }: TopbarProps) {
  const { user, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between px-6 py-4 shrink-0"
      style={{ borderBottom: '1px solid rgba(99,102,241,0.08)', background: 'rgba(8,13,26,0.8)', backdropFilter: 'blur(20px)' }}>
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>{title}</h1>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all"
          style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', color: '#475569' }}>
          <Search size={13} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>Search anything...</span>
          <kbd className="hidden lg:inline text-xs px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', fontFamily: 'JetBrains Mono', fontSize: '0.65rem' }}>
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="relative w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
          <Bell size={14} style={{ color: '#94a3b8' }} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
            style={{ background: '#6366f1' }} />
        </motion.button>

        {/* User dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}
          >
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm hidden sm:block" style={{ color: '#f1f5f9', fontFamily: 'Syne' }}>
              {user?.name || user?.email?.split('@')[0] || 'User'}
            </span>
            <ChevronDown size={12} style={{ color: '#475569' }} />
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-10 w-48 rounded-xl overflow-hidden z-50"
                style={{ background: '#0d1528', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                <div className="px-3 py-2.5 border-b" style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
                  <p className="text-xs font-medium" style={{ color: '#f1f5f9' }}>{user?.email}</p>
                  <p className="text-xs" style={{ color: '#475569' }}>Free Plan</p>
                </div>
                {[
                  { label: 'Settings', action: () => { navigate('/settings'); setDropdownOpen(false) } },
                  { label: 'Sign Out', action: () => { logout(); navigate('/login') } },
                ].map(({ label, action }) => (
                  <button key={label} onClick={action}
                    className="w-full text-left px-3 py-2 text-sm transition-all hover:bg-white/5"
                    style={{ color: '#94a3b8', fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
