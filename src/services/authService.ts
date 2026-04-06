import { API_BASE_URL } from '@/services/apiConfig'
import { throwApiError } from '@/services/http'
const AUTH_TOKEN_STORAGE_KEY = 'restaura_fotos_auth_token'

interface BackendUsuario {
  id: string
  nome: string
  email: string
  telefone: string
}

interface ValidarTokenResponse {
  usuario: BackendUsuario
  expiracao: string
}

interface SaldoCreditosResponse {
  saldoAtual: number
}

interface LoginLinkResponse {
  message: string
}

interface CadastroPayload {
  nome: string
  email: string
  telefone: string
}

interface CadastroResponse {
  token: string
  usuario: BackendUsuario
}

export async function requestLoginLink(email: string): Promise<LoginLinkResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })

  if (!response.ok) {
    await throwApiError(response, 'Nao foi possivel enviar o link de login.')
  }

  return response.json()
}

export async function registerUser(payload: CadastroPayload): Promise<CadastroResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/cadastro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    await throwApiError(response, 'Nao foi possivel concluir o cadastro.')
  }

  return response.json()
}

export async function validateToken(token: string): Promise<ValidarTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/validar-token`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    await throwApiError(response, 'Token invalido ou expirado.')
  }

  return response.json()
}

export async function getCreditBalance(token: string): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/creditos/saldo`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    await throwApiError(response, 'Nao foi possivel obter o saldo de creditos.')
  }

  const data: SaldoCreditosResponse = await response.json()
  return data.saldoAtual
}

export function setStoredAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
}

export function getStoredAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
}

export function clearStoredAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
}
