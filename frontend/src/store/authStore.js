import { create } from 'zustand'
import { api } from '../lib/api'

// Listen for the unauthorized event from the API client and auto-logout
window.addEventListener('auth:unauthorized', () => {
  useAuthStore.getState().logout()
})

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null })
      // BUG FIX: was '/auth/login' — backend route is '/auth/sign-in'
      const data = await api.post('/auth/sign-in', { email, password })

      localStorage.setItem('auth_token', data.accessToken)

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      })

      return { success: true }
    } catch (error) {
      set({
        error: error.message || 'Failed to login',
        isLoading: false
      })
      return { success: false, error: error.message }
    }
  },

  register: async (payload) => {
    try {
      set({ isLoading: true, error: null })
      // BUG FIX: was '/auth/register' — backend route is '/auth/sign-up'
      const data = await api.post('/auth/sign-up', payload)

      localStorage.setItem('auth_token', data.accessToken)

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      })

      return { success: true }
    } catch (error) {
      set({
        error: error.message || 'Failed to register',
        isLoading: false
      })
      return { success: false, error: error.message }
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout', {})
    } catch {
      // Ignore logout errors — always clear local state
    } finally {
      localStorage.removeItem('auth_token')
      set({ user: null, isAuthenticated: false, error: null })
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      set({ isLoading: false, isAuthenticated: false })
      return
    }

    try {
      // BUG FIX: now validates the token with the server instead of blindly trusting localStorage
      const data = await api.get('/auth/me')
      set({ user: data.user, isAuthenticated: true, isLoading: false })
    } catch {
      // Token is invalid or expired — clear it
      localStorage.removeItem('auth_token')
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  }
}))
