import { RestauracaoHistoricoItem } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

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

async function fetchFileBlob(token: string, endpoint: string): Promise<{ blob: Blob; filename: string }> {
  const response = await fetch(buildEndpointUrlWithToken(endpoint, token), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Falha ao baixar arquivo da restauracao.')
  }

  const contentDisposition = response.headers.get('content-disposition') ?? ''
  const fileMatch = contentDisposition.match(/filename=\"?([^\";]+)\"?/i)
  const filename = fileMatch?.[1] ?? 'download'

  return {
    blob: await response.blob(),
    filename
  }
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
    throw new Error('Nao foi possivel carregar o historico de restauracoes.')
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
    throw new Error('Nao foi possivel iniciar a restauracao.')
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
    throw new Error('Nao foi possivel consultar o status da restauracao.')
  }

  return response.json()
}

export async function downloadRestauracaoArquivo(token: string, id: number) {
  const { blob, filename } = await fetchFileBlob(token, `/restauracoes/${id}/arquivo`)
  triggerBlobDownload(blob, filename)
}

export async function downloadRestauracaoVideo(token: string, id: number) {
  const { blob, filename } = await fetchFileBlob(token, `/restauracoes/${id}/video`)
  triggerBlobDownload(blob, filename)
}

export async function downloadRestauracaoOriginal(token: string, id: number) {
  const { blob, filename } = await fetchFileBlob(token, `/restauracoes/${id}/original`)
  triggerBlobDownload(blob, filename)
}

export function getRestauracaoArquivoUrl(token: string, id: number) {
  return buildEndpointUrlWithToken(`/restauracoes/${id}/arquivo`, token)
}

export function getRestauracaoVideoUrl(token: string, id: number) {
  return buildEndpointUrlWithToken(`/restauracoes/${id}/video`, token)
}
