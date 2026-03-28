import { useEffect, useRef } from 'react'
import { clearStoredAuthToken, getCreditBalance, getStoredAuthToken, validateToken } from '@/services/authService'
import { useAppStore } from '@/store/appStore'

export function useAuthBootstrap() {
  const hasBootstrapped = useRef(false)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const setAuthSession = useAppStore((state) => state.setAuthSession)
  const setUserCredits = useAppStore((state) => state.setUserCredits)
  const clearAuthSession = useAppStore((state) => state.clearAuthSession)

  useEffect(() => {
    if (hasBootstrapped.current) return
    hasBootstrapped.current = true

    const tokenCandidate = getStoredAuthToken()
    if (!tokenCandidate || isAuthenticated) return
    const jwtToken = tokenCandidate

    let cancelled = false

    async function restoreSession() {
      try {
        const data = await validateToken(jwtToken)
        if (cancelled) return

        setAuthSession({
          token: jwtToken,
          user: {
            id: data.usuario.id,
            name: data.usuario.nome,
            email: data.usuario.email,
            phone: data.usuario.telefone
          }
        })

        const credits = await getCreditBalance(jwtToken)
        if (cancelled) return
        setUserCredits(credits)
      } catch {
        if (cancelled) return
        clearStoredAuthToken()
        clearAuthSession()
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, setAuthSession, setUserCredits, clearAuthSession])
}
