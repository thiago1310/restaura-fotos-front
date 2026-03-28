import { CreditPackage } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

interface PlanoApiResponse {
  pacoteId: string
  nome: string
  valor: number
  quantidadeCreditos: number
}

interface GerarPixApiResponse {
  pagamentoId: number
  pixCopiaECola: string
  valor: number
  expiracao: string
  creditos: number
  pacoteId: string
  planoNome: string
}

interface StatusPagamentoApiResponse {
  pagamentoId: number
  status: 'PENDENTE' | 'APROVADO' | 'EXPIRADO' | 'CANCELADO'
  creditosLiberados: number
  atualizadoEm: string
}

function buildQrCodeUrl(pixCode: string) {
  const encodedPayload = encodeURIComponent(pixCode)
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodedPayload}`
}

export async function listPlanos(): Promise<CreditPackage[]> {
  const response = await fetch(`${API_BASE_URL}/pagamentos/planos`, {
    method: 'GET'
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar os planos de creditos.')
  }

  const data: PlanoApiResponse[] = await response.json()
  if (!data.length) return []

  const maiorQuantidadeCreditos = Math.max(...data.map((item) => item.quantidadeCreditos))

  return data.map((item) => ({
    id: item.pacoteId,
    name: item.nome,
    photos: item.quantidadeCreditos,
    price: Number(item.valor),
    popular: item.quantidadeCreditos === maiorQuantidadeCreditos
  }))
}

export async function gerarPix(token: string, pacoteId: string) {
  const response = await fetch(`${API_BASE_URL}/pagamentos/pix/qrcode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ pacoteId })
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel gerar o Pix para este pacote.')
  }

  const data: GerarPixApiResponse = await response.json()

  return {
    packageId: data.pacoteId,
    qrCodeUrl: buildQrCodeUrl(data.pixCopiaECola),
    pixCode: data.pixCopiaECola,
    pagamentoId: data.pagamentoId,
    expiracao: data.expiracao
  }
}

export async function consultarStatusPagamento(token: string, pagamentoId: number): Promise<StatusPagamentoApiResponse> {
  const response = await fetch(`${API_BASE_URL}/pagamentos/${pagamentoId}/status`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel consultar o status do pagamento.')
  }

  return response.json()
}
