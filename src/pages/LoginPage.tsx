import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  clearStoredAuthToken,
  getCreditBalance,
  getStoredAuthToken,
  requestLoginLink,
  setStoredAuthToken,
  validateToken
} from '@/services/authService'
import { useAppStore } from '@/store/appStore'

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tokenFromUrl = useMemo(() => searchParams.get('token'), [searchParams])

  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const user = useAppStore((state) => state.user)
  const setAuthSession = useAppStore((state) => state.setAuthSession)
  const setUserCredits = useAppStore((state) => state.setUserCredits)
  const clearAuthSession = useAppStore((state) => state.clearAuthSession)

  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const tokenCandidate = tokenFromUrl ?? getStoredAuthToken()
    if (!tokenCandidate) return
    const jwtToken = tokenCandidate

    let cancelled = false

    async function bootstrapSession() {
      setIsSubmitting(true)
      setErrorMessage(null)
      setInfoMessage('Validando sessao...')

      try {
        const data = await validateToken(jwtToken)
        if (cancelled) return

        setStoredAuthToken(jwtToken)
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

        navigate('/dashboard', { replace: true })
      } catch {
        if (cancelled) return
        clearStoredAuthToken()
        clearAuthSession()
        setInfoMessage(null)
        setErrorMessage('Nao foi possivel validar o token de login.')
        if (tokenFromUrl) {
          navigate('/login', { replace: true })
        }
      } finally {
        if (!cancelled) {
          setIsSubmitting(false)
        }
      }
    }

    bootstrapSession()

    return () => {
      cancelled = true
    }
  }, [tokenFromUrl, navigate, setAuthSession, setUserCredits, clearAuthSession])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsSubmitting(true)
    setErrorMessage(null)
    setInfoMessage(null)

    try {
      const response = await requestLoginLink(email)
      setInfoMessage(response.message)
    } catch {
      setErrorMessage('Falha ao solicitar login. Confira o e-mail e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className='mx-auto max-w-md'>
      <Card>
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Informe seu e-mail para receber o link de acesso.</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {isAuthenticated ? (
            <div className='space-y-3'>
              <p className='text-sm text-ink/80'>Voce esta logado como {user.name}.</p>
              <Button asChild className='w-full'>
                <Link to='/dashboard'>Ir para dashboard</Link>
              </Button>
            </div>
          ) : (
            <>
              <form className='space-y-3' onSubmit={handleSubmit}>
                <Input
                  type='email'
                  placeholder='seu@email.com'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <Button type='submit' className='w-full' disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar link de login'}
                </Button>
              </form>
              <p className='text-sm text-ink/80'>
                Nao tem conta?{' '}
                <Link to='/cadastro' className='font-semibold text-brand-700 hover:text-brand-800'>
                  Cadastre-se
                </Link>
              </p>
            </>
          )}

          {infoMessage ? <p className='text-sm text-ink/80'>{infoMessage}</p> : null}
          {errorMessage ? <p className='text-sm text-red-600'>{errorMessage}</p> : null}
        </CardContent>
      </Card>
    </section>
  )
}
