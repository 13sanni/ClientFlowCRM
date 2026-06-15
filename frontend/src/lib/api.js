const API_BASE = import.meta.env.VITE_API_URL || '/api'

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data
    this.name = 'ApiError'
  }
}

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Send cookies for refresh token

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config)
    let data = await response.json().catch(() => null)

    if (!response.ok) {
      if (response.status === 401 && endpoint !== '/auth/sign-in' && endpoint !== '/auth/refresh') {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(() => request(endpoint, options)).catch((err) => { throw err })
        }

        isRefreshing = true

        try {
          const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          })

          if (!refreshRes.ok) throw new Error('Refresh failed')

          const refreshData = await refreshRes.json()
          localStorage.setItem('auth_token', refreshData.accessToken)
          
          isRefreshing = false
          processQueue(null, refreshData.accessToken)
          
          // Retry the original request
          return request(endpoint, options)
        } catch (refreshErr) {
          isRefreshing = false
          processQueue(refreshErr, null)
          localStorage.removeItem('auth_token')
          window.dispatchEvent(new Event('auth:unauthorized'))
          throw new ApiError('Session expired', 401, null)
        }
      }

      if (response.status === 401) {
        localStorage.removeItem('auth_token')
        window.dispatchEvent(new Event('auth:unauthorized'))
      }

      throw new ApiError(data?.message || response.statusText, response.status, data)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message, 0, null)
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data, options) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  patch: (endpoint, data, options) => request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
}
