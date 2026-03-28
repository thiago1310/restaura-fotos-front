import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getCreditBalance, registerUser, setStoredAuthToken } from '@/services/authService'
import { useAppStore } from '@/store/appStore'

function toNameTitleCase(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .trimStart()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function CadastroPage() {
  const navigate = useNavigate()
  const setAuthSession = useAppStore((state) => state.setAuthSession)
  const setUserCredits = useAppStore((state) => state.setUserCredits)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)

  function validatePhoneField(phoneValue: string) {
    const phoneDigits = phoneValue.replace(/\D/g, '')
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      setPhoneError('Informe um telefone valido com DDD.')
      return false
    }
    setPhoneError(null)
    return true
  }

  function validateEmailField(emailValue: string) {
    const normalizedEmail = emailValue.trim()
    if (!isValidEmail(normalizedEmail)) {
      setErrorMessage('E-mail invalido.')
      return false
    }
    return true
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedName = toNameTitleCase(nome)
    const normalizedEmail = email.trim()
    if (!normalizedName) {
      setErrorMessage('Informe o nome completo.')
      return
    }

    if (!validateEmailField(normalizedEmail)) {
      return
    }

    if (!validatePhoneField(telefone)) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await registerUser({ nome: normalizedName, email: normalizedEmail, telefone })
      setStoredAuthToken(response.token)

      setAuthSession({
        token: response.token,
        user: {
          id: response.usuario.id,
          name: response.usuario.nome,
          email: response.usuario.email,
          phone: response.usuario.telefone
        }
      })

      const credits = await getCreditBalance(response.token)
      setUserCredits(credits)

      navigate('/payment', { replace: true })
    } catch {
      setErrorMessage('Nao foi possivel concluir o cadastro. Revise os dados e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className='mx-auto max-w-md'>
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar</CardTitle>
          <CardDescription>Crie sua conta para acessar a restauracao de fotos.</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <form className='space-y-3' onSubmit={handleSubmit}>
            <Input
              placeholder='Nome completo'
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              onBlur={() => setNome((currentName) => toNameTitleCase(currentName))}
              required
            />
            <Input
              type='email'
              placeholder='seu@email.com'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => {
                const normalizedEmail = email.trim()
                setEmail(normalizedEmail)
                if (!validateEmailField(normalizedEmail)) return
                setErrorMessage((currentMessage) => (currentMessage === 'E-mail invalido.' ? null : currentMessage))
              }}
              required
            />
            <Input
              placeholder='Telefone com DDD'
              value={telefone}
              onChange={(event) => {
                setTelefone(formatPhone(event.target.value))
                setPhoneError(null)
              }}
              onBlur={() => {
                validatePhoneField(telefone)
              }}
              inputMode='tel'
              maxLength={15}
              required
            />
            {phoneError ? <p className='text-sm text-red-600'>{phoneError}</p> : null}
            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Cadastrando...' : 'Criar conta'}
            </Button>
          </form>

          <p className='text-sm text-ink/80'>
            Ja tem conta?{' '}
            <Link to='/login' className='font-semibold text-brand-700 hover:text-brand-800'>
              Entrar
            </Link>
          </p>

          {errorMessage ? <p className='text-sm text-red-600'>{errorMessage}</p> : null}
        </CardContent>
      </Card>
    </section>
  )
}
