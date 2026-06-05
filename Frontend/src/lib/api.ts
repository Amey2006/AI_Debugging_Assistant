import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('auth-storage')
  if (stored) {
    try {
      const { state } = JSON.parse(stored)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    } catch {}
  }
  return config
})

export const authAPI = {
  register: (email: string, password: string, username: string) =>
    api.post('/auth/register', { email, password, username }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
}

export const debugAPI = {
  analyzeError: (code: string, error_message: string) =>
    api.post('/analyze-error', { code, error_message }),
  explain: (prompt: string) =>
    api.post('/explain', { prompt }),
}

export default api
