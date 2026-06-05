import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Key, Bell, Code2, Shield, Trash2, CheckCircle2 } from 'lucide-react'
import { useAuthStore, useDebugStore } from '../store'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-10 h-5 rounded-full transition-all duration-300 shrink-0"
      style={{ background: checked ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(99,102,241,0.1)' }}
    >
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
      />
    </button>
  )
}

interface SettingRowProps {
  label: string
  description: string
  children: React.ReactNode
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0"
      style={{ borderColor: 'rgba(99,102,241,0.06)' }}>
      <div className="flex-1 mr-6">
        <p className="text-sm font-medium" style={{ color: '#f1f5f9', fontFamily: 'Syne' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>{description}</p>
      </div>
      {children}
    </div>
  )
}

interface SectionProps {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  title: string
  children: React.ReactNode
}

function Section({ icon: Icon, title, children }: SectionProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl"
      style={{ background: 'rgba(13,21,40,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}>
      <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
        <Icon size={15} style={{ color: '#6366f1' }} />
        <h3 className="text-sm font-semibold" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}

export default function SettingsPage() {
  const { user } = useAuthStore()
  const { clearHistory } = useDebugStore()
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true })
  const [editor, setEditor] = useState({ wordWrap: true, minimap: false, lineNumbers: true })
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gemini-2.5-flash')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-6 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Syne', color: '#f1f5f9' }}>Settings</h2>
          <p className="text-xs mt-0.5" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>
            Manage your preferences and configuration
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            background: saved ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: saved ? '#10b981' : '#fff',
            fontFamily: 'Syne',
            border: saved ? '1px solid rgba(16,185,129,0.3)' : 'none',
          }}>
          {saved ? <><CheckCircle2 size={14} /> Saved!</> : 'Save Changes'}
        </motion.button>
      </div>

      {/* Profile */}
      <Section icon={Settings} title="Profile">
        <SettingRow label="Email" description="Your account email address">
          <span className="text-sm" style={{ color: '#64748b', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}>
            {user?.email || '—'}
          </span>
        </SettingRow>
        <SettingRow label="Display Name" description="Your name shown in the app">
          <input defaultValue={user?.name || ''} className="px-2.5 py-1.5 rounded-md text-sm outline-none w-40"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: '#f1f5f9', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.15)'} />
        </SettingRow>
      </Section>

      {/* AI Configuration */}
      <Section icon={Key} title="AI Configuration">
        <SettingRow label="Gemini API Key" description="Your Google Gemini API key for AI analysis">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIza..."
            className="px-2.5 py-1.5 rounded-md text-sm outline-none w-48"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: '#f1f5f9', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.15)'} />
        </SettingRow>
        <SettingRow label="AI Model" description="Choose the Gemini model for analysis">
          <select value={model} onChange={(e) => setModel(e.target.value)}
            className="px-2.5 py-1.5 rounded-md text-sm outline-none"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: '#94a3b8', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
          </select>
        </SettingRow>
        <div className="pt-2">
          <p className="text-xs" style={{ color: '#334155', fontFamily: 'JetBrains Mono' }}>
            Set <code className="px-1 py-0.5 rounded text-xs" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>GEMINI_API_KEY</code> in your backend <code style={{ color: '#818cf8' }}>.env</code> file for production use.
          </p>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications">
        {(Object.keys(notifications) as Array<keyof typeof notifications>).map((key) => (
          <SettingRow key={key}
            label={{ email: 'Email Notifications', push: 'Push Notifications', weekly: 'Weekly Summary' }[key]}
            description={{ email: 'Receive debug reports via email', push: 'Browser push notifications', weekly: 'Weekly debugging stats digest' }[key]}>
            <Toggle checked={notifications[key]} onChange={(v) => setNotifications({ ...notifications, [key]: v })} />
          </SettingRow>
        ))}
      </Section>

      {/* Editor Preferences */}
      <Section icon={Code2} title="Editor Preferences">
        {(Object.keys(editor) as Array<keyof typeof editor>).map((key) => (
          <SettingRow key={key}
            label={{ wordWrap: 'Word Wrap', minimap: 'Show Minimap', lineNumbers: 'Line Numbers' }[key]}
            description={{ wordWrap: 'Wrap long lines in the code editor', minimap: 'Show code minimap in editor', lineNumbers: 'Show line numbers in editor' }[key]}>
            <Toggle checked={editor[key]} onChange={(v) => setEditor({ ...editor, [key]: v })} />
          </SettingRow>
        ))}
      </Section>

      {/* Danger zone */}
      <Section icon={Shield} title="Data Management">
        <SettingRow label="Clear Debug History" description="Permanently delete all past debug sessions">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { if (confirm('Clear all debug history?')) clearHistory() }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}>
            <Trash2 size={12} /> Clear History
          </motion.button>
        </SettingRow>
      </Section>
    </div>
  )
}
