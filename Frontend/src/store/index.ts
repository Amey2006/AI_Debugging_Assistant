import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DebugHistoryItem {
  id: string
  code: string
  error_message: string
  error_type: string
  category: string
  ai_response: string
  timestamp: string
  language: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface AuthState {
  token: string | null
  user: { email: string; name: string } | null
  setAuth: (token: string, user: { email: string; name: string }) => void
  logout: () => void
}

interface DebugState {
  history: DebugHistoryItem[]
  currentAnalysis: DebugHistoryItem | null
  isAnalyzing: boolean
  addToHistory: (item: DebugHistoryItem) => void
  setCurrentAnalysis: (item: DebugHistoryItem | null) => void
  setIsAnalyzing: (v: boolean) => void
  clearHistory: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
)

export const useDebugStore = create<DebugState>()(
  persist(
    (set) => ({
      history: [],
      currentAnalysis: null,
      isAnalyzing: false,
      addToHistory: (item) =>
        set((state) => ({ history: [item, ...state.history].slice(0, 50) })),
      setCurrentAnalysis: (item) => set({ currentAnalysis: item }),
      setIsAnalyzing: (v) => set({ isAnalyzing: v }),
      clearHistory: () => set({ history: [] }),
    }),
    { name: 'debug-storage' }
  )
)
