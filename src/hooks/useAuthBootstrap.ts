import { useEffect } from 'react'
import { clearStoredAuthToken, getCreditBalance, getStoredAuthToken, validateToken } from '@/services/authService'
import { useAppStore } from '@/store/appStore'

export function useAuthBootstrap() {
  const setAuthSession = useAppStore((state) => state.setAuthSession)
  const startAuthBootstrap = useAppStore((state) => state.startAuthBootstrap)
  const finishAuthBootstrap = useAppStore((state) => state.finishAuthBootstrap)
  const setUserCredits = useAppStore((state) => state.setUserCredits)
  const clearAuthSession = useAppStore((state) => state.clearAuthSession)

  useEffect(() => {
    const tokenCandidate = getStoredAuthToken()
    if (!tokenCandidate) {
      finishAuthBootstrap()
      return
    }
    const jwtToken = tokenCandidate
    startAuthBootstrap()

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
      } finally {
        if (!cancelled) {
          finishAuthBootstrap()
        }
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [setAuthSession, startAuthBootstrap, finishAuthBootstrap, setUserCredits, clearAuthSession])
}
