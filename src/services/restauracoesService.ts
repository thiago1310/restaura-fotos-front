import { API_BASE_URL } from '@/services/apiConfig'
import { throwApiError } from '@/services/http'
import { RestauracaoHistoricoItem } from '@/types'

interface ListRestauracoesResponse {
  pagina: number
  limite: number
  total: number
  itens: RestauracaoHistoricoItem[]
}

interface CriarRestauracaoPayload {
  foto: File
  restaurarDanos: boolean
  colorizar: boolean
  melhorarQualidade: boolean
  animarFoto: boolean
}

interface CriarRestauracaoResponse {
  restauracaoId: number
  statusInicial: 'PENDENTE' | 'PROCESSANDO' | 'CONCLUIDA' | 'FALHA'
  creditosDebitados: number
}

interface RestauracaoDetalheResponse {
  id: number
  status: 'PENDENTE' | 'PROCESSANDO' | 'CONCLUIDA' | 'FALHA'
  erro: string | null
  urls: {
    arquivoRestaurado: string | null
    video: string | null
  }
  video: {
    solicitado: boolean
    status: 'NAO_SOLICITADO' | 'PROCESSANDO' | 'DISPONIVEL' | 'FALHA'
    erro: string | null
  }
  criadoEm: string
  finalizadoEm: string | null
}

function buildEndpointUrlWithToken(endpoint: string, token: string) {
  const url = new URL(`${API_BASE_URL}${endpoint}`)
  url.searchParams.set('token', token)
  return url.toString()
}

async function fetchFileBlob(token: string, endpoint: string): Promise<Blob> {
  const response = await fetch(buildEndpointUrlWithToken(endpoint, token), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    await throwApiError(response, 'Falha ao baixar arquivo da restauracao.')
  }

  return response.blob()
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}

export async function listRestauracoes(token: string, pagina = 1, limite = 10): Promise<ListRestauracoesResponse> {
  const response = await fetch(`${API_BASE_URL}/restauracoes?pagina=${pagina}&limite=${limite}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    await throwApiError(response, 'Nao foi possivel carregar o historico de restauracoes.')
  }

  return response.json()
}

export async function createRestauracao(token: string, payload: CriarRestauracaoPayload): Promise<CriarRestauracaoResponse> {
  const formData = new FormData()
  formData.append('foto', payload.foto)
  formData.append('restaurarDanos', String(payload.restaurarDanos))
  formData.append('colorizar', String(payload.colorizar))
  formData.append('melhorarQualidade', String(payload.melhorarQualidade))
  formData.append('animarFoto', String(payload.animarFoto))

  const response = await fetch(`${API_BASE_URL}/restauracoes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })

  if (!response.ok) {
    await throwApiError(response, 'Nao foi possivel iniciar a restauracao.')
  }

  return response.json()
}

export async function getRestauracaoDetalhe(token: string, id: number): Promise<RestauracaoDetalheResponse> {
  const response = await fetch(`${API_BASE_URL}/restauracoes/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    await throwApiError(response, 'Nao foi possivel consultar o status da restauracao.')
  }

  return response.json()
}

export async function downloadRestauracaoArquivo(token: string, id: number) {
  const blob = await fetchFileBlob(token, `/restauracoes/${id}/arquivo`)
  triggerBlobDownload(blob, `restauracao-${id}.jpg`)
}

export async function downloadRestauracaoVideo(token: string, id: number) {
  const blob = await fetchFileBlob(token, `/restauracoes/${id}/video`)
  triggerBlobDownload(blob, `video-${id}.mp4`)
}

export async function downloadRestauracaoOriginal(token: string, id: number) {
  const blob = await fetchFileBlob(token, `/restauracoes/${id}/original`)
  triggerBlobDownload(blob, `origital-${id}.jpg`)
}

export function getRestauracaoArquivoUrl(token: string, id: number) {
  return buildEndpointUrlWithToken(`/restauracoes/${id}/arquivo`, token)
}

export function getRestauracaoVideoUrl(token: string, id: number) {
  return buildEndpointUrlWithToken(`/restauracoes/${id}/video`, token)
}
