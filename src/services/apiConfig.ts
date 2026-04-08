function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '')
}

function resolveApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim()

  if (configuredUrl) {
    return normalizeBaseUrl(configuredUrl)
  }

  const hostedDefaultUrl = 'https://api.retauraphoto.com.br'

  if (typeof window !== 'undefined') {
    const { hostname } = window.location

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3333'
    }
  }

  return hostedDefaultUrl
}

export const API_BASE_URL = resolveApiBaseUrl()
